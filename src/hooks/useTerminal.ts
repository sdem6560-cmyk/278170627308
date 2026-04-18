import { useState, useCallback, useEffect } from 'react';
import { TerminalLine } from '../types';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useTerminal = () => {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>(() => {
    const saved = localStorage.getItem('sentinel_terminalLines');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('sentinel_terminalLines', JSON.stringify(terminalLines));
  }, [terminalLines]);

  const addTerminalLine = useCallback((content: string, type: TerminalLine['type'] = 'output', phase?: string) => {
    const newLine: TerminalLine = {
      id: generateId(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString(),
      phase,
    };
    setTerminalLines(prev => [...prev, newLine]);
  }, []);

  const clearTerminal = useCallback(() => {
    setTerminalLines([]);
  }, []);

  return {
    terminalLines,
    addTerminalLine,
    clearTerminal
  };
};
