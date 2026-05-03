import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getJourney } from '../services/api';
import { FiMap, FiExternalLink, FiClock, FiCheckCircle, FiCircle } from 'react-icons/fi';

/**
 * VotingJourney Component - Visualizes the user's progress through the election process.
 * Displays step-by-step milestones with statuses, resource links, and estimated times.
 * Implements accessible list structures and status-specific ARIA labels.
 * @returns {JSX.Element}
 */
export default function VotingJourney() {
  const { user } = useUser();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the user's personalized voting journey on mount.
   */
  useEffect(() => {
    const fetch = async () => {
      console.log('VotingJourney.jsx: fetch started');
      try {
        const { data } = await getJourney(user._id);
        if (data.success) {
          setJourney(data.data);
          console.log('VotingJourney.jsx: fetch succeeded');
        }
      } catch (e) {
        console.error('VotingJourney.jsx: fetch then', e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetch();
  }, [user]);

  if (loading) {
    return (
      <section className="glass-card p-6" aria-busy="true" aria-label="Loading your voting journey">
        <h2 className="section-title"><FiMap className="text-primary" aria-hidden="true" /> Your Voting Journey</h2>
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="loading-shimmer h-16 w-full" aria-hidden="true" />)}
        </div>
      </section>
    );
  }

  return (
    <section className="glass-card p-6" aria-labelledby="journey-title">
      <h2 id="journey-title" className="section-title">
        <FiMap className="text-primary" aria-hidden="true" /> Your Voting Journey
      </h2>
      {journey?.summary && (
        <p className="section-subtitle">{journey.summary}</p>
      )}

      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2" role="list">
        {journey?.steps?.map((step, i) => (
          <motion.li key={i}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            aria-label={`${step.completed ? 'Completed' : 'Pending'} Step ${step.number}: ${step.title}`}
            className={`flex gap-3 p-3 rounded-xl transition-all ${
              step.completed
                ? 'bg-secondary/5 border border-secondary/20'
                : 'bg-bg-elevated border border-border hover:border-primary/30'
            }`}>
            <div className="flex-shrink-0 mt-1" aria-hidden="true">
              {step.completed
                ? <FiCheckCircle className="text-secondary" size={18} />
                : <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary">{step.number}</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm ${step.completed ? 'text-secondary' : 'text-text-primary'}`}>
                {step.title}
              </h3>
              <p className="text-text-secondary text-xs mt-0.5 line-clamp-2">{step.description}</p>
              <div className="flex items-center gap-3 mt-1.5">
                {step.resource && (
                  <a href={step.resource} target="_blank" rel="noreferrer"
                    aria-label={`Visit official resource for ${step.title}`}
                    className="text-primary text-xs flex items-center gap-1 hover:underline">
                    <FiExternalLink size={10} aria-hidden="true" /> Visit
                  </a>
                )}
                {step.estimatedTime && (
                  <span className="text-text-muted text-xs flex items-center gap-1">
                    <FiClock size={10} aria-hidden="true" /> {step.estimatedTime}
                  </span>
                )}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      {journey?.nextAction && (
        <footer className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-sm text-primary-glow font-medium">
            <span aria-hidden="true">👉</span> Next Action: {journey.nextAction}
          </p>
        </footer>
      )}
    </section>
  );
}
