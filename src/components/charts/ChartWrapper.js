import React from 'react';
import { useUserStore, useAppStore } from '../../stores';

const ChartWrapper = ({
  children,
  title,
  height = 400,
  loading = false,
  error = null,
  className = ''
}) => {
  const { preferences } = useUserStore();
  const { addNotification } = useAppStore();

  const handleError = (errorMessage) => {
    addNotification({
      type: 'error',
      message: `Chart Error: ${errorMessage}`,
      duration: 5000
    });
  };

  if (error) {
    return (
      <div className={`chart-container error ${className}`}>
        <h3>{title}</h3>
        <div className="chart-error">
          <p>Unable to load chart: {error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`chart-container loading ${className}`}>
        <h3>{title}</h3>
        <div className="chart-skeleton" style={{ height }}>
          <div className="skeleton-content">
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`chart-container ${preferences.theme} ${className}`}
      style={{ height: height + 40 }} // Add space for title
    >
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-content" style={{ height }}>
        {children}
      </div>
    </div>
  );
};

export default ChartWrapper;