import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, ShieldAlert, Zap, Settings, Terminal as TerminalIcon, Brain, Target, Globe, Lock, Keyboard, Edit2, Home, Folder, Activity } from 'lucide-react';
import { Phase, LayoutConfig } from '../types';

interface BottomBarProps {
  phase: Phase;
  autopilot: boolean;
  onAutopilotToggle: () => void;
  isAutonomous?: boolean;
  onAutonomousToggle?: () => void;
  activeTab?: 'TERMINAL' | 'AI' | 'TARGETS' | 'THREATS' | 'FEEDS' | 'VAULT' | 'PAYLOAD' | 'DESKTOP' | 'FILES' | 'PROCESSES';
  onTabChange?: (tab: 'TERMINAL' | 'AI' | 'TARGETS' | 'THREATS' | 'FEEDS' | 'VAULT' | 'PAYLOAD' | 'DESKTOP' | 'FILES' | 'PROCESSES') => void;
  onSettingsClick?: () => void;
  onAction?: (action: string) => void;
  layoutConfig?: LayoutConfig;
  onLayoutChange?: (config: LayoutConfig) => void;
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
  onAction,
  layoutConfig,
  onLayoutChange
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [editingShortcut, setEditingShortcut] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="flex flex-col md:flex-row items-center justify-between bg-[var(--bg-secondary)] border-t border-[var(--border-color)] shrink-0 glass-panel relative z-[100]">
      {/* Taskbar Navigation */}
      <div className="flex w-full h-14 md:h-16 items-center justify-around px-2 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.01)] overflow-x-auto no-scrollbar">
        <button 
          onClick={() => onTabChange?.('DESKTOP')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[60px] h-full transition-all duration-300 ${activeTab === 'DESKTOP' ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'}`}
        >
          <Home size={18} className={activeTab === 'DESKTOP' ? 'scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">الرئيسية</span>
        </button>

        <button 
          onClick={() => onTabChange?.('AI')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[60px] h-full transition-all duration-300 relative group ${activeTab === 'AI' ? 'text-[var(--accent-purple)]' : 'text-[var(--text-muted)]'}`}
        >
          <Brain size={18} className={activeTab === 'AI' ? 'scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">المنسق</span>
          {layoutConfig && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setEditingShortcut('switchAI');
              }}
              className="absolute top-0 right-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded px-1 py-0.5 text-[6px] font-mono opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1"
            >
              <Keyboard size={6} />
              {layoutConfig.shortcuts.switchAI}
            </div>
          )}
        </button>

        <button 
          onClick={() => onTabChange?.('TERMINAL')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[60px] h-full transition-all duration-300 relative group ${activeTab === 'TERMINAL' ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'}`}
        >
          <div className={`absolute -top-4 w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center shadow-lg transition-all duration-300 ${activeTab === 'TERMINAL' ? 'border-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.3)]' : ''}`}>
            <TerminalIcon size={24} />
          </div>
          <span className="mt-6 text-[10px] font-bold uppercase tracking-tighter">الرادار</span>
          {layoutConfig && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setEditingShortcut('switchTerminal');
              }}
              className="absolute top-0 right-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded px-1 py-0.5 text-[6px] font-mono opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1"
            >
              <Keyboard size={6} />
              {layoutConfig.shortcuts.switchTerminal}
            </div>
          )}
        </button>

        <button 
          onClick={() => onTabChange?.('TARGETS')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[60px] h-full transition-all duration-300 ${activeTab === 'TARGETS' ? 'text-[var(--accent-orange)]' : 'text-[var(--text-muted)]'}`}
        >
          <Target size={18} className={activeTab === 'TARGETS' ? 'scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">الأهداف</span>
        </button>

        <button 
          onClick={() => onTabChange?.('FILES')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[60px] h-full transition-all duration-300 ${activeTab === 'FILES' ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'}`}
        >
          <Folder size={18} className={activeTab === 'FILES' ? 'scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">الملفات</span>
        </button>

        <button 
          onClick={() => onTabChange?.('PROCESSES')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[60px] h-full transition-all duration-300 ${activeTab === 'PROCESSES' ? 'text-[var(--accent-green)]' : 'text-[var(--text-muted)]'}`}
        >
          <Activity size={18} className={activeTab === 'PROCESSES' ? 'scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">العمليات</span>
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
      {/* Shortcut Editor Overlay */}
      {editingShortcut && layoutConfig && onLayoutChange && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-6 w-full max-w-xs space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-[var(--accent-orange)]">
              <Keyboard size={20} />
              <h3 className="text-sm font-black uppercase tracking-widest">تعديل الاختصار</h3>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              اضغط على المفتاح الجديد لتخصيص اختصار {editingShortcut === 'switchAI' ? 'المنسق (AI)' : editingShortcut === 'switchTerminal' ? 'الرادار (Terminal)' : 'الواجهة'}.
            </p>
            <div className="relative">
              <input 
                autoFocus
                type="text"
                placeholder="اضغط مفتاحاً..."
                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-4 py-3 text-center text-lg font-mono text-[var(--accent-orange)] outline-none focus:border-[var(--accent-orange)]"
                onKeyDown={(e) => {
                  e.preventDefault();
                  const newShortcuts = { ...layoutConfig.shortcuts, [editingShortcut]: e.key };
                  onLayoutChange({ ...layoutConfig, shortcuts: newShortcuts });
                  setEditingShortcut(null);
                }}
              />
            </div>
            <button 
              onClick={() => setEditingShortcut(null)}
              className="w-full py-2 text-[10px] font-bold uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
