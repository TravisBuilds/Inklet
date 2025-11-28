// src/components/FranchiseView.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { StoryMeta } from "../types";
import type { AdultFilter } from "./StoryFilters";
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

  const franchiseStories = useMemo(
    () =>
      stories
        .filter((s) => {
          // Franchise filter
          if (s.franchise !== franchise) return false;
          
          // Adult filter logic
          if (adultFilter === "hide" && s.is_adult) return false;
          if (adultFilter === "adultOnly" && !s.is_adult) return false;
          
          return true;
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [stories, franchise, adultFilter]
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

      <div className="filters-bar">
        <select
          className="filter-select"
          value={adultFilter}
          onChange={(e) => setAdultFilter(e.target.value as AdultFilter)}
        >
          <option value="all">All content</option>
          <option value="hide">Hide adult</option>
          <option value="adultOnly">Adult only</option>
        </select>
      </div>

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
