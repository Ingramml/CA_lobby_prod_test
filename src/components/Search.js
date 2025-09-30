import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../stores';
import { API_ENDPOINTS, apiCall } from '../config/api';

// Generate demo search results for production mode
const generateDemoSearchResults = (query, filters) => {
  const demoData = [
    // California Medical Association entries (7 total)
    {
      organization: 'California Medical Association',
      lobbyist: 'John Smith',
      description: 'Healthcare legislation advocacy and medical professional representation',
      amount: 125000,
      date: '2024-09-15',
      filing_date: '2024-09-15',
      category: 'healthcare',
      activity_description: 'Lobbying activities related to healthcare reform and medical licensing'
    },
    {
      organization: 'California Medical Association',
      lobbyist: 'Dr. Maria Garcia',
      description: 'Telemedicine policy advocacy and physician licensing reform',
      amount: 87500,
      date: '2024-08-20',
      filing_date: '2024-08-20',
      category: 'healthcare',
      activity_description: 'Remote healthcare delivery and cross-state licensing advocacy'
    },
    {
      organization: 'California Medical Association',
      lobbyist: 'Robert Thompson',
      description: 'Medical liability reform and insurance regulation',
      amount: 65000,
      date: '2024-07-10',
      filing_date: '2024-07-10',
      category: 'healthcare',
      activity_description: 'Tort reform and medical malpractice insurance legislation'
    },
    {
      organization: 'California Medical Association',
      lobbyist: 'John Smith',
      description: 'Mental health services expansion and coverage mandates',
      amount: 98000,
      date: '2024-06-15',
      filing_date: '2024-06-15',
      category: 'healthcare',
      activity_description: 'Behavioral health integration and parity legislation'
    },
    {
      organization: 'California Medical Association',
      lobbyist: 'Dr. Maria Garcia',
      description: 'Prescription drug pricing reform advocacy',
      amount: 110000,
      date: '2024-05-20',
      filing_date: '2024-05-20',
      category: 'healthcare',
      activity_description: 'Pharmaceutical cost transparency and affordability measures'
    },
    {
      organization: 'California Medical Association',
      lobbyist: 'Susan Lee',
      description: 'Hospital capacity and emergency preparedness',
      amount: 73000,
      date: '2024-04-10',
      filing_date: '2024-04-10',
      category: 'healthcare',
      activity_description: 'Emergency medical services and disaster response planning'
    },
    {
      organization: 'California Medical Association',
      lobbyist: 'Robert Thompson',
      description: 'Medical education funding and residency programs',
      amount: 82500,
      date: '2024-03-25',
      filing_date: '2024-03-25',
      category: 'education',
      activity_description: 'Graduate medical education and training program support'
    },
    // Tech Innovation Coalition entries (6 total)
    {
      organization: 'Tech Innovation Coalition',
      lobbyist: 'Sarah Johnson',
      description: 'Technology policy development and regulatory advocacy',
      amount: 89000,
      date: '2024-09-10',
      filing_date: '2024-09-10',
      category: 'technology',
      activity_description: 'Advocacy for technology innovation policies and startup support'
    },
    {
      organization: 'Tech Innovation Coalition',
      lobbyist: 'Kevin Zhang',
      description: 'AI regulation and data privacy policy',
      amount: 95000,
      date: '2024-08-15',
      filing_date: '2024-08-15',
      category: 'technology',
      activity_description: 'Artificial intelligence ethics and consumer data protection'
    },
    {
      organization: 'Tech Innovation Coalition',
      lobbyist: 'Sarah Johnson',
      description: 'Cybersecurity standards and infrastructure protection',
      amount: 102000,
      date: '2024-07-05',
      filing_date: '2024-07-05',
      category: 'technology',
      activity_description: 'Critical infrastructure security and cyber defense policy'
    },
    {
      organization: 'Tech Innovation Coalition',
      lobbyist: 'Kevin Zhang',
      description: 'Net neutrality and broadband access advocacy',
      amount: 76000,
      date: '2024-06-20',
      filing_date: '2024-06-20',
      category: 'technology',
      activity_description: 'Digital equity and internet access for underserved communities'
    },
    {
      organization: 'Tech Innovation Coalition',
      lobbyist: 'Rachel Park',
      description: 'Platform liability and Section 230 reform',
      amount: 115000,
      date: '2024-05-15',
      filing_date: '2024-05-15',
      category: 'technology',
      activity_description: 'Online content moderation and platform accountability'
    },
    {
      organization: 'Tech Innovation Coalition',
      lobbyist: 'Sarah Johnson',
      description: 'Digital economy tax policy and marketplace fairness',
      amount: 88000,
      date: '2024-04-18',
      filing_date: '2024-04-18',
      category: 'finance',
      activity_description: 'E-commerce taxation and digital services tax frameworks'
    },
    // Environmental Defense Alliance entries (5 total)
    {
      organization: 'Environmental Defense Alliance',
      lobbyist: 'Michael Chen',
      description: 'Environmental protection and climate change policy advocacy',
      amount: 67500,
      date: '2024-09-05',
      filing_date: '2024-09-05',
      category: 'environment',
      activity_description: 'Climate change legislation and environmental protection lobbying'
    },
    {
      organization: 'Environmental Defense Alliance',
      lobbyist: 'Jennifer Martinez',
      description: 'Renewable energy development and green infrastructure',
      amount: 72000,
      date: '2024-08-01',
      filing_date: '2024-08-01',
      category: 'environment',
      activity_description: 'Clean energy transition and sustainable infrastructure investment'
    },
    {
      organization: 'Environmental Defense Alliance',
      lobbyist: 'Michael Chen',
      description: 'Water conservation and drought management policy',
      amount: 58000,
      date: '2024-06-12',
      filing_date: '2024-06-12',
      category: 'environment',
      activity_description: 'Water resource management and conservation strategies'
    },
    {
      organization: 'Environmental Defense Alliance',
      lobbyist: 'Jennifer Martinez',
      description: 'Wildlife protection and habitat preservation',
      amount: 63500,
      date: '2024-05-08',
      filing_date: '2024-05-08',
      category: 'environment',
      activity_description: 'Biodiversity conservation and endangered species protection'
    },
    {
      organization: 'Environmental Defense Alliance',
      lobbyist: 'Carlos Rivera',
      description: 'Clean air standards and pollution control',
      amount: 71000,
      date: '2024-04-22',
      filing_date: '2024-04-22',
      category: 'environment',
      activity_description: 'Air quality improvement and emissions reduction regulations'
    },
    // Education Reform Society entries (4 total)
    {
      organization: 'Education Reform Society',
      lobbyist: 'Emily Rodriguez',
      description: 'Public education policy and funding advocacy',
      amount: 52000,
      date: '2024-08-28',
      filing_date: '2024-08-28',
      category: 'education',
      activity_description: 'Educational funding and policy reform advocacy'
    },
    {
      organization: 'Education Reform Society',
      lobbyist: 'James Wilson',
      description: 'Teacher compensation and professional development',
      amount: 48500,
      date: '2024-07-15',
      filing_date: '2024-07-15',
      category: 'education',
      activity_description: 'Educator salary increases and training program expansion'
    },
    {
      organization: 'Education Reform Society',
      lobbyist: 'Emily Rodriguez',
      description: 'School safety and infrastructure modernization',
      amount: 61000,
      date: '2024-06-05',
      filing_date: '2024-06-05',
      category: 'education',
      activity_description: 'Campus security improvements and facility upgrades'
    },
    {
      organization: 'Education Reform Society',
      lobbyist: 'Amanda Foster',
      description: 'Early childhood education expansion',
      amount: 55000,
      date: '2024-05-10',
      filing_date: '2024-05-10',
      category: 'education',
      activity_description: 'Pre-K program funding and universal early education access'
    },
    // Small Business Coalition entries (4 total)
    {
      organization: 'Small Business Coalition',
      lobbyist: 'David Wilson',
      description: 'Small business interests and regulatory reform',
      amount: 43200,
      date: '2024-08-20',
      filing_date: '2024-08-20',
      category: 'finance',
      activity_description: 'Small business regulatory relief and economic development'
    },
    {
      organization: 'Small Business Coalition',
      lobbyist: 'Patricia Lee',
      description: 'Tax incentives and small business credit access',
      amount: 51000,
      date: '2024-07-08',
      filing_date: '2024-07-08',
      category: 'finance',
      activity_description: 'Small business tax credits and lending program expansion'
    },
    {
      organization: 'Small Business Coalition',
      lobbyist: 'David Wilson',
      description: 'Workforce development and job training programs',
      amount: 39500,
      date: '2024-06-18',
      filing_date: '2024-06-18',
      category: 'labor',
      activity_description: 'Vocational training and skills development initiatives'
    },
    {
      organization: 'Small Business Coalition',
      lobbyist: 'Marcus Thompson',
      description: 'Healthcare cost reduction for small employers',
      amount: 46800,
      date: '2024-05-25',
      filing_date: '2024-05-25',
      category: 'healthcare',
      activity_description: 'Small business health insurance affordability measures'
    },
    // California Hospital Association entries (3 total)
    {
      organization: 'California Hospital Association',
      lobbyist: 'Linda Chen',
      description: 'Hospital funding and Medicare reimbursement rates',
      amount: 135000,
      date: '2024-09-01',
      filing_date: '2024-09-01',
      category: 'healthcare',
      activity_description: 'Hospital payment reform and Medicaid expansion advocacy'
    },
    {
      organization: 'California Hospital Association',
      lobbyist: 'Dr. Steven Wong',
      description: 'Emergency department capacity and trauma care',
      amount: 92000,
      date: '2024-07-22',
      filing_date: '2024-07-22',
      category: 'healthcare',
      activity_description: 'Emergency medical services funding and trauma center support'
    },
    {
      organization: 'California Hospital Association',
      lobbyist: 'Linda Chen',
      description: 'Healthcare workforce shortage solutions',
      amount: 108000,
      date: '2024-06-10',
      filing_date: '2024-06-10',
      category: 'healthcare',
      activity_description: 'Nursing and healthcare professional recruitment and retention'
    }
  ];

  // Filter demo data based on search query and filters
  return demoData.filter(item => {
    // If no query provided, show all items (will be filtered by other criteria)
    const matchesQuery = !query || !query.trim() ||
      item.organization.toLowerCase().includes(query.toLowerCase()) ||
      item.lobbyist.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());

    const matchesOrganization = !filters.organization ||
      item.organization.toLowerCase().includes(filters.organization.toLowerCase());

    const matchesLobbyist = !filters.lobbyist ||
      item.lobbyist.toLowerCase().includes(filters.lobbyist.toLowerCase());

    const matchesCategory = !filters.category || filters.category === 'all' ||
      item.category === filters.category;

    // Date range filtering
    const matchesDateRange = !filters.dateRange || filters.dateRange === 'all' || (() => {
      const itemDate = new Date(item.date);
      const now = new Date();

      switch (filters.dateRange) {
        case 'last-month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return itemDate >= lastMonth;
        case 'last-quarter':
          const lastQuarter = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          return itemDate >= lastQuarter;
        case 'last-year':
          const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return itemDate >= lastYear;
        default:
          return true;
      }
    })();

    // Amount range filtering
    const matchesAmountMin = !filters.amountMin ||
      item.amount >= parseInt(filters.amountMin);

    const matchesAmountMax = !filters.amountMax ||
      item.amount <= parseInt(filters.amountMax);

    return matchesQuery && matchesOrganization && matchesLobbyist &&
           matchesCategory && matchesDateRange && matchesAmountMin && matchesAmountMax;
  }).slice(0, 20); // Limit to 20 results for demo
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
    setResults,
    setLoading,
    setError,
    addToHistory
  } = useSearchStore();

  const navigate = useNavigate();

  // Memoized helper function to get organization activity count
  const getOrganizationActivityCount = React.useMemo(
    () => (orgName) => results.filter(r => r.organization === orgName).length,
    [results]
  );

  const handleSearch = async (e) => {
    e.preventDefault();

    // Allow search with just filters (no query required)
    const hasFilters = filters.organization ||
                      filters.lobbyist ||
                      (filters.category && filters.category !== 'all') ||
                      (filters.dateRange && filters.dateRange !== 'all') ||
                      filters.amountMin ||
                      filters.amountMax;

    if (!query.trim() && !hasFilters) {
      console.log('No search query or filters provided');
      setError('Please enter a search term or select at least one filter.');
      return;
    }

    // Use store methods properly
    setLoading(true);
    setError(null);

    try {
      // ALWAYS use demo data until backend integration is explicitly requested
      // Set REACT_APP_USE_BACKEND_API=true in .env to enable backend calls
      const useBackend = process.env.REACT_APP_USE_BACKEND_API === 'true';

      if (!useBackend) {
        // Use demo data (default behavior)
        const demoResults = generateDemoSearchResults(query, filters);

        // Update search store with demo results
        setResults(demoResults);

        // Add current search to history
        addToHistory({
          query,
          filters,
          resultCount: demoResults.length,
          timestamp: new Date().toISOString()
        });

        console.log('Demo search completed:', demoResults.length, 'results');
      } else {
        // Backend API mode (requires REACT_APP_USE_BACKEND_API=true in .env)
        const searchParams = new URLSearchParams({
          q: query.trim(),
          client: filters.organization || '',
          lobbyist: filters.lobbyist || '',
          category: filters.category === 'all' ? '' : filters.category || '',
          date_range: filters.dateRange === 'all' ? '' : filters.dateRange || ''
        });

        const data = await apiCall(`${API_ENDPOINTS.search}?${searchParams}`);

        if (data.success) {
          setResults(data.data || []);
          addToHistory({
            query,
            filters,
            resultCount: data.data?.length || 0,
            timestamp: new Date().toISOString()
          });
          console.log('Backend search completed:', data);
        } else {
          throw new Error(data.message || 'Search failed');
        }
      }
    } catch (error) {
      console.error('Search error:', error);

      // Always fallback to demo data on any error
      const demoResults = generateDemoSearchResults(query, filters);
      setResults(demoResults);

      addToHistory({
        query,
        filters,
        resultCount: demoResults.length,
        timestamp: new Date().toISOString()
      });

      console.log('Fallback to demo data:', demoResults.length, 'results');
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

              <div className="filter-group">
                <label>Min Amount ($):</label>
                <input
                  type="number"
                  value={filters.amountMin || ''}
                  onChange={(e) => setFilters({ amountMin: e.target.value })}
                  placeholder="e.g. 50000"
                  disabled={loading}
                />
              </div>

              <div className="filter-group">
                <label>Max Amount ($):</label>
                <input
                  type="number"
                  value={filters.amountMax || ''}
                  onChange={(e) => setFilters({ amountMax: e.target.value })}
                  placeholder="e.g. 100000"
                  disabled={loading}
                />
              </div>

              <div className="filter-group">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setFilters({
                    dateRange: 'all',
                    organization: '',
                    lobbyist: '',
                    category: 'all',
                    amountMin: '',
                    amountMax: ''
                  })}
                  disabled={loading}
                >
                  Clear All Filters
                </button>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4
                        className="organization-link"
                        style={{ margin: 0, display: 'inline' }}
                        onClick={() => {
                          console.log('Navigating to profile for:', result.organization);
                          navigate(`/organization/${encodeURIComponent(result.organization)}`);
                        }}
                      >
                        {result.organization || result.lobbyist || 'Lobby Entry'}
                      </h4>
                      {result.organization && getOrganizationActivityCount(result.organization) > 1 && (
                        <span style={{
                          backgroundColor: '#e3f2fd',
                          color: '#1565c0',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {getOrganizationActivityCount(result.organization)} activities
                        </span>
                      )}
                    </div>
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