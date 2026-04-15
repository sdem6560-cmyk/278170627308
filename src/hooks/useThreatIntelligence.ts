import { useState, useEffect } from 'react';
import { IOC } from '../types';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useThreatIntelligence = (autoUpdateEnabled: boolean, updateInterval: number, addTerminalLine: (content: string, type?: any) => void) => {
  const [iocs, setIocs] = useState<IOC[]>([]);

  useEffect(() => {
    // Initial IOC generation
    const initialIocs: IOC[] = [
      { id: 'ioc-1', type: 'IP', value: '185.244.25.102', source: 'AlienVault', severity: 'critical', timestamp: new Date().toLocaleTimeString() },
      { id: 'ioc-2', type: 'DOMAIN', value: 'malicious-update.com', source: 'OTX', severity: 'high', timestamp: new Date().toLocaleTimeString() },
      { id: 'ioc-3', type: 'HASH', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', source: 'MISP', severity: 'medium', timestamp: new Date().toLocaleTimeString() },
    ];
    setIocs(initialIocs);
  }, []);

  useEffect(() => {
    if (!autoUpdateEnabled) return;

    const interval = setInterval(() => {
      const savedFeeds = localStorage.getItem('sentinel_threat_feeds');
      const enabledFeeds = savedFeeds ? JSON.parse(savedFeeds).filter((f: any) => f.enabled) : [];
      
      if (enabledFeeds.length > 0 && Math.random() > 0.5) {
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
        
        localStorage.setItem('sentinel_last_sync', new Date().toLocaleTimeString());
      }
    }, updateInterval * 1000);

    return () => clearInterval(interval);
  }, [autoUpdateEnabled, updateInterval, addTerminalLine]);

  return { iocs, setIocs };
};
