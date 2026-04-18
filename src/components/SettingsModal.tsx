import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { X, Settings, Shield, Bell, Monitor, Database, Lock, Cpu, Key, Eye, EyeOff, Globe, Plus, Trash2, RefreshCw, Zap, Layout, Brain, Keyboard, SlidersHorizontal } from 'lucide-react';
import { ThreatFeed, LayoutConfig } from '../types';
import { DEFAULT_FEEDS, DEFAULT_LAYOUT_CONFIG } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  layoutConfig: LayoutConfig;
  onLayoutChange: (config: LayoutConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, layoutConfig, onLayoutChange }) => {
  const [shodanKey, setShodanKey] = useState('');
  const [vtKey, setVtKey] = useState('');
  const [aiKey, setAiKey] = useState('');
  const [showShodanKey, setShowShodanKey] = useState(false);
  const [showVtKey, setShowVtKey] = useState(false);
  const [showAiKey, setShowAiKey] = useState(false);
  const [feeds, setFeeds] = useState<ThreatFeed[]>([]);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedName, setNewFeedName] = useState('');
  const [isHackerMode, setIsHackerMode] = useState(true);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(60); // seconds
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());
  const [localLayout, setLocalLayout] = useState<LayoutConfig>(layoutConfig);

  useEffect(() => {
    setLocalLayout(layoutConfig);
  }, [layoutConfig]);

  useEffect(() => {
    const savedShodan = localStorage.getItem('sentinel_shodan_key') || '';
    setShodanKey(savedShodan);
    const savedVt = localStorage.getItem('sentinel_vt_key') || '';
    setVtKey(savedVt);
    const savedAi = localStorage.getItem('GEMINI_API_KEY') || '';
    setAiKey(savedAi);
    
    const savedFeeds = localStorage.getItem('sentinel_threat_feeds');
    if (savedFeeds) {
      setFeeds(JSON.parse(savedFeeds));
    } else {
      setFeeds(DEFAULT_FEEDS);
    }

    const savedAutoUpdate = localStorage.getItem('sentinel_auto_update');
    if (savedAutoUpdate !== null) setAutoUpdateEnabled(JSON.parse(savedAutoUpdate));

    const savedInterval = localStorage.getItem('sentinel_update_interval');
    if (savedInterval) setUpdateInterval(JSON.parse(savedInterval));
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('sentinel_shodan_key', shodanKey);
    localStorage.setItem('sentinel_vt_key', vtKey);
    localStorage.setItem('GEMINI_API_KEY', aiKey);
    localStorage.setItem('sentinel_threat_feeds', JSON.stringify(feeds));
    localStorage.setItem('sentinel_auto_update', JSON.stringify(autoUpdateEnabled));
    localStorage.setItem('sentinel_update_interval', JSON.stringify(updateInterval));
    onLayoutChange(localLayout);
    onClose();
  };

  const addFeed = () => {
    if (!newFeedUrl || !newFeedName) return;
    const newFeed: ThreatFeed = {
      id: `f-${Date.now()}`,
      name: newFeedName,
      url: newFeedUrl,
      enabled: true
    };
    setFeeds([...feeds, newFeed]);
    setNewFeedUrl('');
    setNewFeedName('');
  };

  const removeFeed = (id: string) => {
    setFeeds(feeds.filter(f => f.id !== id));
  };

  const toggleFeed = (id: string) => {
    setFeeds(feeds.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[rgba(26,34,52,0.5)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-[rgba(0,240,255,0.1)] text-[var(--accent-cyan)]">
                  <Settings size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-[var(--text-primary)]">إعدادات النظام المركزية</h2>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest">SENTINEL_CORE_CONFIG_V4.2</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
              {/* Section: Security */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--accent-cyan)]">
                  <Shield size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">بروتوكولات الأمان والذكاء الاصطناعي</h3>
                </div>
                
                {/* External API Keys */}
                <div className="p-4 rounded-lg bg-[rgba(0,240,255,0.03)] border border-[var(--border-color)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-[var(--accent-cyan)]" />
                      <span className="text-xs font-bold text-[var(--text-primary)]">مفاتيح الوصول الخارجية (API Keys)</span>
                    </div>
                    <div className="text-[9px] text-[var(--text-muted)] font-mono">EXTERNAL_INTEGRATIONS</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase text-[var(--text-muted)]">Shodan API Key</label>
                      <div className="relative">
                        <input 
                          type={showShodanKey ? "text" : "password"}
                          value={shodanKey}
                          onChange={(e) => setShodanKey(e.target.value)}
                          placeholder="أدخل مفتاح Shodan..."
                          className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-4 py-2 text-xs text-[var(--text-primary)] font-mono focus:border-[var(--accent-cyan)] outline-none transition-all pr-10"
                        />
                        <button 
                          onClick={() => setShowShodanKey(!showShodanKey)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
                        >
                          {showShodanKey ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase text-[var(--text-muted)]">VirusTotal API Key</label>
                      <div className="relative">
                        <input 
                          type={showVtKey ? "text" : "password"}
                          value={vtKey}
                          onChange={(e) => setVtKey(e.target.value)}
                          placeholder="أدخل مفتاح VirusTotal..."
                          className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-4 py-2 text-xs text-[var(--text-primary)] font-mono focus:border-[var(--accent-cyan)] outline-none transition-all pr-10"
                        />
                        <button 
                          onClick={() => setShowVtKey(!showVtKey)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
                        >
                          {showVtKey ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase text-[var(--text-muted)]">Gemini AI API Key</label>
                      <div className="relative">
                        <input 
                          type={showAiKey ? "text" : "password"}
                          value={aiKey}
                          onChange={(e) => setAiKey(e.target.value)}
                          placeholder="أدخل مفتاح Gemini API..."
                          className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-4 py-2 text-xs text-[var(--text-primary)] font-mono focus:border-[var(--accent-cyan)] outline-none transition-all pr-10"
                        />
                        <button 
                          onClick={() => setShowAiKey(!showAiKey)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
                        >
                          {showAiKey ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] text-[var(--text-muted)] leading-relaxed">
                    تُستخدم هذه المفاتيح لربط النظام بقواعد بيانات التهديدات العالمية. يتم تخزينها محلياً في متصفحك فقط.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">التشفير الكمي</div>
                      <div className="text-[10px] text-[var(--text-muted)]">تأمين قنوات الاتصال بتشفير AES-256</div>
                    </div>
                    <div className="w-10 h-5 rounded-full bg-[var(--accent-cyan)] relative cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 left-5.5" />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">وضع التخفي (Stealth Mode)</div>
                      <div className="text-[10px] text-[var(--text-muted)]">إخفاء بصمة النظام وتغيير المظهر للتمويه</div>
                    </div>
                    <div 
                      onClick={() => setLocalLayout({ ...localLayout, stealthMode: !localLayout.stealthMode })}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${localLayout.stealthMode ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--bg-input)] border border-[var(--border-color)]'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${localLayout.stealthMode ? 'left-5.5' : 'left-0.5'}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Interface */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--accent-purple)]">
                  <Monitor size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">تخصيص الواجهة</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-xs text-[var(--text-secondary)]">سمة النظام (Theme)</span>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0A0E17] border-2 border-[var(--accent-cyan)] cursor-pointer" />
                      <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[var(--border-color)] cursor-pointer" />
                      <div className="w-6 h-6 rounded-full bg-[#0F172A] border border-[var(--border-color)] cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-xs text-[var(--text-secondary)]">سرعة الرسوم المتحركة</span>
                    <input type="range" className="w-32 accent-[var(--accent-purple)]" />
                  </div>
                  <div className="p-4 rounded-lg bg-[rgba(170,85,255,0.05)] border border-[rgba(170,85,255,0.1)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap size={16} className="text-[var(--accent-purple)]" />
                      <div>
                        <div className="text-xs font-bold text-[var(--text-primary)]">وضع المحترف (Pro Hacker Mode)</div>
                        <div className="text-[10px] text-[var(--text-muted)] t-muted">تفعيل المؤثرات البصرية والتحليلية المتقدمة</div>
                      </div>
                    </div>
                    <div 
                      onClick={() => setIsHackerMode(!isHackerMode)}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${isHackerMode ? 'bg-[var(--accent-purple)]' : 'bg-[var(--bg-input)] border border-[var(--border-color)]'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${isHackerMode ? 'left-5.5' : 'left-0.5'}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Layout Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--accent-cyan)]">
                  <Layout size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">تكوين المخطط والوحدات</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'showSidebarLeft', name: 'القائمة اليسرى (AI)', icon: Brain },
                    { id: 'showSidebarRight', name: 'القائمة اليمنى (Stats)', icon: Database },
                    { id: 'showTopBar', name: 'الشريط العلوي', icon: Monitor },
                    { id: 'showBottomBar', name: 'الشريط السفلي', icon: Layout },
                    { id: 'showSystemStatus', name: 'حالة النظام', icon: Cpu },
                    { id: 'showNeuralCoPilot', name: 'المساعد العصبي', icon: Zap },
                    { id: 'showMasterControl', name: 'لوحة التحكم الديناميكية', icon: SlidersHorizontal },
                  ].map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between group hover:border-[var(--accent-cyan)] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)]" />
                        <span className="text-[11px] font-bold text-[var(--text-secondary)]">{item.name}</span>
                      </div>
                      <div 
                        onClick={() => setLocalLayout({ ...localLayout, [item.id]: !localLayout[item.id as keyof LayoutConfig] })}
                        className={`w-8 h-4 rounded-full relative cursor-pointer transition-all ${localLayout[item.id as keyof LayoutConfig] ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--bg-input)] border border-[var(--border-color)]'}`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${localLayout[item.id as keyof LayoutConfig] ? 'left-4.5' : 'left-0.5'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Desktop Icon Customization */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--accent-purple)]">
                  <Monitor size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">تخصيص أيقونات سطح المكتب</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-lg bg-[rgba(170,85,255,0.03)] border border-[var(--border-color)]">
                  {localLayout.desktopIcons?.map((icon, index) => (
                    <div key={icon.id} className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded bg-[rgba(255,255,255,0.05)]`} style={{ color: icon.color }}>
                            {React.createElement((LucideIcons as any)[icon.iconName] || LucideIcons.HelpCircle, { size: 14 })}
                          </div>
                          <span className="text-[11px] font-bold text-[var(--text-primary)]">{icon.name}</span>
                        </div>
                        <div 
                          onClick={() => {
                            const newIcons = [...localLayout.desktopIcons];
                            newIcons[index] = { ...newIcons[index], isVisible: !newIcons[index].isVisible };
                            setLocalLayout({ ...localLayout, desktopIcons: newIcons });
                          }}
                          className={`w-8 h-4 rounded-full relative cursor-pointer transition-all ${icon.isVisible ? 'bg-[var(--accent-purple)]' : 'bg-[var(--bg-input)] border border-[var(--border-color)]'}`}
                        >
                          <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${icon.isVisible ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase text-[var(--text-muted)]">الاسم</label>
                          <input 
                            type="text"
                            value={icon.name}
                            onChange={(e) => {
                              const newIcons = [...localLayout.desktopIcons];
                              newIcons[index] = { ...newIcons[index], name: e.target.value };
                              setLocalLayout({ ...localLayout, desktopIcons: newIcons });
                            }}
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded px-2 py-1 text-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-purple)]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase text-[var(--text-muted)]">الأيقونة</label>
                          <input 
                            type="text"
                            value={icon.iconName}
                            onChange={(e) => {
                              const newIcons = [...localLayout.desktopIcons];
                              newIcons[index] = { ...newIcons[index], iconName: e.target.value };
                              setLocalLayout({ ...localLayout, desktopIcons: newIcons });
                            }}
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded px-2 py-1 text-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-purple)]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[8px] text-[var(--text-muted)] leading-relaxed italic">
                  * يمكنك تغيير أسماء الأيقونات ونوعها (باستخدام أسماء Lucide Icons) وإخفائها من سطح المكتب.
                </p>
              </div>

              {/* Section: Keyboard Shortcuts */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--accent-orange)]">
                  <Keyboard size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">اختصارات لوحة المفاتيح</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-[rgba(255,136,0,0.03)] border border-[var(--border-color)]">
                  {[
                    { id: 'openPayload', name: 'فتح مولد الحمولات' },
                    { id: 'switchTerminal', name: 'التبديل للمبنى الرئيسي' },
                    { id: 'switchAI', name: 'التبديل للمساعد العصبي' },
                    { id: 'switchTargets', name: 'التبديل للأهداف' },
                    { id: 'executeCommand', name: 'تنفيذ الأمر' },
                    { id: 'toggleSidebarLeft', name: 'تبديل القائمة اليسرى' },
                    { id: 'toggleSidebarRight', name: 'تبديل القائمة اليمنى' },
                  ].map((shortcut) => (
                    <div key={shortcut.id} className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase text-[var(--text-muted)]">{shortcut.name}</label>
                      <input 
                        type="text"
                        value={localLayout.shortcuts[shortcut.id as keyof typeof localLayout.shortcuts]}
                        onChange={(e) => setLocalLayout({
                          ...localLayout,
                          shortcuts: {
                            ...localLayout.shortcuts,
                            [shortcut.id]: e.target.value
                          }
                        })}
                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono focus:border-[var(--accent-orange)] outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-[var(--text-muted)] leading-relaxed italic">
                  * استخدم مفاتيح مفردة (مثلاً: p, t, a, s) أو مفاتيح خاصة (مثلاً: Enter).
                </p>
              </div>

              {/* Section: Threat Intelligence Feeds */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--accent-red)]">
                  <Globe size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">مصادر استخبارات التهديدات (Feeds)</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Auto-update settings */}
                  <div className="p-4 rounded-lg bg-[rgba(255,51,102,0.05)] border border-[rgba(255,51,102,0.1)] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RefreshCw size={16} className="text-[var(--accent-red)]" />
                        <div>
                          <div className="text-xs font-bold text-[var(--text-primary)]">تحديث تلقائي للاستخبارات</div>
                          <div className="text-[10px] text-[var(--text-muted)]">مزامنة المصادر بشكل دوري</div>
                        </div>
                      </div>
                      <div 
                        onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${autoUpdateEnabled ? 'bg-[var(--accent-red)]' : 'bg-[var(--bg-input)] border border-[var(--border-color)]'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${autoUpdateEnabled ? 'left-5.5' : 'left-0.5'}`} />
                      </div>
                    </div>

                    {autoUpdateEnabled && (
                      <div className="space-y-2 pt-2 border-t border-[rgba(255,51,102,0.1)]">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[var(--text-secondary)]">فترة التحديث (ثواني)</span>
                          <span className="text-[10px] font-mono text-[var(--accent-red)]">{updateInterval}s</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="3600" 
                          step="10"
                          value={updateInterval}
                          onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
                          className="w-full accent-[var(--accent-red)]" 
                        />
                        <div className="text-[8px] text-[var(--text-muted)] font-mono uppercase">
                          آخر مزامنة ناجحة: {lastSyncTime}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add New Feed */}
                  <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        value={newFeedName}
                        onChange={(e) => setNewFeedName(e.target.value)}
                        placeholder="اسم المصدر (مثلاً: OTX)"
                        className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded px-3 py-2 text-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-red)]"
                      />
                      <input 
                        type="text" 
                        value={newFeedUrl}
                        onChange={(e) => setNewFeedUrl(e.target.value)}
                        placeholder="رابط الـ Feed (URL)"
                        className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded px-3 py-2 text-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-red)]"
                      />
                    </div>
                    <button 
                      onClick={addFeed}
                      className="w-full py-2 bg-[rgba(255,51,102,0.1)] border border-[rgba(255,51,102,0.2)] text-[var(--accent-red)] rounded text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-[var(--accent-red)] hover:text-white transition-all"
                    >
                      <Plus size={14} />
                      إضافة مصدر جديد
                    </button>
                  </div>

                  {/* Feeds List */}
                  <div className="space-y-2">
                    {feeds.map(feed => (
                      <div key={feed.id} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] group">
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => toggleFeed(feed.id)}
                            className={`w-8 h-4 rounded-full relative cursor-pointer transition-all ${feed.enabled ? 'bg-[var(--accent-red)]' : 'bg-[var(--bg-input)] border border-[var(--border-color)]'}`}
                          >
                            <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${feed.enabled ? 'left-4.5' : 'left-0.5'}`} />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-[var(--text-primary)]">{feed.name}</div>
                            <div className="text-[8px] text-[var(--text-muted)] font-mono truncate max-w-[200px]">{feed.url}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors">
                            <RefreshCw size={12} />
                          </button>
                          <button 
                            onClick={() => removeFeed(feed.id)}
                            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section: System */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--accent-orange)]">
                  <Cpu size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest">أداء النظام</h3>
                </div>
                <div className="p-4 rounded-lg bg-[rgba(255,136,0,0.05)] border border-[rgba(255,136,0,0.1)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database size={16} className="text-[var(--accent-orange)]" />
                      <span className="text-xs font-bold text-[var(--text-primary)]">مسح ذاكرة التخزين المؤقت</span>
                    </div>
                    <button className="px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded text-[10px] font-bold uppercase hover:bg-[var(--accent-red)] hover:text-white transition-all">تنفيذ المسح</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock size={16} className="text-[var(--accent-orange)]" />
                      <span className="text-xs font-bold text-[var(--text-primary)]">إعادة تعيين مفاتيح الوصول</span>
                    </div>
                    <button className="px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded text-[10px] font-bold uppercase hover:bg-[var(--accent-orange)] hover:text-white transition-all">إعادة تعيين</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[rgba(26,34,52,0.5)] flex justify-between items-center">
              <div className="flex items-center gap-2 text-[9px] font-mono text-[var(--text-muted)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
                <span>جميع الأنظمة تعمل بكفاءة</span>
              </div>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-[var(--accent-cyan)] text-[var(--bg-primary)] rounded-md font-black text-[10px] uppercase tracking-[2px] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all active:scale-95"
              >
                حفظ وإغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
