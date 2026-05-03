import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGlobe, FiArrowRight, FiCopy, FiCheck, FiVolume2, FiSend, FiRotateCcw, FiArrowDown, FiRepeat
} from 'react-icons/fi';
import { translateText } from '../services/api';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const LANGUAGES = [
  { code: 'hi', name: 'हिन्दी', nameEn: 'Hindi', speechCode: 'hi-IN' },
  { code: 'bn', name: 'বাংলা', nameEn: 'Bengali', speechCode: 'bn-IN' },
  { code: 'te', name: 'తెలుగు', nameEn: 'Telugu', speechCode: 'te-IN' },
  { code: 'mr', name: 'मराठी', nameEn: 'Marathi', speechCode: 'mr-IN' },
  { code: 'ta', name: 'தமிழ்', nameEn: 'Tamil', speechCode: 'ta-IN' },
  { code: 'gu', name: 'ગુજરાતી', nameEn: 'Gujarati', speechCode: 'gu-IN' },
  { code: 'kn', name: 'ಕನ್ನಡ', nameEn: 'Kannada', speechCode: 'kn-IN' },
  { code: 'ml', name: 'മലയാളം', nameEn: 'Malayalam', speechCode: 'ml-IN' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', nameEn: 'Punjabi', speechCode: 'pa-IN' },
  { code: 'or', name: 'ଓଡ଼ିଆ', nameEn: 'Odia', speechCode: 'or-IN' },
  { code: 'ur', name: 'اردو', nameEn: 'Urdu', speechCode: 'ur-PK' },
  { code: 'en', name: 'English', nameEn: 'English', speechCode: 'en-US' },
];

const QUICK_PHRASES = [
  'Where is my polling booth?',
  'What documents do I need to vote?',
  'How to register as a voter?',
  'What is NOTA?',
  'How does EVM work?',
  'When is the election date?',
  'How to check voter ID status?',
  'What is VVPAT?',
  'Can I vote without Voter ID card?',
  'What is the age limit for voting?',
];

/**
 * TranslatorPage Component - Multi-language translation portal for electoral information.
 * Supports translation into 11 Indian languages, text-to-speech, and translation history.
 * Implements high-standard accessibility including live regions and semantic focus management.
 * @returns {JSX.Element}
 */
export default function TranslatorPage() {
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const textareaRef = useRef(null);

  const selectedSource = LANGUAGES.find(l => l.code === sourceLang);
  const selectedTarget = LANGUAGES.find(l => l.code === targetLang);

  // ── Pre-load browser voices on mount ──
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  /**
   * Executes the translation request via backend API and updates history.
   */
  const handleTranslate = async () => {
    console.log('TranslatorPage.jsx: handleTranslate started');
    try {
      if (!inputText.trim()) return;
      if (sourceLang === targetLang) {
        setError('Source and target languages must be different.');
        return;
      }
      setError('');
      setIsTranslating(true);
      setTranslatedText('');

      // Use backend translation service (Google Cloud Translation API)
      const res = await translateText(inputText.trim(), selectedTarget.nameEn, targetLang);
      
      if (res.data.success) {
        const result = res.data.data.translatedText;
        setTranslatedText(result);
        setHistory(prev => [
          { input: inputText.trim(), output: result, sourceLang, targetLang, lang: selectedTarget.nameEn, langCode: targetLang },
          ...prev.slice(0, 9),
        ]);
        console.log('TranslatorPage.jsx: handleTranslate succeeded');
      } else {
        throw new Error(res.data.error || 'Translation failed');
      }
    } catch (err) {
      console.error('TranslatorPage.jsx: handleTranslate then', err);
      setError(err.response?.data?.error || err.message || 'Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  /**
   * Swaps the source and target languages and moves translation to input.
   */
  const handleSwapLangs = () => {
    console.log('TranslatorPage.jsx: handleSwapLangs started');
    try {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
      if (translatedText) {
        setInputText(translatedText);
        setTranslatedText('');
      }
      console.log('TranslatorPage.jsx: handleSwapLangs succeeded');
    } catch (e) {
      console.error('TranslatorPage.jsx: handleSwapLangs then', e);
    }
  };

  /**
   * Copies text to clipboard with feedback.
   * @param {string} text 
   */
  const handleCopy = (text) => {
    console.log('TranslatorPage.jsx: handleCopy started');
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      console.log('TranslatorPage.jsx: handleCopy succeeded');
    } catch (e) {
      console.error('TranslatorPage.jsx: handleCopy then', e);
    }
  };

  /**
   * Performs Text-to-Speech using the best available browser voice for the language.
   * @param {string} text - Text to speak.
   * @param {string} langCode - ISO language code.
   */
  const handleSpeak = (text, langCode) => {
    console.log('TranslatorPage.jsx: handleSpeak started');
    try {
      if (!('speechSynthesis' in window) || !text) return;

      window.speechSynthesis.cancel();

      const langInfo = LANGUAGES.find(l => l.code === langCode);
      const speechCode = langInfo?.speechCode || 'en-US';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechCode;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      const allVoices = window.speechSynthesis.getVoices();
      let bestVoice = allVoices.find(v => v.lang === speechCode) || 
                  allVoices.find(v => v.lang.startsWith(langCode)) ||
                  allVoices.find(v => v.name.toLowerCase().includes('google') && v.lang.startsWith(langCode));

      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      }

      setIsSpeaking(true);
      const safetyMs = Math.max(text.length * 120, 8000);
      const timer = setTimeout(() => {
        setIsSpeaking(false);
        window.speechSynthesis.cancel();
      }, safetyMs);

      utterance.onend = () => { clearTimeout(timer); setIsSpeaking(false); };
      utterance.onerror = () => { clearTimeout(timer); setIsSpeaking(false); };

      window.speechSynthesis.speak(utterance);
      console.log('TranslatorPage.jsx: handleSpeak succeeded');
    } catch (e) {
      console.error('TranslatorPage.jsx: handleSpeak then', e);
      setIsSpeaking(false);
    }
  };

  /**
   * Populates input with a quick phrase.
   * @param {string} phrase 
   */
  const handleQuickPhrase = (phrase) => {
    console.log('TranslatorPage.jsx: handleQuickPhrase started');
    try {
      setInputText(phrase);
      setSourceLang('en');
      textareaRef.current?.focus();
      console.log('TranslatorPage.jsx: handleQuickPhrase succeeded');
    } catch (e) {
      console.error('TranslatorPage.jsx: handleQuickPhrase then', e);
    }
  };

  /**
   * Resets the translation interface.
   */
  const handleClear = () => {
    console.log('TranslatorPage.jsx: handleClear started');
    try {
      setInputText('');
      setTranslatedText('');
      setError('');
      textareaRef.current?.focus();
      console.log('TranslatorPage.jsx: handleClear succeeded');
    } catch (e) {
      console.error('TranslatorPage.jsx: handleClear then', e);
    }
  };

  /**
   * Handles keyboard shortcuts for translation.
   */
  const handleKeyDown = (e) => {
    console.log('TranslatorPage.jsx: handleKeyDown started');
    try {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleTranslate();
      }
      console.log('TranslatorPage.jsx: handleKeyDown succeeded');
    } catch (e) {
      console.error('TranslatorPage.jsx: handleKeyDown then', e);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6" role="main" id="main-content">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-bg-elevated flex items-center justify-center shadow-lg shadow-primary/20" aria-hidden="true">
            <FiGlobe size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Election Translator</h1>
            <p className="text-xs text-text-muted">Translate any text into 11 Indian languages instantly</p>
          </div>
        </div>
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="text-[10px] px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium border border-secondary/20">
            ⚡ Secure Backend API
          </span>
          <span className="text-[10px] px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
            🗣️ Text-to-Speech
          </span>
        </div>
      </header>

      {/* Language Selector Row */}
      <section className="glass-card p-5" aria-label="Language Selection">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Source Language */}
          <div className="flex-1 w-full">
            <p id="from-lang-label" className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-2">Translate From</p>
            <nav className="flex flex-wrap gap-1.5" role="list" aria-labelledby="from-lang-label">
              {LANGUAGES.map((lang) => (
                <button
                  key={`src-${lang.code}`}
                  role="listitem"
                  aria-pressed={sourceLang === lang.code}
                  onClick={() => setSourceLang(lang.code)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sourceLang === lang.code
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-bg-elevated text-text-secondary hover:text-text-primary border border-border/50'
                  }`}>
                  {lang.nameEn}
                </button>
              ))}
            </nav>
          </div>

          {/* Swap Button */}
          <button
            aria-label="Swap source and target languages"
            onClick={handleSwapLangs}
            className="p-2.5 rounded-xl bg-bg-elevated border border-border hover:border-primary/30 hover:bg-primary/5 text-text-muted hover:text-primary transition-all self-center flex-shrink-0">
            <FiRepeat size={16} aria-hidden="true" />
          </button>

          {/* Target Language */}
          <div className="flex-1 w-full">
            <p id="to-lang-label" className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-2">Translate To</p>
            <nav className="flex flex-wrap gap-1.5" role="list" aria-labelledby="to-lang-label">
              {LANGUAGES.map((lang) => (
                <button
                  key={`tgt-${lang.code}`}
                  role="listitem"
                  aria-pressed={targetLang === lang.code}
                  onClick={() => setTargetLang(lang.code)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    targetLang === lang.code
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-bg-elevated text-text-secondary hover:text-text-primary border border-border/50'
                  }`}>
                  {lang.nameEn}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Translation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Section */}
        <section className="glass-card p-5 flex flex-col" aria-labelledby="input-label">
          <div className="flex items-center justify-between mb-3">
            <span id="input-label" className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              📝 Input ({selectedSource?.nameEn})
            </span>
            <span className="text-[10px] text-text-muted" aria-label={`${inputText.length} of 1000 characters`}>{inputText.length}/1000</span>
          </div>

          <label htmlFor="translation-input" className="sr-only">Enter text to translate</label>
          <textarea
            id="translation-input"
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
            onKeyDown={handleKeyDown}
            placeholder="Type or paste any text here... (Press Enter to translate)"
            rows={5}
            dir={sourceLang === 'ur' ? 'rtl' : 'ltr'}
            className="input-field text-sm resize-none flex-1 min-h-[140px]"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-3 gap-2">
            <div className="flex items-center gap-2">
              <button onClick={handleClear}
                aria-label="Clear input text"
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary px-3 py-2 rounded-lg hover:bg-bg-elevated transition-all">
                <FiRotateCcw size={12} aria-hidden="true" /> Clear
              </button>
              {inputText.trim() && (
                <button
                  onClick={() => handleSpeak(inputText, sourceLang)}
                  aria-label="Listen to original text"
                  className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all">
                  <FiVolume2 size={13} aria-hidden="true" /> Listen
                </button>
              )}
            </div>

            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating || sourceLang === targetLang}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl shadow-md shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all w-full sm:w-auto">
              {isTranslating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Translating...
                </>
              ) : (
                <>
                  <FiSend size={14} aria-hidden="true" /> Translate
                </>
              )}
            </button>
          </div>
        </section>

        {/* Output Section */}
        <section className="glass-card p-5 flex flex-col" aria-labelledby="output-label">
          <div className="flex items-center justify-between mb-3">
            <span id="output-label" className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              🌐 Translation ({selectedTarget?.nameEn})
            </span>
            {translatedText && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSpeak(translatedText, targetLang)}
                  disabled={isSpeaking}
                  aria-label="Listen to translated text"
                  className={`p-2 rounded-lg transition-all border border-border ${
                    isSpeaking
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-bg-elevated hover:bg-primary/10 text-text-muted hover:text-primary'
                  }`}>
                  <FiVolume2 size={14} className={isSpeaking ? 'animate-pulse' : ''} aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleCopy(translatedText)}
                  aria-label="Copy translation to clipboard"
                  className="p-2 rounded-lg bg-bg-elevated hover:bg-primary/10 text-text-muted hover:text-primary transition-all border border-border">
                  {copied ? <FiCheck size={14} className="text-green-500" aria-hidden="true" /> : <FiCopy size={14} aria-hidden="true" />}
                </button>
              </div>
            )}
          </div>

          <div 
            aria-live="polite" 
            aria-atomic="true"
            className={`flex-1 min-h-[140px] rounded-xl p-4 ${
              translatedText ? 'bg-bg-elevated border border-border' : 'bg-bg-elevated/50 border border-dashed border-border/50'
            }`} dir={targetLang === 'ur' ? 'rtl' : 'ltr'}>
            <AnimatePresence mode="wait">
              {isTranslating ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full py-8">
                  <div className="flex gap-1.5 mb-3" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-xs text-text-muted">Translating to {selectedTarget?.nameEn}...</p>
                </motion.div>
              ) : translatedText ? (
                <motion.article key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-lg leading-relaxed text-text-primary font-medium">
                    {translatedText}
                  </p>
                </motion.article>
              ) : error ? (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full py-8">
                  <span className="text-2xl mb-2" aria-hidden="true">⚠️</span>
                  <p className="text-xs text-accent text-center" role="alert">{error}</p>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <span className="text-3xl mb-2 opacity-40" aria-hidden="true">🌐</span>
                  <p className="text-xs text-text-muted">Translation will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Quick Election Phrases */}
      <section className="glass-card p-5" aria-labelledby="quick-phrases-label">
        <h3 id="quick-phrases-label" className="text-sm font-semibold text-text-primary mb-3">⚡ Quick Election Phrases</h3>
        <nav className="flex flex-wrap gap-2" role="list">
          {QUICK_PHRASES.map((phrase) => (
            <button
              key={phrase}
              role="listitem"
              onClick={() => handleQuickPhrase(phrase)}
              aria-label={`Use phrase: ${phrase}`}
              className={`px-3 py-2 rounded-xl text-xs transition-all ${
                inputText === phrase
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                  : 'bg-bg-elevated text-text-secondary hover:text-text-primary border border-border hover:border-primary/20'
              }`}>
              {phrase}
            </button>
          ))}
        </nav>
      </section>

      {/* History */}
      {history.length > 0 && (
        <section className="glass-card p-5" aria-labelledby="history-label">
          <div className="flex items-center justify-between mb-3">
            <h3 id="history-label" className="text-sm font-semibold text-text-primary">📜 Recent Translations</h3>
            <button onClick={() => setHistory([])} className="text-[10px] text-text-muted hover:text-primary">Clear History</button>
          </div>
          <div className="space-y-2" role="list">
            {history.map((h, i) => (
              <article key={i} role="listitem" className="p-3 rounded-xl bg-bg-elevated border border-border/50 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-muted truncate">{h.input}</p>
                    <div className="flex items-center gap-1.5 my-1" aria-hidden="true">
                      <FiArrowDown size={10} className="text-primary" />
                      <span className="text-[10px] text-primary font-medium">{h.lang}</span>
                    </div>
                    <p className="text-sm text-text-primary font-medium" dir={h.langCode === 'ur' ? 'rtl' : 'ltr'}>{h.output}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Info Note */}
      <footer className="p-4 rounded-xl bg-primary/5 border border-primary/15">
        <p className="text-xs text-text-secondary leading-relaxed">
          <span className="font-semibold text-primary">🌐 Google Cloud Translation:</span> Secure, high-quality translations powered by Google Cloud via our protected backend.
          Text-to-Speech depends on browser capabilities. For best results, use Chrome or Edge.
        </p>
      </footer>
    </motion.div>
  );
}
