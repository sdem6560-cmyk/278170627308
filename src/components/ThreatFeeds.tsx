import React from 'react';
import { motion } from 'motion/react';
import { IOC } from '../types';
import { ShieldAlert, Hash, Globe, Link as LinkIcon, Activity, AlertCircle } from 'lucide-react';

interface ThreatFeedsProps {
  iocs: IOC[];
}

export const ThreatFeeds: React.FC<ThreatFeedsProps> = ({ iocs }) => {
  const getSeverityColor = (severity: IOC['severity']) => {
    switch (severity) {
      case 'critical': return 'text-[var(--accent-red)]';
      case 'high': return 'text-[var(--accent-orange)]';
      case 'medium': return 'text-[var(--accent-cyan)]';
      case 'low': return 'text-[var(--text-muted)]';
      default: return 'text-[var(--text-primary)]';
    }
  };

  const getTypeIcon = (type: IOC['type']) => {
    switch (type) {
      case 'IP': return <Activity size={14} />;
      case 'DOMAIN': return <Globe size={14} />;
      case 'HASH': return <Hash size={14} />;
      case 'URL': return <LinkIcon size={14} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-secondary)] p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black uppercase tracking-[3px] text-[var(--text-primary)] flex items-center gap-3">
            <AlertCircle className="text-[var(--accent-orange)]" size={20} />
            مؤشرات الاختراق (IOCs)
          </h2>
          <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1 uppercase tracking-widest">REAL_TIME_THREAT_INTELLIGENCE_FEED</p>
        </div>
        <div className="px-3 py-1 rounded bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.1)] text-[10px] font-mono text-[var(--accent-cyan)]">
          TOTAL_IOCS: {iocs.length}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        {iocs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-50 space-y-4">
            <ShieldAlert size={48} strokeWidth={1} />
            <p className="text-xs font-mono uppercase tracking-widest">No active threats detected in feeds</p>
          </div>
        ) : (
          iocs.map((ioc, index) => (
            <motion.div
              key={ioc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-[var(--radius-md)] bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] hover:border-[rgba(255,255,255,0.1)] transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded bg-[rgba(255,255,255,0.03)] ${getSeverityColor(ioc.severity)}`}>
                    {getTypeIcon(ioc.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">{ioc.type}</span>
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)] ${getSeverityColor(ioc.severity)}`}>
                        {ioc.severity}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[var(--text-secondary)] break-all group-hover:text-[var(--accent-cyan)] transition-colors">
                      {ioc.value}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] font-mono text-[var(--text-muted)] mb-1">{ioc.timestamp}</div>
                  <div className="text-[8px] font-bold text-[var(--accent-cyan)] uppercase tracking-tighter">{ioc.source}</div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
