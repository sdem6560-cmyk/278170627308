import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Terminal, Shield, Zap, Search, Cpu } from 'lucide-react';

interface Packet {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  timestamp: string;
}

export const Sniffer: React.FC = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isSniffing, setIsSniffing] = useState(true);

  useEffect(() => {
    if (!isSniffing) return;

    const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'SSH', 'DNS', 'FTP', 'SMTP'];
    const ips = ['192.168.1.45', '10.0.0.1', '172.16.0.10', '192.168.1.102', '45.22.11.9', '185.244.25.102'];

    const interval = setInterval(() => {
      const newPacket: Packet = {
        id: Math.random().toString(36).substring(7),
        source: ips[Math.floor(Math.random() * ips.length)],
        destination: ips[Math.floor(Math.random() * ips.length)],
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        length: Math.floor(Math.random() * 1500) + 40,
        info: `[${Math.random().toString(36).substring(7).toUpperCase()}] Data transmission sequence...`,
        timestamp: new Date().toLocaleTimeString()
      };

      setPackets(prev => [newPacket, ...prev].slice(0, 50));
    }, 800);

    return () => clearInterval(interval);
  }, [isSniffing]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-[var(--radius-md)] m-1">
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[var(--accent-green)] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">مراقب حركة الشبكة (Network Sniffer)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.1)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
            <span className="text-[8px] font-mono text-[var(--accent-green)]">LIVE_STREAM</span>
          </div>
          <button 
            onClick={() => setIsSniffing(!isSniffing)}
            className={`px-3 py-0.5 rounded text-[8px] font-black uppercase transition-all ${
              isSniffing ? 'bg-[rgba(255,51,102,0.1)] text-[var(--accent-red)] border border-[rgba(255,51,102,0.2)]' : 'bg-[rgba(0,255,157,0.1)] text-[var(--accent-green)] border border-[rgba(0,255,157,0.2)]'
            }`}
          >
            {isSniffing ? 'إيقاف (STOP)' : 'بدء (START)'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar font-mono text-[10px]">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[var(--bg-tertiary)] z-10">
            <tr className="border-b border-[var(--border-color)]">
              <th className="px-3 py-2 text-[var(--text-muted)] uppercase tracking-tighter">Time</th>
              <th className="px-3 py-2 text-[var(--text-muted)] uppercase tracking-tighter">Source</th>
              <th className="px-3 py-2 text-[var(--text-muted)] uppercase tracking-tighter">Dest</th>
              <th className="px-3 py-2 text-[var(--text-muted)] uppercase tracking-tighter">Proto</th>
              <th className="px-3 py-2 text-[var(--text-muted)] uppercase tracking-tighter">Len</th>
              <th className="px-3 py-2 text-[var(--text-muted)] uppercase tracking-tighter">Info</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {packets.map((p) => (
                <motion.tr 
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(0,240,255,0.03)] transition-colors group"
                >
                  <td className="px-3 py-1.5 text-[var(--text-muted)]">{p.timestamp}</td>
                  <td className="px-3 py-1.5 text-[var(--accent-cyan)]">{p.source}</td>
                  <td className="px-3 py-1.5 text-[var(--text-secondary)]">{p.destination}</td>
                  <td className="px-3 py-1.5">
                    <span className={`px-1.5 py-0.5 rounded-sm ${
                      p.protocol === 'TCP' ? 'bg-[rgba(0,240,255,0.1)] text-[var(--accent-cyan)]' :
                      p.protocol === 'UDP' ? 'bg-[rgba(170,85,255,0.1)] text-[var(--accent-purple)]' :
                      p.protocol === 'HTTP' ? 'bg-[rgba(0,255,157,0.1)] text-[var(--accent-green)]' :
                      'bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)]'
                    }`}>
                      {p.protocol}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-[var(--text-muted)]">{p.length}</td>
                  <td className="px-3 py-1.5 text-[var(--text-secondary)] truncate max-w-[200px] group-hover:text-[var(--text-primary)] transition-colors">{p.info}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
