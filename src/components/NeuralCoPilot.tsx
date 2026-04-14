import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Zap, Target, ShieldAlert, ChevronRight } from 'lucide-react';

interface NeuralCoPilotProps {
  phase: string;
  autopilot: boolean;
  onAction: (action: string) => void;
}

export const NeuralCoPilot: React.FC<NeuralCoPilotProps> = ({ phase, autopilot, onAction }) => {
  const [suggestion, setSuggestion] = useState<{ text: string; action: string } | null>(null);

  useEffect(() => {
    const suggestions = [
      { text: "تحليل ثغرات Buffer Overflow في الهدف Alpha", action: "vulnscan" },
      { text: "تفعيل بروتوكول التشفير الكمي لتأمين الاتصال", action: "status" },
      { text: "بدء عملية تسريب البيانات المشفرة من Gateway", action: "exfiltrate" },
      { text: "رصد محاولة اختراق خارجية من عنوان IP مجهول", action: "scan" },
      { text: "بدء هجوم القوة الغاشمة على خادم SSH", action: "brute" },
      { text: "توليد حمولة برمجية مخصصة لتجاوز الدفاعات", action: "payload" },
      { text: "فحص خريطة الشبكة العصبية للبحث عن مسارات جديدة", action: "netmap" }
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
      } else {
        setSuggestion(null);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

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
              <div className="absolute -inset-0.5 bg-linear-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" />
              
              <div className="relative flex items-center gap-4 bg-[var(--bg-secondary)] border border-[rgba(170,85,255,0.3)] rounded-lg p-4 shadow-2xl backdrop-blur-xl max-w-[300px]">
                <div className="p-2 rounded-full bg-[rgba(170,85,255,0.1)] text-[var(--accent-purple)] shrink-0">
                  <Brain size={20} className="animate-pulse" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-purple)] mb-1">اقتراح Sentinel AI</div>
                  <p className="text-[11px] text-[var(--text-primary)] leading-tight font-medium mb-2">{suggestion.text}</p>
                  
                  <button 
                    onClick={() => onAction(suggestion.action)}
                    className="flex items-center gap-1 text-[9px] font-bold text-[var(--accent-cyan)] uppercase tracking-tighter hover:gap-2 transition-all"
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
                      className="text-[var(--accent-purple)] animate-[dash_2s_ease-in-out_infinite]"
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
