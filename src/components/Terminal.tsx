import React, { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Maximize2, X, Trash2 } from 'lucide-react';
import { TerminalLine } from '../types';
import { COMMANDS } from '../constants';

interface TerminalProps {
  lines: TerminalLine[];
  onCommand: (cmd: string) => void;
  onClear: () => void;
  phase?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ lines, onCommand, onClear, phase = 'RECON' }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [tabMatches, setTabMatches] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(-1);
  const [originalPrefix, setOriginalPrefix] = useState('');
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('sentinel_terminal_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('sentinel_terminal_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus only on mount and manual trigger
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput && tabIndex === -1) {
      const firstWord = trimmedInput.split(' ')[0].toLowerCase();
      
      // Only offer autocomplete for the command itself (no spaces yet)
      if (!inputValue.includes(' ')) {
        const matches = COMMANDS.filter(cmd => cmd.startsWith(firstWord));
        setIsValid(matches.length > 0);
        setTabMatches(matches);

        if (matches.length > 0) {
          const match = matches[0];
          if (match && match.startsWith(inputValue.toLowerCase()) && match !== inputValue.toLowerCase()) {
            setSuggestion(match.slice(inputValue.length));
          } else {
            setSuggestion('');
          }
        } else {
          setSuggestion('');
        }
      } else {
        // If there's a space, they are typing arguments. Just validate the first word.
        const isValidCmd = COMMANDS.includes(firstWord);
        setIsValid(isValidCmd);
        setTabMatches([]);
        setSuggestion('');
      }
    } else if (!trimmedInput) {
      setSuggestion('');
      setIsValid(true);
      setTabMatches([]);
      setTabIndex(-1);
      setOriginalPrefix('');
    }
  }, [inputValue, tabIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCommand(inputValue);
      if (inputValue.trim()) {
        setHistory(prev => {
          const newHistory = [inputValue, ...prev.filter(h => h !== inputValue)].slice(0, 50);
          return newHistory;
        });
      }
      setHistoryIndex(-1);
      setInputValue('');
      setSuggestion('');
      setTabIndex(-1);
      setOriginalPrefix('');
      const terminal = outputRef.current;
      if (terminal) {
        terminal.classList.add('terminal-pulse');
        setTimeout(() => terminal.classList.remove('terminal-pulse'), 200);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (tabMatches.length > 0) {
        if (tabMatches.length === 1) {
          // If only one match, just complete it
          setInputValue(tabMatches[0]);
          setSuggestion('');
          setTabIndex(-1);
        } else {
          // Cycle through matches
          const nextIndex = (tabIndex + 1) % tabMatches.length;
          if (tabIndex === -1) {
            setOriginalPrefix(inputValue);
          }
          setTabIndex(nextIndex);
          setInputValue(tabMatches[nextIndex]);
          setSuggestion('');
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  const getLineStyle = (type: TerminalLine['type']) => {
    switch (type) {
      case 'info': return 'text-[var(--accent-cyan)] border-l-2 border-[var(--accent-cyan)] pl-2 ml-1';
      case 'error': return 'text-[var(--accent-red)] font-bold bg-[rgba(255,51,102,0.08)] px-2 py-1 rounded-sm border-l-2 border-[var(--accent-red)] ml-1';
      case 'success': return 'text-[var(--accent-green)] font-bold bg-[rgba(0,255,136,0.05)] px-2 py-1 rounded-sm border-l-2 border-[var(--accent-green)] ml-1';
      case 'warning': return 'text-[var(--accent-orange)] font-semibold bg-[rgba(255,136,0,0.05)] px-2 py-1 rounded-sm border-l-2 border-[var(--accent-orange)] ml-1';
      case 'ai': return 'text-[var(--accent-purple)] italic bg-[rgba(170,85,255,0.05)] px-2 py-1 rounded-sm border-l-2 border-[var(--accent-purple)] ml-1';
      case 'system': return 'text-[var(--text-muted)] text-[12px] opacity-70 italic';
      case 'command': return 'text-[var(--accent-yellow)] font-medium';
      case 'output': return 'text-[var(--text-primary)] opacity-90 pl-4';
      default: return 'text-[var(--text-primary)]';
    }
  };

  const getPrefix = (type: TerminalLine['type']) => {
    switch (type) {
      case 'info': return 'ℹ ';
      case 'error': return '✖ ';
      case 'success': return '✔ ';
      case 'warning': return '⚠ ';
      case 'ai': return '✦ ';
      case 'system': return '⚙ ';
      default: return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-panel)]">
      <div className="flex items-center justify-between px-5 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shrink-0">
        <div className="flex items-center gap-2.5 font-mono text-sm font-semibold">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-red)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-orange)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-green)]" />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <TerminalIcon size={14} className="text-[var(--text-secondary)]" />
            <span>وحدة التحكم المركزية - root@sentinel:~#</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClear} className="p-1.5 border border-[var(--border-color)] rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] transition-[var(--transition-fast)]">
            <Trash2 size={12} />
          </button>
          <button className="p-1.5 border border-[var(--border-color)] rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-[var(--transition-fast)]">
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      <div 
        ref={outputRef}
        onClick={focusInput}
        className="flex-1 overflow-y-auto p-4 px-5 font-mono text-sm leading-relaxed ltr text-left terminal-output cursor-text"
        style={{ direction: 'ltr', textAlign: 'left' }}
      >
        {lines.map(line => (
          <div key={line.id} className={`mb-2 py-0.5 whitespace-pre-wrap break-all transition-all duration-300 ${getLineStyle(line.type)}`}>
            <div className="flex items-start gap-2">
              {line.type === 'command' ? (
                <span className="shrink-0">
                  <span className="text-[var(--accent-green)] font-bold">root@sentinel</span>
                  <span className="text-[var(--text-primary)]">:</span>
                  <span className="text-[var(--accent-blue)]">[{line.phase || phase}]</span>
                  <span className="text-[var(--text-primary)]">#</span>
                </span>
              ) : (
                <span className="opacity-50 shrink-0 text-[10px] mt-0.5">{getPrefix(line.type)}</span>
              )}
              <div className="flex-1">
                <span className="block">{line.content}</span>
                {line.timestamp && line.type !== 'command' && (
                  <span className="text-[10px] opacity-30 block mt-0.5">[{line.timestamp}]</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2 relative">
          <div className="flex items-center gap-1">
            <span className={`text-[9px] translate-y-[1px] ${isValid ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)] animate-pulse'}`}>
              {isValid ? '●' : '○'}
            </span>
            <span className="text-[var(--accent-green)] font-bold">root@sentinel</span>
          </div>
          <span className="text-[var(--text-primary)]">:</span>
          <span className="text-[var(--accent-blue)]">[{phase}]</span>
          <span className="text-[var(--text-primary)]">#</span>
          <div className="flex-1 relative">
            <input 
              ref={inputRef}
              type="text"
              autoFocus
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setTabIndex(-1);
                setOriginalPrefix('');
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none font-mono text-sm outline-none relative z-10 text-[var(--text-primary)]"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            {suggestion && (
              <div 
                className="absolute left-0 top-0 text-[var(--text-muted)] opacity-50 font-mono text-sm pointer-events-none z-0 whitespace-pre"
              >
                <span className="opacity-0">{inputValue}</span>
                {suggestion}
              </div>
            )}
      {tabMatches.length > 1 && (
        <div className="absolute left-0 -top-10 flex flex-wrap gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] px-3 py-2 rounded-lg shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 backdrop-blur-md max-w-[400px]">
          <div className="w-full text-[9px] font-black uppercase tracking-widest text-[var(--accent-cyan)] mb-1 opacity-70 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
            اقتراحات الأوامر (Command Suggestions)
          </div>
          {tabMatches.map((match, i) => (
            <span 
              key={match} 
              className={`text-[10px] px-2 py-0.5 rounded font-mono transition-all ${
                i === tabIndex 
                  ? 'bg-[var(--accent-cyan)] text-[var(--bg-primary)] font-bold scale-110 shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
                  : 'text-[var(--text-secondary)] bg-[rgba(255,255,255,0.03)] border border-transparent'
              }`}
            >
              {match}
            </span>
          ))}
          <div className="w-full mt-1 pt-1 border-t border-[rgba(255,255,255,0.05)] text-[8px] text-[var(--text-muted)] flex justify-between">
            <span>[TAB] للتنقل</span>
            <span>[ENTER] للاختيار</span>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};
