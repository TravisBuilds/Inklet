// src/components/StoryList.tsx
import React, { useEffect, useState } from "react";
import type { StoryMeta } from "../types";
import { StoryFilters } from "./StoryFilters";
import type { AdultFilter } from "./StoryFilters";
import { StoryCard } from "./StoryCard";
import { fetchStories } from "../api/storiesApi";

interface StoryListProps {
  onSelectStory: (id: string) => void;
  onSelectFranchise?: (franchise: string) => void;
}

export const StoryList: React.FC<StoryListProps> = ({
  onSelectStory,
  onSelectFranchise
}) => {
  const [stories, setStories] = useState<StoryMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [adultFilter, setAdultFilter] = useState<AdultFilter>("all");

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
    if (adultFilter === "hide" && story.is_adult) return false;
    if (adultFilter === "adultOnly" && !story.is_adult) return false;

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
        adultFilter={adultFilter}
        onAdultFilterChange={setAdultFilter}
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
              onFranchiseClick={onSelectFranchise}
            />
          ))}
        </div>
      )}
    </div>
  );
};
