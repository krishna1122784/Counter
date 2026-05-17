import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveBackground, getBackgrounds, clearBackgrounds } from './idbUtils';
import './App.css';

const INITIAL_BACKGROUNDS = [
  '/images/radha.png',
  '/images/krishna.png',
  '/images/laddu_gopal.png',
  '/images/maharaj_ji.png'
];

const TRANSLATIONS = {
  en: {
    loginTitle: "Login to Devotion",
    registerTitle: "Register Account",
    username: "Username",
    password: "Password",
    loginBtn: "Login",
    registerBtn: "Register",
    needAccount: "Need an account? Register here",
    haveAccount: "Already have an account? Login",
    configureJaap: "Configure Your Jaap",
    nameOfJaap: "Name of Jaap",
    egChant: "e.g. Radha Radha",
    timingInterval: "Timing Interval",
    startDevotion: "Start Devotion",
    chantCount: "Chant Count",
    manualChant: "Manual Chant",
    startAuto: "Start Auto",
    stopAuto: "Stop Auto",
    resetCount: "Reset Count",
    uploadBg: "Upload BG",
    history: "History",
    logout: "Logout",
    jaapHistory: "Jaap History",
    noHistory: "No history found. Start your devotion!",
    clearHistory: "Clear History",
    chanted: "Chanted",
    times: "times",
    greeting: "Jai Shri Krishna",
    sec: "sec",
    errEmptyFields: "Please enter both username and password",
    errInvalidCreds: "Invalid credentials",
    errUserExists: "Username already exists"
  },
  hi: {
    loginTitle: "भक्ति में लॉगिन करें",
    registerTitle: "खाता बनाएं",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    loginBtn: "लॉगिन",
    registerBtn: "रजिस्टर",
    needAccount: "खाता नहीं है? यहाँ रजिस्टर करें",
    haveAccount: "पहले से खाता है? लॉगिन करें",
    configureJaap: "अपने जाप को कॉन्फ़िगर करें",
    nameOfJaap: "जाप का नाम",
    egChant: "जैसे: राधा राधा",
    timingInterval: "समय अंतराल",
    startDevotion: "भक्ति शुरू करें",
    chantCount: "जाप संख्या",
    manualChant: "मैनुअल जाप",
    startAuto: "ऑटो शुरू करें",
    stopAuto: "ऑटो रोकें",
    resetCount: "संख्या रीसेट करें",
    uploadBg: "बैकग्राउंड अपलोड करें",
    history: "इतिहास",
    logout: "लॉगआउट",
    jaapHistory: "जाप का इतिहास",
    noHistory: "कोई इतिहास नहीं मिला। अपनी भक्ति शुरू करें!",
    clearHistory: "इतिहास साफ़ करें",
    chanted: "जाप किया",
    times: "बार",
    greeting: "जय श्री कृष्ण",
    sec: "सेकंड",
    errEmptyFields: "कृपया उपयोगकर्ता नाम और पासवर्ड दोनों दर्ज करें",
    errInvalidCreds: "अमान्य क्रेडेंशियल",
    errUserExists: "उपयोगकर्ता नाम पहले से मौजूद है"
  },
  sa: {
    loginTitle: "भक्तौ प्रवेशः",
    registerTitle: "पञ्जीकरणम्",
    username: "प्रयोक्तृनाम",
    password: "कूटशब्दः",
    loginBtn: "प्रविशतु",
    registerBtn: "पञ्जीकरणं करोतु",
    needAccount: "नूतनलेखः आवश्यकः? अत्र पञ्जीकरणं करोतु",
    haveAccount: "पूर्वमेव लेखः अस्ति? प्रविशतु",
    configureJaap: "स्वकीयजापस्य विन्यासः",
    nameOfJaap: "जापस्य नाम",
    egChant: "यथा: राधा राधा",
    timingInterval: "कालान्तरालः",
    startDevotion: "भक्तिं आरभत",
    chantCount: "जापसंख्या",
    manualChant: "हस्तजापः",
    startAuto: "स्वचालितं आरभत",
    stopAuto: "स्वचालितं स्थगयतु",
    resetCount: "संख्यां शून्यीकरोतु",
    uploadBg: "पृष्ठभूमिं अपलोड् करोतु",
    history: "इतिहासः",
    logout: "निर्गच्छतु",
    jaapHistory: "जापस्य इतिहासः",
    noHistory: "कोऽपि इतिहासः न प्राप्तः। भक्तिं आरभत!",
    clearHistory: "इतिहासम् अपमार्जतु",
    chanted: "जपितम्",
    times: "वारम्",
    greeting: "जय श्री कृष्णः",
    sec: "क्षणः",
    errEmptyFields: "कृपया प्रयोक्तृनाम कूटशब्दं च द्वयं लिखतु",
    errInvalidCreds: "अमान्यपरिचयः",
    errUserExists: "प्रयोक्तृनाम पूर्वमेव विद्यते"
  },
  mai: {
    loginTitle: "भक्ति में लॉगिन करू",
    registerTitle: "खाता बनाऊ",
    username: "उपयोगकर्ताक नाम",
    password: "पासवर्ड",
    loginBtn: "लॉगिन करू",
    registerBtn: "रजिस्टर करू",
    needAccount: "खाता नै अछि? एतय रजिस्टर करू",
    haveAccount: "पहले सँ खाता अछि? लॉगिन करू",
    configureJaap: "अपन जाप कॉन्फ़िगर करू",
    nameOfJaap: "जाप क नाम",
    egChant: "जैसे: राधा राधा",
    timingInterval: "समय अंतराल",
    startDevotion: "भक्ति शुरू करू",
    chantCount: "जाप संख्या",
    manualChant: "मैनुअल जाप",
    startAuto: "ऑटो शुरू करू",
    stopAuto: "ऑटो रोकू",
    resetCount: "संख्या रीसेट करू",
    uploadBg: "बैकग्राउंड अपलोड करू",
    history: "इतिहास",
    logout: "लॉगआउट करू",
    jaapHistory: "जाप क इतिहास",
    noHistory: "कोनो इतिहास नै भेटल। अपन भक्ति शुरू करू!",
    clearHistory: "इतिहास साफ़ करू",
    chanted: "जाप कएल",
    times: "बेर",
    greeting: "जय सियाराम",
    sec: "सेकंड",
    errEmptyFields: "कृपया उपयोगकर्ता नाम और पासवर्ड दोनों दर्ज करू",
    errInvalidCreds: "अमान्य क्रेडेंशियल",
    errUserExists: "उपयोगकर्ता नाम पहले सँ मौजूद अछि"
  }
};

