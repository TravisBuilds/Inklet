// src/components/StoryList.tsx
import React, { useEffect, useState } from "react";
import type { StoryMeta } from "../types";
import { StoryFilters } from "./StoryFilters";
import { StoryCard } from "./StoryCard";
import { fetchStories } from "../api/storiesApi";

interface StoryListProps {
  onSelectStory: (id: string) => void;
}

export const StoryList: React.FC<StoryListProps> = ({ onSelectStory }) => {
  const [stories, setStories] = useState<StoryMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hideAdult, setHideAdult] = useState(false);

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

  const filtered = stories.filter((story) => {
    if (hideAdult && story.is_adult) return false;

    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      story.title.toLowerCase().includes(term) ||
      story.franchise.toLowerCase().includes(term) ||
      story.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  });

  return (
    <div className="story-list-wrapper">
      <StoryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        hideAdult={hideAdult}
        onHideAdultChange={setHideAdult}
      />

      {loading ? (
        <p className="muted">Loading stories…</p>
      ) : filtered.length === 0 ? (
        <p className="muted">No stories found. Try another search term.</p>
      ) : (
        <div className="story-list">
          {filtered.map((story) => (
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
