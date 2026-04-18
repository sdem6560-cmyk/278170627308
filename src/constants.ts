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
  { id: 'exploit', name: 'استغلال (EXPLOIT)', icon: 'Zap', color: 'var(--accent-yellow)', cmd: 'exploit' },
  { id: 'live', name: 'بداء تشغيل مباشر لكل الأدوات', icon: 'Radio', color: 'var(--accent-red)', cmd: 'live' },
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
  stealthMode: true,
  desktopIcons: [
    { id: 'di-1', name: 'Terminal', iconName: 'Terminal', color: 'var(--accent-cyan)', action: 'TERMINAL', isVisible: true },
    { id: 'di-2', name: 'Neural AI', iconName: 'Brain', color: 'var(--accent-purple)', action: 'AI', isVisible: true },
    { id: 'di-3', name: 'ZeroDay', iconName: 'Bug', color: 'var(--accent-red)', action: 'ZERODAY', isVisible: true },
    { id: 'di-4', name: 'Targets', iconName: 'Target', color: 'var(--accent-orange)', action: 'TARGETS', isVisible: true },
    { id: 'di-5', name: 'Vault', iconName: 'Lock', color: 'var(--accent-purple)', action: 'VAULT', isVisible: true },
    { id: 'di-6', name: 'Payload', iconName: 'Zap', color: 'var(--accent-yellow)', action: 'PAYLOAD', isVisible: true },
    { id: 'di-7', name: 'Files', iconName: 'Folder', color: 'var(--accent-cyan)', action: 'FILES', isVisible: true },
    { id: 'di-8', name: 'Processes', iconName: 'Activity', color: 'var(--accent-green)', action: 'PROCESSES', isVisible: true },
  ],
  shortcuts: {
    openPayload: 'p',
    switchTerminal: 't',
    switchAI: 'a',
    switchTargets: 's',
    executeCommand: 'Enter',
    toggleSidebarLeft: '[',
    toggleSidebarRight: ']',
  },
};
