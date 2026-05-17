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
    errUserExists: "Username already exists",
    soundSettings: "Sound Settings",
    muteSound: "Mute",
    unmuteSound: "Unmute",
    soundType: "Sound Type",
    soundIntervalLabel: "Alert Interval",
    voiceChant: "Voice Chant (Jaap)",
    templeBell: "Temple Bell",
    bothSounds: "Both (Voice & Bell)",
    everyChant: "Every Chant",
    customInterval: "Custom Count",
    editChant: "Edit Jaap Name",
    saveSettings: "Apply & Close",
    keyboard: "Keyboard",
    soundSpeedLabel: "Chanting Speed"
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
    errUserExists: "उपयोगकर्ता नाम पहले से मौजूद है",
    soundSettings: "ध्वनि सेटिंग्स",
    muteSound: "मौन करें",
    unmuteSound: "ध्वनि चालू",
    soundType: "ध्वनि का प्रकार",
    soundIntervalLabel: "चेतावनी अंतराल",
    voiceChant: "वाणी जाप",
    templeBell: "मंदिर की घंटी",
    bothSounds: "दोनों (आवाज-घंटी)",
    everyChant: "हर जाप पर",
    customInterval: "कस्टम संख्या",
    editChant: "जाप नाम बदलें",
    saveSettings: "काबू और बंद करें",
    keyboard: "कीबोर्ड",
    soundSpeedLabel: "आवाज की गति"
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
    errUserExists: "प्रयोक्तृनाम पूर्वमेव विद्यते",
    soundSettings: "ध्वनि विन्यासः",
    muteSound: "मौनं करोतु",
    unmuteSound: "सशब्दं करोतु",
    soundType: "ध्वनिप्रकारः",
    soundIntervalLabel: "ध्वनि-अन्तरालः",
    voiceChant: "वाणीजापः",
    templeBell: "मन्दिरघण्टा",
    bothSounds: "उभयम्",
    everyChant: "प्रत्येकजापे",
    customInterval: "इच्छानुसारसंख्या",
    editChant: "जापनाम परिवर्तनम्",
    saveSettings: "पिदधातु",
    keyboard: "कुञ्जीपटल",
    soundSpeedLabel: "वाणीगतिः"
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
    errUserExists: "उपयोगकर्ता नाम पहले सँ मौजूद अछि",
    soundSettings: "ध्वनि सेटिंग्स",
    muteSound: "म्यूट करू",
    unmuteSound: "अनम्यूट करू",
    soundType: "ध्वनि क प्रकार",
    soundIntervalLabel: "ध्वनि अंतराल",
    voiceChant: "आवाज जाप",
    templeBell: "मंदिरक घंटी",
    bothSounds: "दुनू (आवाज आ घंटी)",
    everyChant: "हरेक जाप पर",
    customInterval: "मनपसन्द संख्या",
    editChant: "जाप क नाम बदलू",
    saveSettings: "लागू आ बंद करू",
    keyboard: "कीबोर्ड",
    soundSpeedLabel: "आवाजक गति"
  },
  bho: {
    loginTitle: "भक्ति में लॉगिन करीं",
    registerTitle: "खाता बनाईं",
    username: "उपयोगकर्ता के नाम",
    password: "पासवर्ड",
    loginBtn: "लॉगिन करीं",
    registerBtn: "रजिस्टर करीं",
    needAccount: "खाता नईखे? एहिजा रजिस्टर करीं",
    haveAccount: "पहले से खाता बा? लॉगिन करीं",
    configureJaap: "अपन जाप कॉन्फ़िगर करीं",
    nameOfJaap: "जाप के नाम",
    egChant: "जैसे: राधा राधा",
    timingInterval: "समय अंतराल",
    startDevotion: "भक्ति शुरू करीं",
    chantCount: "जाप संख्या",
    manualChant: "मैनुअल जाप",
    startAuto: "ऑटो शुरू करीं",
    stopAuto: "ऑटो रोकीं",
    resetCount: "संख्या रीसेट करीं",
    uploadBg: "बैकग्राउंड अपलोड करीं",
    history: "इतिहास",
    logout: "लॉगआउट करीं",
    jaapHistory: "जाप के इतिहास",
    noHistory: "कोनो इतिहास नईखे मिलल। अपन भक्ति शुरू करीं!",
    clearHistory: "इतिहास साफ़ करीं",
    chanted: "जाप कइलीं",
    times: "बेर",
    greeting: "प्रणाम",
    sec: "सेकंड",
    errEmptyFields: "कृपया उपयोगकर्ता नाम अउरी पासवर्ड दुनो दर्ज करीं",
    errInvalidCreds: "अमान्य क्रेडेंशियल",
    errUserExists: "उपयोगकर्ता नाम पहले से मौजूद बा",
    soundSettings: "ध्वनि सेटिंग्स",
    muteSound: "म्यूट करीं",
    unmuteSound: "अनम्यूट करीं",
    soundType: "ध्वनि के प्रकार",
    soundIntervalLabel: "ध्वनि अंतराल",
    voiceChant: "आवाज जाप",
    templeBell: "मंदिर के घंटी",
    bothSounds: "दुनो (आवाज अउरी घंटी)",
    everyChant: "हर जाप पर",
    customInterval: "मनपसंद संख्या",
    editChant: "जाप के नाम बदलीं",
    saveSettings: "लागू अउरी बंद करीं",
    keyboard: "कीबोर्ड",
    soundSpeedLabel: "आवाज के गति"
  }
};

