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
    const { isAuthenticated, hasAdultAccess, login, logout } = useAuth();

    return (
        <div className="inklet-root">
            <header className="inklet-header">
                <div className="inklet-header-left">
                    <div className="inklet-logo">
                        <img
                            src="/logo.png"
                            alt="Inklet Logo"
                            style={{ height: "104px", marginRight: "0.5rem" }}
                        />
                    </div>

                    <nav className="inklet-nav">
                        <button
                            className={currentView === "home" ? "nav-btn active" : "nav-btn"}
                            onClick={() => onNavigate("home")}
                        >
                            Home
                        </button>
                        <button
                            className={currentView === "explore" ? "nav-btn active" : "nav-btn"}
                            onClick={() => onNavigate("explore")}
                        >
                            Explore
                        </button>
                        <button
                            className={currentView === "create" ? "nav-btn active" : "nav-btn"}
                            onClick={() => onNavigate("create")}
                        >
                            Create with AI
                        </button>
                    </nav>
                </div>

                <div className="inklet-header-right">
                    {isAuthenticated ? (
                        <>
                            {hasAdultAccess ? (
                                <span className="badge badge-subbed">Adult access</span>
                            ) : (
                                <span className="badge">Free tier</span>
                            )}
                            <button className="pill-btn secondary" onClick={logout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <button className="pill-btn" onClick={login}>
                            Log in
                        </button>
                    )}
                </div>
            </header>

            <main className="inklet-main">{children}</main>
        </div>
    );
};
