export type Phase = 'RECON' | 'ENUM' | 'EXPLOIT' | 'POST' | 'EXFIL';

export interface TerminalLine {
  id: string;
  type: 'info' | 'error' | 'success' | 'warning' | 'ai' | 'system' | 'output' | 'command';
  content: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AIThought {
  id: string;
  type: 'analysis' | 'prediction' | 'decision' | 'alert';
  text: string;
  timestamp: string;
}

export interface Target {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'scanning';
  os?: string;
  ports?: number[];
  services?: string[];
  vulnerabilities?: string[];
}

export interface Session {
  id: string;
  targetId: string;
  type: 'meterpreter' | 'shell' | 'ssh';
  status: 'active' | 'closed';
  openedAt: string;
}

export interface ArsenalParam {
  id: string;
  name: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'toggle' | 'select';
  options?: string[];
}

export interface ArsenalItem {
  id: string;
  name: string;
  desc: string;
  type: 'scan' | 'exploit' | 'post' | 'util';
  params?: ArsenalParam[];
}

export interface RadarEvent {
  id: string;
  time: string;
  message: string;
}

export interface ThreatFeed {
  id: string;
  url: string;
  name: string;
  enabled: boolean;
  lastSync?: string;
}

export interface IOC {
  id: string;
  type: 'IP' | 'DOMAIN' | 'HASH' | 'URL';
  value: string;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export interface Credential {
  id: string;
  targetId: string;
  username: string;
  password?: string;
  hash?: string;
  type: 'ssh' | 'http' | 'db' | 'system';
  timestamp: string;
}

export interface Vulnerability {
  id: string;
  cve: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'detected' | 'exploited';
}

export interface DesktopIcon {
  id: string;
  name: string;
  iconName: string; // From lucide-react
  color: string;
  action: 'TERMINAL' | 'AI' | 'ZERODAY' | 'TARGETS' | 'VAULT' | 'PAYLOAD' | 'FILES' | 'PROCESSES' | 'DESKTOP';
  isVisible: boolean;
}

export interface LayoutConfig {
  showSidebarLeft: boolean;
  showSidebarRight: boolean;
  showTopBar: boolean;
  showBottomBar: boolean;
  showSystemStatus: boolean;
  showNeuralCoPilot: boolean;
  showMasterControl: boolean;
  stealthMode: boolean;
  desktopIcons: DesktopIcon[];
  shortcuts: {
    openPayload: string;
    switchTerminal: string;
    switchAI: string;
    switchTargets: string;
    executeCommand: string;
    toggleSidebarLeft: string;
    toggleSidebarRight: string;
  };
}
