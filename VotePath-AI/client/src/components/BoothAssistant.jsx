import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getBoothGuide } from '../services/api';
import { FiMapPin, FiSearch, FiExternalLink, FiNavigation } from 'react-icons/fi';

/**
 * BoothAssistant Component - Interactive tool to locate polling booths.
 * Features pincode/area-based search and provides comprehensive election day guidance.
 * Implements accessible form controls and real-time status updates via aria-live.
 * @returns {JSX.Element}
 */
export default function BoothAssistant() {
  const { user } = useUser();
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [area, setArea] = useState('');
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetches booth guidance data based on pincode and area.
   * Handles loading states and provides results to the UI.
   */
  const fetchGuide = async () => {
    console.log('BoothAssistant.jsx: fetchGuide started');
    if (!pincode.trim()) return;
    setLoading(true);
    try {
      const { data } = await getBoothGuide(user._id, pincode, area);
      if (data.success) {
        setGuide(data.data);
        console.log('BoothAssistant.jsx: fetchGuide succeeded');
      }
    } catch (e) {
      console.error('BoothAssistant.jsx: fetchGuide then', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-5 sm:p-6" role="region" aria-labelledby="finder-title">
      <h2 id="finder-title" className="text-base font-bold text-text-primary mb-1 flex items-center gap-2">
        <FiNavigation size={16} className="text-primary" aria-hidden="true" /> Booth Finder
      </h2>
      <p className="text-xs text-text-muted mb-4">Enter your pincode to get personalized booth guidance</p>

      {/* Search Row */}
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <div className="relative flex-1">
          <label htmlFor="pincode-input" className="sr-only">Enter Pincode</label>
          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={14} aria-hidden="true" />
          <input 
            id="pincode-input"
            type="text" 
            className="input-field w-full text-sm" 
            style={{ paddingLeft: '2.25rem' }}
            placeholder="Enter pincode (e.g. 400001)"
            value={pincode} 
            onChange={e => setPincode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchGuide()}
            aria-required="true"
          />
        </div>
        <div className="relative flex-1">
          <label htmlFor="area-input" className="sr-only">Area or Locality (Optional)</label>
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={14} aria-hidden="true" />
          <input 
            id="area-input"
            type="text" 
            className="input-field w-full text-sm" 
            style={{ paddingLeft: '2.25rem' }}
            placeholder="Area / Locality (optional)"
            value={area} 
            onChange={e => setArea(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchGuide()}
          />
        </div>
        <motion.button 
          onClick={fetchGuide} 
          disabled={loading || !pincode.trim()}
          whileTap={{ scale: 0.95 }}
          aria-label={loading ? 'Searching for booth details...' : 'Search for booth'}
          className="btn-primary px-6 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
          ) : (
            <>
              <FiSearch size={16} aria-hidden="true" /> 
              <span className="hidden sm:inline">Search</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Results */}
      <section aria-live="polite" aria-atomic="true">
        <AnimatePresence>
          {guide && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 max-h-[500px] overflow-y-auto pr-1">

              {/* How to find your booth */}
              <div className="p-4 rounded-xl bg-bg-elevated border border-border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-text-primary">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xs" aria-hidden="true">🔍</span>
                  How to Find Your Booth
                </h3>
                <ol className="space-y-2">
                  {guide.howToFind?.steps?.map((s, i) => (
                    <li key={i} className="text-xs text-text-secondary flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
                {guide.howToFind?.officialLink && (
                  <a href={guide.howToFind.officialLink} target="_blank" rel="noreferrer"
                    aria-label="Visit ECI Electoral Search (External Site)"
                    className="inline-flex items-center gap-1.5 text-xs text-primary mt-3 hover:underline px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors">
                    <FiExternalLink size={10} aria-hidden="true" /> Open Electoral Search Portal
                  </a>
                )}
              </div>

              {/* What to carry */}
              <div className="p-4 rounded-xl bg-bg-elevated border border-border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-text-primary">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xs" aria-hidden="true">📋</span>
                  What to Carry
                </h3>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Required documents">
                  {guide.whatToCarry?.map((item, i) => (
                    <span key={i} role="listitem" className="text-xs px-3 py-1.5 rounded-lg bg-primary/8 text-primary border border-primary/15 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* DOs and DON'Ts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                  <h4 className="text-sm font-semibold text-secondary mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-secondary/15 flex items-center justify-center text-xs" aria-hidden="true">✅</span>
                    DOs
                  </h4>
                  <ul className="space-y-1.5">
                    {guide.dos?.map((d, i) => (
                      <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                        <span className="text-secondary mt-0.5" aria-hidden="true">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <h4 className="text-sm font-semibold text-red-500 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-red-500/15 flex items-center justify-center text-xs" aria-hidden="true">❌</span>
                    DON'Ts
                  </h4>
                  <ul className="space-y-1.5">
                    {guide.donts?.map((d, i) => (
                      <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                        <span className="text-red-500 mt-0.5" aria-hidden="true">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Timing */}
              {guide.timing && (
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-center">
                  <p className="text-sm text-primary font-medium">🕐 Booth Timing: {guide.timing}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
