
import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Brain, Target, Activity, Database, Shield, Layout, FileText, Cpu } from 'lucide-react';
import { playSound } from '../lib/soundUtils';

interface TaskbarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  autopilot: boolean;
  threatLevel: number;
}

export const Taskbar: React.FC<TaskbarProps> = ({ activeTab, onTabChange, autopilot, threatLevel }) => {
  const tasks = [
    { id: 'DESKTOP', icon: Layout, label: 'Desktop' },
    { id: 'TERMINAL', icon: Terminal, label: 'Terminal' },
    { id: 'AI', icon: Brain, label: 'AI Co-Pilot' },
    { id: 'TARGETS', icon: Target, label: 'Targets' },
    { id: 'THREATS', icon: Activity, label: 'Network' },
    { id: 'FILES', icon: FileText, label: 'System' },
    { id: 'PROCESSES', icon: Cpu, label: 'Monitor' },
  ];

  const handleTabClick = (id: string) => {
    playSound('click');
    onTabChange(id);
  };

  return (
    <div className="os-taskbar h-12 shrink-0 border-t border-[var(--border-color)]">
      <div className="os-start-btn cursor-pointer hover:brightness-125 transition-all" onClick={() => handleTabClick('DESKTOP')}>
        <Shield size={18} />
      </div>
      
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => handleTabClick(task.id)}
            className={`os-task-item ${activeTab === task.id ? 'active' : ''}`}
          >
            <task.icon size={14} />
            <span className="hidden sm:inline">{task.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${autopilot ? 'bg-[var(--accent-green)] animate-pulse' : 'bg-[var(--text-muted)]'}`} />
          <span className="text-[10px] font-mono text-[var(--text-secondary)] hidden md:inline">
            AUTOPILOT: {autopilot ? 'ONLINE' : 'STBY'}
          </span>
        </div>
        
        <div className="flex flex-col items-end gap-0.5 min-w-[60px]">
          <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Threat Index</div>
          <div className="w-full h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-red)]"
              initial={{ width: 0 }}
              animate={{ width: `${threatLevel}%` }}
            />
          </div>
        </div>
        
        <div className="text-[10px] font-mono text-[var(--accent-cyan)] bg-[rgba(0,240,255,0.05)] px-2 py-0.5 rounded border border-[var(--border-glow)] hidden lg:block">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
