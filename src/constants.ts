export const COMMANDS = [
  'help', 'recon', 'scan', 'scan_deep', 'vulnscan', 'brute', 'exploit', 'exploit_auto', 'exfiltrate', 
  'login', 'andrax', 'netmap', 'vault', 'payload', 'feeds', 'targets', 
  'whoami', 'ai', 'terminal', 'settings', 'status', 'clear', 'exit', 'report', 'sessions'
];

export const DEFAULT_FEEDS = [
  { id: 'f1', name: 'AlienVault OTX', url: 'https://otx.alienvault.com/api/v1/pulses/subscribed', enabled: true },
  { id: 'f2', name: 'MISP Open Source', url: 'https://misp-project.org/feeds/', enabled: false }
];

export const DEFAULT_MASTER_CONFIG = [
  { id: 'recon', name: 'استطلاع (RECON)', icon: 'Search', color: 'var(--accent-cyan)', cmd: 'recon' },
  { id: 'scan', name: 'مسح (SCAN)', icon: 'Activity', color: 'var(--accent-blue)', cmd: 'scan' },
  { id: 'vuln', name: 'ثغرات (VULN)', icon: 'Shield', color: 'var(--accent-orange)', cmd: 'vulnscan' },
  { id: 'brute', name: 'قوة غاشمة (BRUTE)', icon: 'Lock', color: 'var(--accent-red)', cmd: 'brute' },
  { id: 'exploit', name: 'استغلال (EXPLOIT)', icon: 'Zap', color: 'var(--accent-yellow)', cmd: 'exploit' },
  { id: 'exfil', name: 'تسريب (EXFIL)', icon: 'Globe', color: 'var(--accent-purple)', cmd: 'exfiltrate' },
];

export const DESTRUCTIVE_COMMANDS = ['exploit', 'exploit_auto', 'brute', 'exfiltrate', 'exfil'];

export const DEFAULT_LAYOUT_CONFIG = {
  showSidebarLeft: true,
  showSidebarRight: true,
  showTopBar: true,
  showBottomBar: true,
  showSystemStatus: true,
  showNeuralCoPilot: true,
  showMasterControl: true,
};
