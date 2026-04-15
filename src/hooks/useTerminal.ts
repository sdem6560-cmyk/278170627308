import { useState, useCallback } from 'react';
import { TerminalLine } from '../types';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useTerminal = () => {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);

  const addTerminalLine = useCallback((content: string, type: TerminalLine['type'] = 'output') => {
    const newLine: TerminalLine = {
      id: generateId(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString(),
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
