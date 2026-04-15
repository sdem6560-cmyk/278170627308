import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Zap, Target, ShieldAlert, ChevronRight } from 'lucide-react';
import { getSystemThoughts } from '../services/geminiService';
import { ArsenalItem } from '../types';

interface NeuralCoPilotProps {
  phase: string;
  threatLevel: number;
  arsenal: ArsenalItem[];
  autopilot: boolean;
  onAction: (action: string) => void;
}

export const NeuralCoPilot: React.FC<NeuralCoPilotProps> = ({ phase, threatLevel, arsenal, autopilot, onAction }) => {
  const [suggestion, setSuggestion] = useState<{ text: string; type: string; action: string } | null>(null);

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (!autopilot) return;
      
      try {
        const thoughts = await getSystemThoughts(phase, threatLevel, arsenal);
        if (thoughts && thoughts.length > 0) {
          const thought = thoughts[0];
          setSuggestion({
            text: thought.text,
            type: thought.type,
            action: thought.action
          });
        }
      } catch (error) {
        console.error("Failed to fetch AI suggestion:", error);
      }
    };

    fetchSuggestion();
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        fetchSuggestion();
      } else {
        setSuggestion(null);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [autopilot, phase, threatLevel, arsenal]);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'alert': return { color: 'var(--accent-red)', border: 'rgba(255,51,102,0.3)' };
      case 'prediction': return { color: 'var(--accent-orange)', border: 'rgba(255,136,0,0.3)' };
      case 'decision': return { color: 'var(--accent-purple)', border: 'rgba(170,85,255,0.3)' };
      case 'analysis':
      default: return { color: 'var(--accent-cyan)', border: 'rgba(0,240,255,0.3)' };
    }
  };

  const styles = suggestion ? getTypeStyles(suggestion.type) : getTypeStyles('analysis');

  return (
    <div className="fixed bottom-24 right-6 z-[150] pointer-events-none">
      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="pointer-events-auto"
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div 
                className="absolute -inset-0.5 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" 
                style={{ backgroundColor: styles.color }}
              />
              
              <div 
                className="relative flex items-center gap-4 bg-[var(--bg-secondary)] rounded-lg p-4 shadow-2xl backdrop-blur-xl max-w-[300px] border"
                style={{ borderColor: styles.border }}
              >
                <div 
                  className="p-2 rounded-full shrink-0"
                  style={{ backgroundColor: `${styles.color}1a`, color: styles.color }}
                >
                  <Brain size={20} className="animate-pulse" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div 
                    className="text-[9px] font-black uppercase tracking-widest mb-1"
                    style={{ color: styles.color }}
                  >
                    اقتراح Sentinel AI ({suggestion.type})
                  </div>
                  <p className="text-[11px] text-[var(--text-primary)] leading-tight font-medium mb-2">{suggestion.text}</p>
                  
                  {suggestion.action && (
                    <div className="mb-2 p-1.5 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
                      <div className="text-[8px] text-[var(--text-muted)] uppercase mb-0.5">الأداة المقترحة:</div>
                      <div className="text-[10px] font-bold text-[var(--accent-cyan)] flex items-center gap-1">
                        <Zap size={10} />
                        {arsenal.find(a => a.id === suggestion.action)?.name || suggestion.action}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => onAction(suggestion.action)}
                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-tighter hover:gap-2 transition-all"
                    style={{ color: styles.color }}
                  >
                    تنفيذ الإجراء المقترح <ChevronRight size={10} />
                  </button>
                </div>

                {/* Progress Ring (Simulated) */}
                <div className="absolute top-2 right-2">
                  <svg className="w-4 h-4 -rotate-90">
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      className="text-[rgba(255,255,255,0.05)]"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray={38}
                      strokeDashoffset={10}
                      className="animate-[dash_2s_ease-in-out_infinite]"
                      style={{ color: styles.color }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
