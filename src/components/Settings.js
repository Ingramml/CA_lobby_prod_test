import React, { useState } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      newResults: false,
      weeklyDigest: true,
      systemUpdates: true
    },
    display: {
      theme: 'light',
      resultsPerPage: 25,
      defaultView: 'grid'
    },
    privacy: {
      shareUsage: false,
      saveSearchHistory: true,
      autoLogout: 30
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Settings & Preferences</h1>
        <p className="page-description">
          Customize your CA lobby search experience and account preferences
        </p>
      </div>

      <div className="page-content">
        <div className="settings-grid">
          <div className="dashboard-card">
            <h3>👤 Account Information</h3>
            <div className="settings-section">
              <div className="setting-item">
                <label>Display Name:</label>
                <input type="text" placeholder="Your display name" disabled />
              </div>
              <div className="setting-item">
                <label>Email Address:</label>
                <input type="email" placeholder="your.email@example.com" disabled />
              </div>
              <div className="setting-item">
                <label>Organization:</label>
                <input type="text" placeholder="Your organization name" disabled />
              </div>
              <div className="setting-item">
                <label>Role:</label>
                <select disabled>
                  <option>Researcher</option>
                  <option>Analyst</option>
                  <option>Administrator</option>
                  <option>Viewer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>🔔 Notification Preferences</h3>
            <div className="settings-section">
              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    disabled
                  />
                  Email notifications enabled
                </label>
              </div>
              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newResults}
                    onChange={(e) => handleSettingChange('notifications', 'newResults', e.target.checked)}
                    disabled
                  />
                  Notify me of new search results
                </label>
              </div>
              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.weeklyDigest}
                    onChange={(e) => handleSettingChange('notifications', 'weeklyDigest', e.target.checked)}
                    disabled
                  />
                  Weekly activity digest
                </label>
              </div>
              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.systemUpdates}
                    onChange={(e) => handleSettingChange('notifications', 'systemUpdates', e.target.checked)}
                    disabled
                  />
                  System updates and maintenance notices
                </label>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>🎨 Display Preferences</h3>
            <div className="settings-section">
              <div className="setting-item">
                <label>Theme:</label>
                <select
                  value={settings.display.theme}
                  onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                  disabled
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Results per page:</label>
                <select
                  value={settings.display.resultsPerPage}
                  onChange={(e) => handleSettingChange('display', 'resultsPerPage', e.target.value)}
                  disabled
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
                  value={settings.display.defaultView}
                  onChange={(e) => handleSettingChange('display', 'defaultView', e.target.value)}
                  disabled
                >
                  <option value="grid">Grid View</option>
                  <option value="list">List View</option>
                  <option value="table">Table View</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>🔐 Privacy & Security</h3>
            <div className="settings-section">
              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.privacy.shareUsage}
                    onChange={(e) => handleSettingChange('privacy', 'shareUsage', e.target.checked)}
                    disabled
                  />
                  Share usage analytics to improve the service
                </label>
              </div>
              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.privacy.saveSearchHistory}
                    onChange={(e) => handleSettingChange('privacy', 'saveSearchHistory', e.target.checked)}
                    disabled
                  />
                  Save search history for quick access
                </label>
              </div>
              <div className="setting-item">
                <label>Auto-logout after (minutes):</label>
                <select
                  value={settings.privacy.autoLogout}
                  onChange={(e) => handleSettingChange('privacy', 'autoLogout', e.target.value)}
                  disabled
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={0}>Never</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>📋 Data Management</h3>
            <div className="settings-section">
              <div className="placeholder-content">
                <p>Data management tools will include:</p>
                <ul>
                  <li>Export all personal data</li>
                  <li>Clear search history</li>
                  <li>Delete saved searches</li>
                  <li>Download activity reports</li>
                </ul>
                <div className="button-group">
                  <button className="data-btn" disabled>📤 Export My Data</button>
                  <button className="data-btn danger" disabled>🗑️ Clear History</button>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>🔧 Advanced Settings</h3>
            <div className="settings-section">
              <div className="placeholder-content">
                <p>Advanced configuration options:</p>
                <ul>
                  <li>API access and rate limits</li>
                  <li>Custom data source integrations</li>
                  <li>Automated report scheduling</li>
                  <li>Team collaboration settings</li>
                </ul>
                <div className="button-group">
                  <button className="settings-btn" disabled>⚙️ Advanced Config</button>
                  <button className="settings-btn" disabled>🔑 API Settings</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="save-btn" disabled>💾 Save Changes</button>
          <button className="reset-btn" disabled>🔄 Reset to Defaults</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;