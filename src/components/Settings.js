import React from 'react';
import { useUserStore } from '../stores';

function Settings() {
  const { preferences, updatePreferences } = useUserStore();

  const handlePreferenceChange = (key, value) => {
    updatePreferences({ [key]: value });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Settings & Preferences</h1>
        <p className="page-description">
          Customize your CA Lobby experience with personalized settings and preferences
        </p>
      </div>

      <div className="page-content">
        <div className="settings-grid">

          {/* Display Preferences */}
          <div className="settings-card">
            <h3>🎨 Display Preferences</h3>
            <div className="settings-section">
              <div className="setting-item">
                <label>Theme:</label>
                <select
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Results per page:</label>
                <select
                  value={preferences.pageSize}
                  onChange={(e) => handlePreferenceChange('pageSize', parseInt(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Default view:</label>
                <select
                  value={preferences.defaultView}
                  onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                >
                  <option value="list">List</option>
                  <option value="grid">Grid</option>
                  <option value="table">Table</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-card">
            <h3>🔔 Notification Preferences</h3>
            <div className="settings-section">
              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                  />
                  Enable notifications
                </label>
              </div>

              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.autoSave}
                    onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
                  />
                  Auto-save searches
                </label>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="settings-card">
            <h3>🌐 Language & Region</h3>
            <div className="settings-section">
              <div className="setting-item">
                <label>Language:</label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="settings-card">
            <h3>🔒 Data & Privacy</h3>
            <div className="settings-section">
              <div className="setting-item">
                <p className="setting-description">
                  Your search history and preferences are stored locally in your browser.
                  Data is encrypted and never shared with third parties.
                </p>
              </div>

              <div className="setting-item">
                <p className="setting-description">
                  <strong>Current preferences:</strong>
                </p>
                <pre className="preferences-display">
                  {JSON.stringify(preferences, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="settings-card">
            <h3>ℹ️ About CA Lobby</h3>
            <div className="settings-section">
              <div className="setting-item">
                <p className="setting-description">
                  CA Lobby provides transparent access to California lobbying data.
                  Built with modern web technologies for fast, accessible public information access.
                </p>
              </div>

              <div className="setting-item">
                <p className="setting-description">
                  <strong>Version:</strong> 1.0.0<br />
                  <strong>Phase:</strong> 2b - State Management<br />
                  <strong>Status:</strong> Active Development
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;