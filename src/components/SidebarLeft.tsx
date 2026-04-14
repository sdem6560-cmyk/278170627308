import React from 'react';
import { Brain, MessageSquare, Send, Sparkles, AlertTriangle, Lightbulb, Zap, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AIThought, ChatMessage } from '../types';

interface SidebarLeftProps {
  thoughts: AIThought[];
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({ thoughts, messages, onSendMessage }) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <aside className="w-full md:w-[320px] bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col shrink-0 overflow-hidden glass-panel relative z-20">
      {/* AI Thoughts Panel */}
      <div className="flex-1 flex flex-col overflow-hidden border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between px-4 py-3.5 text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-secondary)] border-b border-[var(--border-color)] bg-[rgba(26,34,52,0.5)] shrink-0">
          <div className="flex items-center gap-2.5">
            <Brain size={14} className="text-[var(--accent-purple)] animate-pulse" />
            <span>تحليلات النظام المركزية</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence initial={false}>
            {thoughts.map((thought, index) => (
              <motion.div 
                key={thought.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                className="p-5 md:p-4 border-b border-[rgba(30,45,69,0.3)] hover:bg-[rgba(170,85,255,0.05)] transition-all duration-300 group cursor-default relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-[rgba(0,240,255,0.02)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="flex items-center justify-between mb-3 md:mb-2">
                  <div className={`flex items-center gap-2 text-[9px] font-black uppercase px-2.5 py-1 rounded-sm tracking-widest shadow-sm ${
                    thought.type === 'analysis' ? 'bg-[rgba(0,240,255,0.1)] text-[var(--accent-cyan)] border border-[rgba(0,240,255,0.2)]' :
                    thought.type === 'prediction' ? 'bg-[rgba(170,85,255,0.1)] text-[var(--accent-purple)] border border-[rgba(170,85,255,0.2)]' :
                    thought.type === 'decision' ? 'bg-[rgba(0,255,157,0.1)] text-[var(--accent-green)] border border-[rgba(0,255,157,0.2)]' :
                    'bg-[rgba(255,51,102,0.1)] text-[var(--accent-red)] border border-[rgba(255,51,102,0.2)]'
                  }`}>
                    {thought.type === 'analysis' && <Search size={10} />}
                    {thought.type === 'prediction' && <Sparkles size={10} />}
                    {thought.type === 'decision' && <Zap size={10} />}
                    {thought.type === 'alert' && <AlertTriangle size={10} />}
                    <span>{
                      thought.type === 'analysis' ? 'تحليل' :
                      thought.type === 'prediction' ? 'توقع' :
                      thought.type === 'decision' ? 'قرار' : 'تنبيه'
                    }</span>
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] font-mono opacity-60 group-hover:opacity-100 transition-opacity">{thought.timestamp}</span>
                </div>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed font-medium">{thought.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-secondary)] border-b border-[var(--border-color)] bg-[rgba(26,34,52,0.5)] shrink-0">
          <div className="flex items-center gap-2.5">
            <MessageSquare size={14} className="text-[var(--accent-cyan)]" />
            <span>قناة التواصل الآمنة</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`text-[9px] font-black uppercase mb-1.5 tracking-widest opacity-70 ${msg.role === 'user' ? 'text-[var(--accent-cyan)]' : 'text-[var(--accent-purple)]'}`}>
                  {msg.role === 'user' ? 'OPERATOR' : 'SENTINEL_AI'}
                </div>
                <div className={`p-4 md:p-3 rounded-[var(--radius-lg)] md:rounded-[var(--radius-md)] text-[14px] md:text-[13px] leading-relaxed max-w-[95%] shadow-lg border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${
                  msg.role === 'user' 
                    ? 'bg-[rgba(0,240,255,0.08)] border-[rgba(0,240,255,0.2)] text-[var(--text-primary)] shadow-[0_0_15px_rgba(0,240,255,0.05)]' 
                    : 'bg-[rgba(170,85,255,0.08)] border-[rgba(170,85,255,0.2)] text-[var(--text-primary)] shadow-[0_0_15px_rgba(170,85,255,0.05)]'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="p-4 border-t border-[var(--border-color)] bg-[rgba(10,14,23,0.3)] flex gap-2.5 shrink-0">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="أدخل أوامر للمشغل..."
            className="flex-1 px-4 py-3 border border-[var(--border-color)] rounded-[var(--radius-md)] bg-[var(--bg-input)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent-cyan)] focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all duration-300"
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)] bg-linear-to-br from-[var(--accent-purple)] to-[var(--accent-cyan)] text-[var(--bg-primary)] font-bold cursor-pointer hover:brightness-110 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(170,85,255,0.3)]"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};
