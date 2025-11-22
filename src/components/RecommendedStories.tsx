// src/components/RecommendedStories.tsx
import React from "react";
import type { StoryMeta } from "../types";
import { StoryCard } from "./StoryCard";

interface RecommendedStoriesProps {
  stories: StoryMeta[];
  onSelectStory: (id: string) => void;
}

export const RecommendedStories: React.FC<RecommendedStoriesProps> = ({
  stories,
  onSelectStory
}) => {
  if (!stories.length) return null;

  return (
    <section className="recommended-section">
      <h2 className="section-title">You may also like</h2>

      <div className="recommended-list">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onClick={() => onSelectStory(story.id)}
          />
        ))}
      </div>
    </section>
  );
};
