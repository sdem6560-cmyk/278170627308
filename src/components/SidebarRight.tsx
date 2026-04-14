import React, { useState } from 'react';
import { Search, Zap, ShieldAlert, Settings, Target as TargetIcon, Radio, ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { Target, ArsenalItem, RadarEvent } from '../types';

interface SidebarRightProps {
  targets: Target[];
  activeTargetId: string | null;
  onTargetSelect: (id: string) => void;
  arsenal: ArsenalItem[];
  radar: RadarEvent[];
  onUpdateParam?: (itemId: string, paramId: string, newValue: any) => void;
  onAction?: (action: string) => void;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({ 
  targets, 
  activeTargetId, 
  onTargetSelect, 
  arsenal,
  radar,
  onUpdateParam,
  onAction
}) => {
  const [tuningItemId, setTuningItemId] = useState<string | null>(null);

  const tuningItem = arsenal.find(i => i.id === tuningItemId);

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

          <div className="p-4 border-t border-[var(--border-color)] bg-[rgba(26,34,52,0.5)]">
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
              <span className="bg-[var(--bg-input)] px-2.5 py-0.5 rounded-full text-[9px] text-[var(--accent-cyan)] border border-[rgba(0,240,255,0.2)] font-mono">{targets.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {targets.map(target => (
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
                  </div>
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
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {arsenal.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => onAction?.(item.type === 'scan' ? 'scan' : item.type === 'exploit' ? 'exploit' : item.name.toLowerCase())}
                  className="flex items-center gap-4 md:gap-3 p-3.5 md:p-2.5 rounded-[var(--radius-lg)] md:rounded-[var(--radius-md)] mb-2 md:mb-1 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-[rgba(255,136,0,0.03)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
