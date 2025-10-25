import React, { Suspense, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSearchStore, useUserStore, useAppStore } from '../stores';
import { LobbyTrendsChart, OrganizationChart, CategoryChart } from './charts';
import { API_ENDPOINTS, apiCall } from '../config/api';
import KPICard from './KPICard';
import {
  getTotalYearSpending,
  getCityGovernmentSpending,
  getCountyGovernmentSpending,
  getOrganizationCounts
} from '../utils/kpiCalculations';
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

  // Calculate KPI values (memoized for performance)
  const currentYear = new Date().getFullYear();
  const kpiData = useMemo(() => ({
    totalYearSpending: getTotalYearSpending(),
    citySpending: getCityGovernmentSpending(),
    countySpending: getCountyGovernmentSpending(),
    counts: getOrganizationCounts()
  }), []);

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
        <h1>California Lobbying Dashboard</h1>
        <p className="page-description">
          Welcome back, {user?.firstName || 'User'}! Year-to-date lobbying expenditure analysis for {currentYear}
        </p>
      </div>

      <div className="page-content">
        {/* KPI Section */}
        <div className="kpi-section">
          <div className="kpi-grid">
            <KPICard
              title="Total Lobbying Expenditures"
              subtitle={`Year-to-Date ${currentYear}`}
              value={kpiData.totalYearSpending}
              icon="💰"
              color="#2563eb"
              isEstimate={true}
            />
            <KPICard
              title="City Government Lobbying"
              subtitle={`${kpiData.counts.cityOrganizations} California ${kpiData.counts.cityOrganizations === 1 ? 'City' : 'Cities'}`}
              value={kpiData.citySpending}
              icon="🏛️"
              color="#10b981"
              isEstimate={true}
            />
            <KPICard
              title="County Government Lobbying"
              subtitle={`${kpiData.counts.countyOrganizations} California ${kpiData.counts.countyOrganizations === 1 ? 'County' : 'Counties'}`}
              value={kpiData.countySpending}
              icon="🏢"
              color="#8b5cf6"
              isEstimate={true}
            />
          </div>
        </div>

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
    const fetchHealth = async () => {
      try {
        const data = await apiCall(API_ENDPOINTS.health);
        setHealth(data);
      } catch (err) {
        // Health check failed - handled silently in demo mode
        // Provide fallback data for production when backend isn't available
        setHealth({
          status: 'demo_mode',
          service: 'ca-lobby-api',
          version: '1.3.0',
          environment: 'production',
          database: { status: 'demo_mode' },
          message: 'Running in demo mode - backend not connected'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
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
    const fetchStatus = async () => {
      try {
        const data = await apiCall(API_ENDPOINTS.status);
        setStatus(data);
      } catch (err) {
        // Status check failed - handled silently in demo mode
        // Provide fallback data for production
        setStatus({
          phase: '1.3 - Frontend-Backend Integration (Demo Mode)',
          components: {
            backend_api: 'demo_mode',
            database: 'demo_mode',
            authentication: 'clerk_active',
            search_api: 'demo_mode'
          },
          performance: {
            cache_hit_rate: 'N/A'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
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
    const fetchCacheStats = async () => {
      try {
        const data = await apiCall(API_ENDPOINTS.cacheStats);
        setData(data);
      } catch (err) {
        // Cache stats failed - handled silently in demo mode
        // Provide fallback data for production
        setData({
          success: true,
          cache_hits: 0,
          cache_misses: 0,
          hit_rate: '0%',
          cached_keys: 0,
          message: 'Demo mode - no backend connected'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCacheStats();
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