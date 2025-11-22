// src/components/StoryCard.tsx
import React from "react";
import type { StoryMeta } from "../types";

interface StoryCardProps {
  story: StoryMeta;
  onClick: () => void;
  onFranchiseClick?: (franchise: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onClick,
  onFranchiseClick
}) => {
  const handleFranchiseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // prevent card click
    if (onFranchiseClick) {
      onFranchiseClick(story.franchise);
    }
  };

  return (
    <div className="story-card" onClick={onClick}>
      <div className="story-card-header">
        <h3 className="story-card-title">{story.title}</h3>
        {story.is_adult && <span className="badge badge-adult">18+</span>}
      </div>

      <div className="story-card-meta">
        {story.franchise && (
          <button
            className="tag franchise-tag"
            onClick={handleFranchiseClick}
          >
            {story.franchise}
          </button>
        )}
        {story.moodCategories && story.moodCategories.length > 0 && (
          <span className="tag">
            {story.moodCategories.slice(0, 2).join(" · ")}
          </span>
        )}
      </div>

      {story.synopsis && (
        <p className="story-card-synopsis">{story.synopsis}</p>
      )}

      <div className="story-card-footer">
        <span className="pill pill-length">{story.length}</span>
        <span className="pill pill-upvotes">
          👍 {story.upvotes ?? 0}
        </span>
      </div>
    </div>
  );
};
