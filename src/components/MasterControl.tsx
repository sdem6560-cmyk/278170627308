import React from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, Search, Lock, Globe, Terminal, Activity, Cpu, Database } from 'lucide-react';

interface MasterControlProps {
  onAction: (action: string) => void;
}

export const MasterControl: React.FC<MasterControlProps> = ({ onAction }) => {
  const actions = [
    { id: 'recon', name: 'استطلاع (RECON)', icon: Search, color: 'var(--accent-cyan)', cmd: 'recon' },
    { id: 'scan', name: 'مسح (SCAN)', icon: Activity, color: 'var(--accent-blue)', cmd: 'scan' },
    { id: 'vuln', name: 'ثغرات (VULN)', icon: Shield, color: 'var(--accent-orange)', cmd: 'vulnscan' },
    { id: 'brute', name: 'قوة غاشمة (BRUTE)', icon: Lock, color: 'var(--accent-red)', cmd: 'brute' },
    { id: 'exploit', name: 'استغلال (EXPLOIT)', icon: Zap, color: 'var(--accent-yellow)', cmd: 'exploit' },
    { id: 'exfil', name: 'تسريب (EXFIL)', icon: Globe, color: 'var(--accent-purple)', cmd: 'exfiltrate' },
  ];

  return (
    <div className="p-4 bg-[rgba(10,14,23,0.6)] border-b border-[var(--border-color)] backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-[var(--accent-cyan)]" />
          <h3 className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-primary)]">لوحة التحكم المباشر (Direct Operation Panel)</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
            <span className="text-[8px] font-mono text-[var(--text-muted)]">SYSTEM_READY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)] animate-ping" />
            <span className="text-[8px] font-mono text-[var(--text-muted)]">NEURAL_LINK_SYNCED</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction(action.cmd)}
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] hover:border-[var(--accent-cyan)] hover:bg-[rgba(0,240,255,0.05)] transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-transparent via-[rgba(0,240,255,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <action.icon size={20} style={{ color: action.color }} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{action.name}</span>
            <div className="w-full h-0.5 bg-[var(--border-color)] mt-1 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--accent-cyan)] w-0 group-hover:w-full transition-all duration-500" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
