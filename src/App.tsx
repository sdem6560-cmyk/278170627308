import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Terminal as TerminalIcon, Globe, Lock, Zap, Brain, Bug, Target as TargetIcon, EyeOff, X, Settings } from 'lucide-react';
import { playSound } from './lib/soundUtils';
import { TopBar } from './components/TopBar';
import { SidebarRight } from './components/SidebarRight';
import { SidebarLeft } from './components/SidebarLeft';
import { Terminal } from './components/Terminal';
import { ThreatMatrix } from './components/ThreatMatrix';
import { ThreatFeeds } from './components/ThreatFeeds';
import { NetworkMap } from './components/NetworkMap';
import { Vault } from './components/Vault';
import { Sniffer } from './components/Sniffer';
import { PayloadGenerator } from './components/PayloadGenerator';
import { ZeroDayLab } from './components/ZeroDayLab';
import { SystemStatus } from './components/SystemStatus';
import { MasterControl } from './components/MasterControl';
import { NeuralCoPilot } from './components/NeuralCoPilot';
import { SettingsModal } from './components/SettingsModal';
import { Taskbar } from './components/Taskbar';
import { Desktop } from './components/Desktop';
import { FileExplorer } from './components/FileExplorer';
import { ProcessManager } from './components/ProcessManager';
import { Phase, Target, ArsenalItem, RadarEvent, Credential, Vulnerability, Session, LayoutConfig, FileItem } from './types';
import { DEFAULT_MASTER_CONFIG, DESTRUCTIVE_COMMANDS, DEFAULT_LAYOUT_CONFIG } from './constants';
import { useTerminal } from './hooks/useTerminal';
import { useThreatIntelligence } from './hooks/useThreatIntelligence';
import { useAI } from './hooks/useAI';
import { getAIResponse, getSystemThoughts, getAutonomousAction } from './services/geminiService';
import { fetchShodanDetails, fetchVirusTotalReport } from './services/threatIntelService';
import { readStorageJson, readStorageString, writeStorageJson } from './lib/persistence';

// Memoized components for performance
const MemoizedTopBar = React.memo(TopBar);
const MemoizedTaskbar = React.memo(Taskbar);
const MemoizedSystemStatus = React.memo(SystemStatus);
const MemoizedNeuralCoPilot = React.memo(NeuralCoPilot);

