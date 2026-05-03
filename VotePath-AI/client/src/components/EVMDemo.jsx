import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample candidate data (realistic Indian election format)
const CANDIDATES = [
  { id: 1, name: 'Rajesh Kumar', party: 'Bharatiya Jan Sewa Party', symbol: '🌻', color: '#FF9933' },
  { id: 2, name: 'Priya Sharma', party: 'Rashtriya Lok Morcha', symbol: '🌿', color: '#138808' },
  { id: 3, name: 'Amit Singh', party: 'Janta Kalyan Dal', symbol: '⭐', color: '#3B82F6' },
  { id: 4, name: 'Fatima Begum', party: 'Independent', symbol: '🏠', color: '#8B5CF6' },
  { id: 5, name: 'Suresh Yadav', party: 'Samajik Nyay Party', symbol: '🔔', color: '#EF4444' },
  { id: 6, name: 'NOTA', party: 'None of the Above', symbol: '✖️', color: '#6B7280' },
];

/**
 * EVMDemo Component - Interactive simulation of an Electronic Voting Machine.
 * Guides users through the voting process, from selecting a candidate to VVPAT verification.
 * Implements strict accessibility with aria-live updates, keyboard support, and semantic status indicators.
 * @returns {JSX.Element}
 */
export default function EVMDemo() {
  const [step, setStep] = useState('intro'); // intro | voting | vvpat | done
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [vvpatVisible, setVvpatVisible] = useState(false);
  const [vvpatTimer, setVvpatTimer] = useState(7);
  const [pressedButton, setPressedButton] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  /**
   * Simulates the casting of a vote on the EVM.
   * Triggers LED light, beep simulation, and transitions to VVPAT verification.
   * @param {Object} candidate - The selected candidate object.
   */
  const handleVote = (candidate) => {
    setPressedButton(candidate.id);
    setSelectedCandidate(candidate);

    // LED light + beep simulation
    setTimeout(() => {
      setStep('vvpat');
      setVvpatVisible(true);

      // VVPAT countdown (7 seconds as per ECI rules)
      let count = 7;
      setVvpatTimer(count);
      const interval = setInterval(() => {
        count--;
        setVvpatTimer(count);
        if (count <= 0) {
          clearInterval(interval);
          setVvpatVisible(false);
          setStep('done');
        }
      }, 1000);
    }, 800);
  };

  /** Resets the EVM simulation to the initial state. */
  const resetDemo = () => {
    setStep('intro');
    setSelectedCandidate(null);
    setVvpatVisible(false);
    setVvpatTimer(7);
    setPressedButton(null);
    setShowInstructions(true);
  };

  const stepOrder = ['intro', 'voting', 'vvpat', 'done'];

  return (
    <section className="glass-card p-5 sm:p-6" aria-labelledby="evm-demo-title">
      <div className="flex items-center justify-between mb-1">
        <h2 id="evm-demo-title" className="text-base font-bold text-text-primary flex items-center gap-2">
          <span aria-hidden="true">🖥️</span> Interactive EVM Demo
        </h2>
        {step !== 'intro' && (
          <button onClick={resetDemo}
            aria-label="Reset EVM simulation"
            className="text-xs text-primary hover:underline font-medium px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all">
            🔄 Try Again
          </button>
        )}
      </div>
      <p className="text-xs text-text-muted mb-5">Practice using the Electronic Voting Machine before election day</p>

      {/* ── STEP INDICATOR ── */}
      <nav className="flex items-center gap-2 mb-5" aria-label="Simulation progress">
        {stepOrder.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div 
              aria-current={step === s ? 'step' : undefined}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === s ? 'bg-primary text-white shadow-md shadow-primary/30' :
              stepOrder.indexOf(step) > i ? 'bg-primary/20 text-primary' :
              'bg-bg-elevated text-text-muted border border-border'
            }`}>
              <span className="sr-only">Step {i + 1}:</span>
              {i + 1}
            </div>
            {i < 3 && <div className={`w-6 sm:w-10 h-0.5 rounded-full transition-all ${
              stepOrder.indexOf(step) > i ? 'bg-primary/40' : 'bg-border'
            }`} aria-hidden="true" />}
          </div>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        {/* ── INTRO SCREEN ── */}
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="text-center py-6">
              <div className="text-5xl mb-4" aria-hidden="true">🗳️</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Welcome to EVM Practice</h3>
              <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
                This is a simulation of India's <strong>Electronic Voting Machine (EVM)</strong> used in all elections.
              </p>

              {showInstructions && (
                <div className="max-w-sm mx-auto text-left space-y-2 mb-6" role="list" aria-label="EVM Instructions">
                  {[
                    'Look at the Ballot Unit with candidate names',
                    'Press the BLUE button next to your candidate',
                    'A light will glow and a beep will sound',
                    'Check the VVPAT slip (visible for 7 seconds)',
                    'Your vote is recorded securely!'
                  ].map((text, i) => (
                    <div key={i} role="listitem" className="flex items-start gap-2 text-xs text-text-secondary">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold" aria-hidden="true">{i + 1}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setStep('voting'); setShowInstructions(false); }}
                className="px-6 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-md shadow-primary/25 hover:shadow-lg transition-all">
                Start EVM Demo →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── VOTING SCREEN ── */}
        {step === 'voting' && (
          <motion.div key="voting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* LEFT: Ballot Unit */}
            <div className="rounded-2xl border-2 border-border bg-bg-elevated/50 overflow-hidden" role="group" aria-label="Ballot Unit">
              <div className="bg-bg-elevated px-4 py-2.5 border-b border-border flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Ballot Unit</span>
                <span className="text-[10px] text-text-muted" aria-label="Constituency Number">Demo-001</span>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-0 px-3 py-2 text-[10px] text-text-muted font-semibold uppercase border-b border-border/50" aria-hidden="true">
                <span className="w-8 text-center">S.No</span>
                <span className="px-2">Candidate</span>
                <span className="w-10 text-center">Symbol</span>
                <span className="w-14 text-center">Action</span>
              </div>

              {/* Candidate list */}
              <div className="divide-y divide-border/30" role="list">
                {CANDIDATES.map((c, i) => (
                  <motion.div key={c.id}
                    role="listitem"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`grid grid-cols-[auto_1fr_auto_auto] gap-0 items-center px-3 py-2.5 transition-all ${
                      pressedButton === c.id ? 'bg-primary/10' : 'hover:bg-bg-elevated'
                    }`}>
                    <span className="w-8 text-center text-xs font-bold text-text-muted" aria-hidden="true">{i + 1}</span>
                    <div className="px-2">
                      <p className="text-sm font-semibold text-text-primary leading-tight">{c.name}</p>
                      <p className="text-[10px] text-text-muted">{c.party}</p>
                    </div>
                    <span className="w-10 text-center text-xl" aria-hidden="true">{c.symbol}</span>
                    <div className="w-14 flex justify-center">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleVote(c)}
                        disabled={pressedButton !== null}
                        aria-label={`Vote for ${c.name}, ${c.party}`}
                        className={`w-10 h-8 rounded-lg text-xs font-bold transition-all ${
                          pressedButton === c.id
                            ? 'bg-green-500 text-white shadow-md shadow-green-500/30'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed'
                        }`}>
                        {pressedButton === c.id ? '✓' : 'VOTE'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT: Control Unit */}
            <div className="rounded-2xl border-2 border-border bg-bg-elevated/50 overflow-hidden" role="group" aria-label="Control Unit">
              <div className="bg-bg-elevated px-4 py-2.5 border-b border-border">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Control Unit</span>
              </div>

              <div className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]" aria-live="polite">
                <div className={`w-5 h-5 rounded-full mb-4 transition-all duration-300 ${
                  pressedButton ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' : 'bg-red-500/30'
                }`} aria-hidden="true" />

                <div className="text-4xl mb-3" aria-hidden="true">
                  {pressedButton ? '🔔' : '🗳️'}
                </div>

                <p className="text-sm font-semibold text-text-primary text-center mb-1">
                  {pressedButton ? 'Vote Registered!' : 'Ready to Record'}
                </p>
                <p className="text-xs text-text-muted text-center">
                  {pressedButton
                    ? 'A beep sound confirms your vote is recorded'
                    : 'Press a BLUE button on the Ballot Unit to cast your vote'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── VVPAT VERIFICATION ── */}
        {step === 'vvpat' && selectedCandidate && (
          <motion.div key="vvpat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center py-6" role="status" aria-label="VVPAT Verification">
            <h3 className="text-base font-bold text-text-primary mb-1">📃 VVPAT Verification</h3>
            <p className="text-xs text-text-muted mb-4">Verify your printed slip — visible for {vvpatTimer}s</p>

            <motion.div
              initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              aria-label={`Printed VVPAT slip showing vote for ${selectedCandidate.name} with symbol ${selectedCandidate.symbol}`}
              className="w-56 bg-white rounded-xl border-2 border-dashed border-gray-300 p-5 shadow-lg relative overflow-hidden">
              <div className="text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2" aria-hidden="true">VVPAT Slip</p>
                <div className="text-3xl mb-2" aria-hidden="true">{selectedCandidate.symbol}</div>
                <p className="text-sm font-bold text-gray-800">{selectedCandidate.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{selectedCandidate.party}</p>
              </div>
            </motion.div>
            <div className="mt-4 flex items-center gap-2" aria-hidden="true">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs text-text-muted">Slip will drop in {vvpatTimer}s</p>
            </div>
          </motion.div>
        )}

        {/* ── DONE SCREEN ── */}
        {step === 'done' && selectedCandidate && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="text-center py-8" role="status" aria-label="Voting session complete">
            <div className="text-5xl mb-4" aria-hidden="true">🎉</div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Vote Cast Successfully!</h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto mb-2">
              You voted for <strong>{selectedCandidate.name}</strong> ({selectedCandidate.party})
            </p>
            <button onClick={resetDemo}
              className="mt-4 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl shadow-md shadow-primary/25 hover:shadow-lg transition-all">
              🔁 Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