const STANDARD_CHANTS = {
  en: ['Radha Radha', 'Ram Ram', 'Hare Krishna', 'Om Namah Shivaya'],
  hi: ['राधा राधा', 'राम राम', 'हरे कृष्ण', 'ॐ नमः शिवाय'],
  sa: ['राधा राधा', 'राम राम', 'हरे कृष्ण', 'ॐ नमः शिवाय'],
  mai: ['राधा राधा', 'राम राम', 'हरे कृष्ण', 'ॐ नमः शिवाय'],
  bho: ['राधा राधा', 'राम राम', 'हरे कृष्ण', 'ॐ नमः शिवाय']
};

const RAW_CHANTS = {
  'Radha Radha': 'radha radha',
  'राधा राधा': 'radha radha',
  'राम राम': 'ram ram',
  'Ram Ram': 'ram ram',
  'Hare Krishna': 'hare krishna',
  'हरे कृष्ण': 'hare krishna',
  'Om Namah Shivaya': 'om namah shivaya',
  'ॐ नमः शिवाय': 'om namah shivaya'
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
      <option value="bho">🇮🇳 भोजपुरी (Bhojpuri)</option>
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

// Global AudioContext cache to avoid reaching the browser limit (usually 6-50 contexts),
// which completely halts Web Audio playback after several manual chants.
let globalAudioContext = null;

// Helper to play temple bell sound using Web Audio API
const playTempleBell = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    if (!globalAudioContext) {
      globalAudioContext = new AudioContext();
    }
    
    // Resume context if suspended (common browser autoplay security restriction)
    if (globalAudioContext.state === 'suspended') {
      globalAudioContext.resume();
    }
    
    const ctx = globalAudioContext;
    const now = ctx.currentTime;
    
    // Fundamental frequency of a temple bell (E4 / 329.63Hz)
    const fund = 329.63;
    const partials = [1, 2, 3, 4.2, 5.4];
    const gains = [0.5, 0.25, 0.15, 0.1, 0.05];
    
    partials.forEach((mult, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fund * mult, now);
      
      // Decay envelope
      gainNode.gain.setValueAtTime(gains[i], now);
      // Exponential decay
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (3.0 / mult));
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 3.0);
    });
  } catch (error) {
    console.warn("Failed to play temple bell:", error);
  }
};

// Keep a global reference to prevent premature garbage collection of the active utterance in Chrome/Firefox,
// which is the primary cause of static pops, clipped endings, or truncated audio syllables.
if (typeof window !== 'undefined') {
  window.activeSpeechUtterances = window.activeSpeechUtterances || [];
}

