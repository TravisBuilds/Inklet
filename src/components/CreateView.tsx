// src/components/CreateView.tsx
import React from "react";
import { StoryUploadForm } from "./StoryUploadForm";
import { AiPromptBuilder } from "./AiPromptBuilder";

interface CreateViewProps {
  onStoryCreated: (id: string) => void;
}

export const CreateView: React.FC<CreateViewProps> = ({ onStoryCreated }) => {
  return (
    <div className="create-view">
      <div className="create-column">
        <StoryUploadForm onCreated={onStoryCreated} />
      </div>
      <div className="create-column">
        <h2>Or generate with AI</h2>
        <p className="muted">
          Use AI to draft an outline or first pass, then edit before publishing.
          (We can later wire this to your OpenAI backend.)
        </p>
        <AiPromptBuilder />
      </div>
    </div>
  );
};
