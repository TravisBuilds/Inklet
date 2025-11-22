// src/components/StoryReader.tsx

import React, { useEffect, useState } from "react";
import type { StoryMeta, StoryDetail } from "../types";
import { fetchStoryById, fetchStories } from "../api/storiesApi";
import { RecommendedStories } from "./RecommendedStories";
import { storySimilarity } from "../utils/storySimilarity";
import { useAuth } from "../context/AuthContext";
import { PaywallModal } from "./PaywallModal";

interface StoryReaderProps {
    storyId: string;
    onBack: () => void;
    onSelectStory?: (id: string) => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
    storyId,
    onBack,
    onSelectStory = () => { }
}) => {
    const [story, setStory] = useState<StoryDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const [allStories, setAllStories] = useState<StoryMeta[]>([]);
    const [recommended, setRecommended] = useState<StoryMeta[]>([]);

    const { hasAdultAccess } = useAuth();
    const [paywallOpen, setPaywallOpen] = useState(false);
    // top of StoryReader.tsx (inside the component or above it)
    const devBypassPaywall =
        import.meta.env.VITE_DEV_BYPASS_PAYWALL === "true";

    // Load the story being read
    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            setLoading(true);
            const data = await fetchStoryById(storyId);
            if (isMounted) {
                setStory(data);
                setLoading(false);
            }
        };

        load();
        return () => {
            isMounted = false;
        };
    }, [storyId]);

    // Load all stories for recommendations
    useEffect(() => {
        const loadAll = async () => {
            const data = await fetchStories();
            setAllStories(data);
        };
        loadAll();
    }, []);

    // Compute recommendations anytime story or allStories change
    useEffect(() => {
        if (!story || allStories.length === 0) return;

        const others = allStories.filter((s) => s.id !== story.id);

        const scored = others
            .map((s) => ({
                story: s,
                score: storySimilarity(story, s)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 12)
            .map((x) => x.story);

        setRecommended(scored);
    }, [story, allStories]);

    if (loading || !story) {
        return (
            <div className="story-reader">
                <button className="link-btn" onClick={onBack}>
                    ← Back
                </button>
                <p className="muted">Loading story…</p>
            </div>
        );
    }

    // 🔒 Adult paywall gate
    if (story.is_adult && !hasAdultAccess && !devBypassPaywall) {
        return (
            <div className="story-reader">
                <button className="link-btn" onClick={onBack}>
                    ← Back
                </button>

                <h1 className="reader-title">{story.title}</h1>

                <div className="reader-meta">
                    {story.franchise && <span className="pill">{story.franchise}</span>}
                    <span className="badge badge-adult">18+</span>
                </div>

                {story.synopsis && (
                    <div className="reader-synopsis">
                        <h3>Synopsis</h3>
                        <p>{story.synopsis}</p>
                    </div>
                )}

                <p className="muted">
                    This story is marked as adult content (18+). Unlock a{" "}
                    <strong>1-year subscription for $5</strong> to read all adult stories
                    on Inklet.
                </p>

                <button className="pill-btn" onClick={() => setPaywallOpen(true)}>
                    Unlock adult access
                </button>

                <PaywallModal
                    open={paywallOpen}
                    onClose={() => setPaywallOpen(false)}
                />
            </div>
        );
    }


    // ✅ Normal reader for SFW stories or subscribers
    return (
        <div className="story-reader">
            <button className="link-btn" onClick={onBack}>
                ← Back
            </button>

            <h1 className="reader-title">{story.title}</h1>

            <div className="reader-meta">
                {story.franchise && <span className="pill">{story.franchise}</span>}
                {story.is_adult && <span className="badge badge-adult">18+</span>}
                <span className="pill pill-length">{story.length}</span>
            </div>

            {story.synopsis && (
                <div className="reader-synopsis">
                    <h3>Synopsis</h3>
                    <p>{story.synopsis}</p>
                </div>
            )}

            <article className="reader-content">
                {story.content.split("\n").map((line, i) => (
                    <p key={i}>{line.trim()}</p>
                ))}
            </article>

            <RecommendedStories
                stories={recommended}
                onSelectStory={onSelectStory}
            />
        </div>
    );
};
