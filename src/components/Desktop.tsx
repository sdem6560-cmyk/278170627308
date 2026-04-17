import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { DesktopIcon } from '../types';

interface DesktopProps {
  onOpenTab: (tab: any) => void;
  onOpenSettings: () => void;
  icons?: DesktopIcon[];
}

export const Desktop: React.FC<DesktopProps> = ({ onOpenTab, onOpenSettings, icons = [] }) => {
  const renderIcon = (iconName: string, size = 32, className = "", color?: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <IconComponent size={size} className={className} style={{ color }} />;
  };

  const displayIcons = icons.filter(icon => icon.isVisible);

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <div className="w-96 h-96 border-8 border-[var(--accent-cyan)] rounded-full flex items-center justify-center">
          <span className="text-9xl font-black tracking-tighter">S</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 relative z-10">
        {displayIcons.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onOpenTab(item.action)}
            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-[rgba(255,255,255,0.03)] border border-transparent hover:border-[rgba(0,240,255,0.1)] transition-all cursor-pointer group"
          >
            <div className={`w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all group-active:scale-90`}>
              {renderIcon(item.iconName, 32, `group-hover:scale-110 transition-transform`, item.color)}
            </div>
            <div className="text-center">
              <div className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                {item.name}
              </div>
              <div className="text-[8px] font-mono text-[var(--text-muted)] uppercase tracking-tighter mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.action}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Settings Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: displayIcons.length * 0.05 }}
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-[rgba(255,255,255,0.03)] border border-transparent hover:border-[rgba(0,240,255,0.1)] transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all group-active:scale-90">
            {renderIcon("Settings", 32, "text-[var(--text-secondary)] group-hover:rotate-90 transition-transform")}
          </div>
          <div className="text-center">
            <div className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)] group-hover:text-white transition-colors">
              إعدادات النظام
            </div>
            <div className="text-[8px] font-mono text-[var(--text-muted)] uppercase tracking-tighter mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              System Configuration
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Info Overlay */}
      <div className="absolute bottom-8 right-8 text-right font-mono pointer-events-none opacity-40">
        <div className="text-[10px] text-[var(--accent-cyan)] font-bold">SENTINEL_OS v4.2.0</div>
        <div className="text-[8px] text-[var(--text-muted)]">KERNEL_STATUS: OPTIMIZED</div>
        <div className="text-[8px] text-[var(--text-muted)]">ENCRYPTION: AES-256-GCM</div>
      </div>
    </div>
  );
};
