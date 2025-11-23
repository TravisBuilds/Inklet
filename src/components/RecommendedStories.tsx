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

  const handleStoryClick = (storyId: string) => {
    console.log("[RecommendedStories] Story clicked:", storyId);
    console.log("[RecommendedStories] onSelectStory function:", typeof onSelectStory);
    try {
      onSelectStory(storyId);
      console.log("[RecommendedStories] onSelectStory called successfully");
    } catch (error) {
      console.error("[RecommendedStories] Error calling onSelectStory:", error);
    }
  };

  return (
    <section className="recommended-section">
      <h2 className="section-title">You may also like</h2>

      <div className="recommended-list">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onClick={() => handleStoryClick(story.id)}
          />
        ))}
      </div>
    </section>
  );
};
