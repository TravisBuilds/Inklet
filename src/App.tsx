// src/App.tsx
import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { StoryList } from "./components/StoryList";
import { StoryReader } from "./components/StoryReader";
import { AiPromptBuilder } from "./components/AiPromptBuilder";
import { ExploreView } from "./components/ExploreView";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<"home" | "explore" | "create">(
    "home"
  );
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const handleBackToList = () => {
    setSelectedStoryId(null);
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {selectedStoryId ? (
        <StoryReader storyId={selectedStoryId} onBack={handleBackToList} />
      ) : currentView === "create" ? (
        <AiPromptBuilder />
      ) : currentView === "explore" ? (
        <ExploreView onSelectStory={setSelectedStoryId} />
      ) : (
        // home view
        <StoryList onSelectStory={setSelectedStoryId} />
      )}
    </Layout>
  );
};

export default App;
