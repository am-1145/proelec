import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getChecklist, updateChecklistItem } from '../services/api';
import toast from 'react-hot-toast';
import { FiCheckSquare, FiSquare, FiCheck } from 'react-icons/fi';

/**
 * SmartChecklist Component - Personalized voting task tracker.
 * Displays a list of required steps for the user and updates readiness score.
 * Features keyboard navigation, ARIA checkbox roles, and semantic progress tracking.
 * @param {Object} props
 * @param {Function} props.onProgressChange - Callback when progress updates.
 * @returns {JSX.Element}
 */
export default function SmartChecklist({ onProgressChange }) {
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the user's personalized checklist on mount.
   */
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getChecklist(user._id);
        if (data.success) {
          setItems(data.data.items);
          setProgress(data.data.progress);
        }
      } catch (e) {
        console.error('Checklist load failed:', e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetch();
  }, [user]);

  /**
   * Toggles the completion status of a checklist item.
   * Synchronizes with the backend and triggers progress updates.
   * @param {string} itemKey - The unique key of the item.
   * @param {string} label - The label for the toast notification.
   */
  const toggleItem = async (itemKey, label) => {
    const item = items.find(i => i.key === itemKey);
    if (!item) return;

    try {
      const { data } = await updateChecklistItem(user._id, itemKey, !item.completed);
      if (data.success) {
        setItems(data.data.items);
        setProgress(data.data.progress);
        onProgressChange?.(data.data.progress);
        toast.success(item.completed ? `Unchecked ${label}` : `Completed ${label}! ✨`);
      }
    } catch (e) {
      toast.error('Failed to update task status');
    }
  };

  return (
    <section className="glass-card p-6" aria-labelledby="checklist-title">
      <div className="flex items-center justify-between mb-4">
        <h2 id="checklist-title" className="section-title mb-0">
          <FiCheckSquare className="text-primary" aria-hidden="true" /> Smart Checklist
        </h2>
        <span className="text-sm font-semibold text-primary" aria-label={`${progress.completed} of ${progress.total} tasks completed`}>
          {progress.completed}/{progress.total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-border mb-4 overflow-hidden" 
           role="progressbar" 
           aria-valuenow={progress.percentage} 
           aria-valuemin="0" 
           aria-valuemax="100" 
           aria-label="Checklist completion progress">
        <motion.div className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress.percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {loading ? (
        <div className="space-y-2" aria-hidden="true">
          {[1,2,3,4].map(i => <div key={i} className="loading-shimmer h-14 w-full" />)}
        </div>
      ) : (
        <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-1" role="list">
          {items.map((item, i) => (
            <motion.li key={item.key}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggleItem(item.key, item.label)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleItem(item.key, item.label);
                }
              }}
              role="checkbox"
              aria-checked={item.completed}
              tabIndex={0}
              className={`checklist-item outline-none focus-visible:ring-2 focus-visible:ring-primary ${item.completed ? 'completed' : ''}`}
              aria-label={item.label}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                item.completed
                  ? 'bg-secondary border-secondary'
                  : 'border-text-muted'
              }`} aria-hidden="true">
                {item.completed && <FiCheck size={12} className="text-bg-dark" strokeWidth={3} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${item.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                  {item.label}
                </p>
                <p className="text-text-muted text-xs truncate">{item.description}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
