// src/components/AiPromptBuilder.tsx
import React, { useState } from "react";

export const AiPromptBuilder: React.FC = () => {
  const [franchise, setFranchise] = useState("");
  const [mood, setMood] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleGenerate = async () => {
    setPending(true);
    // Stub: later call your backend / Supabase Edge + OpenAI
    setTimeout(() => {
      setResult(
        "This is where your AI-generated outline or draft will show up once the backend is wired."
      );
      setPending(false);
    }, 800);
  };

  return (
    <div className="ai-builder">
      <h1>AI Story Builder (Coming Soon)</h1>
      <p className="muted">
        Draft new stories based on your favorite franchises and healing moods.
      </p>

      <div className="ai-builder-grid">
        <div className="ai-field">
          <label>Franchise / Universe</label>
          <input
            type="text"
            value={franchise}
            placeholder="e.g. Jujutsu Kaisen, The Expanse…"
            onChange={(e) => setFranchise(e.target.value)}
          />
        </div>

        <div className="ai-field">
          <label>Mood</label>
          <input
            type="text"
            value={mood}
            placeholder="e.g. Found Family, Second Chances…"
            onChange={(e) => setMood(e.target.value)}
          />
        </div>
      </div>

      <div className="ai-field">
        <label>Extra prompt (optional)</label>
        <textarea
          value={customPrompt}
          placeholder="Anything specific you want the AI to explore emotionally?"
          onChange={(e) => setCustomPrompt(e.target.value)}
        />
      </div>

      <button className="pill-btn" onClick={handleGenerate} disabled={pending}>
        {pending ? "Thinking…" : "Generate draft"}
      </button>

      {result && (
        <div className="ai-result">
          <h2>Draft Preview</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};
