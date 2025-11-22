// src/components/StoryFilters.tsx
import React from "react";

interface StoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  hideAdult: boolean;
  onHideAdultChange: (value: boolean) => void;
}

export const StoryFilters: React.FC<StoryFiltersProps> = ({
  searchTerm,
  onSearchChange,
  hideAdult,
  onHideAdultChange
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
      <label className="filters-toggle">
        <input
          type="checkbox"
          checked={hideAdult}
          onChange={(e) => onHideAdultChange(e.target.checked)}
        />
        <span>Hide adult stories</span>
      </label>
    </div>
  );
};
