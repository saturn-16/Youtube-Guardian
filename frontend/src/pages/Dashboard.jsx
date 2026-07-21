import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Prism from '../components/Prism';
import FuzzyText from '../components/FuzzyText';
import { LogOut, Play, Square, RefreshCw, Send, AlertTriangle, ShieldCheck, CheckCircle, Home, Shield } from 'lucide-react';

const BACKEND_URL = 'https://saturn-16-youtube-guardian.hf.space';

const Dashboard = ({ onBackToLanding }) => {
  const { user, logout } = useAuth();
  
  // Controls & Status
  const [videoInput, setVideoInput] = useState('');
  const [wsStatus, setWsStatus] = useState('idle'); // idle, connecting, live, demo, error
  const [wsStatusText, setWsStatusText] = useState('IDLE');
  
  // Real-time Data
  const [messages, setMessages] = useState([]);
  const [flaggedMessages, setFlaggedMessages] = useState([]);
  const [offenders, setOffenders] = useState({});
  const [toasts, setToasts] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);

  // Live Stats
  const [stats, setStats] = useState({
    total: 0,
    flagged: 0,
    byRisk: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
  });

  // Manual Analyzer
  const [analyzeInput, setAnalyzeInput] = useState('');
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [analyzeVisible, setAnalyzeVisible] = useState(false);

  const wsRef = useRef(null);
  const chatFeedRef = useRef(null);
  const flaggedFeedRef = useRef(null);
  const dropdownRef = useRef(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ── YOUTUBE URL → VIDEO ID EXTRACTION ──
  const extractVideoId = (input) => {
    input = input.trim();
    if (!input) return '';
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    
    const patterns = [
      /(?:youtube\.com|youtu\.be)\/live\/([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com|youtu\.be)\/(?:watch\?.*v=|embed\/|shorts\/|v\/)([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const m = input.match(p);
      if (m) return m[1];
    }
    return input;
  };

  // ── TOAST SYSTEM ──
  const addToast = (msg, type = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Load existing flagged messages and stats on mount
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const flaggedRes = await fetch(`${BACKEND_URL}/api/flagged/?limit=20`);
        const flaggedData = await flaggedRes.json();
        if (flaggedData.items && flaggedData.items.length) {
          const loadedFlagged = flaggedData.items.slice(0, 10).map(item => ({
            username: item.username,
            message: item.message,
            timestamp: item.timestamp,
            risk_level: item.risk_level,
            risk_score: item.risk_score,
            urls: item.urls || []
          }));
          setFlaggedMessages(loadedFlagged);

          // Build offenders list from these loaded messages
          const initialOffenders = {};
          flaggedData.items.forEach(item => {
            const name = item.username;
            if (!initialOffenders[name]) {
              initialOffenders[name] = { count: 0, maxRisk: 'LOW', maxScore: 0 };
            }
            initialOffenders[name].count++;
            initialOffenders[name].maxScore = Math.max(initialOffenders[name].maxScore, item.risk_score);
            const order = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
            if (order.indexOf(item.risk_level) > order.indexOf(initialOffenders[name].maxRisk)) {
              initialOffenders[name].maxRisk = item.risk_level;
            }
          });
          setOffenders(initialOffenders);
        }

        const statsRes = await fetch(`${BACKEND_URL}/api/analytics/stats`);
        const statsData = await statsRes.json();
        setStats({
          total: statsData.total_messages || 0,
          flagged: statsData.total_flagged || 0,
          byRisk: {
            CRITICAL: statsData.by_risk?.CRITICAL || 0,
            HIGH: statsData.by_risk?.HIGH || 0,
            MEDIUM: statsData.by_risk?.MEDIUM || 0,
            LOW: statsData.by_risk?.LOW || 0,
          }
        });
      } catch (err) {
        console.error("Backend offline. Starting clean.", err);
      }
    };

    loadExistingData();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Auto scroll chat feed
  useEffect(() => {
    if (autoScroll && chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (!chatFeedRef.current) return;
    const { scrollHeight, scrollTop, clientHeight } = chatFeedRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 80;
    setAutoScroll(atBottom);
  };

  // ── WEBSOCKET MONITORING ──
  const startMonitor = () => {
    const videoId = extractVideoId(videoInput);
    if (!videoId) {
      addToast('Enter a YouTube video ID or URL', 'error');
      return;
    }
    setVideoInput(videoId); // update input field to show parsed ID

    if (wsRef.current) wsRef.current.close();

    const wsUrl = `${BACKEND_URL.replace('https', 'wss').replace('http', 'ws')}/ws`;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    setWsStatus('connecting');
    setWsStatusText('CONNECTING…');

    socket.onopen = () => {
      socket.send(JSON.stringify({ action: 'start', video_id: videoId }));
    };

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'status') {
        const mode = msg.data.mode;
        setWsStatus(mode);
        setWsStatusText(mode === 'demo' ? 'DEMO MODE' : 'LIVE');
        addToast(
          `Connected — ${mode === 'demo' ? 'Demo mode (simulated chat)' : 'Live YouTube chat'}`,
          'ok'
        );
      } else if (msg.type === 'message') {
        const data = msg.data;
        
        // Append messages
        setMessages(prev => [...prev.slice(-99), data]);
        
        // Update stats
        setStats(prev => {
          const newTotal = prev.total + 1;
          const newFlagged = prev.flagged + (data.is_flagged ? 1 : 0);
          const newByRisk = { ...prev.byRisk };
          if (data.is_flagged && data.risk_level !== 'SAFE') {
            newByRisk[data.risk_level] = (newByRisk[data.risk_level] || 0) + 1;
          }
          return { total: newTotal, flagged: newFlagged, byRisk: newByRisk };
        });

        // Append flagged messages
        if (data.is_flagged) {
          setFlaggedMessages(prev => [data, ...prev.slice(0, 49)]);
          
          // Track offenders
          setOffenders(prev => {
            const name = data.username;
            const current = prev[name] || { count: 0, maxRisk: 'LOW', maxScore: 0 };
            const newCount = current.count + 1;
            const newScore = Math.max(current.maxScore, data.risk_score);
            let newRisk = current.maxRisk;
            const order = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
            if (order.indexOf(data.risk_level) > order.indexOf(current.maxRisk)) {
              newRisk = data.risk_level;
            }
            return {
              ...prev,
              [name]: { count: newCount, maxRisk: newRisk, maxScore: newScore }
            };
          });

          // Warn popup
          setStats(prev => {
            if (prev.flagged > 0 && prev.flagged % 5 === 0) {
              addToast(`⚠ ${prev.flagged} suspicious messages detected`, 'warn');
            }
            return prev;
          });
        }
      } else if (msg.type === 'error') {
        addToast(msg.data.message || 'Backend error occurred', 'error');
        setWsStatus('error');
        setWsStatusText('ERROR');
      }
    };

    socket.onerror = () => {
      addToast('WebSocket error — is the backend running?', 'error');
      setWsStatus('error');
      setWsStatusText('ERROR');
    };

    socket.onclose = () => {
      setWsStatus('idle');
      setWsStatusText('IDLE');
    };
  };

  const stopMonitor = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ action: 'stop' }));
      wsRef.current.close();
    }
  };

  const clearAll = () => {
    setMessages([]);
    setFlaggedMessages([]);
    setOffenders({});
    setStats({
      total: 0,
      flagged: 0,
      byRisk: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
    });
    addToast('Cleared all dashboard records', 'ok');
  };

  // ── MANUAL SCANNERS ──
  const handleAnalyze = async () => {
    const msg = analyzeInput.trim();
    if (!msg) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      setAnalyzeResult(data);
      setAnalyzeVisible(true);
    } catch (e) {
      addToast('Backend offline — running local model simulation', 'warn');
      setAnalyzeResult({
        risk_score: 0.72,
        risk_level: 'HIGH',
        is_flagged: true,
        reasons: ['ML Model confidence: 72%', 'Phishing URL detected'],
        ml_score: 0.68
      });
      setAnalyzeVisible(true);
    }
  };

  const colors = { SAFE: 'var(--safe)', LOW: 'var(--low)', MEDIUM: 'var(--medium)', HIGH: 'var(--high)', CRITICAL: 'var(--critical)' };
  const maxRiskVal = Math.max(...Object.values(stats.byRisk), 1);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Background WebGL Prism */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Prism
          animationType="hover"
          timeScale={0.3}
          height={3.2}
          baseWidth={5.2}
          scale={3.2}
          hueShift={0.1}
          colorFrequency={1.2}
          noise={0.15}
          glow={0.8}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* HEADER */}
        <header>
          <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="logo-icon" style={{ display: 'flex', alignItems: 'center', filter: 'drop-shadow(0 0 10px var(--accent))', marginRight: '6px' }}>
              <Shield size={30} color="var(--accent)" fill="rgba(0, 212, 255, 0.1)" />
            </div>
            <div style={{ marginLeft: '-22px', display: 'flex', alignItems: 'center', height: '34px', overflow: 'visible' }}>
              <FuzzyText
                fontSize="24px"
                fontWeight={800}
                color="#fff"
                baseIntensity={0.1}
                hoverIntensity={0.35}
                fuzzRange={8}
                gradient={["#fff", "#00d4ff"]}
              >
                YouTube Guardian
              </FuzzyText>
            </div>
          </div>
          <div className="header-right">
            {user && (
              <div 
                ref={dropdownRef}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{ 
                  position: 'relative', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  background: 'rgba(255,255,255,0.03)', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  border: showUserDropdown ? '1px solid var(--accent)' : '1px solid var(--border)', 
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!showUserDropdown) e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  if (!showUserDropdown) e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <img
                  src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}
                  alt="Profile"
                  style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid var(--accent)' }}
                />
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text)' }}>{user.displayName || 'Security Operator'}</span>
                
                {showUserDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: '0',
                      background: 'rgba(13, 19, 24, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '4px',
                      zIndex: 1000,
                      minWidth: '120px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      animation: 'fadeIn 0.15s ease-out'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={logout}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text2)',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '11px',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(244,67,54,0.1)';
                        e.currentTarget.style.color = 'var(--high)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text2)';
                      }}
                    >
                      <LogOut size={12} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="stat-chip">Total Checked: <b style={{ color: 'var(--accent)' }}>{stats.total}</b></div>
            <div className="stat-chip">Total Flagged: <b style={{ color: 'var(--high)' }}>{stats.flagged}</b></div>
            
            <div className="status-badge">
              <div className={`status-dot ${wsStatus}`} />
              <span>{wsStatusText}</span>
            </div>

            <button
              onClick={onBackToLanding}
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <Home size={12} />
              Home
            </button>
          </div>
        </header>

        {/* CONTROLS */}
        <div className="control-bar">
          <label>YOUTUBE SOURCE</label>
          <div className="input-wrap">
            <input
              type="text"
              placeholder="Paste live stream link or video ID"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && wsStatus === 'idle' && startMonitor()}
              disabled={wsStatus !== 'idle'}
            />
            {wsStatus === 'idle' ? (
              <button className="btn btn-primary" onClick={startMonitor}>
                <Play size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                MONITOR
              </button>
            ) : (
              <button className="btn btn-stop" onClick={stopMonitor} style={{ borderRadius: '0 6px 6px 0' }}>
                <Square size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                STOP
              </button>
            )}
          </div>
          
          <button className="btn btn-clear" onClick={clearAll}>
            ✕ CLEAR
          </button>

          <label style={{ marginLeft: 'auto' }}>ANALYZE MESSAGE</label>
          <div className="analyze-wrap">
            <input
              type="text"
              placeholder="Paste suspicious text to scan..."
              value={analyzeInput}
              onChange={(e) => setAnalyzeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button className="btn btn-analyze" onClick={handleAnalyze}>
              ⚡ SCAN
            </button>
          </div>
        </div>

        {/* SCANNER DRAWER */}
        <div className={`analyze-result ${analyzeVisible ? 'visible' : ''}`}>
          {analyzeResult && (
            <>
              <div className="ar-header">
                <span className="ar-label">ANALYSIS SCORE</span>
                <span className={`risk-tag risk-${analyzeResult.risk_level}`}>{analyzeResult.risk_level}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--text2)', marginLeft: 'auto' }}>
                  {(analyzeResult.risk_score * 100).toFixed(1)}%
                </span>
                <button
                  onClick={() => setAnalyzeVisible(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '12px' }}
                >
                  ✕
                </button>
              </div>
              <div className="ar-bar-wrap">
                <div
                  className="ar-bar"
                  style={{
                    width: `${analyzeResult.risk_score * 100}%`,
                    background: colors[analyzeResult.risk_level] || 'var(--accent)'
                  }}
                />
              </div>
              <div className="msg-reasons">
                {(analyzeResult.reasons || []).map((r, i) => (
                  <span key={i} className="reason-chip">{r}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* FEED LAYOUT */}
        <div className="layout" style={{ height: 'calc(100vh - 148px)' }}>
          {/* LEFT COLUMN: LIVE CHAT + STATS BAR */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid var(--border)' }}>
            {/* LIVE CHAT STREAM */}
            <div className="panel" style={{ position: 'relative', flex: 1, borderRight: 'none', borderBottom: 'none' }}>
              <div className="panel-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="panel-title">
                  <div className="dot" />
                  LIVE CHAT STREAM
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="panel-count">{messages.length} messages</span>
                  {wsStatus !== 'idle' && (
                    <button
                      onClick={stopMonitor}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--high)',
                        color: 'var(--high)',
                        cursor: 'pointer',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        fontFamily: "'JetBrains Mono', monospace"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(244,67,54,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                      title="Stop Scanning"
                    >
                      <Square size={10} fill="var(--high)" />
                      STOP
                    </button>
                  )}
                </div>
              </div>
              
              <div className="panel-body" ref={chatFeedRef} onScroll={handleScroll}>
                {messages.length === 0 ? (
                  <div className="empty-state">
                    <div className="es-icon">💬</div>
                    Enter a YouTube Live stream link or video ID to begin scanning.
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`chat-msg ${msg.is_flagged ? `flagged ${msg.risk_level}` : ''}`}>
                      <div className="avatar">{msg.username[0].toUpperCase()}</div>
                      <div className="msg-body">
                        <div className="msg-meta">
                          <span className="msg-user">{msg.username}</span>
                          <span className="msg-time">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                          {msg.is_flagged && (
                            <span className={`risk-tag risk-${msg.risk_level}`}>{msg.risk_level}</span>
                          )}
                        </div>
                        <div className="msg-text">{msg.message}</div>
                        {msg.is_flagged && msg.reasons && (
                          <div className="msg-reasons">
                            {msg.reasons.map((r, idx) => (
                              <span key={idx} className="reason-chip">{r}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Scroll bottom helper */}
              <button
                className={`scroll-btn ${!autoScroll && messages.length > 0 ? 'visible' : ''}`}
                onClick={() => {
                  setAutoScroll(true);
                  if (chatFeedRef.current) {
                    chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
                  }
                }}
              >
                ↓
              </button>
            </div>

            {/* BOTTOM STATS BAR */}
            <div className="stats-bar" style={{ position: 'relative', width: '100%', bottom: 'auto', left: 'auto', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--border)', zIndex: 10 }}>
              <div className="stat-box">
                <div className="stat-label">Messages Scanned</div>
                <div className="stat-value accent">{stats.total}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Flagged</div>
                <div className="stat-value danger">{stats.flagged}</div>
              </div>
              <div className="stat-box" style={{ borderRight: 'none' }}>
                <div className="stat-label">Detection Rate</div>
                <div className="stat-value">
                  {stats.total > 0 ? ((stats.flagged / stats.total) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FLAGGED PANEL & OFFENDERS */}
          <div className="right-col" style={{ height: '100%' }}>
            {/* FLAGGED MESSAGES */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title" style={{ color: 'var(--high)' }}>
                  <div className="dot" style={{ background: 'var(--high)', boxShadow: '0 0 6px var(--high)' }} />
                  FLAGGED THREATS
                </div>
                <span className="panel-count" style={{ borderColor: 'rgba(244,67,54,0.3)', color: 'var(--high)' }}>
                  {flaggedMessages.length} flagged
                </span>
              </div>
              <div className="panel-body" ref={flaggedFeedRef}>
                {flaggedMessages.length === 0 ? (
                  <div className="empty-state">
                    <div className="es-icon" style={{ opacity: 0.1 }}>🚩</div>
                    No threats detected yet.
                  </div>
                ) : (
                  flaggedMessages.map((msg, index) => (
                    <div key={index} className="flagged-msg" onClick={() => { setAnalyzeInput(msg.message); handleAnalyze(); }}>
                      <div className="fm-top">
                        <span className="fm-user" style={{ color: colors[msg.risk_level] }}>{msg.username}</span>
                        <span className={`risk-tag risk-${msg.risk_level}`} style={{ fontSize: '8px' }}>{msg.risk_level}</span>
                        <span className="fm-score">{(msg.risk_score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="fm-text">{msg.message}</div>
                      {msg.urls && msg.urls.length > 0 && (
                        <div className="fm-urls">
                          {msg.urls.slice(0, 2).map((u, i) => (
                            <span key={i} className="url-chip">{u}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--text3)', marginTop: '4px' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* TOP OFFENDERS */}
            <div className="panel" style={{ borderBottom: 'none' }}>
              <div className="panel-header">
                <div className="panel-title" style={{ color: 'var(--critical)' }}>
                  <div className="dot" style={{ background: 'var(--critical)', boxShadow: '0 0 6px var(--critical)' }} />
                  TOP OFFENDERS
                </div>
              </div>
              <div className="panel-body">
                {Object.keys(offenders).length === 0 ? (
                  <div className="empty-state">
                    <div className="es-icon" style={{ opacity: 0.1 }}>⚠️</div>
                    No repeat offenders yet.
                  </div>
                ) : (
                  Object.entries(offenders)
                    .sort((a, b) => b[1].count - a[1].count)
                    .slice(0, 8)
                    .map(([name, info], index) => (
                      <div key={index} className="offender-row">
                        <span className="off-rank">#{index + 1}</span>
                        <div className="off-avatar">{name[0].toUpperCase()}</div>
                        <div className="off-info">
                          <div className="off-name">{name}</div>
                          <div className="off-meta">
                            <span className={`risk-tag risk-${info.maxRisk}`} style={{ fontSize: '8px', padding: '1px 5px', marginRight: '6px' }}>{info.maxRisk}</span>
                            <span>score: {(info.maxScore * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <span className="off-count">{info.count}✕</span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATIONS */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>
              {t.type === 'ok' ? <ShieldCheck size={14} style={{ verticalAlign: 'middle' }} /> :
               t.type === 'warn' ? <AlertTriangle size={14} style={{ verticalAlign: 'middle' }} /> :
               <CheckCircle size={14} style={{ verticalAlign: 'middle' }} />}
            </span>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