const STANDARD_CHANTS = {
  en: ['Radha Radha', 'Ram Ram', 'Hare Krishna', 'Om Namah Shivaya'],
  hi: ['राधा राधा', 'राम राम', 'हरे कृष्ण', 'ॐ नमः शिवाय'],
  sa: ['राधा राधा', 'राम राम', 'हरे कृष्ण', 'ॐ नमः शिवाय'],
  mai: ['राधा राधा', 'राम राम', 'हरे कृष्ण', 'ॐ नमः शिवाय']
};

const DEVOTIONAL_WORDS = {
  'radha': 'राधा',
  'radhe': 'राधे',
  'shyam': 'श्याम',
  'shyama': 'श्यामा',
  'krishna': 'कृष्ण',
  'krisna': 'कृष्ण',
  'ram': 'राम',
  'rama': 'राम',
  'hare': 'हरे',
  'hari': 'हरि',
  'shiva': 'शिव',
  'shiv': 'शिव',
  'namah': 'नमः',
  'shivaya': 'शिवाय',
  'hanuman': 'हनुमान',
  'sita': 'सीता',
  'ganesha': 'गणेश',
  'ganesh': 'गणेश',
  'durga': 'दुर्गा',
  'lakshmi': 'लक्ष्मी',
  'laxmi': 'लक्ष्मी',
  'narayana': 'नारायण',
  'narayan': 'नारायण',
  'om': 'ॐ'
};

const INDEPENDENT_VOWELS = {
  'aa': 'आ',
  'a': 'अ',
  'i': 'इ',
  'ee': 'ई',
  'u': 'उ',
  'oo': 'ऊ',
  'e': 'ए',
  'ai': 'ऐ',
  'o': 'ओ',
  'au': 'औ',
  'om': 'ॐ'
};

const DEPENDENT_MATRAS = {
  'aa': 'ा',
  'a': 'ा',
  'i': 'ि',
  'ee': 'ी',
  'u': 'ु',
  'oo': 'ू',
  'e': 'े',
  'ai': 'ै',
  'o': 'ो',
  'au': 'ौ',
  'am': 'ं',
  'ah': 'ः'
};

