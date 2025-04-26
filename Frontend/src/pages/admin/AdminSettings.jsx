import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminSettings.css";

const AdminSettings = () => {
  const [siteTitle, setSiteTitle] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/settings");
        setSiteTitle(data.siteTitle);
        setAdminEmail(data.adminEmail);
        setMaintenanceMode(data.maintenanceMode);
      } catch (error) {
        alert("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/api/settings", {
        siteTitle,
        adminEmail,
        maintenanceMode,
      });
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-settings">
      <h2>Settings</h2>
      {loading ? (
        <p>Loading settings...</p>
      ) : (
        <div className="settings-form">
          <div className="settings-field">
            <label htmlFor="siteTitle">Site Title</label>
            <input
              id="siteTitle"
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
            />
          </div>
          <div className="settings-field">
            <label htmlFor="adminEmail">Admin Email</label>
            <input
              id="adminEmail"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
          </div>
          <div className="settings-field">
            <label htmlFor="maintenanceMode">Maintenance Mode</label>
            <input
              id="maintenanceMode"
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
            />
          </div>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
