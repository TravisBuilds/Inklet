// src/components/ExploreView.tsx
import React, { useEffect, useMemo, useState } from "react";
import { fetchStories } from "../api/storiesApi";
import type { StoryMeta } from "../types";
import { StoryCard } from "./StoryCard";

interface ExploreViewProps {
  onSelectStory: (id: string) => void;
  onSelectFranchise: (franchise: string) => void;
}

// Normalizes franchise names so variants like
// "Grey's Anatomy" / "Grey’s Anatomy" / "Gray's Anatomy"
// all collapse together.
function normalizeFranchiseName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'") // curly -> straight apostrophe
    .replace(/\s+/g, " "); // collapse multiple spaces
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectStory,
  onSelectFranchise
}) => {
  const [stories, setStories] = useState<StoryMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hideAdult, setHideAdult] = useState(false);
  const [selectedFranchiseKey, setSelectedFranchiseKey] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const data = await fetchStories();
      if (!cancelled) {
        setStories(data);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Build deduped franchise list: normalized key -> label
  const franchiseOptions = useMemo(
    () => {
      const map = new Map<string, string>(); // key -> display label

      stories.forEach((s) => {
        if (!s.franchise) return;
        const raw = s.franchise.trim();
        if (!raw) return;

        const key = normalizeFranchiseName(raw);
        if (!map.has(key)) {
          // First one wins for display
          map.set(key, raw);
        }
      });

      return Array.from(map.entries())
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([key, label]) => ({ key, label }));
    },
    [stories]
  );

  const filteredStories = useMemo(() => {
    return stories.filter((s) => {
      if (hideAdult && s.is_adult) {
        return false;
      }

      if (selectedFranchiseKey) {
        if (!s.franchise) return false;
        if (normalizeFranchiseName(s.franchise) !== selectedFranchiseKey) {
          return false;
        }
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const inTitle = s.title.toLowerCase().includes(q);
        const inFranchise = (s.franchise ?? "").toLowerCase().includes(q);
        const inTags = (s.tags ?? [])
          .join(" ")
          .toLowerCase()
          .includes(q);
        if (!inTitle && !inFranchise && !inTags) {
          return false;
        }
      }

      return true;
    });
  }, [stories, search, hideAdult, selectedFranchiseKey]);

  const handleFranchiseChange = (value: string) => {
    const key = value || null;
    setSelectedFranchiseKey(key);

    // Optionally also notify parent when a specific franchise is chosen
    if (key) {
      const match = franchiseOptions.find((f) => f.key === key);
      if (match) {
        onSelectFranchise(match.label);
      }
    }
  };

  return (
    <div className="view-wrapper">
      <div className="view-header">
        <h1 className="view-title">Explore stories</h1>
        <p className="view-subtitle">
          Browse by franchise, mood, and more.
        </p>
      </div>

      <div className="explore-controls">
        {/* Franchise dropdown */}
        <div className="control-group">
          <label className="control-label">Franchise</label>
          <select
            className="control-select"
            value={selectedFranchiseKey ?? ""}
            onChange={(e) => handleFranchiseChange(e.target.value)}
          >
            <option value="">All franchises</option>
            {franchiseOptions.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="control-group control-grow">
          <label className="control-label">Search</label>
          <input
            type="text"
            className="control-input"
            placeholder="Search by title, franchise, or tag"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Hide adult toggle */}
        <label className="control-checkbox">
          <input
            type="checkbox"
            checked={hideAdult}
            onChange={(e) => setHideAdult(e.target.checked)}
          />
          <span>Hide adult stories</span>
        </label>
      </div>

      {loading ? (
        <p className="muted">Loading stories…</p>
      ) : filteredStories.length === 0 ? (
        <p className="muted">
          No stories match your filters yet. Try clearing search or
          changing the franchise.
        </p>
      ) : (
        <div className="story-grid">
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => onSelectStory(story.id)}
              onFranchiseClick={
                story.franchise
                  ? () => onSelectFranchise(story.franchise!)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
