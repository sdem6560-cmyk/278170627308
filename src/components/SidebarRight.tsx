import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Zap, ShieldAlert, Settings, Target as TargetIcon, Radio, ChevronLeft, SlidersHorizontal, Filter, Layers, Brain, Sparkles, AlertTriangle, Globe, Info } from 'lucide-react';
import { Target, ArsenalItem, RadarEvent } from '../types';
import { getExploitRecommendation } from '../services/geminiService';

interface SidebarRightProps {
  targets: Target[];
  activeTargetId: string | null;
  onTargetSelect: (id: string) => void;
  onAddTarget?: (ip: string) => void;
  arsenal: ArsenalItem[];
  radar: RadarEvent[];
  onUpdateParam?: (itemId: string, paramId: string, newValue: any) => void;
  onAction?: (action: string) => void;
  isVisible?: boolean;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({ 
  targets, 
  activeTargetId, 
  onTargetSelect, 
  onAddTarget,
  arsenal,
  radar,
  onUpdateParam,
  onAction,
  isVisible = true
}) => {
  const [tuningItemId, setTuningItemId] = useState<string | null>(null);
  const [hoveredArsenalId, setHoveredArsenalId] = useState<string | null>(null);
  const [newTargetIp, setNewTargetIp] = useState('');
  const [groupBy, setGroupBy] = useState<'none' | 'os' | 'status'>('none');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    recommendation: string;
    exploitId: string;
    confidence: number;
    riskLevel: string;
  } | null>(null);

  const activeTarget = useMemo(() => targets.find(t => t.id === activeTargetId), [targets, activeTargetId]);

