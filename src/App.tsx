// src/App.tsx
import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { StoryReader } from "./components/StoryReader";
import { AiPromptBuilder } from "./components/AiPromptBuilder";
import { ExploreView } from "./components/ExploreView";
import { HomeView } from "./components/HomeView";
import { FranchiseView } from "./components/FranchiseView";
// (StoryList is no longer used here, but can be kept for later if you want)

type View = "home" | "explore" | "create" | "franchise";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [activeFranchise, setActiveFranchise] = useState<string | null>(null);

  const handleBackFromReader = () => {
    setSelectedStoryId(null);
  };

  const handleSelectFranchise = (franchise: string) => {
    setActiveFranchise(franchise);
    setSelectedStoryId(null);
    setCurrentView("franchise");
  };

  const handleBackFromFranchise = () => {
    setActiveFranchise(null);
    setCurrentView("explore"); // or "home" if you prefer
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {selectedStoryId ? (
        <StoryReader storyId={selectedStoryId} onBack={handleBackFromReader} />
      ) : currentView === "create" ? (
        <AiPromptBuilder />
      ) : currentView === "explore" ? (
        <ExploreView
          onSelectStory={setSelectedStoryId}
          onSelectFranchise={handleSelectFranchise}
        />
      ) : currentView === "franchise" && activeFranchise ? (
        <FranchiseView
          franchise={activeFranchise}
          onSelectStory={setSelectedStoryId}
          onBack={handleBackFromFranchise}
        />
      ) : (
        <HomeView
          onSelectStory={setSelectedStoryId}
          onSelectFranchise={handleSelectFranchise}
        />
      )}
    </Layout>
  );
};

export default App;
