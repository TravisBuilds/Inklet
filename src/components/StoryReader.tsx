// src/components/StoryReader.tsx
import React, { useEffect, useState } from "react";
import type { StoryDetail, Comment } from "../types";
import { fetchStoryById, fetchComments, postComment } from "../api/storiesApi";
import { useAuth } from "../context/AuthContext";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { PaywallModal } from "./PaywallModal";

interface StoryReaderProps {
  storyId: string;
  onBack: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({ storyId, onBack }) => {
  const [story, setStory] = useState<StoryDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  const { hasAdultAccess } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const s = await fetchStoryById(storyId);
      const c = await fetchComments(storyId);
      if (isMounted) {
        setStory(s);
        setComments(c);
        setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [storyId]);

  const handleCommentSubmit = async (content: string, userName: string) => {
    const newComment = await postComment(storyId, userName, content);
    if (newComment) {
      setComments((prev) => [...prev, newComment]);
    }
  };

  if (loading) {
    return (
      <div className="story-reader">
        <button className="link-btn" onClick={onBack}>
          ← Back to stories
        </button>
        <p className="muted">Loading story…</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="story-reader">
        <button className="link-btn" onClick={onBack}>
          ← Back to stories
        </button>
        <p className="muted">Story not found.</p>
      </div>
    );
  }

  const isAdultLocked = story.is_adult && !hasAdultAccess;

  // Use this for preview: first few paragraphs only
  const paragraphs = story.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const previewParagraphs = paragraphs.slice(0, 3); // show first 3 paras as teaser

  return (
    <div className="story-reader">
      <button className="link-btn" onClick={onBack}>
        ← Back to stories
      </button>

      <h1 className="story-title">{story.title}</h1>

      <p className="story-meta">
        Inklet Original · {story.franchise} · {story.length}
        {story.is_adult && " · Adult"}
      </p>

      {story.moodCategories.length > 0 && (
        <p className="story-moods">
          Mood: {story.moodCategories.join(" · ")}
        </p>
      )}

      {story.tags.length > 0 && (
        <p className="story-characters">
          Characters: {story.tags.join(" · ")}
        </p>
      )}

      {story.synopsis && (
        <p className="story-synopsis">{story.synopsis}</p>
      )}

      {isAdultLocked && (
        <div className="adult-preview">
          <p>
            This is an adult story. You’re seeing only a preview. Unlock adult
            access to read the full story and other adult content on Inklet.
          </p>
          <button
            className="pill-btn"
            onClick={() => setShowPaywall(true)}
          >
            Unlock Adult Access
          </button>
        </div>
      )}

      <div className="story-body">
        {(isAdultLocked ? previewParagraphs : paragraphs).map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      <section className="story-comments">
        <h2>Comments</h2>
        <CommentList comments={comments} />
        <CommentForm onSubmit={handleCommentSubmit} />
      </section>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    </div>
  );
};
