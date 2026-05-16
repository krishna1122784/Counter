import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_BASE_URL = 'http://localhost:8080/api';

const INITIAL_BACKGROUNDS = [
  '/images/radha.png',
  '/images/krishna.png',
  '/images/laddu_gopal.png',
  '/images/maharaj_ji.png'
];

function App() {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [chantText, setChantText] = useState('Radha Radha');
  const [intervalSeconds, setIntervalSeconds] = useState(3);

  const [count, setCount] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  
  const [backgrounds, setBackgrounds] = useState(INITIAL_BACKGROUNDS);
  const [bgIndex, setBgIndex] = useState(0);
  
  const [spawns, setSpawns] = useState([]);
  const [bgTexts, setBgTexts] = useState([]);
  const [bump, setBump] = useState(false);
  
  const [zoomLevel, setZoomLevel] = useState(1);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const nextSideRef = useRef('left');
  const fileInputRef = useRef(null);

  const loadUserData = async (userId) => {
    try {
      // Load History
      const histRes = await fetch(`${API_BASE_URL}/history/${userId}`);
      if (histRes.ok) {
        setHistory(await histRes.json());
      }

      // Load Backgrounds
      const bgRes = await fetch(`${API_BASE_URL}/backgrounds/${userId}`);
      if (bgRes.ok) {
        const bgIds = await bgRes.json();
        if (bgIds.length > 0) {
          const newUrls = bgIds.map(id => `${API_BASE_URL}/backgrounds/image/${id}`);
          setBackgrounds(newUrls);
        } else {
          setBackgrounds(INITIAL_BACKGROUNDS);
        }
      }
    } catch (e) {
      console.error("Failed to load user data", e);
    }
  };

  const handleAuth = async () => {
    setAuthError('');
    const endpoint = isLoginView ? '/auth/login' : '/auth/register';
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      if (res.ok) {
        const loggedInUser = await res.json();
        setUser(loggedInUser);
        loadUserData(loggedInUser.id);
      } else {
        setAuthError(isLoginView ? 'Invalid credentials' : 'Username already exists');
      }
    } catch (e) {
      setAuthError('Cannot connect to server. Is Spring Boot running?');
    }
  };

  useEffect(() => {
    if (!isSetupComplete) return;
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSetupComplete, backgrounds.length]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && user) {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));

      try {
        const res = await fetch(`${API_BASE_URL}/backgrounds/${user.id}`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          // Reload backgrounds
          await loadUserData(user.id);
          setBgIndex(0);
        }
      } catch (err) {
        console.error("Failed to upload backgrounds", err);
      }
    }
  };

  useEffect(() => {
    const texts = Array.from({ length: 15 }).map((_, i) => ({
      id: `bg-text-${i}`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${10 + Math.random() * 10}s`
    }));
    setBgTexts(texts);
  }, []);

  useEffect(() => {
    if (count > 0) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 200);
      return () => clearTimeout(timer);
    }
  }, [count]);

  const spawnText = useCallback(() => {
    const id = Date.now() + Math.random().toString();
    const side = nextSideRef.current;
    nextSideRef.current = side === 'left' ? 'right' : 'left';

    const newSpawn = {
      id,
      side,
      top: `${45 + Math.random() * 10}%`
    };
    setSpawns((prev) => [...prev, newSpawn]);

    setTimeout(() => {
      setCount((prev) => prev + 1);
      setSpawns((prevSpawns) => prevSpawns.filter(spawn => spawn.id !== id));
    }, 1500);
  }, []);

  const saveSession = useCallback(async () => {
    if (count > 0 && user) {
      try {
        await fetch(`${API_BASE_URL}/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, jaapName: chantText || 'Radha Radha', count })
        });
        loadUserData(user.id); // Refresh history
      } catch (e) {
        console.error("Failed to save session", e);
      }
    }
  }, [count, user, chantText]);

  const resetCount = useCallback(() => {
    saveSession();
    setCount(0);
  }, [saveSession]);

  const handleLogout = useCallback(() => {
    saveSession();
    setCount(0);
    setAutoMode(false);
    setIsSetupComplete(false);
    setUser(null);
    setLoginUsername('');
    setLoginPassword('');
    setBackgrounds(INITIAL_BACKGROUNDS);
  }, [saveSession]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));

  useEffect(() => {
    let intervalId;
    if (autoMode) {
      intervalId = setInterval(() => {
        spawnText();
      }, intervalSeconds * 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoMode, spawnText, intervalSeconds]);

  if (!user) {
    return (
      <div className="app-container setup-screen">
        <div className="background-container">
          <img src={INITIAL_BACKGROUNDS[0]} alt="Background" className="bg-image active" style={{filter: 'brightness(0.2)'}} />
        </div>
        <div className="setup-modal">
          <h2 className="setup-title">{isLoginView ? 'Login to Devotion' : 'Register Account'}</h2>
          
          <div className="input-group">
            <label>Username</label>
            <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Username" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" />
          </div>

          {authError && <div style={{color: 'red', marginBottom: '15px'}}>{authError}</div>}

          <button className="btn btn-start setup-start-btn" onClick={handleAuth}>
            {isLoginView ? 'Login' : 'Register'}
          </button>
          
          <p style={{textAlign: 'center', marginTop: '15px', cursor: 'pointer', color: '#ffd700'}} onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? 'Need an account? Register here' : 'Already have an account? Login'}
          </p>
        </div>
      </div>
    );
  }

  if (!isSetupComplete) {
    return (
      <div className="app-container setup-screen">
        <div className="background-container">
          <img src={backgrounds[0]} alt="Background" className="bg-image active" style={{filter: 'brightness(0.2)'}} />
        </div>
        <div className="setup-modal">
          <h2 className="setup-title">Configure Your Jaap</h2>
          
          <div className="input-group">
            <label>Name of Jaap</label>
            <input type="text" value={chantText} onChange={(e) => setChantText(e.target.value)} placeholder="e.g. Radha Radha" />
          </div>

          <div className="input-group">
            <label>Timing Interval</label>
            <div className="timing-controls">
              <button className="timing-btn" onClick={() => setIntervalSeconds(prev => Math.max(1, prev - 1))}>-</button>
              <span className="timing-value">{intervalSeconds} sec</span>
              <button className="timing-btn" onClick={() => setIntervalSeconds(prev => prev + 1)}>+</button>
            </div>
          </div>

          <button className="btn btn-start setup-start-btn" onClick={() => setIsSetupComplete(true)}>
            Start Devotion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="background-container">
        {backgrounds.map((bg, index) => (
          <img key={bg} src={bg} alt="Background" className={`bg-image ${index === bgIndex ? 'active' : ''}`} />
        ))}
      </div>

      <div className="bg-text-layer" style={{ zoom: zoomLevel }}>
        {bgTexts.map((txt) => (
          <div key={txt.id} className="bg-text" style={{ left: txt.left, animationDelay: txt.animationDelay, animationDuration: txt.animationDuration }}>
            {chantText || 'Radha Radha'}
          </div>
        ))}
      </div>

      <div className="spawning-text-container" style={{ zoom: zoomLevel }}>
        <AnimatePresence>
          {spawns.map((spawn) => (
            <motion.div
              key={spawn.id}
              className={`spawning-text ${spawn.side === 'right' ? 'text-red' : ''}`}
              style={{ top: spawn.top }}
              initial={{ left: spawn.side === 'left' ? '-20%' : '120%', opacity: 1, scale: 0.5 }}
              animate={{ left: '50%', x: '-50%', opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 2, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              {chantText || 'Radha Radha'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="ui-overlay" style={{ zoom: zoomLevel }}>
        <div className="top-bar">
          <div className="user-greeting">Jai Shri Krishna, {user.username}</div>
          <div className="top-controls">
            <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
            <button className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current.click()}>🖼️ Upload BG</button>
            <div className="zoom-controls">
              <button className="btn btn-secondary btn-sm" onClick={handleZoomOut}>-</button>
              <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
              <button className="btn btn-secondary btn-sm" onClick={handleZoomIn}>+</button>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowHistory(true)}>📜 History</button>
            <button className="btn btn-stop btn-sm" onClick={handleLogout}>🚪 Logout</button>
          </div>
        </div>

        <div className="ui-bottom">
          <div className="controls-box">
            <button className="btn btn-primary" onClick={spawnText}>Manual Chant</button>
            <button className={`btn ${autoMode ? 'btn-stop' : 'btn-start'}`} onClick={() => setAutoMode(!autoMode)}>
              {autoMode ? `Stop Auto (${intervalSeconds}s)` : `Start Auto (${intervalSeconds}s)`}
            </button>
            <button className="btn btn-secondary" onClick={resetCount}>Reset Count</button>
          </div>

          <div className={`counter-box ${bump ? 'bump' : ''}`}>
            <div className="counter-title">Chant Count</div>
            <h1 className="counter-value">{count}</h1>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="history-modal-overlay">
          <div className="history-modal">
            <div className="history-header">
              <h2>Jaap History</h2>
              <button className="close-btn" onClick={() => setShowHistory(false)}>✕</button>
            </div>
            
            <div className="history-list">
              {history.length === 0 ? (
                <p className="no-history">No history found. Start your devotion!</p>
              ) : (
                history.map(item => (
                  <div key={item.id} className="history-card">
                    <div className="history-card-header">
                      <strong>👤 {user.username}</strong>
                      <span className="history-date">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="history-card-body">
                      Chanted <span className="highlight">{item.jaapName}</span> - <strong>{item.count} times</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
