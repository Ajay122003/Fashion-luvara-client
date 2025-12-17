import React, { useEffect, useState } from "react";
import {
  fetchSiteSettings,
  updateSiteSettings,
  adminUpdateEmail,
  adminChangePassword,
} from "../../api/admin";

const Settings = () => {
  /* =========================
     SITE SETTINGS
  ========================= */
  const [settings, setSettings] = useState({
    enable_cod: true,
    allow_order_cancel: true,
    allow_order_return: true,
    shipping_charge: 50,
    free_shipping_min_amount: 999,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchSiteSettings();
      setSettings({
        ...data,
        shipping_charge: Number(data.shipping_charge),
        free_shipping_min_amount: Number(data.free_shipping_min_amount),
      });
    } catch (err) {
      alert("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const handleToggle = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.checked,
    });
  };

  // 🔥 IMPORTANT FIX (NUMBER)
  const handleNumberChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: Number(e.target.value),
    });
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      alert("Settings updated successfully!");
    } catch (err) {
      console.error(err.response?.data);
      alert("Error updating settings");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     CHANGE EMAIL
  ========================= */
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const updateEmail = async () => {
    if (!newEmail.trim()) return alert("Enter a valid email");

    try {
      setEmailLoading(true);
      const res = await adminUpdateEmail({ new_email: newEmail });
      alert(res.message);
      setNewEmail("");
    } catch (err) {
      alert(
        err.response?.data?.new_email ||
          err.response?.data?.detail ||
          "Unable to update email"
      );
    } finally {
      setEmailLoading(false);
    }
  };

  /* =========================
     CHANGE PASSWORD
  ========================= */
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordField = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const updatePassword = async () => {
    if (!passwordData.old_password || !passwordData.new_password)
      return alert("Fill all password fields");

    try {
      setPasswordLoading(true);
      const res = await adminChangePassword(passwordData);
      alert(res.message);
      setPasswordData({ old_password: "", new_password: "" });
    } catch (err) {
      alert(
        err.response?.data?.old_password ||
          err.response?.data?.new_password ||
          "Password update failed"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">Admin Settings</h3>

      {/* ================= SITE SETTINGS ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold">Store Controls</h5>
          <hr />

          {loading ? (
            <p>Loading settings...</p>
          ) : (
            <>
              {/* COD */}
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="enable_cod"
                  checked={settings.enable_cod}
                  onChange={handleToggle}
                />
                <label className="form-check-label">
                  Enable Cash On Delivery (COD)
                </label>
              </div>

              {/* CANCEL */}
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="allow_order_cancel"
                  checked={settings.allow_order_cancel}
                  onChange={handleToggle}
                />
                <label className="form-check-label">
                  Allow Users to Cancel Orders
                </label>
              </div>

              {/* RETURN */}
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

              {/* 🚚 SHIPPING SETTINGS */}
              <h6 className="fw-bold">Shipping Settings</h6>

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
                className="btn btn-dark mt-2"
                disabled={saving}
                onClick={saveSettings}
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ================= CHANGE EMAIL ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold">Change Admin Email</h5>
          <hr />

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
            className="btn btn-primary"
            disabled={emailLoading}
            onClick={updateEmail}
          >
            {emailLoading ? "Updating..." : "Update Email"}
          </button>
        </div>
      </div>

      {/* ================= CHANGE PASSWORD ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold">Change Admin Password</h5>
          <hr />

          <div className="mb-3">
            <label className="form-label">Old Password</label>
            <input
              type="password"
              className="form-control"
              name="old_password"
              value={passwordData.old_password}
              onChange={handlePasswordField}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              name="new_password"
              value={passwordData.new_password}
              onChange={handlePasswordField}
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
      </div>
    </div>
  );
};

export default Settings;
