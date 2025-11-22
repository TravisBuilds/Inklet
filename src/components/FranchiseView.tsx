// src/components/FranchiseView.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { StoryMeta } from "../types";
import { fetchStories } from "../api/storiesApi";
import { StoryCard } from "./StoryCard";

interface FranchiseViewProps {
  franchise: string;
  onSelectStory: (id: string) => void;
  onBack: () => void;
}

export const FranchiseView: React.FC<FranchiseViewProps> = ({
  franchise,
  onSelectStory,
  onBack
}) => {
  const [stories, setStories] = useState<StoryMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const data = await fetchStories();
      if (isMounted) {
        setStories(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const franchiseStories = useMemo(
    () =>
      stories
        .filter((s) => s.franchise === franchise)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [stories, franchise]
  );

  return (
    <div className="franchise-view">
      <button className="link-btn" onClick={onBack}>
        ← Back
      </button>

      <h1 className="page-title">{franchise}</h1>
      <p className="muted">
        All Inklet stories set in the {franchise} universe.
      </p>

      {loading ? (
        <p className="muted">Loading franchise stories…</p>
      ) : franchiseStories.length === 0 ? (
        <p className="muted">
          No stories found for this franchise yet. Try another franchise from
          Explore.
        </p>
      ) : (
        <div className="story-list">
          {franchiseStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => onSelectStory(story.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
