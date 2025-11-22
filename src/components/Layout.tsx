// src/components/Layout.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  currentView: "home" | "explore" | "create" | "franchise";
  onNavigate: (view: "home" | "explore" | "create") => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentView,
  onNavigate,
  children
}) => {
  const { user, hasAdultAccess, loading, signInWithMagicLink, signOut } =
    useAuth();

  const handleSignIn = async () => {
    const email = window.prompt("Enter your email for a login link:");
    if (!email) return;
    try {
      await signInWithMagicLink(email.trim());
      alert("Check your email for the login link.");
    } catch (err) {
      console.error(err);
      alert("Failed to send login link.");
    }
  };

  const isActive = (view: "home" | "explore" | "create") =>
    currentView === view ? "nav-tab nav-tab-active" : "nav-tab";

  return (
    <div className="inklet-root">
      <header className="inklet-header">
        <div className="inklet-header-left">
          <div className="inklet-logo">
            <img
              src="/logo.png"
              alt="Inklet Logo"
              style={{ height: "94px", marginRight: "0.75rem" }}
            />
          
          </div>

          <nav className="inklet-nav">
            <button
              className={isActive("home")}
              onClick={() => onNavigate("home")}
            >
              Home
            </button>
            <button
              className={isActive("explore")}
              onClick={() => onNavigate("explore")}
            >
              Explore
            </button>
            <button
              className={isActive("create")}
              onClick={() => onNavigate("create")}
            >
              Create with AI
            </button>
          </nav>
        </div>

        <div className="inklet-header-right">
          {!loading && user && (
            <div className="auth-status">
              <span className="muted small">
                {user.email ?? "Signed in"}
                {" · "}
                Adult:{" "}
                {hasAdultAccess ? (
                  <span className="badge badge-ok">Active</span>
                ) : (
                  <span className="badge badge-muted">Locked</span>
                )}
              </span>
              <button className="link-btn" onClick={signOut}>
                Sign out
              </button>
            </div>
          )}

          {!loading && !user && (
            <button className="pill-btn pill-btn-ghost" onClick={handleSignIn}>
              Sign in
            </button>
          )}
        </div>
      </header>

      <main className="inklet-main">{children}</main>
    </div>
  );
};
