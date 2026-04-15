import React, { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Maximize2, X, Trash2 } from 'lucide-react';
import { TerminalLine } from '../types';
import { COMMANDS } from '../constants';

interface TerminalProps {
  lines: TerminalLine[];
  onCommand: (cmd: string) => void;
  onClear: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ lines, onCommand, onClear }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [tabMatches, setTabMatches] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(-1);
  const [originalPrefix, setOriginalPrefix] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isValid, setIsValid] = useState(true);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput && tabIndex === -1) {
      const firstWord = trimmedInput.split(' ')[0].toLowerCase();
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
    } else if (!trimmedInput) {
      setSuggestion('');
      setIsValid(true);
      setTabMatches([]);
      setTabIndex(-1);
      setOriginalPrefix('');
    }
  }, [inputValue, tabIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onCommand(inputValue);
      setHistory(prev => [inputValue, ...prev].slice(0, 50));
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
        const nextIndex = (tabIndex + 1) % tabMatches.length;
        if (tabIndex === -1) {
          setOriginalPrefix(inputValue);
        }
        setTabIndex(nextIndex);
        setInputValue(tabMatches[nextIndex]);
        setSuggestion('');
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
        className="flex-1 overflow-y-auto p-4 px-5 font-mono text-sm leading-relaxed ltr text-left terminal-output"
        style={{ direction: 'ltr', textAlign: 'left' }}
      >
        {lines.map(line => (
          <div key={line.id} className={`mb-2 py-0.5 whitespace-pre-wrap break-all transition-all duration-300 ${getLineStyle(line.type)}`}>
            <div className="flex items-start gap-2">
              {line.type === 'command' ? (
                <span className="shrink-0">
                  <span className="text-[var(--accent-green)] font-bold">root@sentinel</span>
                  <span className="text-[var(--text-primary)]">:</span>
                  <span className="text-[var(--accent-blue)]">~</span>
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
          <span className="text-[var(--accent-green)] font-bold">root@sentinel</span>
          <span className="text-[var(--text-primary)]">:</span>
          <span className="text-[var(--accent-blue)]">~</span>
          <span className="text-[var(--text-primary)]">#</span>
          <div className="flex-1 relative">
            <input 
              type="text"
              autoFocus
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setTabIndex(-1);
                setOriginalPrefix('');
              }}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent border-none font-mono text-sm outline-none relative z-10 transition-colors ${isValid ? 'text-[var(--text-primary)]' : 'text-[var(--accent-red)]'}`}
              spellCheck={false}
              autoComplete="off"
            />
            {suggestion && (
              <div className="absolute left-0 top-0 text-[var(--text-muted)] opacity-50 font-mono text-sm pointer-events-none z-0">
                <span className="invisible">{inputValue}</span>
                {suggestion}
              </div>
            )}
            {tabMatches.length > 1 && (
              <div className="absolute left-0 -top-8 flex gap-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] px-2 py-1 rounded-md text-[10px] z-50 animate-in fade-in slide-in-from-bottom-2">
                <span className="text-[var(--accent-cyan)] font-bold uppercase tracking-tighter opacity-50">Suggestions:</span>
                {tabMatches.map((match, i) => (
                  <span 
                    key={match} 
                    className={`${i === tabIndex ? 'text-[var(--accent-cyan)] font-bold underline' : 'text-[var(--text-muted)]'}`}
                  >
                    {match}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
