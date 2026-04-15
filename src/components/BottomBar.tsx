import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, ShieldAlert, Zap, Settings, Terminal as TerminalIcon, Brain, Target, Globe, Lock } from 'lucide-react';
import { Phase } from '../types';

interface BottomBarProps {
  phase: Phase;
  autopilot: boolean;
  onAutopilotToggle: () => void;
  isAutonomous?: boolean;
  onAutonomousToggle?: () => void;
  activeTab?: 'TERMINAL' | 'AI' | 'TARGETS' | 'THREATS' | 'FEEDS' | 'VAULT' | 'PAYLOAD';
  onTabChange?: (tab: 'TERMINAL' | 'AI' | 'TARGETS' | 'THREATS' | 'FEEDS' | 'VAULT' | 'PAYLOAD') => void;
  onSettingsClick?: () => void;
  onAction?: (action: string) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ 
  phase, 
  autopilot, 
  onAutopilotToggle,
  isAutonomous,
  onAutonomousToggle,
  activeTab,
  onTabChange,
  onSettingsClick,
  onAction
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="flex flex-col md:flex-row items-center justify-between bg-[var(--bg-secondary)] border-t border-[var(--border-color)] shrink-0 glass-panel relative z-[100]">
      {/* Mobile Tab Navigation (Thumb-Driven) */}
      <div className="flex md:hidden w-full h-16 items-center justify-around px-2 border-b border-[var(--border-color)]">
        <button 
          onClick={() => onTabChange?.('AI')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${activeTab === 'AI' ? 'text-[var(--accent-purple)]' : 'text-[var(--text-muted)]'}`}
        >
          <Brain size={18} className={activeTab === 'AI' ? 'scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">المنسق</span>
        </button>

        <button 
          onClick={() => onTabChange?.('THREATS')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${activeTab === 'THREATS' ? 'text-[var(--accent-red)]' : 'text-[var(--text-muted)]'}`}
        >
          <ShieldAlert size={18} className={activeTab === 'THREATS' ? 'scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">التهديدات</span>
        </button>

        <button 
          onClick={() => onTabChange?.('FEEDS')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${activeTab === 'FEEDS' ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'}`}
        >
          <Globe size={18} className={activeTab === 'FEEDS' ? 'scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">المصادر</span>
        </button>

        <button 
          onClick={() => onTabChange?.('VAULT')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${activeTab === 'VAULT' ? 'text-[var(--accent-purple)]' : 'text-[var(--text-muted)]'}`}
        >
          <Lock size={18} className={activeTab === 'VAULT' ? 'scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">المستودع</span>
        </button>

        <button 
          onClick={() => onTabChange?.('PAYLOAD')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${activeTab === 'PAYLOAD' ? 'text-[var(--accent-orange)]' : 'text-[var(--text-muted)]'}`}
        >
          <Zap size={18} className={activeTab === 'PAYLOAD' ? 'scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">الحمولة</span>
        </button>

        <button 
          onClick={() => onTabChange?.('TERMINAL')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 relative ${activeTab === 'TERMINAL' ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'}`}
        >
          <div className={`absolute -top-4 w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center shadow-lg transition-all duration-300 ${activeTab === 'TERMINAL' ? 'border-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.3)]' : ''}`}>
            <TerminalIcon size={24} />
          </div>
          <span className="mt-6 text-[10px] font-bold uppercase tracking-tighter">الرادار الرئيسي</span>
        </button>

        <button 
          onClick={() => onTabChange?.('TARGETS')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${activeTab === 'TARGETS' ? 'text-[var(--accent-orange)]' : 'text-[var(--text-muted)]'}`}
        >
          <Target size={20} className={activeTab === 'TARGETS' ? 'scale-110' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">الأهداف</span>
        </button>
      </div>

      {/* Desktop & Mobile Status Bar */}
      <div className="flex w-full items-center justify-between px-5 h-10 md:h-11">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:flex items-center gap-2.5 text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan)]" />
            <span>المرحلة: <span className="text-[var(--text-primary)] font-bold">{phase}</span></span>
          </div>
          
          <button 
            onClick={onAutopilotToggle}
            className={`flex items-center gap-3 px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold cursor-pointer transition-all duration-300 border font-mono shadow-sm ${
              autopilot 
                ? 'bg-[rgba(0,255,157,0.1)] border-[var(--accent-green)] text-[var(--accent-green)] shadow-[0_0_10px_rgba(0,255,157,0.2)]' 
                : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
            }`}
          >
            <Zap size={12} className={autopilot ? 'animate-pulse' : ''} />
            <span className="hidden xs:inline">الطيار الآلي</span>
            <div className={`w-7 md:w-8 h-3.5 md:h-4 rounded-full bg-[var(--bg-input)] relative transition-all duration-300 ${autopilot ? 'bg-[rgba(0,255,157,0.2)]' : ''}`}>
              <div className={`w-2.5 md:w-3 h-2.5 md:h-3 rounded-full absolute top-0.5 transition-all duration-300 ${autopilot ? 'left-4 md:left-4.5 bg-[var(--accent-green)]' : 'left-0.5 bg-[var(--text-muted)]'}`} />
            </div>
          </button>

          <button 
            onClick={onAutonomousToggle}
            className={`flex items-center gap-3 px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold cursor-pointer transition-all duration-300 border font-mono shadow-sm ${
              isAutonomous 
                ? 'bg-[rgba(170,85,255,0.1)] border-[var(--accent-purple)] text-[var(--accent-purple)] shadow-[0_0_10px_rgba(170,85,255,0.2)]' 
                : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
            }`}
          >
            <Brain size={12} className={isAutonomous ? 'animate-pulse' : ''} />
            <span className="hidden xs:inline">الوكيل المستقل</span>
            <div className={`w-7 md:w-8 h-3.5 md:h-4 rounded-full bg-[var(--bg-input)] relative transition-all duration-300 ${isAutonomous ? 'bg-[rgba(170,85,255,0.2)]' : ''}`}>
              <div className={`w-2.5 md:w-3 h-2.5 md:h-3 rounded-full absolute top-0.5 transition-all duration-300 ${isAutonomous ? 'left-4 md:left-4.5 bg-[var(--accent-purple)]' : 'left-0.5 bg-[var(--text-muted)]'}`} />
            </div>
          </button>
        </div>

        {/* Core Action Buttons */}
        <div className="flex items-center gap-2 px-4 border-x border-[var(--border-color)] h-full">
          <button 
            onClick={() => onAction?.('SCAN')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${
              phase === 'RECON' || phase === 'ENUM'
                ? 'bg-[rgba(0,240,255,0.1)] border-[var(--accent-cyan)] text-[var(--accent-cyan)] shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]'
            }`}
          >
            <ShieldCheck size={12} />
            <span>فحص</span>
          </button>
          
          <button 
            onClick={() => onAction?.('EXPLOIT')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${
              phase === 'EXPLOIT'
                ? 'bg-[rgba(255,136,0,0.1)] border-[var(--accent-orange)] text-[var(--accent-orange)] shadow-[0_0_10px_rgba(255,136,0,0.2)]'
                : 'bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]'
            }`}
          >
            <Zap size={12} />
            <span>استغلال</span>
          </button>

          <button 
            onClick={() => onAction?.('EXFILTRATE')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${
              phase === 'EXFIL'
                ? 'bg-[rgba(170,85,255,0.1)] border-[var(--accent-purple)] text-[var(--accent-purple)] shadow-[0_0_10px_rgba(170,85,255,0.2)]'
                : 'bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-purple)] hover:text-[var(--accent-purple)]'
            }`}
          >
            <Clock size={12} />
            <span>تسريب</span>
          </button>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden xs:flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,255,157,0.05)] text-[var(--accent-green)] font-mono text-[10px] border border-[rgba(0,255,157,0.1)] font-bold tracking-widest">
            <ShieldCheck size={12} />
            <span className="hidden sm:inline">ROOT_ACCESS: GRANTED</span>
            <span className="sm:hidden">ROOT</span>
          </div>

          <div className="flex items-center gap-2 text-[var(--text-muted)] font-mono text-[10px] md:text-[11px] ltr bg-[var(--bg-tertiary)] px-2 md:px-3 py-1 rounded-md border border-[var(--border-color)]" style={{ direction: 'ltr' }}>
            <Clock size={12} className="text-[var(--accent-cyan)]" />
            <span>{time}</span>
          </div>

          <button 
            onClick={onSettingsClick}
            className="p-1.5 border border-[var(--border-color)] rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-all duration-300 hover:rotate-45"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
