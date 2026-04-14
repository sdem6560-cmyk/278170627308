import React from 'react';
import { motion } from 'motion/react';
import { AIThought } from '../types';
import { AlertTriangle, ShieldAlert, Activity, Eye, Zap } from 'lucide-react';

interface ThreatMatrixProps {
  thoughts: AIThought[];
}

export const ThreatMatrix: React.FC<ThreatMatrixProps> = ({ thoughts }) => {
  const getPosition = (type: AIThought['type'], id: string) => {
    // Generate semi-random but consistent position based on type and id
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomOffset = (seed % 20) - 10; // -10 to 10

    switch (type) {
      case 'alert':
        return { x: 80 + randomOffset, y: 20 + randomOffset, color: 'var(--accent-red)' };
      case 'prediction':
        return { x: 70 + randomOffset, y: 50 + randomOffset, color: 'var(--accent-orange)' };
      case 'decision':
        return { x: 30 + randomOffset, y: 40 + randomOffset, color: 'var(--accent-purple)' };
      case 'analysis':
      default:
        return { x: 40 + randomOffset, y: 70 + randomOffset, color: 'var(--accent-cyan)' };
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-secondary)] p-4 md:p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black uppercase tracking-[3px] text-[var(--text-primary)] flex items-center gap-3">
            <ShieldAlert className="text-[var(--accent-red)] animate-pulse" size={20} />
            مصفوفة التهديدات السيبرانية
          </h2>
          <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1 uppercase tracking-widest">THREAT_MATRIX_ANALYSIS_V4.0</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-muted)]">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-red)]" />
            <span>حرجة</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-muted)]">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)]" />
            <span>مرتفعة</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-muted)]">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
            <span>متوسطة</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative border border-[var(--border-color)] bg-[rgba(0,0,0,0.2)] rounded-[var(--radius-lg)] overflow-hidden cyber-grid">
        {/* Matrix Labels */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-black tracking-[4px] text-[var(--text-muted)] uppercase origin-center whitespace-nowrap">
          تأثير التهديد (Impact)
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-[4px] text-[var(--text-muted)] uppercase whitespace-nowrap">
          احتمالية الحدوث (Probability)
        </div>

        {/* Matrix Grid Lines */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r border-[rgba(255,255,255,0.05)]" />
          <div className="flex-1 border-r border-[rgba(255,255,255,0.05)]" />
          <div className="flex-1 border-r border-[rgba(255,255,255,0.05)]" />
          <div className="flex-1" />
        </div>
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 border-b border-[rgba(255,255,255,0.05)]" />
          <div className="flex-1 border-b border-[rgba(255,255,255,0.05)]" />
          <div className="flex-1 border-b border-[rgba(255,255,255,0.05)]" />
          <div className="flex-1" />
        </div>

        {/* Threat Points */}
        {thoughts.map((thought, index) => {
          const pos = getPosition(thought.type, thought.id);
          return (
            <motion.div
              key={thought.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className="absolute group cursor-help"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center relative"
                style={{ backgroundColor: pos.color, boxShadow: `0 0 15px ${pos.color}` }}
              >
                <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: pos.color }} />
                {thought.type === 'alert' && <AlertTriangle size={8} className="text-black" />}
                {thought.type === 'prediction' && <Eye size={8} className="text-black" />}
                {thought.type === 'analysis' && <Activity size={8} className="text-black" />}
                {thought.type === 'decision' && <Zap size={8} className="text-black" />}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-[var(--radius-md)] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-2xl scale-95 group-hover:scale-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: pos.color }}>{thought.type}</span>
                  <span className="text-[8px] font-mono text-[var(--text-muted)]">{thought.timestamp}</span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed font-medium">{thought.text}</p>
                <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.05)] flex justify-between text-[7px] font-mono text-[var(--text-muted)]">
                  <span>PROB: {Math.round(pos.x)}%</span>
                  <span>IMPACT: {Math.round(100 - pos.y)}%</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend / Info */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 rounded-[var(--radius-md)] bg-[rgba(255,51,102,0.05)] border border-[rgba(255,51,102,0.1)]">
          <div className="text-[8px] font-black text-[var(--accent-red)] uppercase mb-1">المنطقة الحمراء</div>
          <div className="text-[10px] text-[var(--text-secondary)] font-medium">تهديدات فورية تتطلب تدخل النظام.</div>
        </div>
        <div className="p-3 rounded-[var(--radius-md)] bg-[rgba(255,136,0,0.05)] border border-[rgba(255,136,0,0.1)]">
          <div className="text-[8px] font-black text-[var(--accent-orange)] uppercase mb-1">توقعات استباقية</div>
          <div className="text-[10px] text-[var(--text-secondary)] font-medium">أنماط هجوم محتملة تم رصدها.</div>
        </div>
        <div className="p-3 rounded-[var(--radius-md)] bg-[rgba(170,85,255,0.05)] border border-[rgba(170,85,255,0.1)]">
          <div className="text-[8px] font-black text-[var(--accent-purple)] uppercase mb-1">قرارات النظام</div>
          <div className="text-[10px] text-[var(--text-secondary)] font-medium">إجراءات دفاعية قيد التنفيذ.</div>
        </div>
        <div className="p-3 rounded-[var(--radius-md)] bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.1)]">
          <div className="text-[8px] font-black text-[var(--accent-cyan)] uppercase mb-1">تحليل البيانات</div>
          <div className="text-[10px] text-[var(--text-secondary)] font-medium">مراقبة روتينية للأنشطة المشبوهة.</div>
        </div>
      </div>
    </div>
  );
};