  const handleAnalyze = async () => {
    if (!activeTarget) return;
    setIsAnalyzing(true);
    setRecommendation(null);
    try {
      // Ensure target shape explicitly strings out the ports and services for the prompt
      const targetPayload = {
        ...activeTarget,
        open_ports: activeTarget.ports || [],
        running_services: activeTarget.services || []
      };
      
      const result = await getExploitRecommendation(targetPayload, arsenal);
      setRecommendation(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isVisible) return null;

  const tuningItem = arsenal.find(i => i.id === tuningItemId);

  const groupedTargets = useMemo(() => {
    if (groupBy === 'none') return { 'الكل': targets };
    
    return targets.reduce((acc, target) => {
      let key = 'أخرى';
      if (groupBy === 'os') {
        key = target.os ? target.os.split(' ')[0] : 'غير معروف';
      } else if (groupBy === 'status') {
        key = target.status === 'online' ? 'متصل' : target.status === 'scanning' ? 'جاري المسح' : 'غير متصل';
      }
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(target);
      return acc;
    }, {} as Record<string, Target[]>);
  }, [targets, groupBy]);

  return (
    <aside className="w-full md:w-[280px] bg-[var(--bg-secondary)] border-l border-[var(--border-color)] flex flex-col shrink-0 overflow-hidden glass-panel relative z-20">
      {tuningItemId && tuningItem ? (
        <div className="flex flex-col flex-1 overflow-hidden animate-in slide-in-from-left duration-300">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-color)] bg-[rgba(26,34,52,0.8)] shrink-0">
            <button 
              onClick={() => setTuningItemId(null)}
              className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--accent-cyan)]">إعدادات الأداة</div>
              <div className="text-[12px] font-bold font-mono text-[var(--text-primary)] truncate">{tuningItem.name}</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-5">
            {tuningItem.params && tuningItem.params.length > 0 ? (
              tuningItem.params.map(param => (
                <div key={param.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{param.name}</label>
                    <span className="text-[9px] font-mono text-[var(--accent-cyan)]">{String(param.value)}</span>
                  </div>
                  
                  {param.type === 'text' && (
                    <input 
                      type="text"
                      value={String(param.value)}
                      onChange={(e) => onUpdateParam?.(tuningItem.id, param.id, e.target.value)}
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-cyan)] outline-none transition-colors font-mono"
                    />
                  )}

                  {param.type === 'number' && (
                    <input 
                      type="range"
                      min="1"
                      max="10"
                      value={Number(param.value)}
                      onChange={(e) => onUpdateParam?.(tuningItem.id, param.id, parseInt(e.target.value))}
                      className="w-full accent-[var(--accent-cyan)]"
                    />
                  )}

                  {param.type === 'toggle' && (
                    <button 
                      onClick={() => onUpdateParam?.(tuningItem.id, param.id, !param.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md border transition-all duration-300 ${
                        param.value 
                          ? 'bg-[rgba(0,240,255,0.1)] border-[var(--accent-cyan)] text-[var(--accent-cyan)]' 
                          : 'bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-muted)]'
                      }`}
                    >
                      <span className="text-xs font-bold uppercase">{param.value ? 'نشط' : 'معطل'}</span>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${param.value ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--text-muted)]'}`}>
                        <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${param.value ? 'left-4.5' : 'left-0.5'}`} />
                      </div>
                    </button>
                  )}

                  {param.type === 'select' && (
                    <select 
                      value={String(param.value)}
                      onChange={(e) => onUpdateParam?.(tuningItem.id, param.id, e.target.value)}
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-cyan)] outline-none transition-colors font-mono"
                    >
                      {param.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-50 py-10">
                <Settings size={32} className="text-[var(--text-muted)]" />
                <div className="text-xs font-medium text-[var(--text-muted)]">لا توجد معلمات قابلة للتعديل لهذه الأداة</div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[var(--border-color)] bg-[rgba(26,34,52,0.5)] space-y-2">
            <button 
              onClick={() => {
                onAction?.(tuningItem.type === 'scan' ? 'scan' : tuningItem.type === 'exploit' ? 'exploit' : tuningItem.name.toLowerCase());
                setTuningItemId(null);
              }}
              className="w-full py-2.5 bg-[var(--accent-orange)] text-[var(--bg-primary)] rounded-md font-bold text-[10px] uppercase tracking-[2px] hover:shadow-[0_0_15px_rgba(255,136,0,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap size={14} />
              تنفيذ الآن (Execute)
            </button>
            <button 
              onClick={() => setTuningItemId(null)}
              className="w-full py-2.5 bg-[var(--accent-cyan)] text-[var(--bg-primary)] rounded-md font-bold text-[10px] uppercase tracking-[2px] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all active:scale-95"
            >
              حفظ الإعدادات
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Targets Section */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-secondary)] border-b border-[var(--border-color)] bg-[rgba(26,34,52,0.5)] shrink-0">
              <div className="flex items-center gap-2">
                <TargetIcon size={14} className="text-[var(--accent-cyan)]" />
                <span>الأهداف النشطة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-[var(--bg-input)] rounded-md border border-[var(--border-color)] p-0.5">
                  <button 
                    onClick={() => setGroupBy('none')}
                    className={`p-1 rounded ${groupBy === 'none' ? 'bg-[var(--accent-cyan)] text-[var(--bg-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    title="No Grouping"
                  >
                    <Filter size={10} />
                  </button>
                  <button 
                    onClick={() => setGroupBy('os')}
                    className={`p-1 rounded ${groupBy === 'os' ? 'bg-[var(--accent-cyan)] text-[var(--bg-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    title="Group by OS"
                  >
                    <Layers size={10} />
                  </button>
                  <button 
                    onClick={() => setGroupBy('status')}
                    className={`p-1 rounded ${groupBy === 'status' ? 'bg-[var(--accent-cyan)] text-[var(--bg-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    title="Group by Status"
                  >
                    <Radio size={10} />
                  </button>
                </div>
                <span className="bg-[var(--bg-input)] px-2.5 py-0.5 rounded-full text-[9px] text-[var(--accent-cyan)] border border-[rgba(0,240,255,0.2)] font-mono">{targets.length}</span>
              </div>
            </div>
            
            <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[rgba(0,240,255,0.02)] space-y-2 shrink-0">
              <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-70">إضافة هدف جديد (New Target)</div>
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan)] transition-colors">
                    <Globe size={12} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter IP (e.g. 10.0.0.5)"
                    value={newTargetIp}
                    onChange={(e) => setNewTargetIp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTargetIp.trim()) {
                        onAddTarget?.(newTargetIp.trim());
                        setNewTargetIp('');
                      }
                    }}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] font-mono outline-none focus:border-[var(--accent-cyan)] focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all"
                  />
                </div>
                <button 
                  onClick={() => {
                    if (newTargetIp.trim()) {
                      onAddTarget?.(newTargetIp.trim());
                      setNewTargetIp('');
                    }
                  }}
                  disabled={!newTargetIp.trim()}
                  className="px-3 bg-[var(--accent-cyan)] text-[var(--bg-primary)] rounded-md font-bold text-[10px] uppercase hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 whitespace-nowrap"
                >
                  إضافة
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {(Object.entries(groupedTargets) as [string, Target[]][]).map(([groupName, groupTargets]) => (
                <div key={groupName} className="mb-4">
                  {groupBy !== 'none' && (
                    <div className="px-2 py-1 mb-2 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center">
                      <span>{groupName}</span>
                      <span className="opacity-50">{groupTargets.length}</span>
                    </div>
                  )}
                  {groupTargets.map(target => (
                    <div 
                      key={target.id}
                      onClick={() => onTargetSelect(target.id)}
                      className={`flex items-center gap-4 md:gap-3 p-3.5 md:p-2.5 rounded-[var(--radius-lg)] md:rounded-[var(--radius-md)] mb-2 md:mb-1 cursor-pointer transition-all duration-300 border-r-4 relative overflow-hidden group ${
                        activeTargetId === target.id 
                          ? 'bg-[rgba(0,240,255,0.1)] border-r-[var(--accent-cyan)] shadow-[inset_0_0_15px_rgba(0,240,255,0.05)]' 
                          : 'border-r-transparent hover:bg-[rgba(255,255,255,0.04)]'
                      }`}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-[rgba(0,240,255,0.03)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <div className={`w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor] ${
                        target.status === 'online' ? 'text-[var(--accent-green)] bg-[var(--accent-green)]' : 
                        target.status === 'scanning' ? 'text-[var(--accent-orange)] bg-[var(--accent-orange)] animate-pulse' : 
                        'text-[var(--text-muted)] bg-[var(--text-muted)]'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-[12px] font-bold font-mono transition-colors ${activeTargetId === target.id ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'}`}>
                          {target.name}
                        </div>
                        <div className="hidden md:block text-[10px] text-[var(--text-muted)] font-medium truncate">{target.ip} {target.os && `| ${target.os}`}</div>
                        <div className="md:hidden text-[10px] text-[var(--text-muted)] font-mono">{target.ip}</div>
                        {activeTargetId === target.id && (
                          <div className="mt-3 space-y-3">
                            {target.ports && (
                              <div className="flex flex-wrap gap-1">
                                {target.ports.map((port, idx) => (
                                  <span key={port} className="text-[8px] font-mono px-1.5 py-0.5 bg-[rgba(0,240,255,0.1)] text-[var(--accent-cyan)] rounded border border-[rgba(0,240,255,0.2)]" title={target.services?.[idx]}>
                                    {port}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAnalyze();
                              }}
                              disabled={isAnalyzing}
                              className="w-full py-1.5 bg-[rgba(170,85,255,0.1)] border border-[rgba(170,85,255,0.2)] text-[var(--accent-purple)] rounded text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--accent-purple)] hover:text-white transition-all disabled:opacity-50"
                            >
                              {isAnalyzing ? (
                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Brain size={12} />
                              )}
                              {isAnalyzing ? 'جاري التحليل...' : 'تحليل الذكاء الاصطناعي'}
                            </button>

                            {recommendation && activeTargetId === target.id && (
                              <div className="p-2.5 rounded bg-[rgba(170,85,255,0.05)] border border-[rgba(170,85,255,0.2)] space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-[var(--accent-purple)]">
                                    <Sparkles size={10} />
                                    <span className="text-[9px] font-black uppercase">توصية النظام</span>
                                  </div>
                                  <div className={`text-[8px] px-1.5 py-0.5 rounded font-mono uppercase ${
                                    recommendation.riskLevel === 'low' ? 'bg-green-500/10 text-green-500' :
                                    recommendation.riskLevel === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                    'bg-red-500/10 text-red-500'
                                  }`}>
                                    RISK: {recommendation.riskLevel}
                                  </div>
                                </div>
                                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed italic">
                                  "{recommendation.recommendation}"
                                </p>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAction?.(recommendation.exploitId);
                                  }}
                                  className="w-full py-1 bg-[var(--accent-purple)] text-white rounded text-[8px] font-bold uppercase tracking-tighter hover:brightness-110 transition-all"
                                >
                                  تنفيذ الاستغلال المقترح
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Arsenal Section */}
          <div className="flex flex-col flex-1 overflow-hidden border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between px-4 py-3.5 text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-secondary)] border-b border-[var(--border-color)] bg-[rgba(26,34,52,0.5)] shrink-0">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[var(--accent-orange)]" />
                <span>الترسانة الهجومية</span>
              </div>
              <span className="bg-[var(--bg-input)] px-2.5 py-0.5 rounded-full text-[9px] text-[var(--accent-orange)] border border-[rgba(255,136,0,0.2)] font-mono">{arsenal.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar relative">
              {arsenal.map(item => (
                <div 
                  key={item.id} 
                  onMouseEnter={() => setHoveredArsenalId(item.id)}
                  onMouseLeave={() => setHoveredArsenalId(null)}
                  onClick={() => onAction?.(item.type === 'scan' ? 'scan' : item.type === 'exploit' ? 'exploit' : item.name.toLowerCase())}
                  className="flex items-center gap-4 md:gap-3 p-3.5 md:p-2.5 rounded-[var(--radius-lg)] md:rounded-[var(--radius-md)] mb-2 md:mb-1 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300 group relative overflow-visible"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-[rgba(255,136,0,0.03)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredArsenalId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                        className="absolute right-full mr-2 top-0 w-64 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-2xl p-4 z-[100] backdrop-blur-xl pointer-events-none"
                        style={{ boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}
                      >
                        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[rgba(255,255,255,0.05)]">
                          <div className={`p-1.5 rounded bg-[rgba(255,255,255,0.05)] ${
                            item.type === 'scan' ? 'text-[var(--accent-cyan)]' :
                            item.type === 'exploit' ? 'text-[var(--accent-orange)]' :
                            'text-[var(--accent-green)]'
                          }`}>
                            {item.type === 'scan' ? <Search size={14} /> : <Zap size={14} />}
                          </div>
                          <div>
                            <div className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">{item.name}</div>
                            <div className="text-[8px] font-mono opacity-50 uppercase tracking-tighter">{item.type} module v1.0.4</div>
                          </div>
                        </div>
                        
                        <p className="text-[10px] text-[var(--text-secondary)] leading-tight mb-4">
                          {item.desc}
                        </p>

                        {item.params && item.params.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-[9px] font-bold uppercase text-[var(--text-muted)] border-b border-[rgba(255,255,255,0.05)] pb-1">Config Parameters</div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                              {item.params.slice(0, 4).map(p => (
                                <React.Fragment key={p.id}>
                                  <span className="text-[8px] font-mono text-[var(--text-muted)] truncate">{p.name}:</span>
                                  <span className="text-[8px] font-mono text-[var(--accent-cyan)] truncate text-right">
                                    {typeof p.value === 'boolean' ? (p.value ? 'ON' : 'OFF') : p.value}
                                  </span>
                                </React.Fragment>
                              ))}
                              {item.params.length > 4 && (
                                <span className="col-span-2 text-[7px] text-[var(--text-muted)] italic text-right">+ {item.params.length - 4} more</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[8px] font-mono text-[var(--accent-green)]">
                            <ShieldAlert size={8} /> AUTH_STABLE
                          </div>
                          <div className="text-[8px] font-mono text-[var(--text-muted)]">LATENCY: 14ms</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={`w-9 h-9 md:w-8 md:h-8 rounded-[var(--radius-sm)] flex items-center justify-center text-sm shrink-0 transition-transform group-hover:scale-110 ${
                    item.type === 'scan' ? 'bg-[rgba(0,240,255,0.1)] text-[var(--accent-cyan)] border border-[rgba(0,240,255,0.1)]' :
                    item.type === 'exploit' ? 'bg-[rgba(255,136,0,0.1)] text-[var(--accent-orange)] border border-[rgba(255,136,0,0.1)]' :
                    item.type === 'post' ? 'bg-[rgba(255,51,102,0.1)] text-[var(--accent-red)] border border-[rgba(255,51,102,0.1)]' :
                    'bg-[rgba(0,255,157,0.1)] text-[var(--accent-green)] border border-[rgba(0,255,157,0.1)]'
                  }`}>
                    {item.type === 'scan' && <Search size={16} />}
                    {item.type === 'exploit' && <Zap size={16} />}
                    {item.type === 'post' && <ShieldAlert size={16} />}
                    {item.type === 'util' && <Settings size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold font-mono text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors truncate">{item.name}</div>
                    <div className="hidden md:block text-[10px] text-[var(--text-muted)] font-medium truncate">{item.desc}</div>
                  </div>
                  {item.params && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setTuningItemId(item.id);
                      }}
                      className="p-1.5 rounded-md hover:bg-[rgba(0,240,255,0.1)] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all opacity-0 group-hover:opacity-100"
                    >
                      <SlidersHorizontal size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Radar Section */}
          <div className="flex flex-col h-[300px] md:h-[200px] overflow-hidden border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between px-4 py-3 md:py-2.5 text-[9px] font-black uppercase tracking-[2px] text-[var(--text-secondary)] border-b border-[var(--border-color)] bg-[rgba(26,34,52,0.5)] shrink-0">
              <div className="flex items-center gap-2">
                <Radio size={12} className="text-[var(--accent-cyan)] animate-pulse" />
                <span>رادار العمليات الميدانية</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {radar.map(event => (
                <div key={event.id} className="flex gap-3 px-4 py-2.5 text-[11px] border-b border-[rgba(30,45,69,0.3)] hover:bg-[rgba(0,240,255,0.02)] transition-colors">
                  <span className="font-mono text-[var(--text-muted)] text-[9px] whitespace-nowrap shrink-0 mt-0.5">{event.time}</span>
                  <p className="text-[var(--text-secondary)] leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: event.message }} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
};
