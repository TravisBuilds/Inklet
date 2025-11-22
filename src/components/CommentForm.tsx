// src/components/CommentForm.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface CommentFormProps {
  onSubmit: (content: string, userName: string) => Promise<void>;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const { user, isAuthenticated, login } = useAuth();
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const name = user?.name || "anon";
    setPending(true);
    try {
      await onSubmit(content, name);
      setContent("");
    } finally {
      setPending(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="comment-login-box">
        <p>Log in to leave a comment.</p>
        <button className="pill-btn" onClick={login}>
          Log in
        </button>
      </div>
    );
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-textarea"
        placeholder="Share your thoughts about this story…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="pill-btn" type="submit" disabled={pending}>
        {pending ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
};
