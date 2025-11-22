// src/components/HomeView.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { StoryMeta } from "../types";
import { fetchStories } from "../api/storiesApi";
import { StoryCard } from "./StoryCard";

interface HomeViewProps {
  onSelectStory: (id: string) => void;
  onSelectFranchise: (franchise: string) => void;
}

interface MoodSection {
  id: string;
  label: string;
  description: string;
  moods: string[];
}

const MOOD_SECTIONS: MoodSection[] = [
  {
    id: "healing",
    label: "Healing & Second Chances",
    description: "What if things didn’t have to end in tragedy?",
    moods: ["healing", "second chance", "forgiveness", "closure"]
  },
  {
    id: "comfort",
    label: "Comfort & Found Family",
    description: "Soft landings, warm bonds, and chosen family.",
    moods: ["comfort", "found family", "warmth", "support"]
  },
  {
    id: "angst",
    label: "Angst & Emotional Catharsis",
    description: "Stories that hurt just enough to help you let go.",
    moods: ["angst", "grief", "loss", "catharsis"]
  },
  {
    id: "romance",
    label: "Slow Burn & Romance",
    description: "Careful confessions, stolen glances, and soft hands.",
    moods: ["romance", "slow burn", "tender", "bittersweet"]
  },
  {
    id: "rebellion",
    label: "Rebellion & Hope",
    description: "When the world is broken and they decide to fix it.",
    moods: ["hope", "rebellion", "bravery", "defiance"]
  }
];

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectStory,
  onSelectFranchise
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

  const sections = useMemo(() => {
    if (!stories.length) return [];

    return MOOD_SECTIONS.map((section) => {
      const rowStories = stories
        .filter((s) => {
          const moods = (s.moodCategories || []).map((m) =>
            m.toLowerCase().trim()
          );
          return section.moods.some((m) => moods.includes(m.toLowerCase()));
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 12);

      return { ...section, stories: rowStories };
    }).filter((sec) => sec.stories.length > 0);
  }, [stories]);

  return (
    <div className="home-view">
      <h1 className="page-title">Welcome to Inklet</h1>
      <p className="muted">
        Mood-based fanfiction to rewrite the moments that hurt—and explore the
        ones that almost happened.
      </p>

      {loading && <p className="muted">Loading stories…</p>}

      {!loading && !sections.length && (
        <p className="muted">
          No stories available yet. Once your first batch is imported, your
          mood-based home feed will appear here.
        </p>
      )}

      {!loading &&
        sections.map((section) => (
          <section key={section.id} className="home-section">
            <div className="home-section-header">
              <h2>{section.label}</h2>
              <p>{section.description}</p>
            </div>
            <div className="home-section-list">
              {section.stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onClick={() => onSelectStory(story.id)}
                  onFranchiseClick={onSelectFranchise}
                />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
};
