import React, { useEffect, useState } from "react";
import {
  fetchSiteSettings,
  updateSiteSettings,
  adminUpdateEmail,
  adminChangePassword,
} from "../../api/admin";

const Settings = () => {
  const [openSection, setOpenSection] = useState("store");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const [settings, setSettings] = useState({
    enable_cod: true,
    allow_order_cancel: true,
    allow_order_return: true,
    shipping_charge: 50,
    free_shipping_min_amount: 999,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD SETTINGS ================= */
  const loadSettings = async () => {
    try {
      const data = await fetchSiteSettings();
      setSettings({
        ...data,
        shipping_charge: Number(data.shipping_charge),
        free_shipping_min_amount: Number(data.free_shipping_min_amount),
      });
    } catch {
      alert("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  /* ================= HANDLERS ================= */
  const handleToggle = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.checked });
  };

  const handleNumberChange = (e) => {
    setSettings({ ...settings, [e.target.name]: Number(e.target.value) });
  };

  /* ================= SAVE SETTINGS (COMMON) ================= */
  const saveSettings = async () => {
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      alert("Settings updated successfully!");
    } catch {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  /* ================= ACCOUNT ================= */
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const updateEmail = async () => {
    if (!newEmail) return alert("Enter email");
    setEmailLoading(true);
    await adminUpdateEmail({ new_email: newEmail });
    setEmailLoading(false);
    setNewEmail("");
    alert("Email updated");
  };

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  const updatePassword = async () => {
    setPasswordLoading(true);
    await adminChangePassword(passwordData);
    setPasswordLoading(false);
    alert("Password updated");
  };

  /* ================= SECTION HEADER ================= */
  const SectionHeader = ({ icon, title, section }) => (
    <div className="admin-header" onClick={() => toggleSection(section)}>
      <div className="d-flex align-items-center gap-2">
        <i className={`bi ${icon}`}></i>
        <span>{title}</span>
      </div>
      <i
        className={`bi bi-chevron-down arrow ${
          openSection === section ? "rotate" : ""
        }`}
      ></i>
    </div>
  );

  return (
    <div className="container py-3" style={{ maxWidth: 900 }}>
      <h3 className="fw-bold mb-4">Admin Settings</h3>

      {/* ================= STORE SETTINGS ================= */}
      <div className="admin-card">
        <SectionHeader
          icon="bi-shop"
          title="Store Settings"
          section="store"
        />

        {openSection === "store" && (
          <div className="admin-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="enable_cod"
                    checked={settings.enable_cod}
                    onChange={handleToggle}
                  />
                  <label className="form-check-label">
                    Enable Cash On Delivery
                  </label>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="allow_order_cancel"
                    checked={settings.allow_order_cancel}
                    onChange={handleToggle}
                  />
                  <label className="form-check-label">
                    Allow Order Cancellation
                  </label>
                </div>

                <div className="form-check form-switch mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="allow_order_return"
                    checked={settings.allow_order_return}
                    onChange={handleToggle}
                  />
                  <label className="form-check-label">
                    Allow Product Returns
                  </label>
                </div>

                {/* 🔥 SAVE STORE SETTINGS */}
                <button
                  className="btn btn-dark"
                  disabled={saving}
                  onClick={saveSettings}
                >
                  {saving ? "Saving..." : "Save Store Settings"}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ================= SHIPPING SETTINGS ================= */}
      <div className="admin-card">
        <SectionHeader
          icon="bi-truck"
          title="Shipping Settings"
          section="shipping"
        />

        {openSection === "shipping" && (
          <div className="admin-body">
            <div className="mb-3">
              <label className="form-label">Shipping Charge (₹)</label>
              <input
                type="number"
                className="form-control"
                name="shipping_charge"
                value={settings.shipping_charge}
                onChange={handleNumberChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Free Shipping Above (₹)
              </label>
              <input
                type="number"
                className="form-control"
                name="free_shipping_min_amount"
                value={settings.free_shipping_min_amount}
                onChange={handleNumberChange}
              />
            </div>

            <button
              className="btn btn-dark"
              disabled={saving}
              onClick={saveSettings}
            >
              {saving ? "Saving..." : "Save Shipping Settings"}
            </button>
          </div>
        )}
      </div>

      {/* ================= ACCOUNT SETTINGS ================= */}
      <div className="admin-card">
        <SectionHeader
          icon="bi-person-circle"
          title="Account Settings"
          section="account"
        />

        {openSection === "account" && (
          <div className="admin-body">
            <div className="mb-3">
              <label className="form-label">New Email</label>
              <input
                type="email"
                className="form-control"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary mb-4"
              disabled={emailLoading}
              onClick={updateEmail}
            >
              {emailLoading ? "Updating..." : "Update Email"}
            </button>

            <hr />

            <div className="mb-3">
              <label className="form-label">Old Password</label>
              <input
                type="password"
                className="form-control"
                value={passwordData.old_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    old_password: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password: e.target.value,
                  })
                }
              />
            </div>

            <button
              className="btn btn-danger"
              disabled={passwordLoading}
              onClick={updatePassword}
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .admin-card {
          background: #fff;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
        }

        .admin-header {
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-weight: 600;
        }

        .admin-header:hover {
          background: #f8f9fa;
        }

        .admin-body {
          padding: 18px;
          border-top: 1px solid #eee;
        }

        .arrow {
          transition: transform 0.3s ease;
        }

        .rotate {
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
};

export default Settings;
