// src/components/StoryFilters.tsx
import React from "react";

export type AdultFilter = "all" | "hide" | "adultOnly";

interface StoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;

  adultFilter: AdultFilter;
  onAdultFilterChange: (value: AdultFilter) => void;
}

export const StoryFilters: React.FC<StoryFiltersProps> = ({
  searchTerm,
  onSearchChange,
  adultFilter,
  onAdultFilterChange
}) => {
  return (
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
  );
};
