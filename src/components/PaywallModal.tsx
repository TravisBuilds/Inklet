import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  open,
  onClose
}) => {
  const { user, hasAdultAccess, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  if (!open) return null;

  const startCheckout = async () => {
    setStatus(null);
    setLoadingCheckout(true);
    try {
      const res = await fetch(
        "https://wjcpoamnbtovgayggrpt.supabase.co/functions/v1/createCheckout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              (await (await import("../lib/supabaseClient")).supabase.auth.getSession())
                .data.session?.access_token ?? ""
            }`
          },
          body: JSON.stringify({})
        }
      );
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        setStatus("Failed to start checkout.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleSendMagicLink = async () => {
    if (!email.trim()) return;
    setStatus("Sending magic link…");
    await signInWithMagicLink(email.trim());
    setStatus("Check your email for a login link.");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Unlock adult stories</h2>
        <p className="muted">
          Get <strong>1 year of unlimited adult content</strong> on Inklet for{" "}
          <strong>$5</strong>. All SFW stories remain free for everyone.
        </p>

        {!user && (
          <>
            <p className="muted">
              First, log in so we can attach the subscription to your account.
            </p>
            <div className="form-field">
              <span>Email for magic link</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="pill-btn" onClick={handleSendMagicLink}>
              Send login link
            </button>
          </>
        )}

        {user && !hasAdultAccess && (
          <>
            <button
              className="pill-btn"
              onClick={startCheckout}
              disabled={loadingCheckout}
            >
              {loadingCheckout ? "Redirecting to checkout…" : "Buy 1 year for $5"}
            </button>
            <p className="muted">
              You’ll be redirected to Stripe’s secure checkout. Once complete,
              you’ll automatically get adult access on Inklet.
            </p>
          </>
        )}

        {user && hasAdultAccess && (
          <p className="success-text">
            Your subscription is already active — you can read all adult
            stories.
          </p>
        )}

        {status && <p className="muted">{status}</p>}

        <button className="link-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
