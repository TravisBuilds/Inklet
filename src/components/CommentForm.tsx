// src/components/CommentForm.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface CommentFormProps {
  onSubmit: (text: string) => Promise<void> | void;
  disabled?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  disabled = false
}) => {
  const { user, loading, signInWithMagicLink } = useAuth();

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState("");
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  const handleSendMagicLink = async () => {
    if (!email.trim()) return;
    try {
      setAuthStatus("Sending login link…");
      await signInWithMagicLink(email.trim());
      setAuthStatus("Check your email for the login link.");
    } catch (err) {
      console.error(err);
      setAuthStatus("Failed to send login link.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending || disabled) return;

    setSending(true);
    try {
      await onSubmit(text.trim());
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // While auth state is loading, just show nothing special
  if (loading) {
    return <p className="muted small">Loading auth…</p>;
  }

  // Not logged in → show simple email login + disabled textarea
  if (!user) {
    return (
      <div className="comment-panel">
        <p className="muted small">
          Sign in to join the discussion. We’ll send you a magic link.
        </p>

        <div className="comment-login-row">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="comment-email-input"
          />
          <button className="pill-btn pill-btn-small" onClick={handleSendMagicLink}>
            Send login link
          </button>
        </div>

        {authStatus && <p className="muted small">{authStatus}</p>}

        <textarea
          className="comment-textarea"
          placeholder="Log in to write a comment…"
          disabled
        />
      </div>
    );
  }

  // Logged in → normal comment form
  return (
    <form className="comment-panel" onSubmit={handleSubmit}>
      <textarea
        className="comment-textarea"
        placeholder="Share your thoughts…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={sending || disabled}
      />

      <div className="comment-actions">
        <button
          type="submit"
          className="pill-btn pill-btn-small"
          disabled={sending || disabled || !text.trim()}
        >
          {sending ? "Posting…" : "Post comment"}
        </button>
      </div>
    </form>
  );
};
