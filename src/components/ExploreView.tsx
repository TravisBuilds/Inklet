// src/components/ExploreView.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { StoryMeta } from "../types";
import { fetchStories } from "../api/storiesApi";
import { StoryCard } from "./StoryCard";
import { ExploreFilters } from "./ExploreFilters";

interface ExploreViewProps {
  onSelectStory: (id: string) => void;
}

type SortOption = "newest" | "oldest" | "longFirst" | "shortFirst";

export const ExploreView: React.FC<ExploreViewProps> = ({ onSelectStory }) => {
  const [stories, setStories] = useState<StoryMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [hideAdult, setHideAdult] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<string>("all");
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

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

  // Build facet lists
  const franchises = useMemo(
    () =>
      Array.from(new Set(stories.map((s) => s.franchise)))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [stories]
  );

  const moods = useMemo(
    () =>
      Array.from(
        new Set(
          stories
            .flatMap((s) => s.moodCategories || [])
            .map((m) => m.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [stories]
  );

  // Filtering + sorting
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let result = stories.filter((story) => {
      if (hideAdult && story.is_adult) return false;

      if (selectedFranchise !== "all" && story.franchise !== selectedFranchise) {
        return false;
      }

      if (
        selectedMood !== "all" &&
        !(story.moodCategories || []).includes(selectedMood)
      ) {
        return false;
      }

      if (!term) return true;

      return (
        story.title.toLowerCase().includes(term) ||
        story.franchise.toLowerCase().includes(term) ||
        story.tags.some((t) => t.toLowerCase().includes(term))
      );
    });

    // sort
    const lengthWeight = (len: StoryMeta["length"]) => {
      if (len === "long") return 3;
      if (len === "medium") return 2;
      return 1; // short
    };

    result = result.slice().sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "longFirst") {
        const diff = lengthWeight(b.length) - lengthWeight(a.length);
        if (diff !== 0) return diff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "shortFirst") {
        const diff = lengthWeight(a.length) - lengthWeight(b.length);
        if (diff !== 0) return diff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  }, [
    stories,
    searchTerm,
    hideAdult,
    selectedFranchise,
    selectedMood,
    sortBy
  ]);

  return (
    <div className="explore-view">
      <h1 className="page-title">Explore stories</h1>
      <p className="muted">
        Filter by franchise, mood, or characters to find exactly the kind of
        emotional arc you’re in the mood for.
      </p>

      <ExploreFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        hideAdult={hideAdult}
        onHideAdultChange={setHideAdult}
        franchises={franchises}
        selectedFranchise={selectedFranchise}
        onFranchiseChange={setSelectedFranchise}
        moods={moods}
        selectedMood={selectedMood}
        onMoodChange={setSelectedMood}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {loading ? (
        <p className="muted">Loading stories…</p>
      ) : filtered.length === 0 ? (
        <p className="muted">
          No stories matched those filters. Try widening your search.
        </p>
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
