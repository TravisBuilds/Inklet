// src/components/ExploreFilters.tsx
import React from "react";
import type { AdultFilter } from "./StoryFilters";

interface ExploreFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;

  adultFilter: AdultFilter;
  onAdultFilterChange: (value: AdultFilter) => void;

  franchises: string[];
  selectedFranchise: string;
  onFranchiseChange: (value: string) => void;

  moods: string[];
  selectedMood: string;
  onMoodChange: (value: string) => void;

  sortBy: "newest" | "oldest" | "longFirst" | "shortFirst";
  onSortChange: (value: "newest" | "oldest" | "longFirst" | "shortFirst") => void;
}

export const ExploreFilters: React.FC<ExploreFiltersProps> = ({
  searchTerm,
  onSearchChange,
  adultFilter,
  onAdultFilterChange,
  franchises,
  selectedFranchise,
  onFranchiseChange,
  moods,
  selectedMood,
  onMoodChange,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="explore-filters">
      {/* Top row: search + adult filter */}
      <div className="filters-bar">
        <input
          className="filters-search"
          type="text"
          placeholder="Search by title, franchise, or character..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <select
          className="filter-select"
          value={adultFilter}
          onChange={(e) =>
            onAdultFilterChange(e.target.value as AdultFilter)
          }
        >
          <option value="all">All content</option>
          <option value="hide">Hide adult</option>
          <option value="adultOnly">Adult only</option>
        </select>
      </div>

      {/* Second row: franchise + mood + sort */}
      <div className="filters-extra">
        <select
          className="filter-select"
          value={selectedFranchise}
          onChange={(e) => onFranchiseChange(e.target.value)}
        >
          <option value="all">All franchises</option>
          {franchises.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={selectedMood}
          onChange={(e) => onMoodChange(e.target.value)}
        >
          <option value="all">All moods</option>
          {moods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) =>
            onSortChange(
              e.target.value as "newest" | "oldest" | "longFirst" | "shortFirst"
            )
          }
        >
          <option value="newest">Sort: Newest first</option>
          <option value="oldest">Sort: Oldest first</option>
          <option value="longFirst">Sort: Longest first</option>
          <option value="shortFirst">Sort: Shortest first</option>
        </select>
      </div>
    </div>
  );
};