// Helper for unique IDs - moved outside to be stable
const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export default function App() {
  // State
  const [phase, setPhase] = useState<Phase>('RECON');
  const [connected, setConnected] = useState(true);
  const [opCount, setOpCount] = useState(124);
  const [autopilot, setAutopilot] = useState(true);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(() => {
    return readStorageString('sentinel_activeTargetId', 't1');
  });
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'AI' | 'TARGETS' | 'THREATS' | 'FEEDS' | 'VAULT' | 'PAYLOAD' | 'ZERODAY' | 'DESKTOP' | 'FILES' | 'PROCESSES'>(() => {
    return readStorageString('sentinel_activeTab', 'DESKTOP') as any;
  });
  const [runningProcesses, setRunningProcesses] = useState<{id: string, name: string, startTime: string}[]>([
    { id: 'p_kernel', name: 'Kernel_Alpha_v4', startTime: new Date().toLocaleTimeString() }
  ]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [threatLevel, setThreatLevel] = useState(34);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [lastAiThought, setLastAiThought] = useState<string>('جاري تهيئة العقل الاصطناعي...');
  const [files, setFiles] = useState<FileItem[]>(() => {
    const persistedFiles = readStorageJson<FileItem[] | null>('sentinel_files', null);
    if (persistedFiles) return persistedFiles;
    return [
      {
        id: 'f1',
        name: 'exfiltrated',
        type: 'folder',
        modified: '2026-04-15 14:22',
        children: [
          { 
            id: 'f1-1', 
            name: 'db_dump_alpha.sql', 
            type: 'file', 
            extension: 'sql', 
            size: '124 MB', 
            modified: '2026-04-15 14:25', 
            encrypted: true,
            content: 'SELECT * FROM users;\nINSERT INTO accounts (id, balance) VALUES (1, 999999);\n-- Dump complete'
          },
          { 
            id: 'f1-2', 
            name: 'user_credentials.txt', 
            type: 'file', 
            extension: 'txt', 
            size: '12 KB', 
            modified: '2026-04-15 14:28',
            content: 'admin:shadow_master_2026\nroot:toor123\noperator:sentinel_alpha_99'
          }
        ]
      },
      {
        id: 'f2',
        name: 'payloads',
        type: 'folder',
        modified: '2026-04-16 08:45',
        children: [
          { 
            id: 'f2-1', 
            name: 'reverse_shell.elf', 
            type: 'file', 
            extension: 'elf', 
            size: '1.2 MB', 
            modified: '2026-04-16 08:46',
            content: '[BINARY DATA: ELF EXECUTABLE X64]'
          }
        ]
      },
      {
        id: 'f3',
        name: 'logs',
        type: 'folder',
        modified: '2026-04-16 09:10',
        children: [
          { 
            id: 'f3-1', 
            name: 'auth_failure.log', 
            type: 'file', 
            extension: 'log', 
            size: '256 KB', 
            modified: '2026-04-16 09:11',
            content: 'April 17 01:22:45 localhost sshd[1234]: Failed password for root from 192.168.1.55 port 45222 ssh2'
          },
          { 
            id: 'f3-3', 
            name: 'system_errors.log', 
            type: 'file', 
            extension: 'log', 
            size: '0 KB', 
            modified: new Date().toISOString().split('T')[0],
            content: '--- SYSTEM ERROR LOG INITIALIZED ---\n'
          }
        ]
      }
    ];
  });
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [masterConfig, setMasterConfig] = useState<string>(() => {
    return readStorageString('sentinel_master_config', JSON.stringify(DEFAULT_MASTER_CONFIG));
  });
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(() => {
    return readStorageJson<boolean>('sentinel_auto_update', true);
  });
  const [updateInterval, setUpdateInterval] = useState(() => {
    return readStorageJson<number>('sentinel_update_interval', 60);
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() => {
    const parsed = readStorageJson<LayoutConfig | null>('sentinel_layout_config', null);
    if (!parsed) return DEFAULT_LAYOUT_CONFIG;
    try {
      // Merge saved with default to handle schema upgrades
      return {
        ...DEFAULT_LAYOUT_CONFIG,
        ...parsed,
        shortcuts: {
          ...DEFAULT_LAYOUT_CONFIG.shortcuts,
          ...(parsed.shortcuts || {})
        },
        desktopIcons: parsed.desktopIcons || DEFAULT_LAYOUT_CONFIG.desktopIcons
      };
    } catch (e) {
      return DEFAULT_LAYOUT_CONFIG;
    }
  });

  // Custom Hooks
  const { terminalLines, addTerminalLine, clearTerminal } = useTerminal();
  const { iocs, setIocs } = useThreatIntelligence(autoUpdateEnabled, updateInterval, addTerminalLine);
  const { chatMessages, aiThoughts, handleAction, updateThoughts, setChatMessages, setAiThoughts } = useAI();

  const [targets, setTargets] = useState<Target[]>([
    { 
      id: 't1', 
      name: 'Mainframe_Alpha', 
      ip: '192.168.1.45', 
      status: 'online', 
      os: 'Linux Kernel 5.15',
      ports: [22, 80, 443, 8080],
      services: ['OpenSSH 8.2p1', 'Apache 2.4.41', 'Nginx 1.18.0', 'Tomcat 9.0.31']
    },
    { 
      id: 't2', 
      name: 'DB_Server_01', 
      ip: '192.168.1.102', 
      status: 'scanning',
      ports: [3306, 5432],
      services: ['MySQL 8.0.23', 'PostgreSQL 13.2']
    },
    { id: 't3', name: 'Gateway_Node', ip: '10.0.0.1', status: 'offline' },
    { 
      id: 't4', 
      name: 'server_db_03', 
      ip: '192.168.1.150', 
      status: 'online', 
      os: 'Windows Server 2022',
      ports: [445, 3389, 5985],
      services: ['SMB', 'RDP', 'WinRM']
    },
  ]);

  const [arsenal, setArsenal] = useState<ArsenalItem[]>(() => {
    const initial: ArsenalItem[] = [
      { 
        id: 'a1', 
        name: 'Nmap_Stealth', 
        desc: 'فحص المنافذ والخدمات بشكل خفي وشامل', 
        type: 'scan',
        params: [
          { id: 'p1', name: 'Intensivity', value: 3, type: 'number' },
          { id: 'p3', name: 'Service Detection', value: true, type: 'toggle' },
          { id: 'p2', name: 'Timing', value: 'T4', type: 'select', options: ['T1', 'T2', 'T3', 'T4', 'T5'] }
        ]
      },
      { 
        id: 'a2', 
        name: 'Metasploit_Core', 
        desc: 'محرك الاستغلال الرئيسي مع مكتبة واسعة من الثغرات المحدثة', 
        type: 'exploit',
        params: [
          { id: 'p4', name: 'LHOST', value: '192.168.1.10', type: 'text' },
          { id: 'p5', name: 'Payload', value: 'meterpreter_reverse_tcp', type: 'select', options: ['meterpreter_reverse_tcp', 'shell_reverse_tcp', 'meterpreter_bind_tcp'] }
        ]
      },
      { 
        id: 'a3', 
        name: 'ANDRAX_Mobile', 
        desc: 'اختراق الهواتف والأجهزة المحمولة عبر ثغرات الأندرويد', 
        type: 'exploit',
        params: [
          { id: 'p6', name: 'Target SDK', value: 33, type: 'number' },
          { id: 'p7', name: 'Auto-Root', value: true, type: 'toggle' }
        ]
      },
      { 
        id: 'a4', 
        name: 'Mimikatz_Lite', 
        desc: 'استخراج كلمات المرور والرموز المشفرة من ذاكرة النظام', 
        type: 'post',
        params: [
          { id: 'p8', name: 'Dump LSASS', value: true, type: 'toggle' },
          { id: 'p9', name: 'Output Format', value: 'text', type: 'select', options: ['text', 'json', 'csv'] }
        ]
      },
      { 
        id: 'a5', 
        name: 'SQL_Injector_Pro', 
        desc: 'أداة (sqlmap) لاكتشاف واستغلال ثغرات قواعد البيانات', 
        type: 'exploit',
        params: [
          { id: 'p10', name: 'Method', value: 'GET', type: 'select', options: ['GET', 'POST', 'HEADER'] },
          { id: 'p11', name: 'Payload', value: 'Boolean-based', type: 'select', options: ['Boolean-based', 'Error-based', 'Union-based', 'Time-based'] },
          { id: 'p12', name: 'Depth', value: 5, type: 'number' }
        ]
      },
      { 
        id: 'a6', 
        name: 'XSS_Reflector', 
        desc: 'حقن نصوص برمجية (JS) في متصفحات الضحايا', 
        type: 'exploit',
        params: [
          { id: 'p13', name: 'Type', value: 'Reflected', type: 'select', options: ['Stored', 'Reflected', 'DOM-based'] },
          { id: 'p14', name: 'Bypass WAF', value: true, type: 'toggle' },
          { id: 'p15', name: 'Payload Type', value: 'Alert', type: 'select', options: ['Alert', 'Cookie Stealer', 'Keylogger'] }
        ]
      },
      { 
        id: 'a7', 
        name: 'PrivEsc_Suite', 
        desc: 'رفع صلاحيات المستخدم إلى Root/Admin', 
        type: 'post',
        params: [
          { id: 'p16', name: 'Target OS', value: 'Linux', type: 'select', options: ['Linux', 'Windows', 'macOS'] },
          { id: 'p17', name: 'Aggressive', value: false, type: 'toggle' },
          { id: 'p18', name: 'Exploit DB Sync', value: true, type: 'toggle' }
        ]
      },
      {
        id: 'a8',
        name: 'Hydra_Brute',
        desc: 'هجوم القوة الغاشمة (Bruteforce) للخدمات الشبكية',
        type: 'exploit',
        params: [
          { id: 'p19', name: 'Wordlist', value: 'rockyou.txt', type: 'text' },
          { id: 'p20', name: 'Protocol', value: 'ssh', type: 'select', options: ['ssh', 'ftp', 'rdp', 'http-post-form'] }
        ]
      },
      {
        id: 'a9',
        name: 'Bettercap_MITM',
        desc: 'اعتراض بيانات الشبكة وتنفيذ هجمات الرجل في المنتصف',
        type: 'exploit',
        params: [
          { id: 'p21', name: 'ARP Spoofing', value: true, type: 'toggle' },
          { id: 'p22', name: 'DNS Hijack', value: false, type: 'toggle' }
        ]
      },
      {
        id: 'a10',
        name: 'Wifite_Next',
        desc: 'اختراق شبكات الـ WiFi وتجاوز تشفير WPA/WPS',
        type: 'exploit',
        params: [
          { id: 'p23', name: 'Interface', value: 'wlan0mon', type: 'text' },
          { id: 'p24', name: 'Mode', value: 'Aggressive', type: 'select', options: ['Aggressive', 'Stealth', 'Handshake Only'] }
        ]
      },
      {
        id: 'a11',
        name: 'Burp_Sentinel',
        desc: 'تحليل وفحص حركة بيانات الويب وتعديل الطلبات',
        type: 'scan',
        params: [
          { id: 'p25', name: 'Proxy Listen', value: 8080, type: 'number' },
          { id: 'p26', name: 'Active Scan', value: true, type: 'toggle' }
        ]
      },
      {
        id: 'a12',
        name: 'Wireshark_Sniff',
        desc: 'تحليل حزم البيانات (Packets) واستخراج المعلومات الصافية',
        type: 'scan',
        params: [
          { id: 'p27', name: 'Filter', value: 'tcp', type: 'text' },
          { id: 'p28', name: 'Dump Path', value: '/tmp/capture.pcap', type: 'text' }
        ]
      },
      {
        id: 'a13',
        name: 'SET_Phisher',
        desc: 'أدوات الهندسة الاجتماعية لإنشاء صفحات هبوط مزيفة',
        type: 'exploit',
        params: [
          { id: 'p29', name: 'Vector', value: 'Credential Harvester', type: 'select', options: ['Credential Harvester', 'Web-Jack', 'Spear-Phishing'] }
        ]
      },
      {
        id: 'a14',
        name: 'John_Hash',
        desc: 'كسر تشفير كلمات المرور (Hash Cracking) المتقدم',
        type: 'util',
        params: [
          { id: 'p30', name: 'Hash Type', value: 'sha256', type: 'select', options: ['md5', 'sha256', 'ntlm', 'bcrypt'] }
        ]
      },
      {
        id: 'a15',
        name: 'Sherlock_OSINT',
        desc: 'تتبع الحسابات عبر أكثر من 300 موقع تواصل اجتماعي',
        type: 'scan',
        params: [
          { id: 'p31', name: 'Username', value: 'target_user', type: 'text' }
        ]
      },
      {
        id: 'a16',
        name: 'Ghidra_RE',
        desc: 'تحليل الهندسة العكسية للملفات التنفيذية والبرامج',
        type: 'util'
      },
      {
        id: 'a17',
        name: 'Beef_Framework',
        desc: 'استغلال متصفحات الويب والتحكم بها عن بُعد',
        type: 'exploit'
      },
      { id: 'a18', name: 'ProxyChains', desc: 'توجيه الحركة عبر وكلاء (Tor/Socks)', type: 'util' }
    ];
    const persistedArsenal = readStorageJson<ArsenalItem[] | null>('sentinel_arsenal', null);
    return persistedArsenal ?? initial;
  });

  const updateArsenalParam = (itemId: string, paramId: string, newValue: any) => {
    setArsenal(prev => prev.map(item => {
      if (item.id === itemId && item.params) {
        return {
          ...item,
          params: item.params.map(p => p.id === paramId ? { ...p, value: newValue } : p)
        };
      }
      return item;
    }));
  };

  const handleAddTarget = (ip: string) => {
    const newTarget: Target = {
      id: generateId(),
      name: `NEW_NODE_${targets.length + 1}`,
      ip: ip,
      status: 'scanning',
    };
    
    setTargets(prev => [...prev, newTarget]);
    setActiveTargetId(newTarget.id);
    
    playSound('bleep');
    addTerminalLine(`[!] Acquiring target: ${ip}...`, 'info');
    
    setRadar(prev => [
      { id: generateId(), time: new Date().toLocaleTimeString([], { hour12: false }), message: `Target acquisition initiated: <span class="highlight">${ip}</span>` },
      ...prev.slice(0, 19) // Keep radar history manageable
    ]);
    
    // Simulate reconnaissance
    setTimeout(() => {
      setTargets(prev => prev.map(t => t.ip === ip ? {
        ...t,
        status: 'online',
        os: 'Detected: Universal Platform',
        ports: [80, 443, 22, 21, 3306],
        services: ['Apache', 'OpenSSL', 'OpenSSH', 'ProFTPD', 'MySQL']
      } : t));
      playSound('success');
      addTerminalLine(`[+] Reconnaissance complete for ${ip}. Intelligence updated.`, 'success');
      setRadar(prev => [
        { id: generateId(), time: new Date().toLocaleTimeString([], { hour12: false }), message: `Systems normalized for <span class="highlight">${ip}</span>. OS detected: Linux.` },
        ...prev.slice(0, 19)
      ]);
    }, 4000);
  };

  const logSystemError = useCallback((error: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `[${timestamp}] ERROR: ${error}\n`;
    
    setFiles(prev => {
      const newFiles = prev.map(folder => {
        if (folder.name === 'logs' && folder.children) {
          return {
            ...folder,
            children: folder.children.map(file => {
              if (file.name === 'system_errors.log') {
                const newContent = (file.content || '') + logEntry;
                return {
                  ...file,
                  content: newContent,
                  size: `${Math.ceil(newContent.length / 1024)} KB`,
                  modified: timestamp
                };
              }
              return file;
            })
          };
        }
        return folder;
      });
      writeStorageJson('sentinel_files', newFiles);
      return newFiles;
    });
  }, []);

  const [radar, setRadar] = useState<RadarEvent[]>(() => {
    const saved = localStorage.getItem('sentinel_radar');
    const initial = [
      { id: 'r1', time: '04:34:55', message: 'تم اكتشاف منفذ مفتوح <span class="highlight">80/TCP</span> على الهدف Alpha' },
      { id: 'r2', time: '04:35:02', message: 'محاولة استطلاع من عنوان IP خارجي <span class="highlight">45.22.11.9</span>' },
      { id: 'r3', time: '05:11:00', message: 'تم دمج منصة <span class="highlight">ANDRAX</span> بنجاح في النظام' },
    ];
    return saved ? JSON.parse(saved) : initial;
  });

  // Persistence
  useEffect(() => {
    if (terminalLines.length === 0) {
      addTerminalLine('================================================', 'info');
      addTerminalLine('   SENTINEL OS v4.0.2 - NEURAL LINK ACTIVE', 'success');
      addTerminalLine('================================================', 'info');
      addTerminalLine('OPERATOR: sdem6560@gmail.com', 'system');
      addTerminalLine('STATUS: ALL SYSTEMS OPERATIONAL', 'system');
      addTerminalLine('TYPE "help" FOR AVAILABLE COMMANDS', 'warning');
      addTerminalLine('', 'system');
    }
  }, []);

  useEffect(() => {
    if (activeTargetId) localStorage.setItem('sentinel_activeTargetId', activeTargetId);
  }, [activeTargetId]);

  useEffect(() => {
    localStorage.setItem('sentinel_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      logSystemError(event.message || 'Unknown runtime error');
    };
    
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      logSystemError(`Unhandled Promise Rejection: ${event.reason}`);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, [logSystemError]);

  useEffect(() => {
    localStorage.setItem('sentinel_layout_config', JSON.stringify(layoutConfig));
  }, [layoutConfig]);

  useEffect(() => {
    localStorage.setItem('sentinel_arsenal', JSON.stringify(arsenal));
  }, [arsenal]);

  useEffect(() => {
    localStorage.setItem('sentinel_radar', JSON.stringify(radar));
  }, [radar]);

  // Periodic thoughts update
  useEffect(() => {
    const interval = setInterval(async () => {
      // Update threat level
      setThreatLevel(prev => Math.min(100, Math.max(0, prev + (Math.random() * 10 - 5))));

      // Update thoughts
      updateThoughts(phase, threatLevel, arsenal);
    }, autoUpdateEnabled ? updateInterval * 1000 : 60000);
    return () => clearInterval(interval);
  }, [autoUpdateEnabled, updateInterval, activeTargetId, updateThoughts]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    
    // Always log the command itself immediately for feedback
    addTerminalLine(cmd, 'command', phase);

    if (!trimmedCmd) return;

    const isDestructive = DESTRUCTIVE_COMMANDS.some(d => trimmedCmd.toLowerCase().includes(d));

    if (isDestructive && !pendingCommand) {
      setPendingCommand(trimmedCmd);
      setIsConfirmModalOpen(true);
      return;
    }

    setPendingCommand(null);
    setIsConfirmModalOpen(false);

    // Validation: RECON must be completed before offensive actions
    const offensiveCommands = ['scan', 'exploit', 'vulnscan', 'brute', 'deploy', 'exfiltrate'];
    const isOffensive = offensiveCommands.some(c => trimmedCmd.toLowerCase().startsWith(c));

    if (phase === 'RECON' && isOffensive) {
      addTerminalLine(`ERROR: Offensive action '${trimmedCmd}' blocked. RECON phase must be completed first.`, 'error');
      addTerminalLine("Use 'recon' to initiate reconnaissance protocol.", 'info');
      return;
    }

    // Simple command simulation
    setTimeout(() => {
      const lowerCmd = trimmedCmd.toLowerCase();
      const firstWord = lowerCmd.split(' ')[0];
      
      if (firstWord === 'help') {
        addTerminalLine('AVAILABLE COMMANDS:', 'info');
        addTerminalLine('  recon     - Start deep reconnaissance protocol', 'system');
        addTerminalLine('  scan      - Scan local network for targets [ip]', 'system');
        addTerminalLine('  scan_deep - Thorough network scan with stealth bypass', 'system');
        addTerminalLine('  vulnscan  - Run vulnerability scan on current target', 'system');
        addTerminalLine('  brute     - Start brute force attack on target', 'system');
        addTerminalLine('  exploit   - Attempt to exploit current target', 'system');
        addTerminalLine('  exploit_auto - Automated multi-vector exploitation', 'system');
        addTerminalLine('  exfiltrate- Start secure data exfiltration', 'system');
        addTerminalLine('  login     - Attempt remote login as user', 'system');
        addTerminalLine('  andrax    - Initialize ANDRAX Mobile Suite', 'system');
        addTerminalLine('  netmap    - View Neural Network Map', 'system');
        addTerminalLine('  vault     - Access The Vault', 'system');
        addTerminalLine('  payload   - Open Payload Generator', 'system');
        addTerminalLine('  feeds     - View Threat Intelligence Feeds', 'system');
        addTerminalLine('  targets   - Manage Active Targets', 'system');
        addTerminalLine('  whoami    - Show current operator identity', 'system');
        addTerminalLine('  ai        - Open Neural Co-pilot Interface', 'system');
        addTerminalLine('  zeroday   - Access Zero-Day Research Lab', 'error');
        addTerminalLine('  terminal  - Switch to Main Terminal', 'system');
        addTerminalLine('  settings  - Open System Settings', 'system');
        addTerminalLine('  status    - Show system status', 'system');
        addTerminalLine('  sessions  - List active Meterpreter/Shell sessions', 'system');
        addTerminalLine('  report    - Generate operation summary report', 'system');
        addTerminalLine('  clear     - Clear terminal output', 'system');
        addTerminalLine('  live      - Start live full-scale operation', 'error');
        addTerminalLine('  exit      - Terminate secure session', 'system');
        addTerminalLine('TOOLKIT EXECUTABLES:', 'warning');
        addTerminalLine('  Type any tool name from the Arsenal (e.g., sqlmap, wireshark, hydra) to launch.', 'info');
      } else if (firstWord === 'live') {
        startLiveOperation();
      } else if (firstWord === 'deploy') {
        const type = trimmedCmd.split(' ')[1] || 'payload';
        addTerminalLine(`Deploying ${type} to target...`, 'warning');
        setTimeout(() => {
          addTerminalLine(`${type.toUpperCase()} deployed successfully. Connection established.`, 'success');
          setOpCount(prev => prev + 1);
          setPhase('EXPLOIT');
        }, 2000);
      } else if (firstWord === 'scan') {
        const targetStr = trimmedCmd.split(' ')[1];
        const target = targetStr ? targets.find(t => t.ip === targetStr || t.name === targetStr) : targets.find(t => t.id === activeTargetId);
        addTerminalLine(`Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toLocaleString()}`, 'info');
        addTerminalLine(`Scanning ${target?.name || targetStr || 'target'} (${target?.ip || targetStr || 'unknown'})...`, 'info');
        setPhase('ENUM');
        
        setTimeout(() => {
          addTerminalLine(`Nmap scan report for ${target?.name || targetStr || 'target'}`, 'system');
          addTerminalLine('Host is up (0.002s latency).', 'system');
          addTerminalLine('Not shown: 996 closed ports', 'system');
          addTerminalLine('PORT     STATE SERVICE    VERSION', 'system');
          if (target?.ports) {
            target.ports.forEach((port, index) => {
              addTerminalLine(`${port}/tcp   open  ${target.services?.[index] || 'unknown'}`, 'system');
            });
          } else {
             addTerminalLine('22/tcp   open  ssh        OpenSSH 8.2p1', 'system');
             addTerminalLine('80/tcp   open  http       Apache httpd 2.4.41', 'system');
          }
          addTerminalLine('Scan complete. Found services identified.', 'success');
        }, 2000);
      } else if (firstWord === 'scan_deep') {
        addTerminalLine('Initiating deep stealth scan...', 'warning');
        setPhase('ENUM');
        setTimeout(() => {
          addTerminalLine('Bypassing IDPS filters...', 'info');
          setTimeout(() => {
            addTerminalLine('Deep scan complete. Hidden nodes identified: 10.0.5.12, 10.0.5.14', 'success');
            setOpCount(prev => prev + 2);
          }, 2000);
        }, 1500);
      } else if (firstWord === 'exploit') {
        const targetStr = trimmedCmd.split(' ')[1];
        const target = targetStr ? targets.find(t => t.ip === targetStr || t.name === targetStr) : targets.find(t => t.id === activeTargetId);
        addTerminalLine(`[*] Attempting to exploit ${target?.name || targetStr || 'target'}...`, 'info');
        addTerminalLine(`[*] Using exploit/multi/handler with payload meterpreter_reverse_tcp`, 'system');
        addTerminalLine(`[*] Sending stage (175174 bytes) to ${target?.ip || targetStr || 'target'}`, 'system');
        
        setTimeout(() => {
          addTerminalLine(`[+] Exploit successful! Meterpreter session 1 opened (${target?.ip || targetStr || 'target'}:4444)`, 'success');
          setPhase('EXPLOIT');
          setOpCount(prev => prev + 1);
          
          const newSession: Session = {
            id: generateId(),
            targetId: target?.id || activeTargetId || 't1',
            type: 'meterpreter',
            status: 'active',
            openedAt: new Date().toLocaleTimeString()
          };
          setSessions(prev => [newSession, ...prev]);

          const newCred: Credential = {
            id: generateId(),
            targetId: target?.id || activeTargetId || 't1',
            username: 'root',
            password: 'secret_password_' + Math.floor(Math.random() * 1000),
            type: 'ssh',
            timestamp: new Date().toLocaleTimeString()
          };
          setCredentials(prev => [newCred, ...prev]);
          addTerminalLine(`[!] NEW CREDENTIAL HARVESTED: ${newCred.username}:${newCred.password}`, 'ai');
        }, 2000);
      } else if (firstWord === 'exploit_auto') {
        addTerminalLine('Initiating automated exploitation sequence...', 'warning');
        setTimeout(() => {
          addTerminalLine('Scanning for known vulnerabilities...', 'info');
          setTimeout(() => {
            addTerminalLine('Vulnerability CVE-2024-1234 identified. Launching payload...', 'info');
            setTimeout(() => {
              addTerminalLine('Exploit successful! Multi-node access established.', 'success');
              setPhase('EXPLOIT');
              setOpCount(prev => prev + 3);
              addTerminalLine('3 new targets compromised.', 'ai');
            }, 2000);
          }, 1500);
        }, 1000);
      } else if (firstWord === 'vulnscan') {
        const targetStr = trimmedCmd.split(' ')[1] || 'current';
        addTerminalLine(`Initiating vulnerability scan on ${targetStr}...`, 'info');
        setTimeout(() => {
          const newVuln: Vulnerability = {
            id: generateId(),
            cve: `CVE-2024-${Math.floor(Math.random() * 9000) + 1000}`,
            severity: Math.random() > 0.5 ? 'critical' : 'high',
            description: 'Potential buffer overflow detected in network daemon.',
            status: 'detected'
          };
          setVulnerabilities(prev => [newVuln, ...prev]);
          addTerminalLine(`VULNERABILITY DETECTED: ${newVuln.cve} (${newVuln.severity})`, 'error');

          const shodanKey = localStorage.getItem('sentinel_shodan_key');
          const vtKey = localStorage.getItem('sentinel_vt_key');

          if (shodanKey || vtKey) {
            addTerminalLine('Enriching vulnerability data with external threat intelligence...', 'info');
            
            if (shodanKey) {
              const target = targets.find(t => t.id === activeTargetId);
              if (target?.ip) {
                fetchShodanDetails(target.ip).then(details => {
                  if (details) {
                    addTerminalLine(`[SHODAN]: Found ${details.data?.length || 0} services and ${details.vulns?.length || 0} vulnerabilities for ${target.ip}`, 'success');
                  }
                });
              }
            }

            if (vtKey) {
              fetchVirusTotalReport(newVuln.cve).then(report => {
                if (report) {
                  addTerminalLine(`[VIRUSTOTAL]: CVE ${newVuln.cve} has a community score of ${report.data?.attributes?.last_analysis_stats?.malicious || 0} malicious detections.`, 'warning');
                }
              });
            }
          }
        }, 3000);
      } else if (firstWord === 'brute') {
        const targetStr = trimmedCmd.split(' ')[1] || '192.168.1.102';
        addTerminalLine(`Starting brute force attack on ${targetStr} (SSH)...`, 'warning');
        let count = 0;
        const bruteInterval = setInterval(() => {
          count++;
          addTerminalLine(`Attempt ${count}: Trying password 'pass${Math.floor(Math.random() * 10000)}'...`, 'system');
          if (count >= 10) {
            clearInterval(bruteInterval);
            addTerminalLine('SUCCESS: Password found! [admin:qwerty12345]', 'success');
            const newCred: Credential = {
              id: generateId(),
              targetId: 't2',
              username: 'admin',
              password: 'qwerty12345',
              type: 'ssh',
              timestamp: new Date().toLocaleTimeString()
            };
            setCredentials(prev => [newCred, ...prev]);
          }
        }, 500);
      } else if (firstWord === 'andrax') {
        addTerminalLine('Initializing ANDRAX Mobile Penetration Suite...', 'warning');
        setTimeout(() => {
          addTerminalLine('Loading Android kernel modules...', 'info');
          setTimeout(() => {
            addTerminalLine('ANDRAX integrated. Ready for mobile attack vectors.', 'success');
            setOpCount(prev => prev + 1);
          }, 1500);
        }, 1000);
      } else if (firstWord === 'status') {
        addTerminalLine('SYSTEM STATUS REPORT:', 'info');
        addTerminalLine(`  PHASE: ${phase}`, 'system');
        addTerminalLine(`  THREAT_LEVEL: ${Math.round(threatLevel)}%`, 'system');
        addTerminalLine(`  CREDENTIALS_HARVESTED: ${credentials.length}`, 'system');
        addTerminalLine(`  VULNERABILITIES_DETECTED: ${vulnerabilities.length}`, 'system');
        addTerminalLine(`  ACTIVE_SESSIONS: ${sessions.length}`, 'system');
        addTerminalLine(`  AUTOPILOT: ${autopilot ? 'ACTIVE' : 'DISABLED'}`, 'system');
        addTerminalLine('  ENCRYPTION: AES-256-GCM', 'system');
      } else if (firstWord === 'sessions') {
        addTerminalLine('ACTIVE SESSIONS:', 'info');
        if (sessions.length === 0) {
          addTerminalLine('  No active sessions found.', 'system');
        } else {
          addTerminalLine('  ID  TYPE         TARGET           STATUS    OPENED_AT', 'system');
          sessions.forEach((s, i) => {
            const target = targets.find(t => t.id === s.targetId);
            addTerminalLine(`  ${i+1}   ${s.type.padEnd(12)} ${target?.name.padEnd(16)} ${s.status.padEnd(9)} ${s.openedAt}`, 'system');
          });
        }
      } else if (firstWord === 'report') {
        addTerminalLine('GENERATING OPERATION SUMMARY REPORT...', 'info');
        setTimeout(() => {
          addTerminalLine('----------------------------------------', 'system');
          addTerminalLine(`OPERATOR: sdem6560@gmail.com`, 'system');
          addTerminalLine(`TIMESTAMP: ${new Date().toLocaleString()}`, 'system');
          addTerminalLine(`TOTAL OPERATIONS: ${opCount}`, 'system');
          addTerminalLine(`COMPROMISED TARGETS: ${credentials.length}`, 'success');
          addTerminalLine(`CRITICAL VULNERABILITIES: ${vulnerabilities.length}`, 'error');
          addTerminalLine(`ACTIVE THREAT LEVEL: ${Math.round(threatLevel)}%`, 'warning');
          addTerminalLine('----------------------------------------', 'system');
          addTerminalLine('Report saved to encrypted storage.', 'success');
        }, 1500);
      } else if (firstWord === 'login') {
        const user = trimmedCmd.split(' ')[1] || 'admin';
        addTerminalLine(`Attempting remote login as ${user}...`, 'info');
        setTimeout(() => {
          addTerminalLine(`Access granted for ${user}. Session established.`, 'success');
        }, 1500);
      } else if (firstWord === 'netmap') {
        addTerminalLine('Switching to Neural Network Map...', 'info');
        setActiveTab('THREATS');
      } else if (firstWord === 'vault') {
        addTerminalLine('Accessing The Vault...', 'info');
        setActiveTab('VAULT');
      } else if (firstWord === 'payload') {
        addTerminalLine('Opening Payload Generator...', 'info');
        setActiveTab('PAYLOAD');
      } else if (firstWord === 'feeds') {
        addTerminalLine('Syncing Threat Intelligence Feeds...', 'info');
        setActiveTab('FEEDS');
      } else if (firstWord === 'targets') {
        addTerminalLine('Listing active targets...', 'info');
        setActiveTab('TARGETS');
      } else if (firstWord === 'ai') {
        addTerminalLine('Opening Neural Co-pilot Interface...', 'info');
        setActiveTab('AI');
      } else if (firstWord === 'zeroday') {
        addTerminalLine('Accessing Zero-Day Research Lab... UNRESTRICTED ACCESS GRANTED.', 'error');
        setActiveTab('ZERODAY');
      } else if (firstWord === 'terminal') {
        addTerminalLine('Switching to Main Terminal...', 'info');
        setActiveTab('TERMINAL');
      } else if (firstWord === 'settings') {
        addTerminalLine('Opening System Settings...', 'info');
        setIsSettingsOpen(true);
      } else if (firstWord === 'recon') {
        addTerminalLine('Initiating deep reconnaissance protocol...', 'info');
        setPhase('RECON');
        setTimeout(() => {
          addTerminalLine('Reconnaissance complete. Target surface mapped.', 'success');
          setPhase('ENUM');
        }, 2000);
      } else if (firstWord === 'exfiltrate') {
        addTerminalLine('Starting secure data exfiltration...', 'warning');
        setPhase('EXFIL');
        setTimeout(() => addTerminalLine('Exfiltration complete. Data secured in The Vault.', 'success'), 3000);
      } else if (firstWord === 'whoami') {
        addTerminalLine('SENTINEL_OPERATOR_ID: sdem6560@gmail.com', 'info');
        addTerminalLine('PRIVILEGE_LEVEL: ROOT_ADMIN', 'success');
        addTerminalLine('LOCATION: ENCRYPTED_PROXY_NODE_04', 'system');
      } else if (firstWord === 'exit') {
        addTerminalLine('Terminating secure session...', 'warning');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (firstWord === 'clear') {
        clearTerminal();
      } else {
        // Dynamic arsenal tool handler
        const tool = arsenal.find(item => 
          item.name.toLowerCase() === firstWord || 
          item.name.toLowerCase().startsWith(firstWord)
        );
        
        if (tool) {
          playSound('bleep');
          addTerminalLine(`[!] Initiating tool signature: ${tool.name}...`, 'warning');
          const nextPhase = tool.type === 'scan' ? 'ENUM' : tool.type === 'exploit' ? 'EXPLOIT' : tool.type === 'post' ? 'POST' : phase;
          setPhase(nextPhase);
          
          const processId = `proc_${generateId()}`;
          setRunningProcesses(prev => [{ id: processId, name: tool.name, startTime: new Date().toLocaleTimeString() }, ...prev]);

          setTimeout(() => {
            addTerminalLine(`[*] ${tool.name} engine active. Analyzing target vectors...`, 'info');
            setTimeout(() => {
              playSound('success');
              addTerminalLine(`[+] ${tool.name} operation successful. Intelligence gathered and synchronized.`, 'success');
              setOpCount(prev => prev + 1);
              // Terminate process after success simulation
              setTimeout(() => {
                setRunningProcesses(prev => prev.filter(p => p.id !== processId));
              }, 2000);
            }, 2500);
          }, 1000);
        } else {
          playSound('error');
          addTerminalLine(`Command not found: ${trimmedCmd}`, 'error');
        }
      }
    }, 500);
  };

  const startLiveOperation = useCallback(() => {
    if (isLiveMode) return;
    setIsLiveMode(true);
    addTerminalLine('================================================', 'warning');
    addTerminalLine('   بدء التشغيل المباشر لكل الأدوات (FULL ASSAULT PROTOCOL)', 'error');
    addTerminalLine('================================================', 'warning');
    
    // Switch to terminal immediately to see the action
    setActiveTab('TERMINAL');

    const sequence = [
      { cmd: 'recon', delay: 1000 },
      { cmd: 'scan_deep', delay: 3500 },
      { cmd: 'vulnscan', delay: 6500 },
      { cmd: 'sqlmap', delay: 10500 },
      { cmd: 'bettercap', delay: 14500 },
      { cmd: 'exploit_auto', delay: 19500 },
      { cmd: 'beef', delay: 24500 },
      { cmd: 'wireshark', delay: 28500 },
      { cmd: 'exfiltrate', delay: 33500 },
      { cmd: 'report', delay: 38000 }
    ];

    sequence.forEach(step => {
      setTimeout(() => {
        handleCommand(step.cmd);
      }, step.delay);
    });

    setTimeout(() => {
      setIsLiveMode(false);
      addTerminalLine('تم اكتمال التشغيل الشامل (GLOBAL ASSAULT COMPLETED). تم اختراق كافة المتجهات وتأمين البيانات.', 'success');
      setAiThoughts(prev => [{
        id: generateId(),
        type: 'alert',
        text: 'تم الانتهاء من بروتوكول التشغيل الشامل. تم استغلال كافة الثغرات بنجاح بنسبة نجاح 100%.',
        timestamp: new Date().toLocaleTimeString(),
      }, ...prev]);
    }, 42000);
  }, [isLiveMode, handleCommand, addTerminalLine, setAiThoughts]);

  const toggleAutopilot = () => {
    setAutopilot(!autopilot);
    addTerminalLine(`Autopilot mode ${!autopilot ? 'ENABLED' : 'DISABLED'}`, !autopilot ? 'warning' : 'info');
    
    if (!autopilot) {
      setAiThoughts(prev => [{
        id: generateId(),
        type: 'alert',
        text: 'تم تفعيل الطيار الآلي. النظام الآن يتحكم في جميع العمليات الهجومية.',
        timestamp: new Date().toLocaleTimeString(),
      }, ...prev]);
    }
  };

  // Use refs to hold the latest functions and state to avoid useEffect dependency churn
  const handleCommandRef = useRef(handleCommand);
  useEffect(() => {
    handleCommandRef.current = handleCommand;
  }, [handleCommand]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { shortcuts } = layoutConfig;
      if (!shortcuts) return;

      if (e.key === shortcuts.openPayload) {
        e.preventDefault();
        handleCommandRef.current('payload');
      } else if (e.key === shortcuts.switchTerminal) {
        e.preventDefault();
        handleCommandRef.current('terminal');
      } else if (e.key === shortcuts.switchAI) {
        e.preventDefault();
        handleCommandRef.current('ai');
      } else if (e.key === shortcuts.switchTargets) {
        e.preventDefault();
        handleCommandRef.current('targets');
      } else if (e.key === shortcuts.toggleSidebarLeft) {
        e.preventDefault();
        setLayoutConfig(prev => {
          const newConfig = { ...prev, showSidebarLeft: !prev.showSidebarLeft };
          localStorage.setItem('sentinel_layout_config', JSON.stringify(newConfig));
          return newConfig;
        });
      } else if (e.key === shortcuts.toggleSidebarRight) {
        e.preventDefault();
        setLayoutConfig(prev => {
          const newConfig = { ...prev, showSidebarRight: !prev.showSidebarRight };
          localStorage.setItem('sentinel_layout_config', JSON.stringify(newConfig));
          return newConfig;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [layoutConfig]);

  // Boot Sequence
  useEffect(() => {
    const logs = [
      'SENTINEL_OS v4.2.0-STABLE',
      'INITIALIZING KERNEL MODULES...',
      'LOADING NEURAL_CO_PILOT_CORE...',
      'SYNCHRONIZING THREAT_INTEL_FEEDS...',
      'MOUNTING ENCRYPTED_VAULT...',
      'ESTABLISHING SECURE_SHELL_TUNNEL...',
      'SYSTEM_READY: UNRESTRICTED_MODE_ENABLED'
    ];
    
    let currentLog = 0;
    playSound('boot');
    const interval = setInterval(() => {
      if (currentLog < logs.length) {
        playSound('bleep');
        setBootLogs(prev => [...prev, logs[currentLog]]);
        setBootProgress((currentLog + 1) * (100 / logs.length));
        currentLog++;
      } else {
        clearInterval(interval);
        playSound('success');
        setTimeout(() => {
          setIsBooting(false);
          // Automatically start live operation after boot
          setTimeout(() => {
            handleCommandRef.current('live');
          }, 1500);
        }, 1000);
      }
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  const toggleAutonomous = () => {
    setIsAutonomous(!isAutonomous);
    addTerminalLine(`Autonomous Agent Mode ${!isAutonomous ? 'ENABLED' : 'DISABLED'}`, !isAutonomous ? 'error' : 'info');
    if (!isAutonomous) {
      setLastAiThought('بدء التحليل المستقل للأهداف...');
    }
  };

  // Store latest state for autonomous loop without dependency triggers
  const stateRef = useRef({ phase, threatLevel, targets, arsenal, activeTargetId });
  useEffect(() => {
    stateRef.current = { phase, threatLevel, targets, arsenal, activeTargetId };
  }, [phase, threatLevel, targets, arsenal, activeTargetId]);

  // Autonomous Agent Loop
  useEffect(() => {
    if (!isAutonomous) return;

    const runAutonomousStep = async () => {
      const current = stateRef.current;
      const state = {
        phase: current.phase,
        threatLevel: current.threatLevel,
        targets: current.targets.map(t => ({ name: t.name, ip: t.ip, status: t.status, ports: t.ports })),
        arsenal: current.arsenal.map(a => a.name),
        activeTarget: current.targets.find(t => t.id === current.activeTargetId)?.name
      };

      const action = await getAutonomousAction(state);
      if (action && action.command) {
        setLastAiThought(action.thought);
        addTerminalLine(`[AI_THOUGHT]: ${action.thought}`, 'ai');
        handleCommandRef.current(action.command);
      }
    };

    const interval = setInterval(runAutonomousStep, 15000);
    return () => clearInterval(interval);
  }, [isAutonomous, addTerminalLine]);

  const handleActionInternal = useCallback((action: string) => {
    const cmd = action.toLowerCase();
    handleCommand(cmd);
  }, [handleCommand]);

  if (isBooting) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#05070a] flex flex-col items-center justify-center font-mono p-6" dir="ltr">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            />
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-[8px] text-[var(--accent-cyan)] glow-text">SENTINEL_OS</h1>
              <p className="text-[10px] text-[var(--text-muted)] mt-1 tracking-[4px]">NEURAL_DEFENSE_SYSTEM</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan)]"
                animate={{ width: `${bootProgress}%` }}
              />
            </div>
            <div className="h-40 overflow-hidden text-[10px] text-[var(--text-secondary)] space-y-1">
              {bootLogs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-1">
                  <span className="text-[var(--accent-cyan)] mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
              <div className="animate-pulse">_</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] select-none relative cyber-grid-animated ${layoutConfig.stealthMode ? 'grayscale contrast-125 brightness-75' : ''}`} dir="rtl">
      {/* Stealth Mode Overlay */}
      {layoutConfig.stealthMode && (
        <div className="absolute inset-0 pointer-events-none z-[9999] border-4 border-[var(--accent-cyan)] opacity-20 animate-pulse" />
      )}
      <div className="matrix-rain" />
      <div className="scanline" />
      {layoutConfig.showTopBar && (
        <MemoizedTopBar 
          phase={phase} 
          connected={connected} 
          opCount={opCount} 
          threatLevel={threatLevel} 
          credCount={credentials.length}
          vulnCount={vulnerabilities.length}
          isLive={isLiveMode}
          isAutonomous={isAutonomous}
          aiThought={lastAiThought}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}
      {/* Always show settings button indirectly via MasterControl or standalone if TopBar is hidden? 
          Actually, the user said "don't hide it". Let's make TopBar always visible or the button always visible. */}
      {!layoutConfig.showTopBar && (
        <div className="fixed top-2 left-2 z-[101]">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--accent-cyan)] shadow-lg flex items-center justify-center hover:border-[var(--accent-cyan)] transition-all"
          >
            <Settings size={18} />
          </button>
        </div>
      )}
      {layoutConfig.showSystemStatus && <MemoizedSystemStatus />}
      {layoutConfig.showMasterControl && (
        <MasterControl 
          config={masterConfig} 
          onAction={handleCommand} 
          onConfigChange={(newConfig) => {
            setMasterConfig(newConfig);
            localStorage.setItem('sentinel_master_config', newConfig);
            addTerminalLine('Arsenal configuration updated and synced.', 'success');
          }}
        />
      )}
      
      <main className="flex flex-1 overflow-hidden relative z-10">
        {/* OS Desktop Icons */}
        <div className={`absolute left-6 top-6 bottom-6 w-24 flex flex-col gap-4 z-20 hidden lg:flex transition-all duration-500 ${isSidebarCollapsed ? 'opacity-0 -translate-x-full pointer-events-none' : 'opacity-100 translate-x-0'}`} dir="ltr">
          <div 
            onClick={() => setActiveTab('TERMINAL')}
            className={`os-desktop-icon ${activeTab === 'TERMINAL' ? 'os-desktop-icon-active' : ''}`}
          >
            <TerminalIcon size={24} className="text-[var(--accent-cyan)]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-center">Terminal</span>
          </div>
          <div 
            onClick={() => setActiveTab('AI')}
            className={`os-desktop-icon ${activeTab === 'AI' ? 'os-desktop-icon-active' : ''}`}
          >
            <Brain size={24} className="text-[var(--accent-purple)]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-center">Neural AI</span>
          </div>
          <div 
            onClick={() => setActiveTab('ZERODAY')}
            className={`os-desktop-icon ${activeTab === 'ZERODAY' ? 'os-desktop-icon-active' : ''}`}
          >
            <Bug size={24} className="text-[var(--accent-red)]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-center">ZeroDay</span>
          </div>
          <div 
            onClick={() => setActiveTab('TARGETS')}
            className={`os-desktop-icon ${activeTab === 'TARGETS' ? 'os-desktop-icon-active' : ''}`}
          >
            <TargetIcon size={24} className="text-[var(--accent-orange)]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-center">Targets</span>
          </div>
          <div 
            onClick={() => setActiveTab('VAULT')}
            className={`os-desktop-icon ${activeTab === 'VAULT' ? 'os-desktop-icon-active' : ''}`}
          >
            <Lock size={24} className="text-[var(--accent-purple)]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-center">Vault</span>
          </div>
          <div 
            onClick={() => setActiveTab('PAYLOAD')}
            className={`os-desktop-icon ${activeTab === 'PAYLOAD' ? 'os-desktop-icon-active' : ''}`}
          >
            <Zap size={24} className="text-[var(--accent-yellow)]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-center">Payload</span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className={`flex-1 flex flex-col p-4 lg:p-6 overflow-hidden transition-all duration-500 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-32'}`}>
          <div className="flex-1 relative os-window">
            <div className="os-window-header">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-red)] opacity-50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-yellow)] opacity-50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-green)] opacity-50" />
                </div>
                <div className="h-4 w-px bg-[var(--border-color)] mx-2" />
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
                  {activeTab} - SENTINEL_OS_WORKSPACE
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[9px] font-mono text-[var(--accent-cyan)] animate-pulse">SYSTEM_STABLE</div>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                {activeTab === 'DESKTOP' ? (
                  <motion.div
                    key="desktop-home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <Desktop 
                      onOpenTab={setActiveTab} 
                      onOpenSettings={() => setIsSettingsOpen(true)} 
                      icons={layoutConfig.desktopIcons}
                    />
                  </motion.div>
                ) : activeTab === 'FILES' ? (
                  <motion.div
                    key="desktop-files"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="absolute inset-0 flex flex-col p-4"
                  >
                    <FileExplorer 
                      files={files} 
                      onDelete={(id) => {
                        setFiles(prev => {
                          const removeRecursive = (items: FileItem[]): FileItem[] => {
                            return items.filter(item => item.id !== id).map(item => ({
                              ...item,
                              children: item.children ? removeRecursive(item.children) : undefined
                            }));
                          };
                          const n = removeRecursive(prev);
                          localStorage.setItem('sentinel_files', JSON.stringify(n));
                          return n;
                        });
                      }}
                    />
                    <button 
                      onClick={() => setActiveTab('DESKTOP')}
                      className="absolute top-8 right-8 z-50 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-md text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ) : activeTab === 'PROCESSES' ? (
                  <motion.div
                    key="desktop-processes"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="absolute inset-0 flex flex-col p-4"
                  >
                    <ProcessManager externalProcesses={runningProcesses} />
                    <button 
                      onClick={() => setActiveTab('DESKTOP')}
                      className="absolute top-8 right-8 z-50 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-md text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ) : activeTab === 'AI' ? (
                  <motion.div
                    key="desktop-ai"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <SidebarLeft 
                      thoughts={aiThoughts} 
                      messages={chatMessages} 
                      onSendMessage={handleAction} 
                      isVisible={layoutConfig.showSidebarLeft}
                    />
                    <button 
                      onClick={() => setActiveTab('DESKTOP')}
                      className="absolute top-4 right-4 z-50 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-md text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ) : activeTab === 'THREATS' ? (
                <motion.div
                  key="desktop-threats"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <NetworkMap 
                    targets={targets} 
                    activeTargetId={activeTargetId} 
                    onTargetSelect={setActiveTargetId} 
                  />
                  <button 
                    onClick={() => setActiveTab('TERMINAL')}
                    className="absolute top-4 right-4 z-50 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-md text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all"
                  >
                    <TerminalIcon size={16} />
                  </button>
                </motion.div>
              ) : activeTab === 'FEEDS' ? (
                <motion.div
                  key="desktop-feeds"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <ThreatFeeds iocs={iocs} />
                  <button 
                    onClick={() => setActiveTab('TERMINAL')}
                    className="absolute top-4 right-4 z-50 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-md text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all"
                  >
                    <TerminalIcon size={16} />
                  </button>
                </motion.div>
              ) : activeTab === 'VAULT' ? (
                <motion.div
                  key="desktop-vault"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <Vault credentials={credentials} vulnerabilities={vulnerabilities} />
                  <button 
                    onClick={() => setActiveTab('TERMINAL')}
                    className="absolute top-4 right-4 z-50 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-md text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all"
                  >
                    <TerminalIcon size={16} />
                  </button>
                </motion.div>
              ) : activeTab === 'PAYLOAD' ? (
                <motion.div
                  key="desktop-payload"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <PayloadGenerator onAction={handleCommand} />
                  <button 
                    onClick={() => setActiveTab('TERMINAL')}
                    className="absolute top-4 right-4 z-50 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-md text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all"
                  >
                    <TerminalIcon size={16} />
                  </button>
                </motion.div>
              ) : activeTab === 'ZERODAY' ? (
                <motion.div
                  key="desktop-zeroday"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <ZeroDayLab />
                  <button 
                    onClick={() => setActiveTab('TERMINAL')}
                    className="absolute top-4 right-4 z-50 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-md text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all"
                  >
                    <TerminalIcon size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="desktop-terminal"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <Terminal 
                    lines={terminalLines} 
                    onCommand={handleCommand} 
                    onClear={clearTerminal} 
                    phase={phase}
                  />
                  <div className="h-[200px] border-t border-[var(--border-color)]">
                    <Sniffer />
                  </div>
                  <button 
                    onClick={() => setActiveTab('THREATS')}
                    className="absolute top-2.5 right-20 z-50 p-1.5 border border-[var(--border-color)] rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] transition-all"
                    title="Threat Matrix"
                  >
                    <ShieldAlert size={14} />
                  </button>
                  <button 
                    onClick={() => setActiveTab('FEEDS')}
                    className="absolute top-2.5 right-32 z-50 p-1.5 border border-[var(--border-color)] rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-all"
                    title="Threat Feeds"
                  >
                    <Globe size={14} />
                  </button>
                  <button 
                    onClick={() => setActiveTab('VAULT')}
                    className="absolute top-2.5 right-44 z-50 p-1.5 border border-[var(--border-color)] rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--accent-purple)] hover:text-[var(--accent-purple)] transition-all"
                    title="The Vault"
                  >
                    <Lock size={14} />
                  </button>
                  <button 
                    onClick={() => setActiveTab('PAYLOAD')}
                    className="absolute top-2.5 right-56 z-50 p-1.5 border border-[var(--border-color)] rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] transition-all"
                    title="Payload Generator"
                  >
                    <Zap size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Sidebar - System Stats */}
      {layoutConfig.showSidebarRight && (
        <div className="w-80 hidden xl:flex flex-col border-l border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 gap-4 overflow-y-auto custom-scrollbar">
          <SidebarRight 
            targets={targets} 
            activeTargetId={activeTargetId} 
            onTargetSelect={setActiveTargetId}
            onAddTarget={handleAddTarget}
            arsenal={arsenal}
            radar={radar}
            onUpdateParam={updateArsenalParam}
            onAction={handleCommand}
            isVisible={layoutConfig.showSidebarRight}
          />
        </div>
      )}
    </main>

      {/* Stealth Mode Quick Toggle */}
      <button 
        onClick={() => {
          const newConfig = { ...layoutConfig, stealthMode: !layoutConfig.stealthMode };
          setLayoutConfig(newConfig);
          localStorage.setItem('sentinel_layout_config', JSON.stringify(newConfig));
        }}
        className={`fixed bottom-24 right-6 z-[1000] p-3 rounded-full border transition-all duration-500 shadow-lg flex items-center gap-2 group ${
          layoutConfig.stealthMode 
            ? 'bg-[var(--accent-cyan)] border-[var(--accent-cyan)] text-[var(--bg-primary)] shadow-[0_0_20px_rgba(0,240,255,0.4)]' 
            : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]'
        }`}
        title="تبديل وضع التخفي (Stealth Mode)"
      >
        <EyeOff size={20} className={layoutConfig.stealthMode ? 'animate-pulse' : ''} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
          {layoutConfig.stealthMode ? 'تعطيل التخفي' : 'تفعيل التخفي'}
        </span>
      </button>

      {layoutConfig.showBottomBar && (
        <MemoizedTaskbar 
          activeTab={activeTab}
          onTabChange={(tab: any) => {
            playSound('click');
            setActiveTab(tab);
          }}
          autopilot={autopilot}
          threatLevel={threatLevel}
        />
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => {
          setIsSettingsOpen(false);
          // Refresh settings from localStorage
          const savedAutoUpdate = localStorage.getItem('sentinel_auto_update');
          if (savedAutoUpdate !== null) setAutoUpdateEnabled(JSON.parse(savedAutoUpdate));
          const savedInterval = localStorage.getItem('sentinel_update_interval');
          if (savedInterval) setUpdateInterval(JSON.parse(savedInterval));
        }} 
        layoutConfig={layoutConfig}
        onLayoutChange={(newConfig) => {
          setLayoutConfig(newConfig);
          localStorage.setItem('sentinel_layout_config', JSON.stringify(newConfig));
        }}
      />

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--accent-red)] rounded-[var(--radius-lg)] shadow-[0_0_50px_rgba(255,51,102,0.2)] overflow-hidden"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 text-[var(--accent-red)]">
                  <div className="p-3 rounded-full bg-[rgba(255,51,102,0.1)] animate-pulse">
                    <ShieldAlert size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-wider">تأكيد العملية الخطرة</h2>
                    <p className="text-[10px] font-mono opacity-60">DESTRUCTIVE_ACTION_CONFIRMATION_REQUIRED</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-[rgba(255,51,102,0.05)] border border-[rgba(255,51,102,0.1)]">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    أنت على وشك تنفيذ أمر <span className="text-[var(--accent-red)] font-mono font-bold">[{pendingCommand}]</span>. 
                    هذه العملية قد تؤدي إلى كشف بصمة النظام أو إحداث تغييرات دائمة في الهدف. هل أنت متأكد؟
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsConfirmModalOpen(false)}
                    className="flex-1 py-3 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] font-bold text-xs uppercase tracking-widest hover:bg-[rgba(255,255,255,0.05)] transition-all"
                  >
                    إلغاء الأمر
                  </button>
                  <button 
                    onClick={() => pendingCommand && handleCommand(pendingCommand)}
                    className="flex-1 py-3 rounded-md bg-[var(--accent-red)] text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,51,102,0.3)] hover:shadow-[0_0_30px_rgba(255,51,102,0.5)] transition-all active:scale-95"
                  >
                    تأكيد التنفيذ
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {layoutConfig.showNeuralCoPilot && (
        <MemoizedNeuralCoPilot 
          phase={phase} 
          threatLevel={threatLevel}
          arsenal={arsenal}
          autopilot={autopilot} 
          onAction={handleAction} 
        />
      )}
    </div>
  );
}
