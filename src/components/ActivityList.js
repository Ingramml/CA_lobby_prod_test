import React from 'react';
import { useOrganizationStore } from '../stores';
import { exportToCSV, generateActivitiesCSV, sanitizeFilename } from '../utils/exportHelpers';

const ActivityList = () => {
  const {
    activities,
    selectedOrganization,
    currentPage,
    totalActivities,
    loading,
    getPaginatedActivities,
    getTotalPages,
    setCurrentPage
  } = useOrganizationStore();

  const paginatedActivities = getPaginatedActivities();
  const totalPages = getTotalPages();

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top of activity list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportActivities = () => {
    const csvData = generateActivitiesCSV(activities);
    const filename = `${sanitizeFilename(selectedOrganization)}_activities.csv`;
    exportToCSV(csvData, filename);
  };

  const getCategoryClass = (category) => {
    const normalizedCategory = category?.toLowerCase() || 'default';
    return `category-badge ${normalizedCategory}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-card">
        <h3>Recent Activities</h3>
        <div className="activity-list-skeleton">
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="dashboard-card">
        <h3>Recent Activities</h3>
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          <p>No activities found for this organization.</p>
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * 10 + 1;
  const endIndex = Math.min(currentPage * 10, totalActivities);

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ margin: 0 }}>Recent Activities</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            Showing {startIndex}-{endIndex} of {totalActivities}
          </span>
          <button
            onClick={handleExportActivities}
            className="btn btn-sm"
            aria-label="Export all activities as CSV"
            title="Export all activities to CSV"
          >
            📥 Export
          </button>
        </div>
      </div>

      <div className="activity-list">
        {paginatedActivities.map((activity, index) => (
          <div key={`activity-${currentPage}-${index}`} className="activity-item">
            <div className="activity-header">
              <span className={getCategoryClass(activity.category)}>
                {activity.category || 'Other'}
              </span>
              <span className="activity-date">{formatDate(activity.date || activity.filing_date)}</span>
            </div>
            <div className="activity-body">
              <h4 className="activity-lobbyist">
                {activity.lobbyist || activity.firm_name || activity.organization || 'Unknown Lobbyist'}
              </h4>
              <p className="activity-description">
                {activity.description || activity.activity_description || `${activity.form_type || 'Filing'} - ${activity.organization_type || 'Lobby Activity'}`}
              </p>
            </div>
            <div className="activity-footer">
              <span className="activity-amount">{formatCurrency(activity.amount || 0)}</span>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityList;