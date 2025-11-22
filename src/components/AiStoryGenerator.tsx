import React, { useState } from "react";

interface AiStoryGeneratorProps {
  onStoryCreated: (id: string) => void;
}

const FRANCHISES = [
  "Star Wars", "Harry Potter", "One Piece", "Naruto", "Avatar",
  "Attack on Titan", "Marvel", "DC", "Game of Thrones", "Witcher",
  "Jujutsu Kaisen", "Tokyo Ghoul", "Firefly", "The Expanse", "Evangelion"
];

const MOODS = [
  "healing", "second chance", "comfort", "found family", "romance",
  "bittersweet", "angst", "grief", "catharsis", "hope", "rebellion"
];

export const AiStoryGenerator: React.FC<AiStoryGeneratorProps> = ({
  onStoryCreated
}) => {
  const [franchise, setFranchise] = useState("");
  const [characters, setCharacters] = useState("");
  const [mood, setMood] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStory = async () => {
    setError(null);

    if (!franchise.trim()) {
      setError("Please choose a franchise.");
      return;
    }

    if (!userPrompt.trim()) {
      setError("Describe what you want the story to be about.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://wjcpoamnbtovgayggrpt.supabase.co/functions/v1/generateStory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ franchise, characters, mood, isAdult, userPrompt })
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Failed to generate story.");
        setLoading(false);
        return;
      }

      onStoryCreated(json.storyId);
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-panel">
      <h2>AI Story Generator</h2>
      <p className="muted">
        Describe a moment, alternate timeline, or emotional arc — we'll generate
        a high-quality fanfiction story using your selected universe.
      </p>

      {error && <p className="error-text">{error}</p>}

      <div className="form-field">
        <span>Franchise *</span>
        <select
          value={franchise}
          onChange={(e) => setFranchise(e.target.value)}
        >
          <option value="">Select franchise…</option>
          {FRANCHISES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <span>Main Characters</span>
        <input
          type="text"
          placeholder="Gojo, Geto, Eren, Mikasa…"
          value={characters}
          onChange={(e) => setCharacters(e.target.value)}
        />
      </div>

      <div className="form-field">
        <span>Mood</span>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">Optional</option>
          {MOODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={isAdult}
          onChange={(e) => setIsAdult(e.target.checked)}
        />
        <span>Adult content (18+)</span>
      </label>

      <div className="form-field">
        <span>Describe your story *</span>
        <textarea
          rows={5}
          placeholder="e.g., What if Anakin never turned? What if Gojo saved Geto? A healing scene between Mikasa and Eren after the rumbling…"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
        />
      </div>

      <button className="pill-btn" onClick={generateStory} disabled={loading}>
        {loading ? "Generating…" : "Generate Story"}
      </button>
    </div>
  );
};
