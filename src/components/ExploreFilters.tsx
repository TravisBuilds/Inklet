// src/components/ExploreFilters.tsx
import React from "react";

interface ExploreFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;

  hideAdult: boolean;
  onHideAdultChange: (value: boolean) => void;

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
  hideAdult,
  onHideAdultChange,
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
      {/* Top row: search + adult toggle */}
      <div className="filters-bar">
        <input
          className="filters-search"
          type="text"
          placeholder="Search by title, franchise, or character..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <label className="filters-toggle">
          <input
            type="checkbox"
            checked={hideAdult}
            onChange={(e) => onHideAdultChange(e.target.checked)}
          />
          <span>Hide adult stories</span>
        </label>
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
            onSortChange(e.target.value as "newest" | "oldest" | "longFirst" | "shortFirst")
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
