import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const BACKGROUNDS = [
  '/images/radha.png',
  '/images/krishna.png',
  '/images/laddu_gopal.png',
  '/images/maharaj_ji.png'
];

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [chantText, setChantText] = useState('Radha Radha');
  const [intervalSeconds, setIntervalSeconds] = useState(3);

  const [count, setCount] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [spawns, setSpawns] = useState([]);
  const [bgTexts, setBgTexts] = useState([]);
  const [bump, setBump] = useState(false);
  
  const nextSideRef = useRef('left');

  // Cycle background images every 5 seconds
  useEffect(() => {
    if (!isSetupComplete) return;
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSetupComplete]);

  // Generate random background floating texts
  useEffect(() => {
    const texts = Array.from({ length: 15 }).map((_, i) => ({
      id: `bg-text-${i}`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${10 + Math.random() * 10}s`
    }));
    setBgTexts(texts);
  }, []);

  // Handle counter bump animation
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
    
    // Toggle for next time
    nextSideRef.current = side === 'left' ? 'right' : 'left';

    const newSpawn = {
      id,
      side,
      // Randomize the vertical position a little bit near the center
      top: `${45 + Math.random() * 10}%`
    };
    setSpawns((prev) => [...prev, newSpawn]);

    // Increment count and remove spawn after 1.5s (when it reaches middle)
    setTimeout(() => {
      setCount((prev) => prev + 1);
      setSpawns((prevSpawns) => prevSpawns.filter(spawn => spawn.id !== id));
    }, 1500);
  }, []);

  const resetCount = useCallback(() => {
    setCount(0);
  }, []);

  // Auto spawn interval
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

  if (!isSetupComplete) {
    return (
      <div className="app-container setup-screen">
        <div className="background-container">
          <img src={BACKGROUNDS[0]} alt="Spiritual Background" className="bg-image active" style={{filter: 'brightness(0.2)'}} />
        </div>
        <div className="setup-modal">
          <h2 className="setup-title">Configure Your Jaap</h2>
          
          <div className="input-group">
            <label>Name of Jaap</label>
            <input 
              type="text" 
              value={chantText} 
              onChange={(e) => setChantText(e.target.value)} 
              placeholder="e.g. Radha Radha"
            />
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
      {/* Background Images Layer */}
      <div className="background-container">
        {BACKGROUNDS.map((bg, index) => (
          <img
            key={bg}
            src={bg}
            alt="Spiritual Background"
            className={`bg-image ${index === bgIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Background Floating Text Layer */}
      <div className="bg-text-layer">
        {bgTexts.map((txt) => (
          <div
            key={txt.id}
            className="bg-text"
            style={{
              left: txt.left,
              animationDelay: txt.animationDelay,
              animationDuration: txt.animationDuration
            }}
          >
            {chantText || 'Radha Radha'}
          </div>
        ))}
      </div>

      {/* Main Spawning Text Layer */}
      <div className="spawning-text-container">
        <AnimatePresence>
          {spawns.map((spawn) => (
            <motion.div
              key={spawn.id}
              className={`spawning-text ${spawn.side === 'right' ? 'text-red' : ''}`}
              style={{ top: spawn.top }}
              initial={{ 
                left: spawn.side === 'left' ? '-20%' : '120%', 
                opacity: 1, 
                scale: 0.5 
              }}
              animate={{ left: '50%', x: '-50%', opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 2, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              {chantText || 'Radha Radha'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* UI Overlay Layer */}
      <div className="ui-overlay">
        <div className={`counter-box ${bump ? 'bump' : ''}`}>
          <div className="counter-title">Chant Count</div>
          <h1 className="counter-value">{count}</h1>
        </div>

        <div className="controls-box">
          <button 
            className="btn btn-primary" 
            onClick={spawnText}
          >
            Manual Chant
          </button>
          
          <button 
            className={`btn ${autoMode ? 'btn-stop' : 'btn-start'}`}
            onClick={() => setAutoMode(!autoMode)}
          >
            {autoMode ? `Stop Auto (${intervalSeconds}s)` : `Start Auto (${intervalSeconds}s)`}
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={resetCount}
          >
            Reset Count
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