const CONSONANTS = {
  'ksh': 'क्ष',
  'dhy': 'ध्य',
  'kh': 'ख',
  'gh': 'घ',
  'ch': 'च',
  'jh': 'झ',
  'th': 'थ',
  'dh': 'ध',
  'ph': 'फ',
  'bh': 'भ',
  'sh': 'श',
  'gy': 'ज्ञ',
  'k': 'क',
  'g': 'ग',
  'j': 'ज',
  't': 'त',
  'd': 'द',
  'n': 'न',
  'p': 'प',
  'b': 'ब',
  'm': 'म',
  'y': 'य',
  'r': 'र',
  'l': 'ल',
  'v': 'व',
  's': 'स',
  'h': 'ह'
};

const transliterateToDevanagari = (str) => {
  if (!str) return '';
  let input = str.toLowerCase();
  
  let words = input.split(' ');
  let transWords = words.map(w => {
    if (!w) return '';
    if (DEVOTIONAL_WORDS[w]) return DEVOTIONAL_WORDS[w];
    
    let res = '';
    let i = 0;
    let lastWasConsonant = false;
    
    while (i < w.length) {
      const remaining = w.substring(i);
      
      // 1. Length 3 consonants
      if (remaining.startsWith('ksh') || remaining.startsWith('dhy')) {
        const key = remaining.substring(0, 3);
        res += CONSONANTS[key];
        i += 3;
        lastWasConsonant = true;
        continue;
      }
      
      // 2. Length 2 consonants
      if (remaining.startsWith('kh') || remaining.startsWith('gh') || 
          remaining.startsWith('ch') || remaining.startsWith('jh') || 
          remaining.startsWith('th') || remaining.startsWith('dh') || 
          remaining.startsWith('ph') || remaining.startsWith('bh') || 
          remaining.startsWith('sh') || remaining.startsWith('gy')) {
        const key = remaining.substring(0, 2);
        res += CONSONANTS[key];
        i += 2;
        lastWasConsonant = true;
        continue;
      }
      
      // 3. Length 2 vowels
      if (remaining.startsWith('aa') || remaining.startsWith('ee') || 
          remaining.startsWith('oo') || remaining.startsWith('ai') || 
          remaining.startsWith('au')) {
        const key = remaining.substring(0, 2);
        if (lastWasConsonant) {
          res += DEPENDENT_MATRAS[key] || '';
        } else {
          res += INDEPENDENT_VOWELS[key] || '';
        }
        i += 2;
        lastWasConsonant = false;
        continue;
      }

      // 4. Length 1 consonants
      const char1 = remaining[0];
      if (CONSONANTS[char1]) {
        res += CONSONANTS[char1];
        i += 1;
        lastWasConsonant = true;
        continue;
      }

      // 5. Length 1 vowels
      if (char1 === 'a' || char1 === 'i' || char1 === 'u' || char1 === 'e' || char1 === 'o') {
        if (lastWasConsonant) {
          res += DEPENDENT_MATRAS[char1] || '';
        } else {
          res += INDEPENDENT_VOWELS[char1] || '';
        }
        i += 1;
        lastWasConsonant = false;
        continue;
      }
      
      // Default: keep character as-is
      res += char1;
      i += 1;
      lastWasConsonant = false;
    }
    
    return res;
  });

  return transWords.join(' ');
};

