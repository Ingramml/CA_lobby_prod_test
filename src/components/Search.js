import React from 'react';
import { useSearchStore } from '../stores';
import { API_ENDPOINTS, apiCall } from '../config/api';

// Generate demo search results for production mode
const generateDemoSearchResults = (query, filters) => {
  const demoData = [
    {
      organization: 'California Medical Association',
      lobbyist: 'John Smith',
      description: 'Healthcare legislation advocacy and medical professional representation',
      amount: 125000,
      date: '2024-09-15',
      filing_date: '2024-09-15',
      activity_description: 'Lobbying activities related to healthcare reform and medical licensing'
    },
    {
      organization: 'Tech Innovation Coalition',
      lobbyist: 'Sarah Johnson',
      description: 'Technology policy development and regulatory advocacy',
      amount: 89000,
      date: '2024-09-10',
      filing_date: '2024-09-10',
      activity_description: 'Advocacy for technology innovation policies and startup support'
    },
    {
      organization: 'Environmental Defense Alliance',
      lobbyist: 'Michael Chen',
      description: 'Environmental protection and climate change policy advocacy',
      amount: 67500,
      date: '2024-09-05',
      filing_date: '2024-09-05',
      activity_description: 'Climate change legislation and environmental protection lobbying'
    },
    {
      organization: 'Education Reform Society',
      lobbyist: 'Emily Rodriguez',
      description: 'Public education policy and funding advocacy',
      amount: 52000,
      date: '2024-08-28',
      filing_date: '2024-08-28',
      activity_description: 'Educational funding and policy reform advocacy'
    },
    {
      organization: 'Small Business Coalition',
      lobbyist: 'David Wilson',
      description: 'Small business interests and regulatory reform',
      amount: 43200,
      date: '2024-08-20',
      filing_date: '2024-08-20',
      activity_description: 'Small business regulatory relief and economic development'
    }
  ];

  // Filter demo data based on search query and filters
  return demoData.filter(item => {
    const matchesQuery = !query ||
      item.organization.toLowerCase().includes(query.toLowerCase()) ||
      item.lobbyist.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());

    const matchesOrganization = !filters.organization ||
      item.organization.toLowerCase().includes(filters.organization.toLowerCase());

    const matchesLobbyist = !filters.lobbyist ||
      item.lobbyist.toLowerCase().includes(filters.lobbyist.toLowerCase());

    return matchesQuery && matchesOrganization && matchesLobbyist;
  }).slice(0, 10); // Limit to 10 results for demo
};

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

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      console.log('Empty query, skipping search');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if we're in production without backend
      const isProduction = process.env.NODE_ENV === 'production';

      if (isProduction) {
        // Simulate search with demo data in production
        const demoResults = generateDemoSearchResults(query, filters);

        // Update search store with demo results
        useSearchStore.setState({
          results: demoResults,
          loading: false,
          error: null
        });

        // Add current search to history
        addToHistory({
          query,
          filters,
          resultCount: demoResults.length,
          timestamp: new Date().toISOString()
        });

        console.log('Demo search completed:', demoResults);
      } else {
        // Call backend API in development
        const searchParams = new URLSearchParams({
          q: query.trim(),
          client: filters.organization || '',
          lobbyist: filters.lobbyist || '',
          category: filters.category === 'all' ? '' : filters.category || '',
          date_range: filters.dateRange === 'all' ? '' : filters.dateRange || ''
        });

        const data = await apiCall(`${API_ENDPOINTS.search}?${searchParams}`);

        if (data.success) {
          // Update search store with results
          useSearchStore.setState({
            results: data.data || [],
            loading: false,
            error: null
          });

          // Add current search to history
          addToHistory({
            query,
            filters,
            resultCount: data.data?.length || 0,
            timestamp: new Date().toISOString()
          });

          console.log('Search completed:', data);
        } else {
          throw new Error(data.message || 'Search failed');
        }
      }
    } catch (error) {
      console.error('Search error:', error);

      // In production, still show demo results even if API fails
      if (process.env.NODE_ENV === 'production') {
        const demoResults = generateDemoSearchResults(query, filters);
        useSearchStore.setState({
          results: demoResults,
          loading: false,
          error: null
        });

        addToHistory({
          query,
          filters,
          resultCount: demoResults.length,
          timestamp: new Date().toISOString()
        });
      } else {
        setError(error.message || 'Search failed. Please try again.');
        useSearchStore.setState({
          results: [],
          loading: false,
          error: error.message || 'Search failed'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Advanced Search</h1>
        <p className="page-description">
          Search through CA lobby data with powerful filtering and analysis tools
        </p>
        {process.env.NODE_ENV === 'production' && (
          <div className="demo-banner">
            <p>📝 <strong>Demo Mode:</strong> This is a demonstration of the search functionality with sample data.
            The full system connects to live California lobby data when deployed with the backend API.</p>
          </div>
        )}
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
              <button type="submit" className="search-btn" disabled={loading}>
                {loading ? '⏳ Searching...' : '🔍 Search'}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <div className="filter-group">
                <label>Lobbyist:</label>
                <input
                  type="text"
                  value={filters.lobbyist}
                  onChange={(e) => setFilters({ lobbyist: e.target.value })}
                  placeholder="Filter by lobbyist name"
                  disabled={loading}
                />
              </div>

              <div className="filter-group">
                <label>Category:</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ category: e.target.value })}
                  disabled={loading}
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

          {/* Search Results Section */}
          {error && (
            <div className="search-error">
              <h3>Search Error</h3>
              <p>{error}</p>
              <button onClick={() => setError(null)} className="btn btn-secondary">
                Dismiss
              </button>
            </div>
          )}

          {results && results.length > 0 && (
            <div className="search-results">
              <h3>Search Results ({results.length} found)</h3>
              <div className="results-list">
                {results.slice(0, 10).map((result, index) => (
                  <div key={index} className="result-item">
                    <h4>{result.organization || result.lobbyist || 'Lobby Entry'}</h4>
                    <p>{result.description || result.activity_description || 'No description available'}</p>
                    <span className="result-meta">
                      Amount: {result.amount ? `$${result.amount.toLocaleString()}` : 'N/A'} |
                      Date: {result.date || result.filing_date || 'N/A'}
                    </span>
                  </div>
                ))}
                {results.length > 10 && (
                  <p className="results-more">Showing first 10 of {results.length} results</p>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="search-loading">
              <h3>Searching...</h3>
              <div className="loading-spinner"></div>
            </div>
          )}
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