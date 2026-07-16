import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LetterGlitch from '../components/LetterGlitch';
import { Shield, Key, AlertTriangle } from 'lucide-react';

const Login = () => {
  const { loginWithGoogle, loginWithGitHub, isConfigured, error: authError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleLogin = async (provider) => {
    setLoading(true);
    setLocalError(null);
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithGitHub();
      }
    } catch (err) {
      console.error(err);
      setLocalError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000'
  };

  const cardStyle = {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '420px',
    padding: '40px 30px',
    borderRadius: '16px',
    background: 'rgba(13, 19, 24, 0.75)',
    border: '1px solid #1e2d3d',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 32px 0 rgba(0, 212, 255, 0.08), inset 0 0 12px rgba(255, 255, 255, 0.02)',
    color: '#c8d8e8',
    fontFamily: "'Syne', sans-serif",
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    background: 'rgba(0, 212, 255, 0.1)',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    color: '#00d4ff',
    marginBottom: '20px',
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '800',
    letterSpacing: '1px',
    marginBottom: '8px',
    color: '#fff'
  };

  const titleSpanStyle = {
    color: '#00d4ff',
    textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
  };

  const descStyle = {
    fontSize: '13px',
    color: '#6a8ba8',
    marginBottom: '30px',
    lineHeight: '1.5'
  };

  const btnStyle = (bg, border, color, hoverShadow) => ({
    width: '100%',
    padding: '12px 20px',
    borderRadius: '8px',
    border: `1px solid ${border}`,
    background: bg,
    color: color,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '15px',
    transition: 'all 0.2s ease',
    outline: 'none'
  });

  const errorBoxStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(244, 67, 54, 0.1)',
    border: '1px solid rgba(244, 67, 54, 0.3)',
    color: '#f44336',
    fontSize: '12px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'left',
    lineHeight: '1.4'
  };

  return (
    <div style={containerStyle}>
      {/* Glitch Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <LetterGlitch
          glitchSpeed={60}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
          glitchColors={['#0e201c', '#00d4ff', '#122b3d']}
        />
      </div>

      {/* Login Card */}
      <div style={cardStyle}>
        <div style={logoStyle}>
          <Shield size={32} />
        </div>
        <h1 style={titleStyle}>Phish<span style={titleSpanStyle}>Guard</span></h1>
        <p style={descStyle}>YOUTUBE CHAT SECURITY MONITOR</p>

        {(!isConfigured) && (
          <div style={errorBoxStyle}>
            <AlertTriangle size={24} style={{ flexShrink: 0 }} />
            <div>
              <strong>Firebase Config Missing</strong>
              <br />
              Please duplicate <code>.env.example</code> to <code>.env.local</code> and fill in your Firebase Web App credentials.
            </div>
          </div>
        )}

        {(localError || authError) && (
          <div style={{ ...errorBoxStyle, background: 'rgba(233, 30, 99, 0.1)', border: '1px solid rgba(233, 30, 99, 0.3)', color: '#e91e63' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>{localError || authError}</div>
          </div>
        )}

        <button
          onClick={() => handleLogin('google')}
          disabled={loading || !isConfigured}
          style={{
            ...btnStyle('rgba(255, 255, 255, 0.05)', '#253545', '#fff'),
            opacity: (loading || !isConfigured) ? 0.5 : 1,
            cursor: (loading || !isConfigured) ? 'not-allowed' : 'pointer'
          }}
          className="login-btn"
        >
          <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.05,3.1v2.57h3.32c1.94,-1.78 3.05,-4.42 3.05,-7.47C21.7,11.96 21.57,11.48 21.35,11.1z" />
            <path fill="#ea4335" d="M12,22c2.7,0 4.96,-0.9 6.62,-2.43l-3.32,-2.57c-0.92,0.62 -2.1,0.99 -3.3,0.99 -2.54,0 -4.7,-1.72 -5.47,-4.03H3.12v2.66C4.77,20.02 8.16,22 12,22z" />
            <path fill="#fbbc05" d="M6.53,13.99C6.33,13.39 6.22,12.71 6.22,12s0.11,-1.39 0.31,-1.99V7.35H3.12C2.45,8.69 2.05,10.22 2.05,12s0.4,3.31 1.07,4.65L6.53,13.99z" />
            <path fill="#34a853" d="M12,6.01c1.47,0 2.78,0.51 3.82,1.5l2.87,-2.87C16.95,2.97 14.7,2 12,2 8.16,2 4.77,3.98 3.12,7.35l3.41,2.66C7.3,7.73 9.46,6.01 12,6.01z" />
          </svg>
          {loading ? 'Authenticating...' : 'Sign in with Google'}
        </button>

        <button
          onClick={() => handleLogin('github')}
          disabled={loading || !isConfigured}
          style={{
            ...btnStyle('#24292e', '#2f363d', '#fff'),
            opacity: (loading || !isConfigured) ? 0.5 : 1,
            cursor: (loading || !isConfigured) ? 'not-allowed' : 'pointer'
          }}
          className="login-btn"
        >
          <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.41 6,9.5 6.63,8.8C6.52,8.53 6.17,7.5 6.72,6.13C6.72,6.13 7.55,5.86 9.44,7.14C10.23,6.92 11.08,6.81 11.93,6.8C12.78,6.81 13.63,6.92 14.42,7.14C16.31,5.86 17.13,6.13 17.13,6.13C17.68,7.5 17.33,8.53 17.23,8.8C17.89,9.5 18.27,10.41 18.27,11.5C18.27,15.32 15.93,16.16 13.7,16.41C14.06,16.72 14.38,17.33 14.38,18.26C14.38,19.58 14.37,20.65 14.37,20.97C14.37,21.27 14.53,21.59 15.04,21.49C19.03,20.15 21.88,16.42 21.88,12C21.88,6.58 17.47,2 12,2Z" />
          </svg>
          {loading ? 'Authenticating...' : 'Sign in with GitHub'}
        </button>

        <div style={{ marginTop: '20px', fontSize: '11px', color: '#3a5570', borderTop: '1px solid #1e2d3d', width: '100%', paddingTop: '15px' }}>
          By continuing, you authorize PhishGuard to monitor chat data.
        </div>
      </div>
    </div>
  );
};

export default Login;
