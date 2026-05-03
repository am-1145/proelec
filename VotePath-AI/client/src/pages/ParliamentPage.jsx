import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi';

// Parliament data
const LOK_SABHA = {
  totalSeats: 543,
  electedSeats: 543,
  term: '5 years',
  speaker: 'Speaker of Lok Sabha',
  minimumAge: 25,
  quorum: '1/10th of total members',
  sessions: ['Budget Session (Feb–May)', 'Monsoon Session (Jul–Aug)', 'Winter Session (Nov–Dec)'],
};

const RAJYA_SABHA = {
  totalSeats: 245,
  elected: 233,
  nominated: 12,
  term: '6 years (1/3 retire every 2 years)',
  chairman: 'Vice President of India',
  minimumAge: 30,
  quorum: '1/10th of total members',
};

const STATE_SEATS = [
  { state: 'Uttar Pradesh', ls: 80, rs: 31 },
  { state: 'Maharashtra', ls: 48, rs: 19 },
  { state: 'West Bengal', ls: 42, rs: 16 },
  { state: 'Tamil Nadu', ls: 39, rs: 18 },
  { state: 'Bihar', ls: 40, rs: 16 },
  { state: 'Madhya Pradesh', ls: 29, rs: 11 },
  { state: 'Karnataka', ls: 28, rs: 12 },
  { state: 'Gujarat', ls: 26, rs: 11 },
  { state: 'Andhra Pradesh', ls: 25, rs: 11 },
  { state: 'Rajasthan', ls: 25, rs: 10 },
  { state: 'Odisha', ls: 21, rs: 10 },
  { state: 'Kerala', ls: 20, rs: 9 },
  { state: 'Telangana', ls: 17, rs: 7 },
  { state: 'Jharkhand', ls: 14, rs: 6 },
  { state: 'Assam', ls: 14, rs: 7 },
  { state: 'Punjab', ls: 13, rs: 7 },
  { state: 'Chhattisgarh', ls: 11, rs: 5 },
  { state: 'Haryana', ls: 10, rs: 5 },
];

const HOW_PARLIAMENT_WORKS = [
  {
    title: 'What is Parliament?',
    content: 'The Parliament of India is the supreme legislative body consisting of two Houses — Lok Sabha (House of the People) and Rajya Sabha (Council of States), along with the President of India.',
  },
  {
    title: 'How are Laws Made?',
    content: 'A Bill can be introduced in either House. It goes through three readings, committee scrutiny, and debate. Once passed by both Houses, it goes to the President for assent. Money Bills can only be introduced in Lok Sabha.',
  },
  {
    title: 'Who can Become an MP?',
    content: 'For Lok Sabha: Indian citizen, minimum 25 years old, registered voter. For Rajya Sabha: Indian citizen, minimum 30 years old. Disqualifications include holding an office of profit, unsound mind, or being an undischarged insolvent.',
  },
  {
    title: 'Key Parliamentary Officials',
    content: 'Speaker of Lok Sabha presides over the lower house. Vice President of India is the ex-officio Chairman of Rajya Sabha. The Prime Minister is the leader of the majority party in Lok Sabha.',
  },
  {
    title: 'Parliamentary Sessions',
    content: 'Parliament meets in three sessions annually: Budget Session (Feb–May), Monsoon Session (Jul–Aug), and Winter Session (Nov–Dec). The President can summon, prorogue, or dissolve sessions.',
  },
  {
    title: 'Parliamentary Privileges',
    content: 'MPs enjoy freedom of speech in Parliament, immunity from court proceedings for statements made in the House, and the right to access information for legislative duties.',
  },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };


/**
 * AccordionItem Component - Collapsible section for parliamentary information.
 * Features ARIA attributes for expanded states and keyboard accessibility.
 * @param {Object} props
 * @param {Object} props.item - The FAQ item containing title and content.
 * @param {boolean} props.isOpen - Whether the accordion is expanded.
 * @param {Function} props.onToggle - Callback to toggle the accordion state.
 * @returns {JSX.Element}
 */
