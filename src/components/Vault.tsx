import React from 'react';
import { motion } from 'motion/react';
import { Lock, Key, ShieldAlert, Database, User, Terminal, Copy, Check } from 'lucide-react';
import { Credential, Vulnerability } from '../types';

interface VaultProps {
  credentials: Credential[];
  vulnerabilities: Vulnerability[];
}

export const Vault: React.FC<VaultProps> = ({ credentials, vulnerabilities }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-secondary)] p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black uppercase tracking-[3px] text-[var(--text-primary)] flex items-center gap-3">
            <Lock className="text-[var(--accent-purple)]" size={20} />
            مستودع البيانات المستخرجة (The Vault)
          </h2>
          <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1 uppercase tracking-widest">SECURE_DATA_EXFILTRATION_REPOSITORY</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Credentials Section */}
        <div className="flex flex-col overflow-hidden bg-[rgba(10,14,23,0.4)] border border-[var(--border-color)] rounded-[var(--radius-lg)]">
          <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[rgba(170,85,255,0.05)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key size={14} className="text-[var(--accent-purple)]" />
              <span className="text-xs font-black uppercase tracking-wider">بيانات الاعتماد (Credentials)</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--accent-purple)]">{credentials.length} ITEMS</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-2">
            {credentials.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-30 space-y-2">
                <User size={32} />
                <p className="text-[10px] uppercase tracking-widest">No credentials harvested yet</p>
              </div>
            ) : (
              credentials.map((cred) => (
                <div key={cred.id} className="p-3 rounded-md bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] hover:border-[rgba(170,85,255,0.3)] transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)]" />
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{cred.type}</span>
                    </div>
                    <span className="text-[8px] font-mono text-[var(--text-muted)]">{cred.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xs font-mono text-[var(--text-primary)] flex items-center gap-2">
                        <span className="text-[var(--text-muted)]">USER:</span> {cred.username}
                      </div>
                      <div className="text-xs font-mono text-[var(--accent-cyan)] flex items-center gap-2">
                        <span className="text-[var(--text-muted)]">PASS:</span> {cred.password || cred.hash?.substring(0, 16) + '...'}
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(cred.password || cred.hash || '', cred.id)}
                      className="p-2 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
                    >
                      {copiedId === cred.id ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vulnerabilities Section */}
        <div className="flex flex-col overflow-hidden bg-[rgba(10,14,23,0.4)] border border-[var(--border-color)] rounded-[var(--radius-lg)]">
          <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[rgba(255,51,102,0.05)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-[var(--accent-red)]" />
              <span className="text-xs font-black uppercase tracking-wider">الثغرات المكتشفة (Vulnerabilities)</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--accent-red)]">{vulnerabilities.length} DETECTED</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-2">
            {vulnerabilities.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-30 space-y-2">
                <Database size={32} />
                <p className="text-[10px] uppercase tracking-widest">No vulnerabilities identified</p>
              </div>
            ) : (
              vulnerabilities.map((vuln) => (
                <div key={vuln.id} className="p-3 rounded-md bg-[rgba(255,51,102,0.02)] border border-[var(--border-color)] hover:border-[rgba(255,51,102,0.3)] transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-[var(--accent-red)]">{vuln.cve}</span>
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        vuln.severity === 'critical' ? 'bg-[rgba(255,51,102,0.2)] text-[var(--accent-red)]' :
                        vuln.severity === 'high' ? 'bg-[rgba(255,136,0,0.2)] text-[var(--accent-orange)]' :
                        'bg-[rgba(0,240,255,0.2)] text-[var(--accent-cyan)]'
                      }`}>
                        {vuln.severity}
                      </span>
                    </div>
                    <div className={`text-[8px] font-bold uppercase ${vuln.status === 'exploited' ? 'text-[var(--accent-green)]' : 'text-[var(--text-muted)]'}`}>
                      {vuln.status}
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{vuln.description}</p>
                  {vuln.status === 'detected' && (
                    <button className="mt-3 w-full py-1.5 bg-[rgba(255,51,102,0.1)] border border-[rgba(255,51,102,0.2)] text-[var(--accent-red)] rounded text-[9px] font-black uppercase hover:bg-[var(--accent-red)] hover:text-white transition-all">
                      بدء عملية الاستغلال (Exploit)
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
