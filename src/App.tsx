import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Terminal as TerminalIcon, Globe, Lock, Zap } from 'lucide-react';
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
import { SystemStatus } from './components/SystemStatus';
import { MasterControl } from './components/MasterControl';
import { NeuralCoPilot } from './components/NeuralCoPilot';
import { SettingsModal } from './components/SettingsModal';
import { BottomBar } from './components/BottomBar';
import { Phase, TerminalLine, ChatMessage, AIThought, Target, ArsenalItem, RadarEvent, IOC, Credential, Vulnerability } from './types';
import { getAIResponse, getSystemThoughts } from './services/geminiService';

// Helper for unique IDs - moved outside to be stable
const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export default function App() {
  // State
  const [phase, setPhase] = useState<Phase>('ENUM');
  const [connected, setConnected] = useState(true);
  const [opCount, setOpCount] = useState(124);
  const [autopilot, setAutopilot] = useState(true);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(() => {
    return localStorage.getItem('sentinel_activeTargetId') || 't1';
  });
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'AI' | 'TARGETS' | 'THREATS' | 'FEEDS' | 'VAULT' | 'PAYLOAD'>(() => {
    return (localStorage.getItem('sentinel_activeTab') as any) || 'TERMINAL';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [iocs, setIocs] = useState<IOC[]>([]);
  const [threatLevel, setThreatLevel] = useState(34);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>(() => {
    const saved = localStorage.getItem('sentinel_terminalLines');
    const initial = [
      { id: 'sys-1', type: 'system', content: 'Sentinel OS v4.2.0 initialized...', timestamp: '04:34:50' },
      { id: 'sys-2', type: 'info', content: 'Establishing secure connection to neural network...', timestamp: '04:34:51' },
      { id: 'sys-3', type: 'success', content: 'Connection established. Autonomous mode standby.', timestamp: '04:34:52' },
      { id: 'sys-4', type: 'warning', content: 'FULL SYSTEM ACTIVATION SIGNAL RECEIVED.', timestamp: '04:34:53' },
      { id: 'sys-5', type: 'ai', content: 'Autopilot engaged. Neural link established. Commencing full-scale operation...', timestamp: '04:34:54' },
    ];
    if (!saved) return initial as TerminalLine[];
    try {
      const parsed = JSON.parse(saved);
      // Migration: Ensure unique IDs for old data
      return parsed.map((l: any, i: number) => ({
        ...l,
        id: l.id.includes('-') ? l.id : `${l.id}-mig-${i}-${Math.random().toString(36).substring(2, 5)}`
      }));
    } catch {
      return initial as TerminalLine[];
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('sentinel_chatMessages');
    const initial = [
      { id: 'chat-1', role: 'ai', text: 'تم تفعيل جميع الأنظمة. الطيار الآلي نشط الآن ويقود العمليات. جاري مسح الشبكة بالكامل ورصد التهديدات العالمية.', timestamp: '04:34:50' },
    ];
    if (!saved) return initial as ChatMessage[];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any, i: number) => ({
        ...m,
        id: m.id.includes('-') ? m.id : `${m.id}-mig-${i}-${Math.random().toString(36).substring(2, 5)}`
      }));
    } catch {
      return initial as ChatMessage[];
    }
  });

  const [aiThoughts, setAiThoughts] = useState<AIThought[]>(() => {
    const saved = localStorage.getItem('sentinel_aiThoughts');
    const initial = [
      { id: 'th-1', type: 'analysis', text: 'تم اكتشاف 3 نقاط ضعف محتملة في جدار الحماية الرئيسي للهدف.', timestamp: '04:34:55' },
      { id: 'th-2', type: 'prediction', text: 'من المتوقع أن يتم تجاوز نظام كشف التسلل (IDS) خلال 15 دقيقة في حال تفعيل الطيار الآلي.', timestamp: '04:35:00' },
    ];
    if (!saved) return initial as AIThought[];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((t: any, i: number) => ({
        ...t,
        id: t.id.includes('-') ? t.id : `${t.id}-mig-${i}-${Math.random().toString(36).substring(2, 5)}`
      }));
    } catch {
      return initial as AIThought[];
    }
  });

  const [targets, setTargets] = useState<Target[]>([
    { id: 't1', name: 'Mainframe_Alpha', ip: '192.168.1.45', status: 'online', os: 'Linux Kernel 5.15' },
    { id: 't2', name: 'DB_Server_01', ip: '192.168.1.102', status: 'scanning' },
    { id: 't3', name: 'Gateway_Node', ip: '10.0.0.1', status: 'offline' },
    { id: 't4', name: 'server_db_03', ip: '192.168.1.150', status: 'online', os: 'Windows Server 2022' },
  ]);

  const [arsenal, setArsenal] = useState<ArsenalItem[]>([
    { 
      id: 'a1', 
      name: 'Nmap_Stealth', 
      desc: 'فحص المنافذ بشكل خفي', 
      type: 'scan',
      params: [
        { id: 'p1', name: 'Intensivity', value: 3, type: 'number' },
        { id: 'p2', name: 'Timing', value: 'T4', type: 'select', options: ['T1', 'T2', 'T3', 'T4', 'T5'] }
      ]
    },
    { 
      id: 'a2', 
      name: 'Metasploit_Core', 
      desc: 'محرك الاستغلال الرئيسي', 
      type: 'exploit',
      params: [
        { id: 'p3', name: 'LHOST', value: '192.168.1.10', type: 'text' },
        { id: 'p4', name: 'Payload', value: 'meterpreter_reverse_tcp', type: 'select', options: ['meterpreter_reverse_tcp', 'shell_reverse_tcp', 'meterpreter_bind_tcp'] }
      ]
    },
    { 
      id: 'a3', 
      name: 'ANDRAX_Mobile', 
      desc: 'منصة اختبار اختراق الأندرويد', 
      type: 'exploit',
      params: [
        { id: 'p5', name: 'Target SDK', value: 33, type: 'number' },
        { id: 'p6', name: 'Auto-Root', value: true, type: 'toggle' }
      ]
    },
    { 
      id: 'a4', 
      name: 'Mimikatz_Lite', 
      desc: 'استخراج كلمات المرور', 
      type: 'post',
      params: [
        { id: 'p7', name: 'Dump LSASS', value: true, type: 'toggle' },
        { id: 'p8', name: 'Output Format', value: 'text', type: 'select', options: ['text', 'json', 'csv'] }
      ]
    },
    { id: 'a5', name: 'ProxyChains', desc: 'توجيه الحركة عبر وكلاء', type: 'util' },
  ]);

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

  const [radar, setRadar] = useState<RadarEvent[]>([
    { id: 'r1', time: '04:34:55', message: 'تم اكتشاف منفذ مفتوح <span class="highlight">80/TCP</span> على الهدف Alpha' },
    { id: 'r2', time: '04:35:02', message: 'محاولة استطلاع من عنوان IP خارجي <span class="highlight">45.22.11.9</span>' },
    { id: 'r3', time: '05:11:00', message: 'تم دمج منصة <span class="highlight">ANDRAX</span> بنجاح في النظام' },
  ]);

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
    if (terminalLines.length > 0) {
      localStorage.setItem('sentinel_terminalLines', JSON.stringify(terminalLines));
    }
  }, [terminalLines]);

  useEffect(() => {
    localStorage.setItem('sentinel_chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('sentinel_aiThoughts', JSON.stringify(aiThoughts));
  }, [aiThoughts]);

  useEffect(() => {
    if (activeTargetId) localStorage.setItem('sentinel_activeTargetId', activeTargetId);
  }, [activeTargetId]);

  useEffect(() => {
    localStorage.setItem('sentinel_activeTab', activeTab);
  }, [activeTab]);

  // Periodic thoughts update
  useEffect(() => {
    // Initial IOC generation
    const initialIocs: IOC[] = [
      { id: 'ioc-1', type: 'IP', value: '185.244.25.102', source: 'AlienVault', severity: 'critical', timestamp: new Date().toLocaleTimeString() },
      { id: 'ioc-2', type: 'DOMAIN', value: 'malicious-update.com', source: 'OTX', severity: 'high', timestamp: new Date().toLocaleTimeString() },
      { id: 'ioc-3', type: 'HASH', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', source: 'MISP', severity: 'medium', timestamp: new Date().toLocaleTimeString() },
    ];
    setIocs(initialIocs);

    // Initial Hacker Data
    setCredentials([
      { id: 'c1', targetId: 't1', username: 'admin', password: 'password123', type: 'ssh', timestamp: '04:35:10' },
      { id: 'c2', targetId: 't4', username: 'db_user', hash: 'e10adc3949ba59abbe56e057f20f883e', type: 'db', timestamp: '05:12:45' }
    ]);
    setVulnerabilities([
      { id: 'v1', cve: 'CVE-2023-1234', severity: 'critical', description: 'Remote Code Execution in OpenSSH', status: 'detected' },
      { id: 'v2', cve: 'CVE-2024-5678', severity: 'high', description: 'SQL Injection in Database Gateway', status: 'exploited' }
    ]);

    const interval = setInterval(async () => {
      // Update threat level
      setThreatLevel(prev => Math.min(100, Math.max(0, prev + (Math.random() * 10 - 5))));

      // Update thoughts
      const newThoughts = await getSystemThoughts();
      if (newThoughts && newThoughts.length > 0) {
        const formattedThoughts = newThoughts.map((t: any) => ({
          id: generateId(),
          type: t.type,
          text: t.text,
          timestamp: new Date().toLocaleTimeString().split(' ')[0],
        }));
        setAiThoughts(prev => [...formattedThoughts, ...prev].slice(0, 20));
      }

      // Simulate new IOCs if feeds are enabled
      const savedFeeds = localStorage.getItem('sentinel_threat_feeds');
      const enabledFeeds = savedFeeds ? JSON.parse(savedFeeds).filter((f: any) => f.enabled) : [];
      
      if (enabledFeeds.length > 0 && Math.random() > 0.7) {
        const feed = enabledFeeds[Math.floor(Math.random() * enabledFeeds.length)];
        const types: IOC['type'][] = ['IP', 'DOMAIN', 'HASH', 'URL'];
        const severities: IOC['severity'][] = ['low', 'medium', 'high', 'critical'];
        
        const newIoc: IOC = {
          id: generateId(),
          type: types[Math.floor(Math.random() * types.length)],
          value: `simulated-${Math.random().toString(36).substring(7)}`,
          source: feed.name,
          severity: severities[Math.floor(Math.random() * severities.length)],
          timestamp: new Date().toLocaleTimeString()
        };
        setIocs(prev => [newIoc, ...prev].slice(0, 50));
        addTerminalLine(`New IOC detected from ${feed.name}: ${newIoc.type} ${newIoc.value}`, 'warning');
      }
    }, 60000); // Every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const addTerminalLine = useCallback((content: string, type: TerminalLine['type'] = 'output') => {
    const newLine: TerminalLine = {
      id: generateId(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTerminalLines(prev => [...prev, newLine]);
  }, []);

  const handleCommand = (cmd: string) => {
    addTerminalLine(cmd, 'command');
    
    // Simple command simulation
    setTimeout(() => {
      if (cmd.toLowerCase() === 'help') {
        addTerminalLine('AVAILABLE COMMANDS:', 'info');
        addTerminalLine('  recon     - Start deep reconnaissance protocol', 'system');
        addTerminalLine('  scan      - Scan local network for targets', 'system');
        addTerminalLine('  vulnscan  - Run vulnerability scan on current target', 'system');
        addTerminalLine('  brute     - Start brute force attack on target', 'system');
        addTerminalLine('  exploit   - Attempt to exploit current target', 'system');
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
        addTerminalLine('  terminal  - Switch to Main Terminal', 'system');
        addTerminalLine('  settings  - Open System Settings', 'system');
        addTerminalLine('  status    - Show system status', 'system');
        addTerminalLine('  clear     - Clear terminal output', 'system');
        addTerminalLine('  exit      - Terminate secure session', 'system');
      } else if (cmd.toLowerCase().startsWith('deploy')) {
        const type = cmd.split(' ')[1] || 'payload';
        addTerminalLine(`Deploying ${type} to target...`, 'warning');
        setTimeout(() => {
          addTerminalLine(`${type.toUpperCase()} deployed successfully. Connection established.`, 'success');
          setOpCount(prev => prev + 1);
          setPhase('EXPLOIT');
        }, 2000);
      } else if (cmd.toLowerCase() === 'scan') {
        addTerminalLine('Starting network scan...', 'info');
        setPhase('ENUM');
        setTimeout(() => addTerminalLine('Scan complete. Found 2 new services.', 'success'), 2000);
      } else if (cmd.toLowerCase() === 'exploit') {
        addTerminalLine('Bypassing firewall...', 'info');
        setTimeout(() => {
          addTerminalLine('Exploit successful! Root access granted.', 'success');
          setPhase('EXPLOIT');
          setOpCount(prev => prev + 1);
          
          // Add captured credential
          const newCred: Credential = {
            id: generateId(),
            targetId: activeTargetId || 't1',
            username: 'root',
            password: 'secret_password_' + Math.floor(Math.random() * 1000),
            type: 'ssh',
            timestamp: new Date().toLocaleTimeString()
          };
          setCredentials(prev => [newCred, ...prev]);
          addTerminalLine(`NEW CREDENTIAL HARVESTED: ${newCred.username}:${newCred.password}`, 'ai');
        }, 2000);
      } else if (cmd.toLowerCase().startsWith('vulnscan')) {
        const target = cmd.split(' ')[1] || 'current';
        addTerminalLine(`Initiating vulnerability scan on ${target}...`, 'info');
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
        }, 3000);
      } else if (cmd.toLowerCase().startsWith('brute')) {
        const target = cmd.split(' ')[1] || '192.168.1.102';
        addTerminalLine(`Starting brute force attack on ${target} (SSH)...`, 'warning');
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
      } else if (cmd.toLowerCase() === 'andrax') {
        addTerminalLine('Initializing ANDRAX Mobile Penetration Suite...', 'warning');
        setTimeout(() => {
          addTerminalLine('Loading Android kernel modules...', 'info');
          setTimeout(() => {
            addTerminalLine('ANDRAX integrated. Ready for mobile attack vectors.', 'success');
            setOpCount(prev => prev + 1);
          }, 1500);
        }, 1000);
      } else if (cmd.toLowerCase() === 'status') {
        addTerminalLine('SYSTEM STATUS REPORT:', 'info');
        addTerminalLine(`  PHASE: ${phase}`, 'system');
        addTerminalLine(`  THREAT_LEVEL: ${Math.round(threatLevel)}%`, 'system');
        addTerminalLine(`  CREDENTIALS_HARVESTED: ${credentials.length}`, 'system');
        addTerminalLine(`  VULNERABILITIES_DETECTED: ${vulnerabilities.length}`, 'system');
        addTerminalLine(`  AUTOPILOT: ${autopilot ? 'ACTIVE' : 'DISABLED'}`, 'system');
        addTerminalLine('  ENCRYPTION: AES-256-GCM', 'system');
      } else if (cmd.toLowerCase().startsWith('login')) {
        const user = cmd.split(' ')[1] || 'admin';
        addTerminalLine(`Attempting remote login as ${user}...`, 'info');
        setTimeout(() => {
          addTerminalLine(`Access granted for ${user}. Session established.`, 'success');
        }, 1500);
      } else if (cmd.toLowerCase() === 'netmap') {
        addTerminalLine('Switching to Neural Network Map...', 'info');
        setActiveTab('THREATS');
      } else if (cmd.toLowerCase() === 'vault') {
        addTerminalLine('Accessing The Vault...', 'info');
        setActiveTab('VAULT');
      } else if (cmd.toLowerCase() === 'payload') {
        addTerminalLine('Opening Payload Generator...', 'info');
        setActiveTab('PAYLOAD');
      } else if (cmd.toLowerCase() === 'feeds') {
        addTerminalLine('Syncing Threat Intelligence Feeds...', 'info');
        setActiveTab('FEEDS');
      } else if (cmd.toLowerCase() === 'targets') {
        addTerminalLine('Listing active targets...', 'info');
        setActiveTab('TARGETS');
      } else if (cmd.toLowerCase() === 'ai') {
        addTerminalLine('Opening Neural Co-pilot Interface...', 'info');
        setActiveTab('AI');
      } else if (cmd.toLowerCase() === 'terminal') {
        addTerminalLine('Switching to Main Terminal...', 'info');
        setActiveTab('TERMINAL');
      } else if (cmd.toLowerCase() === 'settings') {
        addTerminalLine('Opening System Settings...', 'info');
        setIsSettingsOpen(true);
      } else if (cmd.toLowerCase() === 'recon') {
        addTerminalLine('Initiating deep reconnaissance protocol...', 'info');
        setPhase('RECON');
        setTimeout(() => addTerminalLine('Reconnaissance complete. Target surface mapped.', 'success'), 2000);
      } else if (cmd.toLowerCase() === 'exfiltrate') {
        addTerminalLine('Starting secure data exfiltration...', 'warning');
        setPhase('EXFIL');
        setTimeout(() => addTerminalLine('Exfiltration complete. Data secured in The Vault.', 'success'), 3000);
      } else if (cmd.toLowerCase() === 'whoami') {
        addTerminalLine('SENTINEL_OPERATOR_ID: sdem6560@gmail.com', 'info');
        addTerminalLine('PRIVILEGE_LEVEL: ROOT_ADMIN', 'success');
        addTerminalLine('LOCATION: ENCRYPTED_PROXY_NODE_04', 'system');
      } else if (cmd.toLowerCase() === 'exit') {
        addTerminalLine('Terminating secure session...', 'warning');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (cmd.toLowerCase() === 'clear') {
        setTerminalLines([]);
      } else {
        addTerminalLine(`Command not found: ${cmd}`, 'error');
      }
    }, 500);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages(prev => [...prev, userMsg]);

    // Gemini API response
    const history = chatMessages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model' as const,
      parts: [{ text: m.text }]
    }));

    const responseText = await getAIResponse(text, history);
    
    const aiMsg: ChatMessage = {
      id: generateId(),
      role: 'ai',
      text: responseText || 'لا يوجد رد من النظام.',
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages(prev => [...prev, aiMsg]);
  };

  const toggleAutopilot = () => {
    setAutopilot(!autopilot);
    addTerminalLine(`Autopilot mode ${!autopilot ? 'ENABLED' : 'DISABLED'}`, !autopilot ? 'warning' : 'info');
    
    if (!autopilot) {
      const thought: AIThought = {
        id: generateId(),
        type: 'alert',
        text: 'تم تفعيل الطيار الآلي. النظام الآن يتحكم في جميع العمليات الهجومية.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setAiThoughts(prev => [thought, ...prev]);
    }
  };

  const handleAction = (action: string) => {
    const cmd = action.toLowerCase();
    handleCommand(cmd);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] select-none relative cyber-grid-animated" dir="rtl">
      <div className="matrix-rain" />
      <div className="scanline" />
      <TopBar 
        phase={phase} 
        connected={connected} 
        opCount={opCount} 
        threatLevel={threatLevel} 
        credCount={credentials.length}
        vulnCount={vulnerabilities.length}
      />
      <SystemStatus />
      <MasterControl onAction={handleCommand} />
      
      <main className="flex flex-1 overflow-hidden relative z-10">
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          <SidebarLeft 
            thoughts={aiThoughts} 
            messages={chatMessages} 
            onSendMessage={handleSendMessage} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden glass-panel m-1 rounded-[var(--radius-md)] cyber-border relative">
            <AnimatePresence mode="wait">
              {activeTab === 'THREATS' ? (
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
                    onClear={() => setTerminalLines([])} 
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

          <SidebarRight 
            targets={targets} 
            activeTargetId={activeTargetId} 
            onTargetSelect={setActiveTargetId}
            arsenal={arsenal}
            radar={radar}
            onUpdateParam={updateArsenalParam}
            onAction={handleCommand}
          />
        </div>

        {/* Mobile Layout (Tabbed with Layered Animation) */}
        <div className="flex md:hidden flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'AI' && (
              <motion.div 
                key="ai-tab"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex overflow-hidden w-full"
              >
                <SidebarLeft 
                  thoughts={aiThoughts} 
                  messages={chatMessages} 
                  onSendMessage={handleSendMessage} 
                />
              </motion.div>
            )}
            
            {activeTab === 'TERMINAL' && (
              <motion.div 
                key="terminal-tab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col overflow-hidden glass-panel m-1 rounded-[var(--radius-md)] cyber-border w-full"
              >
                <Terminal 
                  lines={terminalLines} 
                  onCommand={handleCommand} 
                  onClear={() => setTerminalLines([])} 
                />
              </motion.div>
            )}

            {activeTab === 'TARGETS' && (
              <motion.div 
                key="targets-tab"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex overflow-hidden w-full"
              >
                <SidebarRight 
                  targets={targets} 
                  activeTargetId={activeTargetId} 
                  onTargetSelect={setActiveTargetId}
                  arsenal={arsenal}
                  radar={radar}
                  onUpdateParam={updateArsenalParam}
                  onAction={handleCommand}
                />
              </motion.div>
            )}

            {activeTab === 'THREATS' && (
              <motion.div 
                key="threats-tab"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex overflow-hidden w-full"
              >
                <NetworkMap 
                  targets={targets} 
                  activeTargetId={activeTargetId} 
                  onTargetSelect={setActiveTargetId} 
                />
              </motion.div>
            )}

            {activeTab === 'FEEDS' && (
              <motion.div 
                key="feeds-tab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex overflow-hidden w-full"
              >
                <ThreatFeeds iocs={iocs} />
              </motion.div>
            )}

            {activeTab === 'VAULT' && (
              <motion.div 
                key="vault-tab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex overflow-hidden w-full"
              >
                <Vault credentials={credentials} vulnerabilities={vulnerabilities} />
              </motion.div>
            )}

            {activeTab === 'PAYLOAD' && (
              <motion.div 
                key="payload-tab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex overflow-hidden w-full"
              >
                <PayloadGenerator onAction={handleCommand} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <BottomBar 
        phase={phase} 
        autopilot={autopilot} 
        onAutopilotToggle={toggleAutopilot} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAction={handleAction}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      <NeuralCoPilot 
        phase={phase} 
        autopilot={autopilot} 
        onAction={handleAction} 
      />
    </div>
  );
}
