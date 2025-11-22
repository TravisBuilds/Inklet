// src/components/PaywallModal.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

interface PaywallModalProps {
  onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose }) => {
  const { isAuthenticated, login, grantAdultAccess } = useAuth();

  const handleUnlock = () => {
    if (!isAuthenticated) {
      // trigger fake login first
      login();
    }
    // In the future: you’d redirect to Stripe / crypto checkout here
    grantAdultAccess();
    onClose();
  };

  return (
    <div className="paywall-backdrop">
      <div className="paywall-modal">
        <h2>Adult Story</h2>
        <p>
          This story is marked as adult content. Log in and unlock adult access
          to read it and other adult stories across Inklet.
        </p>
        <div className="paywall-actions">
          <button className="pill-btn" onClick={handleUnlock}>
            Unlock Adult Access
          </button>
          <button className="pill-btn secondary" onClick={onClose}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
