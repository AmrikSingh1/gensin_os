import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import styles from './Terminal.module.css'

export interface TerminalTheme {
  backgroundColor: string;
  textColor: string;
  promptColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
}

export interface TerminalHistoryItem {
  content: string;
  isCommand?: boolean;
  isError?: boolean;
  timestamp?: Date;
}

export interface TerminalProps {
  initialHistory?: TerminalHistoryItem[];
  prompt?: string;
  theme?: Partial<TerminalTheme>;
  autoFocus?: boolean;
  readOnly?: boolean;
  fullScreen?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  onCommand?: (command: string) => Promise<void> | void;
  onExit?: () => void;
  onClear?: () => void;
  persistHistory?: boolean;
  historyStorageKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Default cyberpunk theme
const defaultTheme: TerminalTheme = {
  backgroundColor: '#0D0221',
  textColor: '#00FF41',
  promptColor: '#FF00FF',
  accentColor: '#00FFFF',
  fontFamily: 'JetBrains Mono, Fira Code, monospace',
  fontSize: 14,
};

const Terminal: React.FC<TerminalProps> = ({
  initialHistory = [],
  prompt = '> ',
  theme = {},
  autoFocus = true,
  readOnly = false,
  fullScreen = false,
  showHeader = true,
  headerTitle = 'Terminal',
  onCommand,
  onExit,
  onClear,
  persistHistory = true,
  historyStorageKey = 'terminal_history',
  className = '',
  style = {},
}) => {
  // Merge provided theme with default theme
  const terminalTheme: TerminalTheme = { ...defaultTheme, ...theme };
  
  // Terminal state
  const [history, setHistory] = useState<TerminalHistoryItem[]>(initialHistory);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [showCursor, setShowCursor] = useState<boolean>(true);
  
  // References
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Load command history from localStorage if persistHistory is true
  useEffect(() => {
    if (persistHistory) {
      try {
        const savedHistory = localStorage.getItem(historyStorageKey);
        if (savedHistory) {
          setCommandHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error loading terminal history:', error);
      }
    }
  }, [persistHistory, historyStorageKey]);
  
  // Save command history to localStorage when it changes
  useEffect(() => {
    if (persistHistory && commandHistory.length > 0) {
      try {
        localStorage.setItem(historyStorageKey, JSON.stringify(commandHistory.slice(-100)));
      } catch (error) {
        console.error('Error saving terminal history:', error);
      }
    }
  }, [commandHistory, persistHistory, historyStorageKey]);
  
  // Autofocus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  // Add command to history
  const addToHistory = (content: string, isCommand: boolean = false, isError: boolean = false) => {
    setHistory(prev => [...prev, {
      content,
      isCommand,
      isError,
      timestamp: new Date()
    }]);
  };
  
  // Handle command submission
  const submitCommand = async () => {
    if (!currentCommand.trim()) return;
    
    // Add to displayed history
    addToHistory(`${prompt}${currentCommand}`, true);
    
    // Add to command history if it's different from the last command
    if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== currentCommand) {
      setCommandHistory(prev => [...prev, currentCommand]);
    }
    
    // Reset history index to allow access to the latest command immediately
    setHistoryIndex(-1);
    
    // Process special commands
    if (currentCommand.trim() === 'clear' && onClear) {
      onClear();
      setHistory([]);
    } else if (currentCommand.trim() === 'exit' && onExit) {
      onExit();
    } else if (onCommand) {
      try {
        await onCommand(currentCommand);
      } catch (error: any) {
        addToHistory(error.message || 'An error occurred', false, true);
      }
    }
    
    // Clear current command
    setCurrentCommand('');
    setCursorPosition(0);
  };
  
  // Handle key presses
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        submitCommand();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
          setHistoryIndex(newIndex);
          const command = commandHistory[commandHistory.length - 1 - newIndex];
          setCurrentCommand(command);
          setCursorPosition(command.length);
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          const command = commandHistory[commandHistory.length - 1 - newIndex];
          setCurrentCommand(command);
          setCursorPosition(command.length);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCurrentCommand('');
          setCursorPosition(0);
        }
        break;
        
      case 'ArrowLeft':
        if (cursorPosition > 0) {
          setCursorPosition(cursorPosition - 1);
        }
        break;
        
      case 'ArrowRight':
        if (cursorPosition < currentCommand.length) {
          setCursorPosition(cursorPosition + 1);
        }
        break;
        
      case 'Home':
        setCursorPosition(0);
        break;
        
      case 'End':
        setCursorPosition(currentCommand.length);
        break;
        
      case 'Tab':
        e.preventDefault();
        // Tab completion is handled by the parent component
        break;
        
      case 'c':
        if (e.ctrlKey) {
          e.preventDefault();
          setCurrentCommand('');
          setCursorPosition(0);
          addToHistory('^C', false);
        }
        break;
        
      case 'l':
        if (e.ctrlKey && onClear) {
          e.preventDefault();
          setHistory([]);
        }
        break;
    }
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    const newCommand = e.target.value;
    setCurrentCommand(newCommand);
    setCursorPosition(e.target.selectionStart || newCommand.length);
  };
  
  // Handle terminal click to focus input
  const handleTerminalClick = () => {
    if (!readOnly && inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Generate terminal styles from theme
  const terminalStyles: React.CSSProperties = {
    backgroundColor: terminalTheme.backgroundColor,
    color: terminalTheme.textColor,
    fontFamily: terminalTheme.fontFamily,
    fontSize: `${terminalTheme.fontSize}px`,
    ...style,
  };
  
  // Split the current command based on cursor position
  const beforeCursor = currentCommand.substring(0, cursorPosition);
  const afterCursor = currentCommand.substring(cursorPosition);
  
  return (
    <motion.div 
      className={`${styles.terminal} ${fullScreen ? styles.fullScreen : ''} ${className}`}
      style={terminalStyles}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleTerminalClick}
    >
      {showHeader && (
        <div className={styles.terminalHeader}>
          <div className={styles.terminalControls}>
            <span className={styles.terminalControl} onClick={onExit} />
            <span className={styles.terminalControl} />
            <span className={styles.terminalControl} />
          </div>
          <div className={styles.terminalTitle}>{headerTitle}</div>
          <div className={styles.terminalControls}></div>
        </div>
      )}
      
      <div ref={terminalRef} className={styles.terminalContent}>
        {history.map((item, index) => (
          <div 
            key={index} 
            className={`${styles.terminalLine} ${item.isCommand ? styles.command : ''} ${item.isError ? styles.error : ''}`}
          >
            {/* Allow HTML content to be displayed for formatting */}
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          </div>
        ))}
        
        {!readOnly && (
          <div className={styles.terminalInputLine}>
            <span style={{ color: terminalTheme.promptColor }}>{prompt}</span>
            <span>{beforeCursor}</span>
            <span className={`${styles.cursor} ${showCursor ? styles.cursorVisible : ''}`}>
              {afterCursor.charAt(0) || ' '}
            </span>
            <span>{afterCursor.substring(1)}</span>
            <input
              ref={inputRef}
              type="text"
              className={styles.terminalInput}
              value={currentCommand}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus={autoFocus}
              disabled={readOnly}
              aria-label="Terminal input"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Terminal; 