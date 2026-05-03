import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getChecklist, getJourney } from '../services/api';
import VotingJourney from '../components/VotingJourney';
import SmartChecklist from '../components/SmartChecklist';
import {
  FiCalendar, FiMapPin, FiArrowRight, FiTrendingUp, FiGlobe
} from 'react-icons/fi';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

/**
 * OverviewPage Component - Main user dashboard view.
 * Displays voting readiness score, journey progress, and quick access to all AI tools.
 * Implements high-performance data fetching and full accessibility compliance.
 * @returns {JSX.Element}
 */
export default function OverviewPage() {
  const { user } = useUser();
  const [score, setScore] = useState(0);
  const [checklistProgress, setChecklistProgress] = useState({ completed: 0, total: 0 });
  const [journeySteps, setJourneySteps] = useState(0);

  /**
   * Fetches checklist and journey data on component mount.
   * Updates local state with readiness percentage and step counts.
   */
  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, jRes] = await Promise.allSettled([
          getChecklist(user._id),
          getJourney(user._id),
        ]);
        if (cRes.status === 'fulfilled' && cRes.value.data.success) {
          const p = cRes.value.data.data.progress;
          setScore(p.percentage);
          setChecklistProgress({ completed: p.completed, total: p.total });
        }
        if (jRes.status === 'fulfilled' && jRes.value.data.success) {
          setJourneySteps(jRes.value.data.data.steps?.length || 0);
        }
      } catch (e) { console.error('Dashboard data load failed:', e); }
    };
    if (user) load();
  }, [user]);

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  /**
   * Synchronizes dashboard readiness score when checklist items are toggled.
   * @param {Object} newProgress - The updated progress object from SmartChecklist.
   */
  const handleChecklistUpdate = (newProgress) => {
    setScore(newProgress.percentage);
    setChecklistProgress({ completed: newProgress.completed, total: newProgress.total });
  };

  // Derive voter status — infer from readiness if user set "unknown"
  const rawStatus = user?.voterStatus;
  const derivedStatus = (rawStatus === 'unknown' || !rawStatus)
    ? (score >= 100 ? 'ready' : score >= 50 ? 'in_progress' : 'not_started')
    : rawStatus;

  const STATUS_MAP = {
    registered:     { label: 'Registered',      emoji: '✅', color: 'text-secondary' },
    applied:        { label: 'Applied',          emoji: '⏳', color: 'text-blue-500' },
    not_registered: { label: 'Not Registered',   emoji: '❌', color: 'text-red-500' },
    ready:          { label: 'Ready to Vote',    emoji: '🎉', color: 'text-secondary' },
    in_progress:    { label: 'In Progress',      emoji: '🔄', color: 'text-blue-500' },
    not_started:    { label: 'Getting Started',  emoji: '🚀', color: 'text-primary' },
  };
  const statusInfo = STATUS_MAP[derivedStatus] || STATUS_MAP.not_started;

  const quickLinks = [
    { to: '/dashboard/timeline', iconEmoji: '📅', label: 'Timeline', desc: 'View important election deadlines' },
    { to: '/dashboard/chat', iconEmoji: '🤖', label: 'AI Chat', desc: 'Ask anything about voting' },
    { to: '/dashboard/booth', iconEmoji: '📍', label: 'Booth Guide', desc: 'Find your polling station' },
    { to: '/dashboard/eci-map', iconEmoji: '🌐', label: 'ECI Map', desc: 'Explore state-wise election data' },
    { to: '/dashboard/parliament', iconEmoji: '🏛️', label: 'Parliament', desc: 'Lok Sabha & Rajya Sabha info' },
    { to: '/dashboard/scenarios', iconEmoji: '🎭', label: 'Scenarios', desc: 'Simulate voter situations' },
    { to: '/dashboard/quiz', iconEmoji: '🧠', label: 'Learn & Quiz', desc: 'Test election knowledge' },
    { to: '/dashboard/translator', iconEmoji: '🌐', label: 'Translate', desc: 'Convert text to 22 Indian languages' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome Banner */}
      <section aria-labelledby="welcome-title"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-bg-card to-secondary/10 border border-border p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" aria-hidden="true" />
        
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex-1">
            <p className="text-text-muted text-sm mb-1">Welcome back,</p>
            <h1 id="welcome-title" className="text-2xl lg:text-3xl font-bold mb-2">
              {user?.name} <span className="inline-block animate-bounce" aria-hidden="true">👋</span>
            </h1>
            <p className="text-text-secondary text-sm max-w-md">
              {user?.isFirstTimeVoter
                ? "Exciting! Your first election is a big milestone. Let's make sure you're fully prepared."
                : "Let's continue your voting preparation journey. Every step counts!"}
            </p>
            <div className="flex flex-wrap gap-2 mt-4" aria-label="User info summary">
              <span className="text-xs px-3 py-1 rounded-full bg-bg-elevated border border-border text-text-secondary">
                📍 {user?.state}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-bg-elevated border border-border text-text-secondary">
                🎂 Age {user?.age}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-bg-elevated border border-border text-text-secondary">
                {statusInfo.emoji} {statusInfo.label}
              </span>
              {user?.isFirstTimeVoter && (
                <span className="text-xs px-3 py-1 rounded-full bg-primary/15 border border-primary/20 text-primary">
                  🌟 First-Time Voter
                </span>
              )}
            </div>
          </div>

          {/* Score Ring */}
          <div className="flex flex-col items-center">
            <div className="progress-ring-container" 
                 role="progressbar" 
                 aria-valuenow={score} 
                 aria-valuemin="0" 
                 aria-valuemax="100" 
                 aria-label="Voter readiness score">
              <svg width="136" height="136" viewBox="0 0 136 136">
                <defs>
                  <linearGradient id="tricolorRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF9933" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#138808" />
                  </linearGradient>
                </defs>
                <circle cx="68" cy="68" r={radius} fill="none" className="progress-ring-bg" strokeWidth="7" />
                <motion.circle cx="68" cy="68" r={radius} fill="none"
                  stroke="url(#tricolorRing)" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                  className="progress-ring-fill" />
              </svg>
              <div className="absolute text-center" aria-hidden="true">
                <motion.span className="text-2xl font-bold gradient-text"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  {score}%
                </motion.span>
                <p className="text-text-muted text-[10px]">Readiness</p>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-2 flex items-center gap-1">
              <FiTrendingUp size={12} className="text-primary" aria-hidden="true" /> Voting Readiness
            </p>
          </div>
        </div>
      </section>

      {/* Status Summary Cards */}
      <section aria-label="Statistics summary" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card-static p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-xs">Journey Steps</p>
              <p className="text-2xl font-bold text-primary mt-1">{journeySteps}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <span className="text-lg">🗺️</span>
            </div>
          </div>
        </div>
        <div className="glass-card-static p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-xs">Tasks Done</p>
              <p className="text-2xl font-bold text-secondary mt-1">
                {checklistProgress.completed}<span className="text-text-muted text-sm" aria-label={`out of ${checklistProgress.total}`}>/{checklistProgress.total}</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center" aria-hidden="true">
              <span className="text-lg">✅</span>
            </div>
          </div>
        </div>
        <div className="glass-card-static p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-xs">Voter Status</p>
              <p className={`text-sm font-semibold mt-1 capitalize ${statusInfo.color}`}>
                {statusInfo.emoji} {statusInfo.label}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <span className="text-lg">🗳️</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== JOURNEY & CHECKLIST ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VotingJourney />
        <SmartChecklist onProgressChange={handleChecklistUpdate} />
      </div>

      {/* Quick Access Grid */}
      <section aria-labelledby="quick-access-title">
        <h2 id="quick-access-title" className="text-lg font-semibold mb-4 text-text-primary">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {quickLinks.map(({ to, iconEmoji, label, desc }) => (
            <Link key={to} to={to} aria-label={`Open ${label}: ${desc}`}>
              <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="glass-card p-4 group cursor-pointer h-full border border-border hover:border-primary/30 transition-all">
                <div className={`w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow`} aria-hidden="true">
                  <span className="text-lg">{iconEmoji}</span>
                </div>
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {label}
                </h3>
                <p className="text-xs text-text-muted mt-1">{desc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                  Open <FiArrowRight size={12} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
