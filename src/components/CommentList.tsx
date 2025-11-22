// src/components/CommentList.tsx
import React from "react";
import type { Comment } from "../types";

interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (!comments.length) {
    return <p className="muted">No comments yet. Be the first to react.</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((c) => (
        <li key={c.id} className="comment-item">
          <div className="comment-header">
            <span className="comment-user">{c.userName || "anon"}</span>
            <span className="comment-date">
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="comment-body">{c.content}</p>
        </li>
      ))}
    </ul>
  );
};
