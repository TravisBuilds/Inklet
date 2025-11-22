// src/App.tsx

import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { StoryReader } from "./components/StoryReader";
import { ExploreView } from "./components/ExploreView";
import { HomeView } from "./components/HomeView";
import { FranchiseView } from "./components/FranchiseView";
import { CreateView } from "./components/CreateView";

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

  // 🔑 Centralized navigation handler
  const handleNavigate = (view: "home" | "explore" | "create") => {
    // Leaving the reader when you change top-level view
    setSelectedStoryId(null);
    // Clear franchise view when navigating to top-level views
    setActiveFranchise(null);
    setCurrentView(view);
  };

  return (
    <Layout currentView={currentView} onNavigate={handleNavigate}>
      {selectedStoryId ? (
        <StoryReader storyId={selectedStoryId} onBack={handleBackFromReader} />
      ) : currentView === "create" ? (
        <CreateView onStoryCreated={setSelectedStoryId} />
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
