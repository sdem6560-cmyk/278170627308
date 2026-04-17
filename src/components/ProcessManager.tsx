import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Cpu, Zap, X, Shield, Terminal, Search } from 'lucide-react';

interface Process {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  mem: number;
  status: 'running' | 'sleeping' | 'zombie';
  type: 'system' | 'exploit' | 'recon';
}

export const ProcessManager: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const initialProcesses: Process[] = [
      { pid: 1024, name: 'sentinel_core', user: 'root', cpu: 2.4, mem: 124, status: 'running', type: 'system' },
      { pid: 2048, name: 'neural_link', user: 'root', cpu: 15.2, mem: 512, status: 'running', type: 'system' },
      { pid: 3096, name: 'recon_scanner', user: 'sentinel', cpu: 45.8, mem: 256, status: 'running', type: 'recon' },
      { pid: 4112, name: 'msf_handler', user: 'sentinel', cpu: 1.2, mem: 88, status: 'sleeping', type: 'exploit' },
      { pid: 5224, name: 'brute_force_v3', user: 'sentinel', cpu: 98.4, mem: 1024, status: 'running', type: 'exploit' },
      { pid: 6336, name: 'exfil_tunnel', user: 'root', cpu: 0.5, mem: 32, status: 'sleeping', type: 'recon' },
    ];
    setProcesses(initialProcesses);

    const interval = setInterval(() => {
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Math.max(0.1, Math.min(99.9, p.cpu + (Math.random() - 0.5) * 5)),
        mem: Math.max(10, p.mem + (Math.random() - 0.5) * 10)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const filteredProcesses = processes.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.pid.toString().includes(filter)
  );

  const killProcess = (pid: number) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] m-1">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]">
        <div className="flex items-center gap-3">
          <Activity size={18} className="text-[var(--accent-green)]" />
          <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">مدير العمليات (Process Manager)</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <Cpu size={12} className="text-[var(--accent-cyan)]" />
              <span className="text-[var(--text-muted)]">CPU:</span>
              <span className="text-[var(--accent-cyan)] font-bold">42.5%</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-[var(--accent-orange)]" />
              <span className="text-[var(--text-muted)]">MEM:</span>
              <span className="text-[var(--accent-orange)] font-bold">2.4 GB</span>
            </div>
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="بحث عن عملية..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md pl-8 pr-3 py-1 text-[10px] outline-none focus:border-[var(--accent-green)] transition-all w-48"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse font-mono text-[10px]">
          <thead className="sticky top-0 bg-[var(--bg-tertiary)] z-10">
            <tr className="border-b border-[var(--border-color)]">
              <th className="px-4 py-2 text-[var(--text-muted)] uppercase tracking-tighter">PID</th>
              <th className="px-4 py-2 text-[var(--text-muted)] uppercase tracking-tighter">Name</th>
              <th className="px-4 py-2 text-[var(--text-muted)] uppercase tracking-tighter">User</th>
              <th className="px-4 py-2 text-[var(--text-muted)] uppercase tracking-tighter">CPU %</th>
              <th className="px-4 py-2 text-[var(--text-muted)] uppercase tracking-tighter">MEM (MB)</th>
              <th className="px-4 py-2 text-[var(--text-muted)] uppercase tracking-tighter">Status</th>
              <th className="px-4 py-2 text-[var(--text-muted)] uppercase tracking-tighter text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {filteredProcesses.map((p) => (
                <motion.tr 
                  key={p.pid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(0,255,157,0.03)] transition-colors group"
                >
                  <td className="px-4 py-2 text-[var(--text-muted)]">{p.pid}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    {p.type === 'exploit' ? <Zap size={10} className="text-[var(--accent-orange)]" /> : 
                     p.type === 'recon' ? <Search size={10} className="text-[var(--accent-cyan)]" /> : 
                     <Shield size={10} className="text-[var(--text-muted)]" />}
                    <span className="text-[var(--text-primary)] font-bold">{p.name}</span>
                  </td>
                  <td className="px-4 py-2 text-[var(--text-secondary)]">{p.user}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-[var(--bg-input)] rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${p.cpu > 80 ? 'bg-[var(--accent-red)]' : p.cpu > 40 ? 'bg-[var(--accent-orange)]' : 'bg-[var(--accent-green)]'}`}
                          style={{ width: `${p.cpu}%` }}
                        />
                      </div>
                      <span className={p.cpu > 80 ? 'text-[var(--accent-red)]' : ''}>{p.cpu.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-[var(--text-secondary)]">{p.mem.toFixed(0)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-1.5 py-0.5 rounded-sm uppercase text-[8px] font-black ${
                      p.status === 'running' ? 'bg-[rgba(0,255,157,0.1)] text-[var(--accent-green)]' :
                      p.status === 'sleeping' ? 'bg-[rgba(0,240,255,0.1)] text-[var(--accent-cyan)]' :
                      'bg-[rgba(255,51,102,0.1)] text-[var(--accent-red)]'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button 
                      onClick={() => killProcess(p.pid)}
                      className="p-1 hover:text-[var(--accent-red)] transition-colors opacity-0 group-hover:opacity-100"
                      title="Kill Process"
                    >
                      <X size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 bg-[var(--bg-tertiary)] border-t border-[var(--border-color)] flex items-center justify-between text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
        <div className="flex gap-4">
          <span>Total Processes: {processes.length}</span>
          <span>Threads: 142</span>
        </div>
        <div className="flex items-center gap-2">
          <Terminal size={10} className="text-[var(--accent-cyan)]" />
          <span>Kernel: Sentinel-v4.2-LTS</span>
        </div>
      </div>
    </div>
  );
};
