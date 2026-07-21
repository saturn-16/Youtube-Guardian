import { useState, useEffect, useRef } from 'react';
import SoftAurora from '../components/SoftAurora';
import FuzzyText from '../components/FuzzyText';
import MetallicPaint from '../components/MetallicPaint';
import FlowingMenu from '../components/FlowingMenu';
import CurvedLoop from '../components/CurvedLoop';
import ScrollFloat from '../components/ScrollFloat';
import VariableProximity from '../components/VariableProximity';
import GlitchText from '../components/GlitchText';
import OrbitImages from '../components/OrbitImages';
import { useAuth } from '../context/AuthContext';
import youtubeLogo from '../assets/youtube-logo.svg';
import { Shield, ArrowRight, Brain, Zap, Activity, AlertTriangle, Cpu, HelpCircle, Lock, LayoutDashboard, LogOut } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GitHubIcon = ({ size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Landing = ({ onLaunchDashboard }) => {
  const { user, logout } = useAuth();
  const [wowState, setWowState] = useState(0); // 0: safe message, 1: suspicious message, 2: blocked
  const proximityContainerRef = useRef(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  // Auto-cycle the "Wow" visualization section
  useEffect(() => {
    const timer = setInterval(() => {
      setWowState(prev => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Card Fade-in Scroll Animation
  useEffect(() => {
    gsap.fromTo(
      ".feature-card",
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: "#features",
          start: "top bottom-=20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  const pipelineItems = [
    { link: '#', text: '1. Chat Received', image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=60' },
    { link: '#', text: '2. Lexical Check', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60' },
    { link: '#', text: '3. Brand Verifier', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60' },
    { link: '#', text: '4. VirusTotal API', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=60' },
    { link: '#', text: '5. Risk Score Alert', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60' }
  ];

  const threatOrbitItems = [
    <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(13, 19, 24, 0.98)', border: '1px solid var(--border)', color: '#fff', width: '210px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--high)', marginBottom: '6px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px' }}>Fake Giveaways</h4>
      <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.4' }}>Bots spamming claim links.</p>
    </div>,
    <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(13, 19, 24, 0.98)', border: '1px solid var(--border)', color: '#fff', width: '210px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--high)', marginBottom: '6px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px' }}>Crypto Scams</h4>
      <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.4' }}>Promoting mock wallet logins.</p>
    </div>,
    <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(13, 19, 24, 0.98)', border: '1px solid var(--border)', color: '#fff', width: '210px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--high)', marginBottom: '6px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px' }}>Phishing URLs</h4>
      <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.4' }}>Spoofed sites steal accounts.</p>
    </div>,
    <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(13, 19, 24, 0.98)', border: '1px solid var(--border)', color: '#fff', width: '210px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--high)', marginBottom: '6px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px' }}>Rapid Bots</h4>
      <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.4' }}>Moderators cannot react in time.</p>
    </div>
  ];

  const pageStyle = {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    overflowY: 'auto',
    background: '#080c10',
    color: '#c8d8e8',
    fontFamily: "'Syne', sans-serif",
    paddingBottom: '80px',
    scrollBehavior: 'smooth'
  };

  const sectionStyle = {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '85px 24px',
  };

  return (
    <div style={pageStyle} className="landing-page">
      {/* Background WebGL SoftAurora */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <SoftAurora
          speed={0.4}
          scale={1.2}
          brightness={0.85}
          color1="#00d4ff" // Cyber cyan
          color2="#ff3333" // YouTube red
          noiseFrequency={2.0}
          noiseAmplitude={0.8}
          bandHeight={0.4}
          bandSpread={0.85}
          octaveDecay={0.12}
          layerOffset={1.0}
          colorSpeed={0.8}
          enableMouseInteraction={true}
          mouseInfluence={0.15}
        />
      </div>

      <header style={{ position: 'relative', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'rgba(8, 12, 16, 0.8)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(10px)' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo-icon" style={{ display: 'flex', alignItems: 'center', filter: 'drop-shadow(0 0 10px var(--accent))', marginRight: '6px' }}>
            <Shield size={32} color="var(--accent)" fill="rgba(0, 212, 255, 0.1)" />
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user && (
            <div 
              ref={dropdownRef}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{ 
                position: 'relative', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                border: showUserDropdown ? '1px solid var(--accent)' : '1px solid var(--border)', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                background: 'rgba(255,255,255,0.03)', 
                marginRight: '4px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.2s',
                zIndex: showUserDropdown ? 1001 : 1
              }}
              onMouseEnter={(e) => {
                if (!showUserDropdown) e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                if (!showUserDropdown) e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
              ) : (
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold' }}>
                  {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                </div>
              )}
              <span style={{ fontSize: '11px', color: 'var(--text)', fontWeight: '500' }}>{user.displayName || user.email}</span>
              
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
          <a
            href="https://github.com/saturn-16/Youtube-Guardian"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text2)', border: '1px solid var(--border)', padding: '10px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifySelf: 'center', transition: 'all 0.2s', background: 'rgba(255,255,255,0.01)' }}
            className="github-btn-header"
            title="GitHub Repository"
          >
            <GitHubIcon size={20} />
          </a>
          <button
            onClick={onLaunchDashboard}
            style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', transition: 'all 0.2s', boxShadow: '0 0 15px rgba(0,212,255,0.3)' }}
          >
            <LayoutDashboard size={14} />
            Monitor Panel
          </button>
        </div>
      </header>

      {/* HERO SECTION WITH LAYERED METALLIC PAINT LOGO */}
      <section style={{ ...sectionStyle, padding: '40px 24px 80px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Layered Container: Logo Background + Text in front */}
        <div style={{ width: '100%', maxWidth: '680px', height: '340px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          
          {/* Animated Metallic Paint Logo (Background) */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <MetallicPaint
              imageSrc={youtubeLogo}
              seed={42}
              scale={3.5}
              patternSharpness={1.2}
              noiseScale={0.5}
              speed={0.45}
              liquid={0.7}
              mouseAnimation={false}
              brightness={2.2}
              contrast={0.9}
              refraction={0.02}
              blur={0.01}
              chromaticSpread={2.5}
              fresnel={1.2}
              angle={30}
              waveAmplitude={1.2}
              distortion={1.1}
              contour={0.3}
              lightColor="#ffffff"
              darkColor="#000000"
              tintColor="#ff3333" // Bright Red tint for YouTube
            />
          </div>

          {/* Heading overlay (Foreground) */}
          <div style={{ position: 'relative', zIndex: 2, pointerEvents: 'none', padding: '20px' }}>
            <GlitchText
              speed={0.4}
              enableShadows={true}
              enableOnHover={false}
              style={{
                fontSize: 'clamp(2rem, 5.8vw, 4.4rem)',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: '900',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                textShadow: '0 4px 15px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.9)'
              }}
            >
              YOUTUBE GUARDIAN
            </GlitchText>
          </div>

        </div>

        {/* CurvedLoop marquee subheading - full screen width and slightly more curved */}
        <div style={{ width: '100%', margin: '-40px auto 10px auto', overflow: 'visible' }}>
          <CurvedLoop 
            marqueeText="PROTECT THE CHAT ✦ PREVENT PHISHING ✦ SCAN SCAMMERS ✦ SECURE VIEWERS ✦ "
            speed={2.2}
            curveAmount={180}
            interactive={true}
          />
        </div>

        <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: '1.6', maxWidth: '720px', marginBottom: '32px' }}>
          YouTube Guardian uses machine learning and threat intelligence APIs to analyze every live chat message in real time, detecting phishing attempts, malicious links, impersonation scams, and suspicious behavior before they reach your audience.
        </p>

        <button
          onClick={onLaunchDashboard}
          style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '14px 28px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '700', transition: 'all 0.2s', boxShadow: '0 0 25px rgba(0,212,255,0.4)' }}
        >
          Launch Security Monitor
          <ArrowRight size={16} />
        </button>
      </section>

      {/* STATISTICS */}
      <section style={{ ...sectionStyle, padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            { value: '92%', label: 'Detection Accuracy', desc: 'Lexical analysis rules' },
            { value: '<100 ms', label: 'Analysis Speed', desc: 'Near-instant verification' },
            { value: '24/7', label: 'Live Monitoring', desc: 'Continuous stream scanning' },
            { value: 'Dual Shield', label: 'AI + API Scanner', desc: 'VirusTotal integration' }
          ].map((stat, i) => (
            <div key={i} style={{ padding: '24px', borderRadius: '12px', background: 'rgba(13, 19, 24, 0.6)', border: '1px solid var(--border)', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent)', marginBottom: '8px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section id="features" style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', lineHeight: '1.2' }}>
            <ScrollFloat
              animationDuration={1.2}
              ease="power3.out"
              scrollStart="top bottom+=35%"
              scrollEnd="bottom center+=5%"
              stagger={0.02}
            >
              Project Capabilities
            </ScrollFloat>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { icon: <Brain size={24} />, title: 'Intelligent Detection', desc: 'Analyzes lexical structure, TLD safety, lookalike words, and homoglyphs with zero dependency rules.' },
            { icon: <Shield size={24} />, title: 'Threat Intelligence', desc: 'Instantly cross-references links against VirusTotal databases to catch known malicious phishing hosts.' },
            { icon: <Activity size={24} />, title: 'Continuous Protection', desc: 'Connects directly to YouTube chat WebSockets to review every stream message continuously, second-by-second.' },
            { icon: <AlertTriangle size={24} />, title: 'Instant Alerting', desc: 'Displays flagged threat cards to stream moderators with detailed analysis scores and security metrics.' }
          ].map((feat, i) => (
            <div 
              key={i} 
              className="feature-card" 
              style={{ opacity: 0, padding: '30px 24px', borderRadius: '12px', background: 'rgba(13, 19, 24, 0.5)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)', willChange: 'transform, opacity' }}
            >
              <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>{feat.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '12px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.6' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* "WOW" ANIMATED SCANNED SECTION */}
      <section style={{ ...sectionStyle, background: 'rgba(13, 19, 24, 0.4)', borderRadius: '20px', border: '1px solid var(--border)', padding: '60px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }} className="wow-grid">
          <div>
            <div style={{ color: 'var(--accent)', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Live Threat Visualization</div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>Every Message Tells a Story</h2>
            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.6', marginBottom: '24px' }}>
              Scammers try to hide in plain sight. YouTube Guardian dissects every word, URL pattern, and character replacement immediately before deciding if a message is safe for your viewers.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--safe)' }} />
                <span>Green checks verify safe and conversational items.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--high)' }} />
                <span>Red signals immediately isolate security threats.</span>
              </div>
            </div>
          </div>

          {/* ANIMATED PREVIEW CARD */}
          <div style={{ background: '#080c10', border: '1px solid var(--border2)', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '12px', left: '16px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text3)', letterSpacing: '1px' }}>
              THREAT SCANNER ENGINE v1.2
            </div>

            {wowState === 0 && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--safe)', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--safe)' }} />
                  VERIFIED SAFE
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>@GamerPro</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  "Wow great play! What rank are you?"
                </div>
              </div>
            )}

            {wowState === 1 && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--medium)', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--medium)' }} />
                  SUSPICIOUS URL DETECTED
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>@CryptoBonus24</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' }}>
                  "Click here for free bitcoin giveaway! http://bit.ly/claim-tokens"
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '9px', background: 'rgba(255,152,0,0.1)', color: 'var(--medium)', border: '1px solid rgba(255,152,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>URL Shortener</span>
                  <span style={{ fontSize: '9px', background: 'rgba(255,152,0,0.1)', color: 'var(--medium)', border: '1px solid rgba(255,152,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>Financial Keywords</span>
                </div>
              </div>
            )}

            {wowState === 2 && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--critical)', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--critical)' }} />
                  CRITICAL SHIELD BLOCKED (98%)
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>@FreeGiftBot</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(244,67,54,0.05)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(244,67,54,0.2)', marginBottom: '12px' }}>
                  "CLAIM free Discord Nitro at http://discord-gift-promo.xyz"
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '9px', background: 'rgba(233,30,99,0.1)', color: 'var(--critical)', border: '1px solid rgba(233,30,99,0.2)', padding: '2px 6px', borderRadius: '4px' }}>Spoofing Brand 'discord'</span>
                  <span style={{ fontSize: '9px', background: 'rgba(233,30,99,0.1)', color: 'var(--critical)', border: '1px solid rgba(233,30,99,0.2)', padding: '2px 6px', borderRadius: '4px' }}>Suspicious TLD (.xyz)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WHY WE BUILT IT */}
      <section style={{ ...sectionStyle, paddingLeft: '4%', paddingRight: '4%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.75fr 1.25fr', gap: '50px', alignItems: 'center' }} className="wow-grid">
          <div style={{ maxWidth: '440px', justifySelf: 'start' }}>
            <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '4px', background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.2)', color: 'var(--high)', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px' }}>THE THREAT</div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '20px' }}>Why We Built It</h2>
            <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: '1.7', marginBottom: '16px' }}>
              Live streams attract thousands of active viewers. Unfortunately, this makes them high-value targets for malicious scammers.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: '1.7' }}>
              From fake cryptocurrency giveaways and phishing URLs disguised as Discord gifts to account recovery frauds—human moderators simply cannot review and intercept messages fast enough. YouTube Guardian gives you an AI security assistant that never looks away.
            </p>
          </div>
          <div style={{ height: '520px', position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
            <OrbitImages
              images={threatOrbitItems}
              shape="ellipse"
              baseWidth={700}
              radiusX={300}
              radiusY={90}
              rotation={-6}
              duration={30}
              itemSize={220}
              responsive={true}
              showPath={true}
              pathColor="rgba(255, 255, 255, 0.15)"
              pathWidth={1.5}
            />
          </div>
        </div>
      </section>

      {/* FLOWING MENU DETECTION PIPELINE */}
      <section style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>Detection Pipeline</h2>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Hover to explore the threat analysis stages</p>
        </div>
        
        <div style={{ borderBottom: '1px solid rgba(0, 212, 255, 0.2)', overflow: 'hidden', borderRadius: '12px' }}>
          <FlowingMenu items={pipelineItems} speed={12} />
        </div>
      </section>

      {/* QUOTES WITH VARIABLE PROXIMITY */}
      <section 
        style={{ ...sectionStyle, padding: '60px 24px', textAlign: 'center', position: 'relative' }}
        ref={proximityContainerRef}
      >
        <div style={{ 
          fontSize: 'clamp(1.3rem, 3.4vw, 2.5rem)', 
          fontWeight: '900', 
          color: '#fff', 
          maxWidth: '1080px', 
          margin: '0 auto 24px auto', 
          lineHeight: '1.5',
          fontFamily: "'Orbitron', sans-serif"
        }}>
          <VariableProximity
            label={'"The fastest phishing attack is the one that reaches your audience before you do."'}
            fromFontVariationSettings="'wght' 400, 'opsz' 8"
            toFontVariationSettings="'wght' 900, 'opsz' 40"
            containerRef={proximityContainerRef}
            radius={220}
            falloff="linear"
            style={{ display: 'inline', cursor: 'default' }}
          />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '2px', fontWeight: 'bold' }}>
          SECURITY PHILOSOPHY
        </div>
      </section>

      {/* TECH STACK */}
      <section style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>Built for Speed. Designed for Security.</h2>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Lightweight technologies underpinning real-time defense</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
          {['Python', 'FastAPI', 'React', 'Vite', 'Firebase Auth', 'WebGL (OGL)', 'VirusTotal API', 'SQLite', 'WebSockets', 'TailwindCSS'].map((tech, idx) => (
            <span key={idx} style={{ padding: '10px 20px', borderRadius: '24px', background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.15)', color: 'var(--text)', fontSize: '13px', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" }}>
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ ...sectionStyle, textAlign: 'center', padding: '100px 24px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>Ready to Protect Your Community?</h2>
        <p style={{ fontSize: '15px', color: 'var(--text2)', maxWidth: '600px', margin: '0 auto 32px auto', lineHeight: '1.6' }}>
          Experience AI-powered moderation designed specifically for high-velocity streaming environments.
        </p>
        <button
          onClick={onLaunchDashboard}
          style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '16px 36px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '800', transition: 'all 0.2s', boxShadow: '0 0 25px rgba(0,212,255,0.4)', margin: '0 auto' }}
        >
          Launch Dashboard Monitor
          <ArrowRight size={16} />
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'rgba(8, 12, 16, 0.9)', padding: '20px 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px' }}>
            © {new Date().getFullYear()} YOUTUBE GUARDIAN. ALL RIGHTS RESERVED. REAL-TIME AI STREAM SAFETY.
          </div>
          {user && (
            <button
              onClick={logout}
              style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', transition: 'color 0.2s', padding: '2px 8px' }}
              className="footer-signout-btn"
            >
              <LogOut size={12} />
              Sign Out
            </button>
          )}
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .github-btn-header:hover {
          color: var(--accent) !important;
          border-color: var(--accent) !important;
        }
        .footer-signout-btn:hover {
          color: var(--accent) !important;
        }
        @media (max-width: 768px) {
          .wow-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;
