import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSearchStore } from '../stores';

// Memoized ActivityItem component
const ActivityItem = React.memo(({ activity, getCategoryClass }) => (
  <div className="result-item">
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
      <span className={getCategoryClass(activity.category)}>
        {activity.category || 'Other'}
      </span>
      <h4 style={{ margin: 0, display: 'inline' }}>
        {activity.lobbyist || 'Unknown Lobbyist'}
      </h4>
    </div>
    <p>{activity.description || activity.activity_description}</p>
    <span className="result-meta">
      Amount: ${activity.amount?.toLocaleString() || 'N/A'} |
      Date: {activity.date || activity.filing_date || 'N/A'}
    </span>
  </div>
));

const OrganizationProfile = React.memo(() => {
  const { organizationName } = useParams();
  const navigate = useNavigate();
  const { results, loading } = useSearchStore();

  const decodedOrgName = decodeURIComponent(organizationName);

  // Helper function to get category badge class
  const getCategoryClass = (category) => {
    const normalizedCategory = category?.toLowerCase() || 'default';
    return `category-badge ${normalizedCategory}`;
  };

  // Filter results for this organization
  const organizationData = useMemo(() => {
    return results.filter(
      result => result.organization === decodedOrgName
    );
  }, [results, decodedOrgName]);

  // Validate organization exists
  const isValidOrganization = useMemo(() => {
    // Don't validate if no search performed
    if (results.length === 0) return null;
    return organizationData.length > 0;
  }, [organizationData, results.length]);

  // State for sorting
  const [sortBy, setSortBy] = React.useState('date-desc');

  // Calculate statistics
  const stats = useMemo(() => {
    if (organizationData.length === 0) return null;

    const totalAmount = organizationData.reduce((sum, item) => sum + (item.amount || 0), 0);
    const avgAmount = totalAmount / organizationData.length;
    const uniqueLobbyists = new Set(organizationData.map(item => item.lobbyist)).size;
    const categories = [...new Set(organizationData.map(item => item.category))];

    return {
      totalAmount,
      avgAmount,
      activityCount: organizationData.length,
      uniqueLobbyists,
      categories
    };
  }, [organizationData]);

  // Sort activities
  const sortedActivities = useMemo(() => {
    const sorted = [...organizationData];

    switch(sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'amount-desc':
        return sorted.sort((a, b) => (b.amount || 0) - (a.amount || 0));
      case 'amount-asc':
        return sorted.sort((a, b) => (a.amount || 0) - (b.amount || 0));
      default:
        return sorted;
    }
  }, [organizationData, sortBy]);

  // Early return for no data
  if (results.length === 0 && !loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button
            onClick={() => navigate('/search')}
            className="btn btn-secondary"
            style={{ marginBottom: '16px' }}
          >
            ← Back to Search
          </button>
          <h1>{decodedOrgName}</h1>
        </div>
        <div className="page-content">
          <div className="dashboard-card">
            <h3>No Data Available</h3>
            <p>
              Please perform a search first to view organization data.
            </p>
            <button
              onClick={() => navigate('/search')}
              className="btn"
              style={{ marginTop: '16px' }}
            >
              Go to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle invalid organization
  if (isValidOrganization === false) {
    return (
      <div className="page-container">
        <div className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('/')}>
            Home
          </span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-link" onClick={() => navigate('/search')}>
            Search
          </span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{decodedOrgName}</span>
        </div>
        <div className="page-header">
          <h1>Organization Not Found</h1>
        </div>
        <div className="page-content">
          <div className="dashboard-card">
            <h3>No Data Found</h3>
            <p>
              The organization "{decodedOrgName}" was not found in the current search results.
            </p>
            <p style={{ marginTop: '16px', color: '#666' }}>
              This could mean:
            </p>
            <ul style={{ textAlign: 'left', color: '#666' }}>
              <li>The organization name is misspelled</li>
              <li>No search has been performed yet</li>
              <li>The organization is not in the current search results</li>
            </ul>
            <button
              onClick={() => navigate('/search')}
              className="btn"
              style={{ marginTop: '16px' }}
            >
              Return to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <span
          className="breadcrumb-link"
          onClick={() => navigate('/')}
        >
          Home
        </span>
        <span className="breadcrumb-separator">/</span>
        <span
          className="breadcrumb-link"
          onClick={() => navigate('/search')}
        >
          Search
        </span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{decodedOrgName}</span>
      </div>

      <div className="page-header">
        <button
          onClick={() => navigate('/search')}
          className="btn btn-secondary"
          style={{ marginBottom: '16px' }}
        >
          ← Back to Search
        </button>
        <h1>{decodedOrgName}</h1>
        <p className="page-description">
          {organizationData.length} lobbying {organizationData.length === 1 ? 'activity' : 'activities'} found
        </p>
      </div>

      <div className="page-content">
        <div className="dashboard-grid">
          {stats && (
            <div className="dashboard-card">
              <h3>Summary Statistics</h3>
              <div className="placeholder-content">
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li><strong>Total Activities:</strong> {stats.activityCount}</li>
                  <li><strong>Total Amount:</strong> ${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
                  <li><strong>Average Amount:</strong> ${stats.avgAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
                  <li><strong>Unique Lobbyists:</strong> {stats.uniqueLobbyists}</li>
                  <li><strong>Categories:</strong> {stats.categories.join(', ') || 'N/A'}</li>
                </ul>
              </div>
            </div>
          )}

          <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Recent Activities</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="sort-select" style={{ fontSize: '0.9rem', color: '#666' }}>
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem'
                }}
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="amount-desc">Amount (Highest First)</option>
                <option value="amount-asc">Amount (Lowest First)</option>
              </select>
            </div>
          </div>
          {sortedActivities.length === 0 ? (
            <p>No data available for this organization. Try searching first.</p>
          ) : (
            <div className="result-preview">
              {sortedActivities.map((activity, index) => (
                <ActivityItem
                  key={`${activity.organization}-${activity.lobbyist}-${activity.date}-${index}`}
                  activity={activity}
                  getCategoryClass={getCategoryClass}
                />
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default OrganizationProfile;