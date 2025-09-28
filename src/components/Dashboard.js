import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSearchStore, useUserStore, useAppStore } from '../stores';
import { LobbyTrendsChart, OrganizationChart } from './charts';
import './charts/charts.css';

function Dashboard() {
  const { user } = useUser();

  // Connect to Zustand stores
  const { searchHistory, savedSearches } = useSearchStore();
  const { recentActivity, bookmarks, syncWithClerk } = useUserStore();
  const { systemStatus, setSystemStatus } = useAppStore();

  // Sync user data with Clerk when user changes
  React.useEffect(() => {
    syncWithClerk(user);
  }, [user, syncWithClerk]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-description">
          Welcome back, {user?.firstName || 'User'}! Monitor system health and access key information.
        </p>
      </div>

      <div className="page-content">
        {/* Visualization Section */}
        <div className="dashboard-section">
          <h2>CA Lobby Data Insights</h2>
          <div className="charts-grid">
            <LobbyTrendsChart />
            <OrganizationChart />
          </div>
        </div>

        {/* System Status Section */}
        <div className="dashboard-section">
          <h2>System Status</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>API Health Check</h3>
              <APIHealthCheck />
            </div>

            <div className="dashboard-card">
              <h3>System Status</h3>
              <SystemStatus />
            </div>

            <div className="dashboard-card">
              <h3>Data Access</h3>
              <DataAccessTest />
            </div>

            <div className="dashboard-card">
              <h3>Recent Search Activity</h3>
              <div className="activity-list">
                {searchHistory.length > 0 ? (
                  searchHistory.slice(0, 3).map((search, index) => (
                    <div key={index} className="activity-item">
                      <span className="search-query">"{search.query || 'Empty query'}"</span>
                      <span className="search-time">
                        {new Date(search.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="no-activity">No recent searches</p>
                )}
              </div>
            </div>

            <div className="dashboard-card">
              <h3>User Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Saved Searches:</span>
                  <span className="stat-value">{savedSearches.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Bookmarks:</span>
                  <span className="stat-value">{bookmarks.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Recent Activity:</span>
                  <span className="stat-value">{recentActivity.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// API Components
function APIHealthCheck() {
  const [health, setHealth] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Health check failed:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="api-result">
      {health ? (
        <div className="success">
          <p>Status: {health.status}</p>
          <p>Message: {health.message}</p>
          <p>Version: {health.version}</p>
          {health.source && <p>Source: {health.source}</p>}
        </div>
      ) : (
        <div className="error">Failed to load health status</div>
      )}
    </div>
  );
}

function SystemStatus() {
  const [status, setStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Status check failed:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="api-result">
      {status ? (
        <div className="success">
          <p>Environment: {status.environment}</p>
          <p>Mock Data: {status.mock_data}</p>
          <p>Debug: {status.debug}</p>
        </div>
      ) : (
        <div className="error">Failed to load system status</div>
      )}
    </div>
  );
}

function DataAccessTest() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/test-data-access')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Data access test failed:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="api-result">
      {data ? (
        <div className="success">
          <p>Status: {data.status}</p>
          <p>Message: {data.message}</p>
          {data.available_modules && (
            <div>
              <p>Available Modules:</p>
              <ul>
                {data.available_modules.map((module, idx) => (
                  <li key={idx}>{module}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="error">Failed to load data access status</div>
      )}
    </div>
  );
}

export default Dashboard;