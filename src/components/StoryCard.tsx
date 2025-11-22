// src/components/StoryCard.tsx
import React from "react";
import type { StoryMeta } from "../types";

interface StoryCardProps {
  story: StoryMeta;
  onClick: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
  const characters = story.tags.slice(0, 3);

  return (
    <div className="story-card" onClick={onClick}>
      <h3 className="story-card-title">
        {story.title}
        {story.is_adult && <span className="adult-pill">Adult</span>}
      </h3>

      <p className="story-card-meta">
        {story.franchise} · {story.length}
      </p>

      {characters.length > 0 && (
        <p className="story-card-characters">
          Characters: {characters.join(" · ")}
        </p>
      )}

      {story.moodCategories.length > 0 && (
        <p className="story-card-moods">
          Mood: {story.moodCategories.slice(0, 2).join(" · ")}
        </p>
      )}

      {story.synopsis && (
        <p className="story-card-synopsis">
          {story.synopsis.length > 160
            ? story.synopsis.slice(0, 157) + "..."
            : story.synopsis}
        </p>
      )}

      <p className="story-card-footer">❤️ {story.upvotes ?? 0}</p>
    </div>
  );
};
