import React from 'react';
import { useSearchStore } from '../stores';

function Search() {
  // Use Zustand store instead of local state
  const {
    query,
    filters,
    results,
    loading,
    error,
    setQuery,
    setFilters,
    addToHistory,
    searchHistory
  } = useSearchStore();

  const handleSearch = (e) => {
    e.preventDefault();

    // Add current search to history
    addToHistory({
      query,
      filters,
      resultCount: results.length
    });

    // Search functionality will be implemented in future phases
    console.log('Search query:', query, 'Filters:', filters);
    console.log('Search history:', searchHistory);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Advanced Search</h1>
        <p className="page-description">
          Search through CA lobby data with powerful filtering and analysis tools
        </p>
      </div>

      <div className="page-content">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for lobbyists, organizations, bills, or topics..."
                className="search-input"
              />
              <button type="submit" className="search-btn" disabled>
                🔍 Search
              </button>
            </div>
          </form>

          <div className="filters-section">
            <h3>Advanced Filters</h3>
            <div className="filters-grid">
              <div className="filter-group">
                <label>Date Range:</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ dateRange: e.target.value })}
                  disabled
                >
                  <option value="all">All Time</option>
                  <option value="last-month">Last Month</option>
                  <option value="last-quarter">Last Quarter</option>
                  <option value="last-year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Organization:</label>
                <input
                  type="text"
                  value={filters.organization}
                  onChange={(e) => setFilters({ organization: e.target.value })}
                  placeholder="Filter by organization name"
                  disabled
                />
              </div>

              <div className="filter-group">
                <label>Lobbyist:</label>
                <input
                  type="text"
                  value={filters.lobbyist}
                  onChange={(e) => setFilters({ lobbyist: e.target.value })}
                  placeholder="Filter by lobbyist name"
                  disabled
                />
              </div>

              <div className="filter-group">
                <label>Category:</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ category: e.target.value })}
                  disabled
                >
                  <option value="all">All Categories</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="technology">Technology</option>
                  <option value="environment">Environment</option>
                  <option value="education">Education</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Search Features</h3>
            <div className="placeholder-content">
              <p>Advanced search capabilities will include:</p>
              <ul>
                <li>Full-text search across all lobby documents</li>
                <li>Boolean operators (AND, OR, NOT)</li>
                <li>Wildcard and fuzzy matching</li>
                <li>Phrase and proximity searches</li>
                <li>Auto-complete and search suggestions</li>
              </ul>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Filter Options</h3>
            <div className="placeholder-content">
              <p>Comprehensive filtering by:</p>
              <ul>
                <li>Date ranges and time periods</li>
                <li>Organization and entity types</li>
                <li>Spending amounts and thresholds</li>
                <li>Geographic regions and districts</li>
                <li>Document types and categories</li>
              </ul>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Search Results</h3>
            <div className="placeholder-content">
              <p>Results will be displayed with:</p>
              <div className="result-preview">
                <div className="result-item">
                  <h4>Sample Result 1</h4>
                  <p>Lobbyist registration for XYZ Corporation - Healthcare sector</p>
                  <span className="result-meta">Filed: Sept 15, 2024 | Amount: $50,000</span>
                </div>
                <div className="result-item">
                  <h4>Sample Result 2</h4>
                  <p>Quarterly activity report - Technology lobbying</p>
                  <span className="result-meta">Filed: Sept 10, 2024 | Amount: $25,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Export & Save</h3>
            <div className="placeholder-content">
              <p>Search result options:</p>
              <ul>
                <li>Export results to CSV, Excel, or PDF</li>
                <li>Save search queries for future use</li>
                <li>Set up alerts for new matching results</li>
                <li>Share search results with team members</li>
              </ul>
              <div className="button-group">
                <button className="export-btn" disabled>💾 Save Search</button>
                <button className="export-btn" disabled>📤 Export Results</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;