import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from '@clerk/clerk-react';

// Import page components
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Reports from './components/Reports';
import Search from './components/Search';
import Settings from './components/Settings';

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      <header className="App-header">
        <div className="header-content">
          <h1>Welcome to TPC's CA lobby search</h1>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="sign-in-btn">Sign In</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <SignedIn>
        <nav className="main-nav">
          <div className="nav-content">
            <div className="nav-links">
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                📊 Dashboard
              </Link>
              <Link
                to="/search"
                className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
              >
                🔍 Search
              </Link>
              <Link
                to="/analytics"
                className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}
              >
                📈 Analytics
              </Link>
              <Link
                to="/reports"
                className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
              >
                📄 Reports
              </Link>
              <Link
                to="/settings"
                className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
              >
                ⚙️ Settings
              </Link>
            </div>
          </div>
        </nav>
      </SignedIn>

      <main className="App-main">
        <SignedOut>
          <div className="welcome-section">
            <h2>Welcome to TPC's CA lobby search</h2>
            <p>Please sign in to access the search dashboard.</p>
          </div>
        </SignedOut>

        <SignedIn>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </SignedIn>
      </main>
    </>
  );
}


export default App;