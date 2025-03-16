import React, { useState } from "react";
import "./AdminSettings.css";

const AdminSettings = () => {
  const [siteTitle, setSiteTitle] = useState("Fashion E-commerce");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    console.log({
      siteTitle,
      adminEmail,
      maintenanceMode,
    });
    alert("Settings saved!");
  };

  return (
    <div className="admin-settings">
      <h2>Settings</h2>
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
        <button onClick={handleSave}>Save Settings</button>
      </div>
    </div>
  );
};

export default AdminSettings;