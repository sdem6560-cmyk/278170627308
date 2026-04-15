import React, { useState, useEffect } from 'react';
import { Cpu, Database, Activity, Zap, Shield, Globe } from 'lucide-react';

export const SystemStatus: React.FC = () => {
  const [cpu, setCpu] = useState(12.4);
  const [mem, setMem] = useState(2.4);
  const [net, setNet] = useState(124);
  const [power, setPower] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 5)));
      setMem(prev => Math.max(1, Math.min(15.5, prev + (Math.random() - 0.5) * 0.2)));
      setNet(prev => Math.max(10, Math.min(999, prev + (Math.random() - 0.5) * 50)));
      setPower(prev => Math.max(20, Math.min(150, prev + (Math.random() - 0.5) * 10)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-2 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
      <div className="flex items-center gap-3 px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <Cpu size={14} className="text-[var(--accent-purple)]" />
        <div className="flex-1">
          <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">CPU_LOAD</div>
          <div className="text-[10px] font-mono font-bold text-[var(--accent-purple)]">{cpu.toFixed(1)}%</div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <Database size={14} className="text-[var(--accent-cyan)]" />
        <div className="flex-1">
          <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">MEM_USAGE</div>
          <div className="text-[10px] font-mono font-bold text-[var(--accent-cyan)]">{mem.toFixed(1)}GB / 16GB</div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <Activity size={14} className="text-[var(--accent-green)]" />
        <div className="flex-1">
          <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">NET_TRAFFIC</div>
          <div className="text-[10px] font-mono font-bold text-[var(--accent-green)]">{net.toFixed(0)} KB/s</div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <Zap size={14} className="text-[var(--accent-orange)]" />
        <div className="flex-1">
          <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">POWER_CONS</div>
          <div className="text-[10px] font-mono font-bold text-[var(--accent-orange)]">{power.toFixed(0)}W</div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <Shield size={14} className="text-[var(--accent-red)]" />
        <div className="flex-1">
          <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">ENCRYPTION</div>
          <div className="text-[10px] font-mono font-bold text-[var(--accent-red)]">AES-256</div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <Globe size={14} className="text-[var(--accent-blue)]" />
        <div className="flex-1">
          <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">VPN_STATUS</div>
          <div className="text-[10px] font-mono font-bold text-[var(--accent-blue)]">CONNECTED</div>
        </div>
      </div>
    </div>
  );
};
