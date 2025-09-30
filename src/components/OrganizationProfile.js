import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrganizationStore, useSearchStore } from '../stores';
import {
  aggregateOrganizationMetrics,
  extractLobbyistNetwork,
  calculateSpendingTrends,
  findRelatedOrganizations
} from '../utils/sampleData';
import ActivitySummary from './ActivitySummary';
import SpendingTrendsChart from './charts/SpendingTrendsChart';
import ActivityList from './ActivityList';
import LobbyistNetwork from './LobbyistNetwork';
import RelatedOrganizations from './RelatedOrganizations';

const OrganizationProfile = React.memo(() => {
  const { organizationName } = useParams();
  const navigate = useNavigate();

  const {
    selectedOrganization,
    organizationData,
    activities,
    loading: orgLoading,
    error,
    setSelectedOrganization,
    setOrganizationData,
    setLobbyists,
    setSpendingTrends,
    setRelatedOrganizations,
    setActivities,
    setLoading,
    setError,
    clearOrganization
  } = useOrganizationStore();

  const { results } = useSearchStore();

  const decodedOrgName = useMemo(() =>
    decodeURIComponent(organizationName),
    [organizationName]
  );

  // CRITICAL BUG FIX APPLIED: Added error handling to useEffect
  useEffect(() => {
    if (!decodedOrgName) {
      clearOrganization();
      return;
    }

    try {
      // Set loading state
      setLoading(true);
      setSelectedOrganization(decodedOrgName);

      // Filter activities for this organization from search results
      const orgActivities = results.filter(
        r => r.organization === decodedOrgName
      );

      // Aggregate all data
      const metrics = aggregateOrganizationMetrics(orgActivities);
      const lobbyists = extractLobbyistNetwork(orgActivities);
      const trends = calculateSpendingTrends(orgActivities, 'quarter');
      const related = findRelatedOrganizations(decodedOrgName, results, 5);

      // Update store
      setOrganizationData(metrics);
      setActivities(orgActivities);
      setLobbyists(lobbyists);
      setSpendingTrends(trends);
      setRelatedOrganizations(related);
    } catch (error) {
      setError(error.message);
      console.error('Error loading organization data:', error);
    }
  }, [decodedOrgName, results, setSelectedOrganization, setOrganizationData,
      setActivities, setLobbyists, setSpendingTrends, setRelatedOrganizations,
      setLoading, setError, clearOrganization]);

  // Validate organization exists
  const isValidOrganization = useMemo(() => {
    // Don't validate if no search performed
    if (results.length === 0) return null;
    return activities && activities.length > 0;
  }, [activities, results.length]);

  // Handle error state
  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Error Loading Profile</h1>
        </div>
        <div className="page-content">
          <div className="dashboard-card">
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => navigate('/search')} className="btn">
              Return to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Early return for no data
  if (results.length === 0 && !orgLoading) {
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
          {activities?.length || 0} lobbying {activities?.length === 1 ? 'activity' : 'activities'} found
        </p>
      </div>

      <div className="page-content">
        {/* Activity Summary Metrics */}
        <ActivitySummary />

        {/* Spending Trends Chart */}
        <div className="dashboard-card">
          <SpendingTrendsChart />
        </div>

        {/* Two-column layout for lists */}
        <div className="profile-grid">
          <div className="profile-main">
            <ActivityList />
          </div>

          <div className="profile-sidebar">
            <div className="dashboard-card">
              <LobbyistNetwork />
            </div>

            <div className="dashboard-card">
              <RelatedOrganizations
                onOrganizationClick={(orgName) => {
                  navigate(`/organization/${encodeURIComponent(orgName)}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OrganizationProfile;