import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, Search, Lock, Globe, Terminal, Activity, Cpu, Database, Bug, Eye, Radio, RefreshCw, SlidersHorizontal, ChevronLeft } from 'lucide-react';
import { ArsenalParam } from '../types';

interface MasterAction {
  id: string;
  name: string;
  icon: string;
  color: string;
  cmd: string;
  params?: ArsenalParam[];
}

interface MasterControlProps {
  config: string; // JSON string
  onAction: (action: string) => void;
  onConfigChange?: (newConfig: string) => void;
}

const iconMap: Record<string, any> = {
  Zap, Shield, Search, Lock, Globe, Terminal, Activity, Cpu, Database, Bug, Eye, Radio
};

export const MasterControl: React.FC<MasterControlProps> = ({ config, onAction, onConfigChange }) => {
  const [tuningActionId, setTuningActionId] = React.useState<string | null>(null);

  const actions = useMemo(() => {
    try {
      const parsed = JSON.parse(config);
      return Array.isArray(parsed) ? (parsed as MasterAction[]) : [];
    } catch (e) {
      console.error("Failed to parse MasterControl config", e);
      return [];
    }
  }, [config]);

  const tuningAction = actions.find(a => a.id === tuningActionId);

  const handleReset = () => {
    if (onConfigChange) {
      const defaultConfig = [
        { id: 'recon', name: 'استطلاع (RECON)', icon: 'Search', color: 'var(--accent-cyan)', cmd: 'recon' },
        { id: 'scan', name: 'مسح (SCAN)', icon: 'Activity', color: 'var(--accent-blue)', cmd: 'scan' },
        { id: 'vuln', name: 'ثغرات (VULN)', icon: 'Shield', color: 'var(--accent-orange)', cmd: 'vulnscan' },
        { id: 'exploit', name: 'استغلال (EXPLOIT)', icon: 'Zap', color: 'var(--accent-yellow)', cmd: 'exploit' },
        { id: 'live', name: 'تشغيل مباشر (LIVE)', icon: 'Radio', color: 'var(--accent-red)', cmd: 'live' },
        { id: 'exfil', name: 'تسريب (EXFIL)', icon: 'Globe', color: 'var(--accent-purple)', cmd: 'exfiltrate' },
      ];
      onConfigChange(JSON.stringify(defaultConfig));
    }
  };

  const updateParam = (actionId: string, paramId: string, newValue: any) => {
    if (onConfigChange) {
      const newActions = actions.map(a => {
        if (a.id === actionId && a.params) {
          return {
            ...a,
            params: a.params.map(p => p.id === paramId ? { ...p, value: newValue } : p)
          };
        }
        return a;
      });
      onConfigChange(JSON.stringify(newActions));
    }
  };

  if (tuningActionId && tuningAction) {
    return (
      <div className="p-4 bg-[rgba(10,14,23,0.8)] border-b border-[var(--border-color)] backdrop-blur-xl animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => setTuningActionId(null)}
            className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="text-[10px] font-black uppercase tracking-[2px] text-[var(--accent-cyan)]">تعديل معلمات العملية</div>
            <div className="text-xs font-bold font-mono text-[var(--text-primary)]">{tuningAction.name}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tuningAction.params?.map(param => (
            <div key={param.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{param.name}</label>
                <span className="text-[9px] font-mono text-[var(--accent-cyan)]">{String(param.value)}</span>
              </div>
              
              {param.type === 'text' && (
                <input 
                  type="text"
                  value={String(param.value)}
                  onChange={(e) => updateParam(tuningAction.id, param.id, e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-cyan)] outline-none transition-colors font-mono"
                />
              )}

              {param.type === 'number' && (
                <input 
                  type="range"
                  min="1"
                  max="100"
                  value={Number(param.value)}
                  onChange={(e) => updateParam(tuningAction.id, param.id, parseInt(e.target.value))}
                  className="w-full accent-[var(--accent-cyan)]"
                />
              )}

              {param.type === 'toggle' && (
                <button 
                  onClick={() => updateParam(tuningAction.id, param.id, !param.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md border transition-all duration-300 ${
                    param.value 
                      ? 'bg-[rgba(0,240,255,0.1)] border-[var(--accent-cyan)] text-[var(--accent-cyan)]' 
                      : 'bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-muted)]'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{param.value ? 'نشط' : 'معطل'}</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${param.value ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--text-muted)]'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${param.value ? 'left-4.5' : 'left-0.5'}`} />
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[rgba(10,14,23,0.6)] border-b border-[var(--border-color)] backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-[var(--accent-cyan)]" />
          <h3 className="text-[10px] font-black uppercase tracking-[2px] text-[var(--text-primary)]">لوحة التحكم الديناميكية (Dynamic Arsenal Panel)</h3>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] hover:border-[var(--accent-cyan)] transition-all group"
          >
            <RefreshCw size={10} className="text-[var(--text-muted)] group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[8px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">RESET_ARSENAL</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
            <span className="text-[8px] font-mono text-[var(--text-muted)]">CONFIG_SYNCED</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => {
          const Icon = iconMap[action.icon] || Terminal;
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction(action.cmd)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] hover:border-[var(--accent-cyan)] hover:bg-[rgba(0,240,255,0.05)] transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-transparent via-[rgba(0,240,255,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon size={20} style={{ color: action.color }} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{action.name}</span>
              
              {action.params && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setTuningActionId(action.id);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-md hover:bg-[rgba(0,240,255,0.1)] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all opacity-0 group-hover:opacity-100"
                >
                  <SlidersHorizontal size={12} />
                </button>
              )}

              <div className="w-full h-0.5 bg-[var(--border-color)] mt-1 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent-cyan)] w-0 group-hover:w-full transition-all duration-500" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
