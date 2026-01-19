import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProfile } from "../hooks/useProfile";
import "./SettingsPage.css";
import "./AccountPage.css";

export function AccountPage() {
  const { user, resendVerificationEmail } = useAuth();
  const { profile, loading, saving, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    mobile: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        nickname: profile.nickname,
        mobile: profile.mobile,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch {
      // Error handled in hook
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        nickname: profile.nickname,
        mobile: profile.mobile,
      });
    }
    setIsEditing(false);
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setResendingEmail(true);
    setResendMessage("");
    setResendError("");

    const { error } = await resendVerificationEmail(user.email);

    if (error) {
      setResendError(error.message || "Failed to resend verification email");
    } else {
      setResendMessage("Verification email sent! Please check your inbox.");
    }

    setResendingEmail(false);

    // Clear messages after 5 seconds
    setTimeout(() => {
      setResendMessage("");
      setResendError("");
    }, 5000);
  };

  const isEmailConfirmed = user?.email_confirmed_at;

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Account</h1>
        <p>Manage your account information</p>
      </header>

      <section className="settings-section">
        <div className="section-header">
          <h2>Profile</h2>
          {!isEditing && !loading && (
            <button
              className="btn-edit-profile"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        {loading ? (
          <div className="settings-card">
            <div className="loading-message">Loading profile...</div>
          </div>
        ) : (
          <div className="settings-card">
            <div className="setting-item">
              <label>Email</label>
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <span className="setting-value setting-readonly">
                  {profile?.email || user?.email}
                </span>
                {!isEmailConfirmed && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.5rem",
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      borderRadius: "0.25rem",
                    }}
                  >
                    Unconfirmed
                  </span>
                )}
              </div>
            </div>

            <div className="setting-item">
              <label>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="setting-input"
                />
              ) : (
                <span className="setting-value">{profile?.name || "—"}</span>
              )}
            </div>

            <div className="setting-item">
              <label>Nickname</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) =>
                    setFormData({ ...formData, nickname: e.target.value })
                  }
                  placeholder="Enter your nickname"
                  className="setting-input"
                />
              ) : (
                <span className="setting-value">
                  {profile?.nickname || "—"}
                </span>
              )}
            </div>

            <div className="setting-item">
              <label>Mobile</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  placeholder="Enter your mobile number"
                  className="setting-input"
                />
              ) : (
                <span className="setting-value">{profile?.mobile || "—"}</span>
              )}
            </div>

            <div className="setting-item">
              <label>Role</label>
              <span className="setting-value setting-readonly">
                {profile?.roleName || "Not assigned"}
              </span>
            </div>

            {isEditing && (
              <div className="setting-actions">
                <button
                  className="btn-save-profile"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button className="btn-cancel-profile" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}

            <div className="setting-item setting-item-muted">
              <label>User ID</label>
              <span className="setting-value setting-id">{user?.id}</span>
            </div>

            {!isEmailConfirmed && (
              <div
                className="setting-item"
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label>Email Verification</label>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginTop: "0.5rem",
                      }}
                    >
                      Your email hasn't been confirmed yet. Please check your
                      inbox for a verification link.
                    </p>
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={handleResendVerification}
                    disabled={resendingEmail}
                    style={{ whiteSpace: "nowrap", marginLeft: "1rem" }}
                  >
                    {resendingEmail ? "Sending..." : "Resend Email"}
                  </button>
                </div>
                {resendMessage && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#10b981",
                      marginTop: "0.5rem",
                    }}
                  >
                    ✓ {resendMessage}
                  </p>
                )}
                {resendError && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#ef4444",
                      marginTop: "0.5rem",
                    }}
                  >
                    ✕ {resendError}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