const DEVANAGARI_ROWS = [
  ['ॐ', 'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
  ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'],
  ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'],
  ['प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व'],
  ['श', 'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ', 'श्र'],
  ['ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', '्', 'ं', 'ः']
];

const ENGLISH_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const LanguageSelector = ({ currentLang, onChange }) => {
  return (
    <select 
      value={currentLang} 
      onChange={(e) => onChange(e.target.value)} 
      className="lang-selector"
    >
      <option value="en">🇺🇸 English</option>
      <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
      <option value="sa">🇮🇳 संस्कृतम् (Sanskrit)</option>
      <option value="mai">🇮🇳 मैथिली (Maithili)</option>
    </select>
  );
};

const VirtualKeyboard = ({ language, onKeyPress, onClose }) => {
  const isDevanagari = language !== 'en';
  const rows = isDevanagari ? DEVANAGARI_ROWS : ENGLISH_ROWS;

  return (
    <div className="virtual-keyboard">
      <div className="vk-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.85rem', color: '#ffd700', fontWeight: 'bold' }}>
          ⌨️ {isDevanagari ? 'मैथिली/हिन्दी/संस्कृत कीबोर्ड (Virtual Keyboard)' : 'English Keyboard (Virtual Keyboard)'}
        </span>
        <button 
          type="button" 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: '#ff4b2b', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
        >
          ✕
        </button>
      </div>
      
      {rows.map((row, idx) => (
        <div key={idx} className="vk-row">
          {row.map(key => (
            <button
              key={key}
              type="button"
              className="vk-key"
              onClick={() => onKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      
      <div className="vk-row" style={{ marginTop: '5px' }}>
        <button type="button" className="vk-key special-key" onClick={() => onKeyPress('CLEAR')}>
          🗑️ Clear
        </button>
        <button type="button" className="vk-key space-key" onClick={() => onKeyPress('SPACE')}>
          Space
        </button>
        <button type="button" className="vk-key special-key" onClick={() => onKeyPress('BACKSPACE')}>
          🔙 Back
        </button>
      </div>
    </div>
  );
};

// Helper to convert File to Base64 Data URL
const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [language, setLanguage] = useState(() => localStorage.getItem('jaap_language') || 'en');
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [chantText, setChantText] = useState(() => {
    const savedLang = localStorage.getItem('jaap_language') || 'en';
    return STANDARD_CHANTS[savedLang] ? STANDARD_CHANTS[savedLang][0] : 'Radha Radha';
  });
  const [intervalSeconds, setIntervalSeconds] = useState(3);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);

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

  // Sync count in a ref to avoid stale closures in spawnText
  const countRef = useRef(count);
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const loadUserData = async (loggedInUser) => {
    try {
      // Load History from localStorage tied to the username
      const savedHist = localStorage.getItem(`jaap_history_${loggedInUser.username}`);
      setHistory(savedHist ? JSON.parse(savedHist) : []);

      // Load Backgrounds from IndexedDB
      const bgs = await getBackgrounds(loggedInUser.id);
      if (bgs && bgs.length > 0) {
        setBackgrounds(bgs);
      } else {
        setBackgrounds(INITIAL_BACKGROUNDS);
      }
    } catch (e) {
      console.error("Failed to load user data", e);
    }
  };

  const handleLanguageChange = (newLang) => {
    const prevLang = language;
    setLanguage(newLang);
    localStorage.setItem('jaap_language', newLang);
    
    // Try to map current chant text if it's one of the standard ones
    const standardListPrev = STANDARD_CHANTS[prevLang] || [];
    const index = standardListPrev.indexOf(chantText);
    if (index !== -1) {
      const standardListNew = STANDARD_CHANTS[newLang];
      if (standardListNew && standardListNew[index]) {
        setChantText(standardListNew[index]);
      }
    }
  };

  const handleChantTextChange = (value) => {
    if (language !== 'en') {
      const transliterated = transliterateToDevanagari(value);
      setChantText(transliterated);
    } else {
      setChantText(value);
    }
  };

  const handleVirtualKeyPress = (key) => {
    if (key === 'SPACE') {
      setChantText(prev => prev + ' ');
    } else if (key === 'BACKSPACE') {
      setChantText(prev => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setChantText('');
    } else {
      setChantText(prev => prev + key);
    }
  };

  const handleAuth = async () => {
    setAuthError('');
    const users = JSON.parse(localStorage.getItem('radha_users') || '[]');

    if (!loginUsername || !loginPassword) {
      setAuthError(TRANSLATIONS[language].errEmptyFields);
      return;
    }

    if (isLoginView) {
      // Login Logic
      const foundUser = users.find(u => u.username === loginUsername && u.password === loginPassword);
      if (foundUser) {
        setUser(foundUser);
        loadUserData(foundUser);
      } else {
        setAuthError(TRANSLATIONS[language].errInvalidCreds);
      }
    } else {
      // Register Logic
      const exists = users.find(u => u.username === loginUsername);
      if (exists) {
        setAuthError(TRANSLATIONS[language].errUserExists);
      } else {
        const newUser = { id: Date.now(), username: loginUsername, password: loginPassword };
        users.push(newUser);
        localStorage.setItem('radha_users', JSON.stringify(users));
        setUser(newUser);
        loadUserData(newUser);
      }
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
      try {
        // Clear previous backgrounds to "replace" them
        await clearBackgrounds(user.id);
        
        // Save new backgrounds to IndexedDB
        for (const file of files) {
          const dataUrl = await fileToDataUrl(file);
          await saveBackground(user.id, dataUrl);
        }

        // Reload UI
        await loadUserData(user);
        setBgIndex(0);
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

    // Pick spiritual and floral emojis
    const devEmojis = ['🙏', '🛕', '🪷', '🪔', '🕉️', '🔔'];
    const flowerEmojis = ['🌹', '🍃', '🌸', '🌺', '🌿'];
    const emoji = Math.random() > 0.5 
      ? devEmojis[Math.floor(Math.random() * devEmojis.length)] + ' ' + flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)]
      : devEmojis[Math.floor(Math.random() * devEmojis.length)];

    const prospectiveCount = countRef.current + 1;

    const newSpawn = {
      id,
      side,
      top: `${15 + Math.random() * 25}%`,
      text: chantText,
      spawnCount: prospectiveCount,
      emoji
    };
    setSpawns((prev) => [...prev, newSpawn]);

    setTimeout(() => {
      setCount((prev) => prev + 1);
      setSpawns((prevSpawns) => prevSpawns.filter(spawn => spawn.id !== id));
    }, 1500);
  }, [chantText]);

  const saveSession = useCallback(() => {
    if (count > 0 && user) {
      const newSession = {
        id: Date.now(),
        userName: user.username,
        jaapName: chantText || 'Radha Radha',
        count,
        date: new Date().toLocaleString()
      };
      const savedHist = JSON.parse(localStorage.getItem(`jaap_history_${user.username}`) || '[]');
      const newHistory = [newSession, ...savedHist];
      localStorage.setItem(`jaap_history_${user.username}`, JSON.stringify(newHistory));
      setHistory(newHistory);
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
          <div className="setup-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="setup-title" style={{ margin: 0 }}>
              {isLoginView ? TRANSLATIONS[language].loginTitle : TRANSLATIONS[language].registerTitle}
            </h2>
            <LanguageSelector currentLang={language} onChange={handleLanguageChange} />
          </div>
          
          <div className="input-group">
            <label>{TRANSLATIONS[language].username}</label>
            <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder={TRANSLATIONS[language].username} />
          </div>

          <div className="input-group">
            <label>{TRANSLATIONS[language].password}</label>
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder={TRANSLATIONS[language].password} />
          </div>

          {authError && <div style={{color: 'red', marginBottom: '15px'}}>{authError}</div>}

          <button className="btn btn-start setup-start-btn" onClick={handleAuth}>
            {isLoginView ? TRANSLATIONS[language].loginBtn : TRANSLATIONS[language].registerBtn}
          </button>
          
          <p style={{textAlign: 'center', marginTop: '15px', cursor: 'pointer', color: '#ffd700'}} onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? TRANSLATIONS[language].needAccount : TRANSLATIONS[language].haveAccount}
          </p>
        </div>
      </div>
    );
  }

  if (!isSetupComplete) {
    return (
      <div className="app-container setup-screen">
        <div className="background-container">
          <img src={backgrounds[0] || INITIAL_BACKGROUNDS[0]} alt="Background" className="bg-image active" style={{filter: 'brightness(0.2)'}} />
        </div>
        <div className="setup-modal">
          <div className="setup-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="setup-title" style={{ margin: 0 }}>{TRANSLATIONS[language].configureJaap}</h2>
            <LanguageSelector currentLang={language} onChange={handleLanguageChange} />
          </div>
          
          <div className="input-group">
            <label>{TRANSLATIONS[language].nameOfJaap}</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="text" 
                value={chantText} 
                onChange={(e) => handleChantTextChange(e.target.value)} 
                placeholder={TRANSLATIONS[language].egChant} 
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                className={`btn btn-secondary btn-sm ${showVirtualKeyboard ? 'active-kbd' : ''}`}
                style={{ padding: '12px 15px', borderRadius: '10px', fontSize: '1.2rem', minWidth: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                onClick={() => setShowVirtualKeyboard(prev => !prev)}
                title="Virtual Keyboard"
              >
                ⌨️
              </button>
            </div>
            
            {showVirtualKeyboard && (
              <VirtualKeyboard 
                language={language} 
                onKeyPress={handleVirtualKeyPress} 
                onClose={() => setShowVirtualKeyboard(false)} 
              />
            )}
            
            {/* Quick Chant Selection Pills */}
            <div className="chant-pills">
              {STANDARD_CHANTS[language]?.map((chant) => (
                <button
                  key={chant}
                  type="button"
                  className={`chant-pill ${chantText === chant ? 'active' : ''}`}
                  onClick={() => setChantText(chant)}
                >
                  {chant}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>{TRANSLATIONS[language].timingInterval}</label>
            <div className="timing-controls">
              <button className="timing-btn" onClick={() => setIntervalSeconds(prev => Math.max(1, prev - 1))}>-</button>
              <span className="timing-value">{intervalSeconds} {TRANSLATIONS[language].sec}</span>
              <button className="timing-btn" onClick={() => setIntervalSeconds(prev => prev + 1)}>+</button>
            </div>
          </div>

          <button className="btn btn-start setup-start-btn" onClick={() => setIsSetupComplete(true)}>
            {TRANSLATIONS[language].startDevotion}
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
              <div className="spawning-text-chant">{spawn.text}</div>
              <div className="spawning-text-count">
                <span className="count-number">#{spawn.spawnCount}</span>
                <span className="count-emoji">{spawn.emoji}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="ui-overlay" style={{ zoom: zoomLevel }}>
        <div className="top-bar">
          <div className="user-greeting">{TRANSLATIONS[language].greeting}, {user.username}</div>
          <div className="top-controls">
            <LanguageSelector currentLang={language} onChange={handleLanguageChange} />
            <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
            <button className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current.click()}>🖼️ {TRANSLATIONS[language].uploadBg}</button>
            <div className="zoom-controls">
              <button className="btn btn-secondary btn-sm" onClick={handleZoomOut}>-</button>
              <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
              <button className="btn btn-secondary btn-sm" onClick={handleZoomIn}>+</button>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowHistory(true)}>📜 {TRANSLATIONS[language].history}</button>
            <button className="btn btn-stop btn-sm" onClick={handleLogout}>🚪 {TRANSLATIONS[language].logout}</button>
          </div>
        </div>

        <div className="ui-bottom">
          <div className="controls-box">
            <button className="btn btn-primary" onClick={spawnText}>{TRANSLATIONS[language].manualChant}</button>
            <button className={`btn ${autoMode ? 'btn-stop' : 'btn-start'}`} onClick={() => setAutoMode(!autoMode)}>
              {autoMode 
                ? `${TRANSLATIONS[language].stopAuto} (${intervalSeconds}${TRANSLATIONS[language].sec})` 
                : `${TRANSLATIONS[language].startAuto} (${intervalSeconds}${TRANSLATIONS[language].sec})`}
            </button>
            <button className="btn btn-secondary" onClick={resetCount}>{TRANSLATIONS[language].resetCount}</button>
          </div>

          <div className={`counter-box ${bump ? 'bump' : ''}`}>
            <div className="counter-title">{TRANSLATIONS[language].chantCount}</div>
            <h1 className="counter-value">{count}</h1>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="history-modal-overlay">
          <div className="history-modal">
            <div className="history-header">
              <h2>{TRANSLATIONS[language].jaapHistory}</h2>
              <button className="close-btn" onClick={() => setShowHistory(false)}>✕</button>
            </div>
            
            <div className="history-list">
              {history.length === 0 ? (
                <p className="no-history">{TRANSLATIONS[language].noHistory}</p>
              ) : (
                history.map(item => (
                  <div key={item.id} className="history-card">
                    <div className="history-card-header">
                      <strong>👤 {item.userName}</strong>
                      <span className="history-date">{item.date}</span>
                    </div>
                    <div className="history-card-body">
                      {TRANSLATIONS[language].chanted} <span className="highlight">{item.jaapName}</span> - <strong>{item.count} {TRANSLATIONS[language].times}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>

            {history.length > 0 && (
              <button 
                className="btn btn-stop w-100" 
                style={{marginTop: '20px'}}
                onClick={() => { 
                  setHistory([]); 
                  localStorage.removeItem(`jaap_history_${user.username}`); 
                }}
              >
                {TRANSLATIONS[language].clearHistory}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