function AccordionItem({ item: faqItem, isOpen, onToggle }) {
  const id = `accordion-${faqItem.title.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button 
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={id}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-elevated/50 transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none">
        <span className="text-sm font-semibold text-text-primary">{faqItem.title}</span>
        {isOpen ? <FiChevronUp size={16} className="text-primary" aria-hidden="true" /> : <FiChevronDown size={16} className="text-text-muted" aria-hidden="true" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            id={id}
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            role="region">
            <div className="px-4 pb-4">
              <p className="text-sm text-text-secondary leading-relaxed">{faqItem.content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * ParliamentPage Component - Educational guide to India's legislative Houses.
 * Features comparative data between Lok Sabha and Rajya Sabha, seat distributions, and FAQs.
 * Implements accessible tabs, accordions, and semantic tables for high-standard accessibility.
 * @returns {JSX.Element}
 */
export default function ParliamentPage() {
  const [activeTab, setActiveTab] = useState('lok-sabha');
  const [openFaq, setOpenFaq] = useState(0);
  const [showAllStates, setShowAllStates] = useState(false);

  const displayedStates = showAllStates ? STATE_SEATS : STATE_SEATS.slice(0, 10);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6" role="main" id="main-content">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-bg-elevated flex items-center justify-center shadow-lg shadow-primary/20" aria-hidden="true">
          <span className="text-xl">🏛️</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Parliament of India</h1>
          <p className="text-xs text-text-muted">Understanding India's legislative system</p>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex rounded-xl bg-bg-elevated p-1 max-w-md" role="tablist" aria-label="Parliamentary Houses">
        {[
          { key: 'lok-sabha', label: 'Lok Sabha', seats: '543' },
          { key: 'rajya-sabha', label: 'Rajya Sabha', seats: '245' },
        ].map(tab => (
          <button key={tab.key} 
            role="tab"
            aria-selected={activeTab === tab.key}
            aria-controls={`${tab.key}-panel`}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeTab === tab.key
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-text-muted hover:text-text-primary'
              }`}>
            {tab.label} <span className="ml-1 opacity-70">({tab.seats})</span>
          </button>
        ))}
      </nav>

      {/* House Info Cards */}
      <section aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          {activeTab === 'lok-sabha' ? (
            <motion.div 
              key="lok-sabha" 
              id="lok-sabha-panel"
              role="tabpanel"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lok Sabha Overview */}
              <article className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-xl" aria-hidden="true">👥</div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">Lok Sabha</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">House of the People</span>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-border/30 mb-2" aria-hidden="true">
                  <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl font-bold text-primary/40">
                    Hemicycle View
                  </div>
                </div>
                <p className="text-center text-xs text-text-muted font-medium mb-2">{LOK_SABHA.totalSeats} Total Seats</p>

                <div className="mt-5 space-y-2.5" role="list">
                  {[
                    { label: 'Total Seats', value: LOK_SABHA.totalSeats },
                    { label: 'Term', value: LOK_SABHA.term },
                    { label: 'Minimum Age', value: `${LOK_SABHA.minimumAge} years` },
                    { label: 'Presiding Officer', value: LOK_SABHA.speaker },
                    { label: 'Quorum', value: LOK_SABHA.quorum },
                  ].map((row, i) => (
                    <div key={i} role="listitem" className="flex justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-text-muted">{row.label}</span>
                      <span className="text-sm font-medium text-text-primary">{row.value}</span>
                    </div>
                  ))}
                </div>
              </article>

              {/* Sessions */}
              <article className="glass-card p-6">
                <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
                  <FiClock className="text-primary" aria-hidden="true" /> Parliamentary Sessions
                </h3>
                <div className="space-y-3" role="list">
                  {LOK_SABHA.sessions.map((session, i) => {
                    const icons = ['🌸', '🌧️', '❄️'];
                    return (
                      <div key={i} role="listitem" className="p-3.5 rounded-xl bg-bg-elevated border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base" aria-hidden="true">{icons[i]}</span>
                          <h4 className="text-sm font-semibold text-text-primary">{session}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </motion.div>
          ) : (
            <motion.div 
              key="rajya-sabha" 
              id="rajya-sabha-panel"
              role="tabpanel"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rajya Sabha Overview */}
              <article className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center text-xl" aria-hidden="true">🏛️</div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">Rajya Sabha</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-medium">Council of States</span>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-border/30 mb-2" aria-hidden="true">
                  <div className="w-full h-40 bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center text-3xl font-bold text-secondary/40">
                    Hemicycle View
                  </div>
                </div>
                <p className="text-center text-xs text-text-muted font-medium mb-2">{RAJYA_SABHA.totalSeats} Total Seats</p>

                <div className="mt-5 space-y-2.5" role="list">
                  {[
                    { label: 'Total Seats', value: RAJYA_SABHA.totalSeats },
                    { label: 'Elected Members', value: RAJYA_SABHA.elected },
                    { label: 'Nominated by President', value: RAJYA_SABHA.nominated },
                    { label: 'Term', value: RAJYA_SABHA.term },
                    { label: 'Minimum Age', value: `${RAJYA_SABHA.minimumAge} years` },
                    { label: 'Chairman', value: RAJYA_SABHA.chairman },
                  ].map((row, i) => (
                    <div key={i} role="listitem" className="flex justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-text-muted">{row.label}</span>
                      <span className="text-sm font-medium text-text-primary">{row.value}</span>
                    </div>
                  ))}
                </div>
              </article>

              {/* Rajya Sabha Key Features */}
              <article className="glass-card p-6">
                <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
                  <FiInfo className="text-secondary" aria-hidden="true" /> Key Features
                </h3>
                <div className="space-y-3" role="list">
                  {[
                    { title: 'Permanent Body', desc: 'Rajya Sabha is never fully dissolved. 1/3rd members retire every 2 years.', icon: '♾️' },
                    { title: 'State Representation', desc: 'Members are elected by state legislative assemblies via proportional representation.', icon: '🗺️' },
                    { title: 'Special Powers', desc: 'Can create new All India Services (Art. 312).', icon: '⚖️' },
                    { title: 'No Money Bills', desc: 'Cannot introduce or reject Money Bills.', icon: '💰' },
                  ].map((feature, i) => (
                    <div key={i} role="listitem" className="p-3.5 rounded-xl bg-bg-elevated border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base" aria-hidden="true">{feature.icon}</span>
                        <h4 className="text-sm font-semibold text-text-primary">{feature.title}</h4>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed pl-7">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </article>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* State-wise Seat Distribution */}
      <section className="glass-card p-6" aria-labelledby="distribution-title">
        <h3 id="distribution-title" className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
          📊 State-wise Seat Distribution (Top States)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Parliamentary seat distribution by state</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="text-left py-2.5 text-text-muted font-medium text-xs">State</th>
                <th scope="col" className="text-center py-2.5 text-text-muted font-medium text-xs">Lok Sabha</th>
                <th scope="col" className="text-center py-2.5 text-text-muted font-medium text-xs">Rajya Sabha</th>
                <th scope="col" className="text-center py-2.5 text-text-muted font-medium text-xs">Total</th>
              </tr>
            </thead>
            <tbody>
              {displayedStates.map((s, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-bg-elevated/50 transition-colors">
                  <td className="py-2.5 text-text-primary font-medium">{s.state}</td>
                  <td className="py-2.5 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">{s.ls}</span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">{s.rs}</span>
                  </td>
                  <td className="py-2.5 text-center text-text-secondary font-semibold">{s.ls + s.rs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => setShowAllStates(!showAllStates)}
          aria-label={showAllStates ? 'Show fewer states' : `Show all ${STATE_SEATS.length} states`}
          className="mt-3 text-xs text-primary hover:underline flex items-center gap-1 mx-auto focus-visible:ring-2 focus-visible:ring-primary outline-none rounded">
          {showAllStates ? 'Show Less' : `Show All ${STATE_SEATS.length} States`}
          {showAllStates ? <FiChevronUp size={12} aria-hidden="true" /> : <FiChevronDown size={12} aria-hidden="true" />}
        </button>
      </section>

      {/* How Parliament Works — FAQ */}
      <section aria-labelledby="faq-title">
        <h3 id="faq-title" className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
          <FiInfo className="text-primary" aria-hidden="true" /> How Parliament Works
        </h3>
        <div className="space-y-2" role="list">
          {HOW_PARLIAMENT_WORKS.map((faq, i) => (
            <div key={i} role="listitem">
              <AccordionItem item={faq} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer Link */}
      <footer className="text-center pb-4">
        <a href="https://sansad.in" target="_blank" rel="noreferrer"
          aria-label="Visit the official Sansad.in portal for more parliament information (External site)"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          Visit sansad.in for Official Parliament Info <FiExternalLink size={14} aria-hidden="true" />
        </a>
      </footer>
    </motion.div>
  );
}
    </motion.div>
  );
}
