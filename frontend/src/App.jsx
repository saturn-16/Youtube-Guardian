import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing'); // landing, dashboard

  // Reset to landing page if user logs out/changes
  useEffect(() => {
    if (!user) {
      setCurrentPage('landing');
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#080c10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#00d4ff'
      }}>
        <div style={{
          border: '1px solid #1e2d3d',
          padding: '24px 40px',
          borderRadius: '8px',
          background: '#0d1318',
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(0, 212, 255, 0.1)'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #1e2d3d',
            borderTopColor: '#00d4ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }} />
          <div style={{ fontSize: '12px', letterSpacing: '2px', fontWeight: 'bold' }}>INITIALIZING SECURITY PROTOCOLS...</div>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return currentPage === 'dashboard' ? (
    <Dashboard onBackToLanding={() => setCurrentPage('landing')} />
  ) : (
    <Landing onLaunchDashboard={() => setCurrentPage('dashboard')} />
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
