import { motion } from 'framer-motion';
import BoothAssistant from '../components/BoothAssistant';
import EVMDemo from '../components/EVMDemo';
import { FiMapPin, FiExternalLink, FiPhone } from 'react-icons/fi';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const QUICK_FACTS = [
  { icon: '🕐', label: 'Polling Hours', value: '7:00 AM – 6:00 PM' },
  { icon: '📄', label: 'Required ID', value: 'Voter ID / Aadhaar' },
  { icon: '📱', label: 'EVM + VVPAT', value: 'Electronic Voting' },
  { icon: '🆓', label: 'Entry Fee', value: 'Free for All' },
];

const BOOTH_ETIQUETTE = [
  { icon: '🔇', title: 'Stay Silent', desc: 'No political discussions or sloganeering inside 100m of the booth.' },
  { icon: '📵', title: 'No Phones', desc: 'Mobile phones are not allowed inside the voting compartment.' },
  { icon: '👤', title: 'Go Alone', desc: 'Enter the voting compartment alone. No companions allowed.' },
  { icon: '🖊️', title: 'Press Once', desc: 'Press the EVM button only once for your chosen candidate.' },
  { icon: '📃', title: 'Check VVPAT', desc: 'Verify your vote on the VVPAT slip displayed for 7 seconds.' },
  { icon: '🚶', title: 'Exit Promptly', desc: 'Leave the booth area immediately after casting your vote.' },
];

/**
 * BoothPage Component - Comprehensive guide for the polling booth experience.
 * Provides location lookup assistance, EVM demos, and step-by-step voting etiquette.
 * Implements strict accessibility standards including semantic lists and ARIA landmarks.
 * @returns {JSX.Element}
 */
export default function BoothPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6" role="main" id="main-content">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-bg-elevated flex items-center justify-center shadow-lg shadow-primary/20" aria-hidden="true">
            <FiMapPin size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Booth Guide</h1>
            <p className="text-xs text-text-muted">Find your polling station & know what to expect on election day</p>
          </div>
        </div>
        <nav className="flex items-center gap-2" aria-label="Booth resources">
          <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noreferrer"
            aria-label="Open official ECI Electoral Search portal in a new tab"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all">
            <FiExternalLink size={12} aria-hidden="true" /> Electoral Search
          </a>
          <a href="tel:1950"
            aria-label="Call ECI Voter Helpline at 1950"
            className="inline-flex items-center gap-1.5 text-xs text-secondary hover:underline px-3 py-1.5 rounded-lg border border-secondary/20 hover:bg-secondary/5 transition-all">
            <FiPhone size={12} aria-hidden="true" /> Helpline 1950
          </a>
        </nav>
      </header>

      {/* Quick Facts */}
      <section aria-label="Key polling booth facts" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_FACTS.map((fact, i) => (
          <div key={i} className="glass-card-static p-4 text-center">
            <span className="text-2xl block mb-1" aria-hidden="true">{fact.icon}</span>
            <p className="text-sm font-bold text-text-primary">{fact.value}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{fact.label}</p>
          </div>
        ))}
      </section>

      {/* Booth Assistant — Main */}
      <section aria-labelledby="assistant-title">
        <h2 id="assistant-title" className="sr-only">Polling Booth Locator</h2>
        <BoothAssistant />
      </section>

      {/* Interactive EVM Demo */}
      <section aria-labelledby="evm-title">
        <h2 id="evm-title" className="sr-only">Interactive EVM Simulation</h2>
        <EVMDemo />
      </section>

      {/* Booth Etiquette Grid */}
      <section className="glass-card p-5 sm:p-6" aria-labelledby="etiquette-title">
        <h2 id="etiquette-title" className="text-base font-bold text-text-primary mb-1 flex items-center gap-2">
          📋 Polling Booth Etiquette
        </h2>
        <p className="text-xs text-text-muted mb-4">Rules and best practices for election day</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="list">
          {BOOTH_ETIQUETTE.map((rule, i) => (
            <motion.div key={i}
              role="listitem"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="p-3 rounded-xl bg-bg-elevated border border-border hover:border-primary/20 transition-all group">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{rule.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                    {rule.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Voting Process Steps */}
      <section className="glass-card p-5 sm:p-6" aria-labelledby="process-title">
        <h2 id="process-title" className="text-base font-bold text-text-primary mb-1 flex items-center gap-2">
          🗳️ Voting Process — Step by Step
        </h2>
        <p className="text-xs text-text-muted mb-4">What happens when you arrive at the polling booth</p>

        <ol className="space-y-3" role="list">
          {[
            { step: 1, title: 'Queue & Entry', desc: 'Join the queue at your assigned booth. Officials verify the queue order.' },
            { step: 2, title: 'Identity Verification', desc: 'Show your Voter ID (EPIC) or alternative photo ID to the presiding officer.' },
            { step: 3, title: 'Ink Application', desc: 'Indelible ink is applied to your left index finger to prevent duplicate voting.' },
            { step: 4, title: 'Slip & Proceed', desc: 'Receive a voter slip and proceed to the EVM voting compartment.' },
            { step: 5, title: 'Cast Your Vote', desc: 'Press the button next to your chosen candidate on the EVM. Check the VVPAT slip.' },
            { step: 6, title: 'Exit & Done', desc: 'Leave the booth area. Congratulations — you\'ve exercised your democratic right!' },
          ].map((s, i) => (
            <motion.li key={i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="flex items-start gap-3 group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i === 4 ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-bg-elevated border border-border text-text-muted group-hover:border-primary/30 group-hover:text-primary'
              } transition-all`} aria-hidden="true">
                {s.step}
              </div>
              <div className="flex-1 pb-3 border-b border-border/50 last:border-b-0">
                <h4 className="text-sm font-semibold text-text-primary">{s.title}</h4>
                <p className="text-xs text-text-muted mt-0.5">{s.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* Important Note */}
      <footer className="p-4 rounded-xl bg-primary/5 border border-primary/15" role="complementary">
        <p className="text-xs text-text-secondary leading-relaxed">
          <span className="font-semibold text-primary">ℹ️ Note:</span> Booth details are generated based on ECI guidelines. 
          For the most accurate booth location, use the official{' '}
          <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noreferrer" className="text-primary underline hover:text-primary-glow">
            Electoral Search Portal
          </a>
          {' '}or contact the ECI helpline at{' '}
          <a href="tel:1950" className="text-primary underline hover:text-primary-glow">1950</a>.
        </p>
      </footer>
    </motion.div>
  );
}
