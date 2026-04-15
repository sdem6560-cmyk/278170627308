import React from 'react';
import { Shield, Activity, Cpu, Globe, AlertTriangle, Menu, X } from 'lucide-react';
import { Phase } from '../types';

interface TopBarProps {
  phase: Phase;
  connected: boolean;
  opCount: number;
  threatLevel: number;
  credCount: number;
  vulnCount: number;
  isLive?: boolean;
  isAutonomous?: boolean;
  aiThought?: string;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  phase, 
  connected, 
  opCount, 
  threatLevel, 
  credCount, 
  vulnCount, 
  isLive,
  isAutonomous,
  aiThought,
  isSidebarCollapsed,
  onToggleSidebar
}) => {
  const getPhaseClass = (p: Phase) => {
    switch (p) {
      case 'RECON': return 'bg-[rgba(0,240,255,0.15)] text-[var(--accent-cyan)] border border-[rgba(0,240,255,0.3)]';
      case 'ENUM': return 'bg-[rgba(51,136,255,0.15)] text-[var(--accent-blue)] border border-[rgba(51,136,255,0.3)]';
      case 'EXPLOIT': return 'bg-[rgba(255,136,0,0.15)] text-[var(--accent-orange)] border border-[rgba(255,136,0,0.3)]';
      case 'POST': return 'bg-[rgba(255,51,102,0.15)] text-[var(--accent-red)] border border-[rgba(255,51,102,0.3)]';
      case 'EXFIL': return 'bg-[rgba(170,85,255,0.15)] text-[var(--accent-purple)] border border-[rgba(170,85,255,0.3)]';
      default: return '';
    }
  };

  const getPhaseName = (p: Phase) => {
    switch (p) {
      case 'RECON': return 'استطلاع';
      case 'ENUM': return 'فحص';
      case 'EXPLOIT': return 'استغلال';
      case 'POST': return 'ما بعد الاستغلال';
      case 'EXFIL': return 'تسريب';
    }
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-5 h-[52px] md:h-[56px] bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shrink-0 z-[100] glass-panel">
      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-all active:scale-90 lg:flex hidden items-center justify-center border border-transparent hover:border-[rgba(0,240,255,0.2)]"
          title={isSidebarCollapsed ? "إظهار القائمة" : "طي القائمة"}
        >
          {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        
        <div className="flex items-center gap-2 md:gap-3 font-black text-lg md:text-xl tracking-wider group cursor-pointer">
          <div className="w-7 h-7 md:w-9 md:h-9 rounded-[var(--radius-sm)] bg-linear-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center text-sm md:text-lg font-mono font-bold text-[var(--bg-primary)] shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
            S
          </div>
          <span className="bg-linear-to-r from-[var(--accent-cyan)] via-[var(--accent-purple)] to-[var(--accent-cyan)] bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent glow-text hidden xs:inline">
            SENTINEL HACKER OS
          </span>
        </div>
        
        <div className={`phase-badge px-3 md:px-5 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold font-mono uppercase tracking-[1px] md:tracking-[2px] ${getPhaseClass(phase)}`}>
          <span className="hidden sm:inline">PHASE: </span>{phase} <span className="hidden md:inline">({getPhaseName(phase)})</span>
        </div>

        {isLive && (
          <div className="flex items-center gap-2 px-3 py-1 bg-[rgba(255,51,102,0.15)] border border-[var(--accent-red)] rounded-md animate-pulse">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-red)] shadow-[0_0_10px_var(--accent-red)]" />
            <span className="text-[10px] font-black text-[var(--accent-red)] uppercase tracking-widest">LIVE OPERATION ACTIVE</span>
          </div>
        )}

        {isAutonomous && (
          <div className="flex-1 max-w-[400px] mx-4 hidden lg:flex items-center gap-3 px-4 py-1.5 bg-[rgba(170,85,255,0.05)] border border-[rgba(170,85,255,0.2)] rounded-lg overflow-hidden relative group">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-[rgba(170,85,255,0.05)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)] animate-ping" />
              <span className="text-[9px] font-black text-[var(--accent-purple)] uppercase tracking-[2px]">AI_THOUGHT_STREAM:</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-[var(--text-primary)] truncate animate-in fade-in slide-in-from-left-2">
                {aiThought}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-6 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1.5 px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-bold bg-[var(--bg-tertiary)] border border-[var(--border-color)] font-mono shadow-inner shrink-0">
          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-[pulse-dot_2s_infinite] ${connected ? 'bg-[var(--accent-green)] shadow-[0_0_10px_var(--accent-green)]' : 'bg-[var(--accent-red)] shadow-[0_0_10px_var(--accent-red)]'}`} />
          <span className="xs:inline">{connected ? 'ON' : 'OFF'}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-5 text-[var(--text-secondary)] font-mono text-[9px] md:text-xs shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(170,85,255,0.1)] border border-[rgba(170,85,255,0.3)] shadow-[0_0_10px_rgba(170,85,255,0.2)] mr-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)] animate-ping" />
            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--accent-purple)]">Neural Link Active</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.1)]">
            <Activity size={10} className="text-[var(--accent-cyan)]" />
            <span className="text-[var(--accent-cyan)] font-bold">{opCount}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[rgba(170,85,255,0.05)] border border-[rgba(170,85,255,0.1)]">
            <Cpu size={10} className="text-[var(--accent-purple)]" />
            <span className="text-[var(--accent-purple)] font-bold">12%</span>
          </div>

          <div className="flex items-center gap-3 px-2 py-1 rounded-md bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.1)]">
            <Globe size={10} className="text-[var(--accent-cyan)]" />
            <span className="text-[var(--accent-cyan)] font-bold">{credCount}</span>
          </div>

          <div className="flex items-center gap-3 px-2 py-1 rounded-md bg-[rgba(255,51,102,0.05)] border border-[rgba(255,51,102,0.1)]">
            <Shield size={10} className="text-[var(--accent-red)]" />
            <span className="text-[var(--accent-red)] font-bold">{vulnCount}</span>
          </div>
          
          <div className="flex items-center gap-3 px-3 py-1 rounded-md bg-[rgba(255,51,102,0.05)] border border-[rgba(255,51,102,0.1)]">
            <Shield size={10} className="text-[var(--accent-red)]" />
            <div className="w-16 h-1.5 bg-[var(--bg-input)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--accent-red)] transition-all duration-1000" 
                style={{ width: `${threatLevel}%` }}
              />
            </div>
            <span className="text-[var(--accent-red)] font-bold text-[9px]">{Math.round(threatLevel)}%</span>
          </div>
        </div>
      </div>
    </header>
  );
};
