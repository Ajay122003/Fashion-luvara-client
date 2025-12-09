import React, { useEffect, useState } from "react";
import { fetchSiteSettings, updateSiteSettings } from "../../api/admin";

const Settings = () => {
  const [settings, setSettings] = useState({
    enable_cod: true,
    allow_order_cancel: true,
    allow_order_return: true,
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchSiteSettings();
      setSettings(data);
    } catch (e) {
      alert("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.checked });
  };

  const handleSave = async () => {
    try {
      await updateSiteSettings(settings);
      alert("Settings updated");
    } catch {
      alert("Failed to update settings");
    }
  };

  return (
    <div>
      <h3 className="mb-3">Site Settings</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="cod"
                name="enable_cod"
                checked={settings.enable_cod}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="cod">
                Enable Cash on Delivery (COD)
              </label>
            </div>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="cancel"
                name="allow_order_cancel"
                checked={settings.allow_order_cancel}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="cancel">
                Allow Order Cancellation
              </label>
            </div>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="return"
                name="allow_order_return"
                checked={settings.allow_order_return}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="return">
                Allow Order Returns
              </label>
            </div>

            <button className="btn btn-dark" onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
