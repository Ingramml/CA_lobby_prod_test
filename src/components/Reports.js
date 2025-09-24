import React from 'react';

function Reports() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Reports & Documentation</h1>
        <p className="page-description">
          Generate and access comprehensive reports from CA lobby search data
        </p>
      </div>

      <div className="page-content">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Quick Reports</h3>
            <div className="placeholder-content">
              <p>Generate instant reports for:</p>
              <ul>
                <li>Weekly lobby activity summaries</li>
                <li>Top lobbyists and organizations</li>
                <li>Recent legislative filings</li>
                <li>Spending reports by category</li>
              </ul>
              <div className="button-group">
                <button className="report-btn" disabled>Generate Weekly Report</button>
                <button className="report-btn" disabled>Download CSV</button>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Custom Report Builder</h3>
            <div className="placeholder-content">
              <p>Build custom reports with:</p>
              <ul>
                <li>Date range selection</li>
                <li>Filter by organization or lobbyist</li>
                <li>Custom data field selection</li>
                <li>Multiple export formats (PDF, Excel, CSV)</li>
              </ul>
              <div className="button-group">
                <button className="report-btn" disabled>Launch Report Builder</button>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Scheduled Reports</h3>
            <div className="placeholder-content">
              <p>Automated reporting features:</p>
              <ul>
                <li>Daily, weekly, monthly schedules</li>
                <li>Email delivery options</li>
                <li>Custom alert thresholds</li>
                <li>Subscription management</li>
              </ul>
              <div className="button-group">
                <button className="report-btn" disabled>Manage Subscriptions</button>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Recent Reports</h3>
            <div className="placeholder-content">
              <p>Access your recent reports:</p>
              <div className="report-list">
                <div className="report-item">
                  <span className="report-name">📄 Q3 Lobby Activity Summary</span>
                  <span className="report-date">Generated: Sept 15, 2024</span>
                </div>
                <div className="report-item">
                  <span className="report-name">📊 Top 50 Lobbyists Report</span>
                  <span className="report-date">Generated: Sept 10, 2024</span>
                </div>
                <div className="report-item">
                  <span className="report-name">💰 Spending Analysis</span>
                  <span className="report-date">Generated: Sept 5, 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Report Templates</h3>
          <div className="placeholder-content">
            <div className="template-grid">
              <div className="template-item">
                <h4>📈 Executive Summary</h4>
                <p>High-level overview of lobby activities and trends</p>
                <button className="template-btn" disabled>Use Template</button>
              </div>
              <div className="template-item">
                <h4>🏛️ Legislative Impact Report</h4>
                <p>Analysis of lobbying influence on specific legislation</p>
                <button className="template-btn" disabled>Use Template</button>
              </div>
              <div className="template-item">
                <h4>🔍 Detailed Investigation</h4>
                <p>Comprehensive analysis for specific organizations or issues</p>
                <button className="template-btn" disabled>Use Template</button>
              </div>
              <div className="template-item">
                <h4>📋 Compliance Check</h4>
                <p>Review filing compliance and regulatory adherence</p>
                <button className="template-btn" disabled>Use Template</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;