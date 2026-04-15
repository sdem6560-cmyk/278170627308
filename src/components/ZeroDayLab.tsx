import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bug, Zap, ShieldAlert, Terminal, Cpu, Binary, Search } from 'lucide-react';

export const ZeroDayLab: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [foundExploit, setFoundExploit] = useState<any>(null);

  const startResearch = () => {
    setIsGenerating(true);
    setProgress(0);
    setLogs(['[INIT]: Initializing Zero-Day Research Module...', '[SCAN]: Analyzing kernel memory patterns...', '[SCAN]: Fuzzing network stack...']);
    setFoundExploit(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          const exploit = {
            id: `0D-${Math.floor(Math.random() * 10000)}`,
            name: 'Kernel_Heap_Overflow_Bypass',
            severity: 'CRITICAL',
            target: 'Linux Kernel 5.10 - 6.2',
            payload: 'reverse_tcp_stager_obfuscated'
          };
          setFoundExploit(exploit);
          setLogs(prevLogs => [...prevLogs, `[SUCCESS]: Zero-Day Exploit Generated: ${exploit.id}`, '[FINISH]: Payload ready for deployment.']);
          return 100;
        }
        
        const newProgress = prev + Math.random() * 5;
        if (Math.random() > 0.8) {
          const techLogs = [
            '[FUZZ]: Found interesting crash at 0x7ffd...',
            '[ANALYSIS]: Potential ROP chain identified.',
            '[BYPASS]: ASLR offset calculated.',
            '[GEN]: Crafting polymorphic shellcode...'
          ];
          setLogs(prevLogs => [...prevLogs, techLogs[Math.floor(Math.random() * techLogs.length)]].slice(-6));
        }
        return newProgress;
      });
    }, 200);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[var(--bg-panel)] overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[rgba(255,51,102,0.1)] rounded-lg text-[var(--accent-red)]">
            <Bug size={24} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-[4px] text-[var(--text-primary)]">Zero-Day Research Lab</h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">UNRESTRICTED EXPLOIT GENERATION CORE</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-[var(--accent-red)] uppercase tracking-widest">Risk Level</span>
            <span className="text-lg font-mono font-bold text-[var(--accent-red)]">EXTREME</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="glass-panel p-6 border border-[rgba(255,51,102,0.2)] rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-[rgba(255,51,102,0.05)] to-transparent opacity-50" />
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-[var(--accent-red)]" />
              محرك التوليد المستقل
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              هذا المحرك يستخدم تقنيات Fuzzing متقدمة لاكتشاف ثغرات غير معروفة (0-Day) في أنظمة التشغيل والبرمجيات. العمليات هنا تتم دون قيود برمجية.
            </p>
            
            <button 
              onClick={startResearch}
              disabled={isGenerating}
              className={`w-full py-4 rounded-lg font-black text-sm uppercase tracking-[4px] transition-all relative overflow-hidden ${
                isGenerating 
                  ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed' 
                  : 'bg-[var(--accent-red)] text-[var(--bg-primary)] hover:shadow-[0_0_30px_rgba(255,51,102,0.4)] active:scale-95'
              }`}
            >
              <span className="relative z-10">{isGenerating ? 'جاري التوليد...' : 'بدء عملية التوليد الكبرى'}</span>
              {isGenerating && (
                <motion.div 
                  className="absolute inset-0 bg-[rgba(255,255,255,0.1)]"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              )}
            </button>
          </div>

          <div className="flex-1 glass-panel p-4 border border-[var(--border-color)] rounded-xl font-mono text-[10px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-2 border-b border-[var(--border-color)] pb-2">
              <span className="text-[var(--text-muted)] uppercase tracking-widest">Research_Logs</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-red)] animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)] animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse delay-150" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className={`animate-in fade-in slide-in-from-left-2 duration-300 ${log.includes('SUCCESS') ? 'text-[var(--accent-green)]' : log.includes('INIT') ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-secondary)]'}`}>
                  {log}
                </div>
              ))}
              {isGenerating && (
                <div className="flex items-center gap-2 text-[var(--accent-red)]">
                  <span className="animate-pulse">_</span>
                  <span>جاري تحليل الثغرات...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {foundExploit ? (
              <motion.div 
                key="exploit-found"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex-1 glass-panel p-6 border-2 border-[var(--accent-green)] rounded-xl bg-[rgba(0,255,157,0.02)] flex flex-col"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[rgba(0,255,157,0.1)] rounded-full text-[var(--accent-green)]">
                    <Zap size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-[var(--accent-green)] uppercase tracking-[3px]">Exploit Generated</div>
                    <div className="text-lg font-bold font-mono text-[var(--text-primary)]">{foundExploit.name}</div>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-color)]">
                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase mb-1">CVE_ID</div>
                    <div className="text-sm font-mono text-[var(--accent-cyan)]">{foundExploit.id}</div>
                  </div>
                  <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-color)]">
                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase mb-1">Target_Scope</div>
                    <div className="text-sm font-mono text-[var(--text-primary)]">{foundExploit.target}</div>
                  </div>
                  <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-color)]">
                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase mb-1">Payload_Type</div>
                    <div className="text-sm font-mono text-[var(--accent-orange)]">{foundExploit.payload}</div>
                  </div>
                </div>

                <button className="w-full mt-6 py-3 bg-[var(--accent-green)] text-[var(--bg-primary)] rounded-lg font-black text-xs uppercase tracking-[2px] hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all">
                  حقن الثغرة في الهدف النشط
                </button>
              </motion.div>
            ) : (
              <div className="flex-1 glass-panel border border-dashed border-[var(--border-color)] rounded-xl flex flex-col items-center justify-center text-center p-8 opacity-40">
                <Binary size={48} className="text-[var(--text-muted)] mb-4" />
                <div className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">في انتظار توليد الثغرة</div>
                <p className="text-[10px] text-[var(--text-muted)] mt-2">ابدأ عملية البحث لتوليد كود استغلال فريد</p>
              </div>
            )}
          </AnimatePresence>

          <div className="glass-panel p-4 border border-[var(--border-color)] rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Neural_Sync_Progress</span>
              <span className="text-[10px] font-mono text-[var(--accent-red)]">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-[var(--bg-input)] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[var(--accent-red)]"
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
