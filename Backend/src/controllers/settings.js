// settings.js
let settings = {
    siteTitle: "Fashion E-commerce",
    adminEmail: "admin@example.com",
    maintenanceMode: false,
  };
  
  export const getSettings = () => settings;
  
  export const updateSettings = (newSettings) => {
    settings = { ...settings, ...newSettings };
    return settings;
  };
  