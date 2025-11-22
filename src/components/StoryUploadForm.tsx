// src/components/StoryUploadForm.tsx
import React, { useState } from "react";
import { createUserStory } from "../api/storiesApi";

interface StoryUploadFormProps {
  onCreated?: (storyId: string) => void;
}

const MOODS = [
  "healing",
  "second chance",
  "comfort",
  "found family",
  "angst",
  "grief",
  "catharsis",
  "romance",
  "slow burn",
  "tender",
  "bittersweet",
  "hope",
  "rebellion",
  "bravery",
  "defiance"
];

export const StoryUploadForm: React.FC<StoryUploadFormProps> = ({
  onCreated
}) => {
  const [title, setTitle] = useState("");
  const [franchise, setFranchise] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [characterTags, setCharacterTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !franchise.trim() || !content.trim()) {
      setError("Title, franchise, and content are required.");
      return;
    }

    setSubmitting(true);
    try {
      const tags = characterTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const story = await createUserStory({
        title: title.trim(),
        franchise: franchise.trim(),
        synopsis: synopsis.trim(),
        content: content.trim(),
        isAdult,
        moodCategories: selectedMoods,
        tags
      });

      if (!story) {
        setError("Failed to save story. Please try again.");
      } else {
        setSuccess("Story submitted! It’s now part of Inklet.");
        setTitle("");
        setFranchise("");
        setSynopsis("");
        setContent("");
        setIsAdult(false);
        setSelectedMoods([]);
        setCharacterTags("");

        if (onCreated) onCreated(story.id);
      }
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="upload-panel">
      <h2>Upload or write your own story</h2>
      <p className="muted">
        Paste your story, tag the universe and mood, and we’ll format it for
        Inklet. Creator identity stays hidden to readers.
      </p>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Title *</span>
          <input
            type="text"
            placeholder="e.g., What If He Stayed?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Franchise / Universe *</span>
          <input
            type="text"
            placeholder="e.g., Jujutsu Kaisen, Witcher, Star Wars…"
            value={franchise}
            onChange={(e) => setFranchise(e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Characters / tags (comma separated)</span>
          <input
            type="text"
            placeholder="e.g., Gojo, Geto, Nobara"
            value={characterTags}
            onChange={(e) => setCharacterTags(e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Synopsis (1–3 sentences)</span>
          <textarea
            rows={3}
            placeholder="Give readers a taste without spoilers."
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Full story *</span>
          <textarea
            rows={12}
            placeholder="Paste or write your story here…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <div className="form-row">
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={isAdult}
              onChange={(e) => setIsAdult(e.target.checked)}
            />
            <span>Mark as adult content (18+)</span>
          </label>
        </div>

        <div className="form-field">
          <span>Mood tags</span>
          <div className="mood-grid">
            {MOODS.map((mood) => (
              <button
                key={mood}
                type="button"
                className={
                  selectedMoods.includes(mood)
                    ? "mood-pill selected"
                    : "mood-pill"
                }
                onClick={() => toggleMood(mood)}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button className="pill-btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit story"}
        </button>
      </form>
    </div>
  );
};