// Helper to speak the chant using Web Speech API
const speakChant = (text, langCode = 'hi', speed = 0.8) => {
  try {
    if (!('speechSynthesis' in window)) return;
    
    // Clean up and optimize text for beautiful devotional pronunciation
    let cleanText = text.trim();
    
    // Replace abbreviated endings to full devotional words so the synthesizer pronounces them fully
    cleanText = cleanText.replace(/\bradh\b/gi, 'Radha');
    cleanText = cleanText.replace(/\bram\b/gi, 'Ram');
    cleanText = cleanText.replace(/\bkrishn\b/gi, 'Krishna');
    
    // Add a natural, graceful pause between repeated devotional words so they are pronounced fully and separately
    if (cleanText.toLowerCase().includes('radha radha')) {
      cleanText = cleanText.replace(/radha\s+radha/gi, 'Radha, Radha');
    } else if (cleanText.toLowerCase().includes('ram ram')) {
      cleanText = cleanText.replace(/ram\s+ram/gi, 'Ram, Ram');
    } else if (cleanText.toLowerCase().includes('krishna krishna')) {
      cleanText = cleanText.replace(/krishna\s+krishna/gi, 'Krishna, Krishna');
    } else if (cleanText.toLowerCase().includes('radhe radhe')) {
      cleanText = cleanText.replace(/radhe\s+radhe/gi, 'Radhe, Radhe');
    } else {
      // General duplicate word comma insert
      const words = cleanText.split(/\s+/);
      if (words.length === 2 && words[0].toLowerCase() === words[1].toLowerCase()) {
        cleanText = `${words[0]}, ${words[1]}`;
      }
    }
    
    // Map application language to speech BCP 47 language code
    const voiceLang = langCode === 'hi' ? 'hi-IN' : 
                      langCode === 'sa' ? 'hi-IN' : 
                      langCode === 'mai' ? 'hi-IN' :
                      langCode === 'bho' ? 'hi-IN' : 'en-US';
                      
    const voices = window.speechSynthesis.getVoices();
    const hasHindiVoice = voices.some(v => v.lang.startsWith('hi') || v.lang === 'hi-IN');
    
    // NATIVE DEVOTIONAL VOICE ENHANCEMENT WITH ACCENT FALLBACK:
    // If speaking in a Hindi-aligned voice AND the system actually has a Hindi voice pack,
    // convert the clean English text to Devanagari.
    // Otherwise, use English text to ensure standard OS fallback voice can read it beautifully without silence!
    let speakText = cleanText;
    let finalLang = voiceLang;
    
    if (voiceLang === 'hi-IN' && hasHindiVoice) {
      const devanagariMaps = {
        'radha, radha': 'राधा, राधा।',
        'radha radha': 'राधा, राधा।',
        'radhe, radhe': 'राधे, राधे।',
        'radhe radhe': 'राधे, राधे।',
        'ram, ram': 'राम, राम।',
        'ram ram': 'राम, राम।',
        'hare krishna': 'हरे कृष्ण।',
        'om namah shivaya': 'ॐ नमः शिवाय।'
      };
      
      const lower = cleanText.toLowerCase();
      if (devanagariMaps[lower]) {
        speakText = devanagariMaps[lower];
      } else {
        // Fallback: transliterate on the fly and add a trailing Devanagari full stop (।) for a smooth breath taper
        const devanagari = transliterateToDevanagari(cleanText);
        if (devanagari) {
          const devWords = devanagari.split(/\s+/);
          if (devWords.length === 2 && devWords[0] === devWords[1]) {
            speakText = `${devWords[0]}, ${devWords[1]}।`;
          } else {
            speakText = `${devanagari}।`;
          }
        }
      }
    } else {
      speakText = `${cleanText}.`;
      finalLang = 'en-US';
    }
    
    const utterance = new SpeechSynthesisUtterance(speakText);
    utterance.lang = finalLang;
    utterance.rate = speed; // Slower, highly realistic and devotional pacing
    utterance.pitch = 1.05; // Sweet, clear, warm devotional pitch
    utterance.volume = 1.0; // Enforce maximum volume
    
    // Find the premium voice
    let voice = null;
    if (finalLang === 'hi-IN') {
      // Prioritize Google Hindi, Microsoft Hemant (warm male), Kalpana (warm female), or high-quality local Hindi voices
      voice = voices.find(v => v.lang.startsWith('hi') && (v.name.includes('Google') || v.name.includes('Hemant') || v.name.includes('Kalpana') || v.name.includes('Natural')));
    } else {
      voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Zira') || v.name.includes('David')));
    }
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith(finalLang) || v.lang === finalLang);
    }
    if (voice) {
      utterance.voice = voice;
    }
    
    // Keep reference globally to completely prevent Chrome's premature garbage collection (and the resulting clipping pops)
    window.activeSpeechUtterances.push(utterance);
    
    utterance.onend = () => {
      window.activeSpeechUtterances = window.activeSpeechUtterances.filter(u => u !== utterance);
    };
    utterance.onerror = () => {
      window.activeSpeechUtterances = window.activeSpeechUtterances.filter(u => u !== utterance);
    };
    
    // Cancel any current speaking, then trigger with a tiny 60ms delay
    window.speechSynthesis.cancel();
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 60);
  } catch (error) {
    console.warn("Failed to speak chant:", error);
  }
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
  const [chantTextRaw, setChantTextRaw] = useState(() => {
    const savedLang = localStorage.getItem('jaap_language') || 'en';
    const initialChant = STANDARD_CHANTS[savedLang] ? STANDARD_CHANTS[savedLang][0] : 'Radha Radha';
    return RAW_CHANTS[initialChant] || 'radha radha';
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

  // Sound and Chant configuration states
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('jaap_sound_muted') === 'true');
  const [soundType, setSoundType] = useState(() => localStorage.getItem('jaap_sound_type') || 'voice');
  const [soundInterval, setSoundInterval] = useState(() => {
    const saved = localStorage.getItem('jaap_sound_interval');
    if (!saved) return 'every';
    return isNaN(Number(saved)) ? saved : Number(saved);
  });
  const [customSoundInterval, setCustomSoundInterval] = useState(() => Number(localStorage.getItem('jaap_custom_sound_interval')) || 10);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [soundSpeed, setSoundSpeed] = useState(() => {
    const saved = localStorage.getItem('jaap_sound_speed');
    return saved ? parseFloat(saved) : 0.8;
  });

  useEffect(() => {
    localStorage.setItem('jaap_sound_speed', soundSpeed.toString());
  }, [soundSpeed]);

  useEffect(() => {
    localStorage.setItem('jaap_sound_muted', isMuted);
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('jaap_sound_type', soundType);
  }, [soundType]);

  useEffect(() => {
    localStorage.setItem('jaap_sound_interval', soundInterval);
  }, [soundInterval]);

  useEffect(() => {
    localStorage.setItem('jaap_custom_sound_interval', customSoundInterval);
  }, [customSoundInterval]);

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
        const nextChant = standardListNew[index];
        setChantText(nextChant);
        setChantTextRaw(RAW_CHANTS[nextChant] || nextChant.toLowerCase());
      }
    }
  };

  const handleChantTextChange = (value) => {
    if (language === 'en') {
      setChantText(value);
      setChantTextRaw(value);
      return;
    }

    if (value === '') {
      setChantText('');
      setChantTextRaw('');
      return;
    }

    // Check if the input is purely Latin (e.g. copy-pasted or completely rewritten)
    const isPureLatin = /^[a-zA-Z\s]*$/.test(value);
    if (isPureLatin) {
      setChantTextRaw(value);
      setChantText(transliterateToDevanagari(value));
      return;
    }

    // Otherwise, calculate character-by-character delta
    if (value.length > chantText.length) {
      const addedChar = value[value.length - 1];
      const newRaw = chantTextRaw + addedChar;
      setChantTextRaw(newRaw);
      setChantText(transliterateToDevanagari(newRaw));
    } else if (value.length < chantText.length) {
      const newRaw = chantTextRaw.slice(0, -1);
      setChantTextRaw(newRaw);
      setChantText(transliterateToDevanagari(newRaw));
    }
  };

  const handleVirtualKeyPress = (key) => {
    if (key === 'SPACE') {
      setChantText(prev => prev + ' ');
      setChantTextRaw(prev => prev + ' ');
    } else if (key === 'BACKSPACE') {
      setChantText(prev => prev.slice(0, -1));
      setChantTextRaw(prev => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setChantText('');
      setChantTextRaw('');
    } else {
      setChantText(prev => prev + key);
      setChantTextRaw(prev => prev + key);
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

    // Play Sound if not muted
    if (!isMuted) {
      let shouldPlay = false;
      if (soundInterval === 'every') {
        shouldPlay = true;
      } else if (typeof soundInterval === 'number') {
        shouldPlay = prospectiveCount % soundInterval === 0;
      } else if (soundInterval === 'custom') {
        shouldPlay = prospectiveCount % customSoundInterval === 0;
      }

      if (shouldPlay) {
        if (soundType === 'bell' || soundType === 'both') {
          playTempleBell();
        }
        if (soundType === 'voice' || soundType === 'both') {
          speakChant(chantText, language, soundSpeed);
        }
      }
    }

    setTimeout(() => {
      setCount((prev) => prev + 1);
      setSpawns((prevSpawns) => prevSpawns.filter(spawn => spawn.id !== id));
    }, 1500);
  }, [chantText, isMuted, soundInterval, customSoundInterval, soundType, language]);

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
    setChantTextRaw('radha radha');
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

  // Prevent screen sleep on all devices (mobile, iOS, desktop) as long as the page is open and visible
  useEffect(() => {
    let wakeLock = null;

    const requestLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
          console.log('Global Screen Wake Lock acquired successfully.');
        }
      } catch (err) {
        console.warn('Failed to acquire global Wake Lock:', err);
      }
    };

    const releaseLock = async () => {
      try {
        if (wakeLock !== null) {
          await wakeLock.release();
          wakeLock = null;
          console.log('Global Screen Wake Lock released.');
        }
      } catch (err) {
        console.warn('Failed to release global Wake Lock:', err);
      }
    };

    // Acquire lock immediately on mount
    requestLock();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestLock();
      } else {
        releaseLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      releaseLock();
    };
  }, []);

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
                  onClick={() => {
                    setChantText(chant);
                    setChantTextRaw(RAW_CHANTS[chant] || chant.toLowerCase());
                  }}
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
          <div className="user-greeting">{chantText || TRANSLATIONS[language].greeting}, {user.username}</div>
          <div className="top-controls">
            <LanguageSelector currentLang={language} onChange={handleLanguageChange} />
            <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
            <button className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current.click()}>🖼️ {TRANSLATIONS[language].uploadBg}</button>
            <div className="zoom-controls">
              <button className="btn btn-secondary btn-sm" onClick={handleZoomOut}>-</button>
              <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
              <button className="btn btn-secondary btn-sm" onClick={handleZoomIn}>+</button>
            </div>
            <button 
              className={`btn btn-secondary btn-sm sound-quick-toggle ${isMuted ? 'muted' : 'unmuted'}`}
              onClick={() => setIsMuted(prev => !prev)}
              title={isMuted ? TRANSLATIONS[language].unmuteSound : TRANSLATIONS[language].muteSound}
              style={{ padding: '8px 12px', fontSize: '1rem' }}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowSoundModal(true)}>⚙️ {TRANSLATIONS[language].soundSettings}</button>
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

      {showSoundModal && (
        <div className="history-modal-overlay">
          <div className="history-modal sound-settings-modal">
            <div className="history-header">
              <h2>🔊 {TRANSLATIONS[language].soundSettings}</h2>
              <button className="close-btn" onClick={() => setShowSoundModal(false)}>✕</button>
            </div>
            
            <div className="history-list" style={{ overflowY: 'auto', gap: '20px', paddingRight: '5px' }}>
              {/* Chant Name Custom Editor */}
              <div className="input-group" style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: 'bold', color: '#ffd700' }}>{TRANSLATIONS[language].editChant}</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
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
                    style={{ padding: '0 15px', borderRadius: '10px', fontSize: '1.2rem', minWidth: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                    onClick={() => setShowVirtualKeyboard(prev => !prev)}
                    title={TRANSLATIONS[language].keyboard}
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

                {/* Quick Selection Pills */}
                <div className="chant-pills" style={{ marginTop: '10px' }}>
                  {STANDARD_CHANTS[language]?.map((chant) => (
                    <button
                      key={chant}
                      type="button"
                      className={`chant-pill ${chantText === chant ? 'active' : ''}`}
                      onClick={() => {
                        setChantText(chant);
                        setChantTextRaw(RAW_CHANTS[chant] || chant.toLowerCase());
                      }}
                    >
                      {chant}
                    </button>
                  ))}
                </div>
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '5px 0' }} />

              {/* Mute Toggle */}
              <div className="sound-setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>🔈 {isMuted ? TRANSLATIONS[language].unmuteSound : TRANSLATIONS[language].muteSound}</span>
                <button 
                  className={`btn ${isMuted ? 'btn-stop' : 'btn-start'} btn-sm`} 
                  onClick={() => setIsMuted(prev => !prev)}
                  style={{ minWidth: '120px' }}
                >
                  {isMuted ? '🔇 Muted' : '🔊 Active'}
                </button>
              </div>

              {/* Sound Type Selection */}
              <div className="sound-setting-block">
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#ffd700' }}>🎵 {TRANSLATIONS[language].soundType}</label>
                <div className="sound-type-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {[
                    { id: 'voice', label: TRANSLATIONS[language].voiceChant },
                    { id: 'bell', label: TRANSLATIONS[language].templeBell },
                    { id: 'both', label: TRANSLATIONS[language].bothSounds }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      className={`chant-pill ${soundType === item.id ? 'active' : ''}`}
                      style={{ flex: '1 1 calc(50% - 10px)', textAlign: 'center', padding: '10px' }}
                      onClick={() => setSoundType(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chanting Speed Control */}
              {soundType !== 'bell' && (
                <div className="sound-setting-block">
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#ffd700' }}>⚡ {TRANSLATIONS[language].soundSpeedLabel}: {soundSpeed.toFixed(2)}x</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.9rem', color: '#aaa' }}>🐌 Slow</span>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1.5" 
                      step="0.05" 
                      value={soundSpeed} 
                      onChange={(e) => setSoundSpeed(parseFloat(e.target.value))} 
                      style={{ flex: 1, accentColor: '#ffd700', cursor: 'pointer', height: '6px', borderRadius: '3px' }}
                    />
                    <span style={{ fontSize: '0.9rem', color: '#aaa' }}>⚡ Fast</span>
                  </div>
                  {/* Quick speed pills */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    {[0.6, 0.8, 1.0, 1.2].map(speed => (
                      <button
                        key={speed}
                        type="button"
                        className={`chant-pill ${soundSpeed === speed ? 'active' : ''}`}
                        style={{ padding: '6px 12px', fontSize: '0.85rem', flex: 1, textAlign: 'center' }}
                        onClick={() => setSoundSpeed(speed)}
                      >
                        {speed.toFixed(1)}x
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Alert Interval */}
              <div className="sound-setting-block">
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#ffd700' }}>⏰ {TRANSLATIONS[language].soundIntervalLabel}</label>
                <div className="sound-type-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {[
                    { id: 'every', label: TRANSLATIONS[language].everyChant },
                    { id: 11, label: '11 Chants' },
                    { id: 21, label: '21 Chants' },
                    { id: 108, label: '108 Chants (1 Mala)' },
                    { id: 'custom', label: TRANSLATIONS[language].customInterval }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      className={`chant-pill ${soundInterval === item.id ? 'active' : ''}`}
                      style={{ flex: '1 1 auto', textAlign: 'center', padding: '8px 12px' }}
                      onClick={() => setSoundInterval(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {soundInterval === 'custom' && (
                  <div className="input-group" style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Enter custom chant interval (e.g. every 5, 50, etc.):</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={customSoundInterval} 
                      onChange={(e) => setCustomSoundInterval(Math.max(1, parseInt(e.target.value) || 1))} 
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <button 
              className="btn btn-primary w-100" 
              style={{ marginTop: '20px' }}
              onClick={() => setShowSoundModal(false)}
            >
              ✅ {TRANSLATIONS[language].saveSettings}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
