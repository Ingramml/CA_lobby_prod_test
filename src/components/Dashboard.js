import React, { Suspense } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSearchStore, useUserStore, useAppStore } from '../stores';
import { LobbyTrendsChart, OrganizationChart, CategoryChart } from './charts';
import './charts/charts.css';

// Error Boundary component for chart protection
class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chart error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="chart-container error">
          <h3>Chart Error</h3>
          <div className="chart-error">
            <p>Chart temporarily unavailable</p>
            <button onClick={() => this.setState({ hasError: false, error: null })}>
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Dashboard() {
  const { user, isLoaded: userLoaded } = useUser();
  const [dashboardLoading, setDashboardLoading] = React.useState(true);
  const [dashboardError, setDashboardError] = React.useState(null);
  const [chartsEnabled, setChartsEnabled] = React.useState(true);

  // Connect to Zustand stores
  const { searchHistory, savedSearches } = useSearchStore();
  const { recentActivity, bookmarks, syncWithClerk, isAuthenticated } = useUserStore();
  const { systemStatus, setSystemStatus } = useAppStore();

  // Sync user data with Clerk when user changes
  React.useEffect(() => {
    if (userLoaded) {
      try {
        syncWithClerk(user);
        setDashboardLoading(false);
        setDashboardError(null);
      } catch (error) {
        console.error('Dashboard sync error:', error);
        setDashboardError('Failed to sync user data');
        setDashboardLoading(false);
      }
    }
  }, [user, userLoaded, syncWithClerk]);

  // Handle chart stability
  const handleChartError = React.useCallback((error) => {
    console.error('Chart rendering error:', error);
    setChartsEnabled(false);
    setTimeout(() => setChartsEnabled(true), 2000); // Re-enable after 2 seconds
  }, []);

  // Show loading state while Clerk is loading
  if (!userLoaded || dashboardLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if something went wrong
  if (dashboardError) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Dashboard Error</h2>
          <p>{dashboardError}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          {chartsEnabled ? (
            <Suspense fallback={<div className="charts-loading">Loading charts...</div>}>
              <div className="charts-grid">
                <ChartErrorBoundary>
                  <LobbyTrendsChart onError={handleChartError} />
                </ChartErrorBoundary>
                <ChartErrorBoundary>
                  <OrganizationChart onError={handleChartError} />
                </ChartErrorBoundary>
                <ChartErrorBoundary>
                  <CategoryChart onError={handleChartError} />
                </ChartErrorBoundary>
              </div>
            </Suspense>
          ) : (
            <div className="charts-disabled">
              <div className="chart-container">
                <h3>Charts Temporarily Disabled</h3>
                <p>Charts are being reloaded due to a display issue.</p>
                <button
                  onClick={() => setChartsEnabled(true)}
                  className="btn btn-primary"
                >
                  Enable Charts
                </button>
              </div>
            </div>
          )}
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
              <h3>Cache Performance</h3>
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
    fetch('http://localhost:5001/health')
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
          <p>Service: {health.service}</p>
          <p>Version: {health.version}</p>
          <p>Environment: {health.environment}</p>
          <p>Database: {health.database?.status}</p>
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
    fetch('http://localhost:5001/api/status')
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
          <p>Phase: {status.phase}</p>
          <p>Backend API: {status.components?.backend_api}</p>
          <p>Database: {status.components?.database}</p>
          <p>Authentication: {status.components?.authentication}</p>
          <p>Cache Hit Rate: {status.performance?.cache_hit_rate}</p>
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
    fetch('http://localhost:5001/api/cache/stats')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Cache stats failed:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="api-result">
      {data ? (
        <div className="success">
          <p>Status: {data.success ? 'Active' : 'Error'}</p>
          <p>Cache Hits: {data.cache_hits || 0}</p>
          <p>Cache Misses: {data.cache_misses || 0}</p>
          <p>Hit Rate: {data.hit_rate || '0%'}</p>
          <p>Cached Keys: {data.cached_keys || 0}</p>
        </div>
      ) : (
        <div className="error">Failed to load cache stats</div>
      )}
    </div>
  );
}

export default Dashboard;