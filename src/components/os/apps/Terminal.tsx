'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useOsStore } from '@/store/osStore'
import { FaTerminal, FaUser, FaServer, FaNetworkWired, FaClock } from 'react-icons/fa'

// Terminal commands
const commands: Record<string, (args: string[]) => string> = {
  help: () => {
    return `Available Commands:
  help - Display this help message
  ls - List directory contents
  cd - Change directory
  cat - Display file contents
  clear - Clear the terminal
  echo - Display a line of text
  date - Display the current date and time
  whoami - Display current user
  hostname - Display system hostname
  ifconfig - Display network configuration
  ping - Test network connectivity
  neofetch - Display system information
  matrix - Start the Matrix effect
  exit - Close the terminal window`
  },
  
  ls: (args) => {
    const directory = args[0] || 'home'
    const files: Record<string, string[]> = {
      'home': ['Documents', 'Pictures', 'Music', 'Downloads', 'config.ini', '.bash_history'],
      'Documents': ['project_x.txt', 'meeting_notes.md', 'secrets.enc'],
      'Pictures': ['screenshot.png', 'profile.jpg', 'cybercity.jpg'],
      'Music': ['synthwave.mp3', 'cyberpunk_mix.ogg', 'darksynth_playlist.m3u'],
      'Downloads': ['security_patch.zip', 'neural_network.dat', 'encrypted_data.bin']
    }
    
    if (directory in files) {
      return files[directory].join('\n')
    } else {
      return `ls: cannot access '${directory}': No such file or directory`
    }
  },
  
  cd: (args) => {
    const directory = args[0]
    if (!directory) {
      return 'cd: missing operand'
    }
    
    const validDirs = ['home', 'Documents', 'Pictures', 'Music', 'Downloads', '..']
    if (validDirs.includes(directory)) {
      return `Changed directory to ${directory}`
    } else {
      return `cd: ${directory}: No such directory`
    }
  },
  
  cat: (args) => {
    const file = args[0]
    if (!file) {
      return 'cat: missing file operand'
    }
    
    const fileContents: Record<string, string> = {
      'config.ini': 'username=neo\ndebug=false\nencryption=enabled\nproxy=192.168.0.10:9050',
      'project_x.txt': 'PROJECT X\n--------\nStatus: In Progress\nDeadline: ASAP\nSecurity Level: HIGHEST\n\nDetails classified.',
      'meeting_notes.md': '# Meeting with Proxima Corp\n- Discussed AI integration\n- Neural interface prototype demo\n- Security concerns re: backdoor access\n- Next meeting scheduled for 12/15',
      'secrets.enc': '[ENCRYPTED CONTENT - ACCESS DENIED]'
    }
    
    if (file in fileContents) {
      return fileContents[file]
    } else {
      return `cat: ${file}: No such file or directory`
    }
  },
  
  clear: () => {
    return 'CLEAR'
  },
  
  echo: (args) => {
    return args.join(' ')
  },
  
  date: () => {
    return new Date().toString()
  },
  
  whoami: () => {
    return 'user@gensin'
  },
  
  hostname: () => {
    return 'gensin-quantum'
  },
  
  ifconfig: () => {
    return `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.42  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::215:5dff:fe44:ae10  prefixlen 64  scopeid 0x20<link>
        ether 00:15:5d:44:ae:10  txqueuelen 1000  (Ethernet)
        RX packets 846872  bytes 1093626001 (1.0 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 446903  bytes 61925013 (59.0 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`
  },
  
  ping: (args) => {
    const host = args[0] || 'localhost'
    return `PING ${host} (127.0.0.1) 56(84) bytes of data.
64 bytes from localhost (127.0.0.1): icmp_seq=1 ttl=64 time=0.022 ms
64 bytes from localhost (127.0.0.1): icmp_seq=2 ttl=64 time=0.024 ms
64 bytes from localhost (127.0.0.1): icmp_seq=3 ttl=64 time=0.028 ms
64 bytes from localhost (127.0.0.1): icmp_seq=4 ttl=64 time=0.031 ms

--- ${host} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3060ms
rtt min/avg/max/mdev = 0.022/0.026/0.031/0.004 ms`
  },
  
  neofetch: () => {
    return `                    ..,
                  .:::::::.
            .:: ::::::::::'::.        user@gensin-quantum
         .:::::::::::::::::::::      -------------------
       .:::::::::::::::::::::::'     OS: GensinOS x64
    .::::::::::::::::::::::::::      Kernel: 5.4.0-quantum
  .::::::::::::::::::::::.           Uptime: 6 days, 4 hours, 32 mins
  '::::::::::::::::::.               Packages: 1432
    '::::::::::::::.                 Shell: cysh 1.0.0
      ':::::::::::                   Resolution: 3840x2160
        ':::::'                      DE: CyberDE
          ''                         WM: NeoWM
                                     Terminal: GensinTerm
                                     CPU: Quantum Core i9 @ 5.2GHz
                                     Memory: 16384MB / 32768MB`
  },
  
  matrix: () => {
    return 'MATRIX_MODE'
  },
  
  exit: () => {
    return 'EXIT'
  }
}

export default function Terminal() {
  const { addNotification, username } = useOsStore()
  const [history, setHistory] = useState<string[]>([`Welcome to GensinOS Terminal v1.0.0`, `Type 'help' to see available commands.`, ''])
  const [command, setCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentDir, setCurrentDir] = useState('home')
  const [isMatrixMode, setIsMatrixMode] = useState(false)
  
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Scroll to bottom on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  
  // Process command
  const handleCommand = () => {
    if (!command.trim()) return
    
    // Add command to history
    const commandWithPrompt = `${username || 'user'}@gensin:~/${currentDir}$ ${command}`
    setHistory(prev => [...prev.slice(0, prev.length - 1), commandWithPrompt, ''])
    
    // Add to command history
    setCommandHistory(prev => [command, ...prev.slice(0, 19)])
    setHistoryIndex(-1)
    
    // Process command
    const [cmd, ...args] = command.trim().split(' ')
    
    // Execute command
    if (cmd in commands) {
      const output = commands[cmd](args)
      
      if (output === 'CLEAR') {
        setHistory([''])
      } else if (output === 'MATRIX_MODE') {
        setIsMatrixMode(true)
        // Reset after 10 seconds
        setTimeout(() => {
          setIsMatrixMode(false)
        }, 10000)
      } else if (output === 'EXIT') {
        addNotification({
          title: 'Terminal',
          message: 'Terminal session ended',
          type: 'info',
          autoClose: true
        })
        // In a real application, this would close the terminal window
      } else {
        setHistory(prev => [...prev.slice(0, prev.length - 1), output, ''])
      }
    } else {
      setHistory(prev => [...prev.slice(0, prev.length - 1), `Command not found: ${cmd}`, ''])
    }
    
    setCommand('')
  }
  
  // Handle keydown events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCommand(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCommand(commandHistory[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommand('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Simple tab completion - in a real terminal this would be more complex
      const [partialCmd] = command.trim().split(' ')
      const suggestions = Object.keys(commands).filter(cmd => cmd.startsWith(partialCmd))
      
      if (suggestions.length === 1) {
        setCommand(suggestions[0])
      } else if (suggestions.length > 0) {
        setHistory(prev => [...prev.slice(0, prev.length - 1), suggestions.join('  '), ''])
      }
    }
  }
  
  // Render terminal output with syntax highlighting
  const renderOutput = (text: string) => {
    if (!text) return <div className="h-5">&nbsp;</div>
    
    // Check if this is a command line
    if (text.includes('@gensin:~')) {
      const [prompt, cmd] = text.split('$ ')
      return (
        <div>
          <span className="text-green-400">{prompt}$ </span>
          <span className="text-cyber-blue">{cmd}</span>
        </div>
      )
    }
    
    // Basic syntax highlighting
    return (
      <div>
        {text.split('\n').map((line, i) => {
          // Directory or file names
          if (line.match(/\.(txt|md|ini|enc|jpg|png|mp3|ogg|m3u|zip|dat|bin)/)) {
            return <div key={i} className="text-yellow-300">{line}</div>
          }
          
          // Directory names in ls output
          if (line.match(/^(Documents|Pictures|Music|Downloads)$/)) {
            return <div key={i} className="text-blue-400">{line}</div>
          }
          
          // Error messages
          if (line.match(/not found|cannot access|denied|missing/i)) {
            return <div key={i} className="text-red-400">{line}</div>
          }
          
          // IP addresses
          if (line.match(/\d+\.\d+\.\d+\.\d+/)) {
            return <div key={i} className="text-purple-400">{line}</div>
          }
          
          // Command titles
          if (line.match(/^Available Commands:|OS:|Kernel:|Uptime:/)) {
            return <div key={i} className="text-cyan-400 font-bold">{line}</div>
          }
          
          return <div key={i}>{line}</div>
        })}
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col bg-black/95 text-green-400 font-mono rounded-lg overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <FaTerminal className="text-green-500" />
          <span className="text-gray-300 font-medium">Terminal</span>
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <FaUser className="text-green-400" />
            <span>{username || 'user'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaServer className="text-purple-400" />
            <span>gensin-quantum</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaNetworkWired className="text-blue-400" />
            <span>192.168.1.42</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaClock className="text-yellow-400" />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      
      {/* Terminal content */}
      <div
        ref={terminalRef}
        className="flex-1 p-3 overflow-auto font-mono text-sm leading-5 relative"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Matrix mode effect */}
        {isMatrixMode && (
          <div className="absolute inset-0 bg-black z-10 overflow-hidden">
            <div className="matrix-effect">
              {Array.from({ length: 100 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="matrix-column text-green-500"
                  initial={{ y: -1000 }}
                  animate={{ y: 2000 }}
                  transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'linear',
                    delay: Math.random() * 2
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    opacity: 0.8 + Math.random() * 0.2
                  }}
                >
                  {Array.from({ length: 20 }).map((_, j) => (
                    <div key={j} className="matrix-char">
                      {String.fromCharCode(0x30A0 + Math.random() * 96)}
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Terminal output */}
        <div className="terminal-output">
          {history.map((text, index) => (
            <div key={index} className="mb-1">
              {renderOutput(text)}
            </div>
          ))}
        </div>
        
        {/* Current command line */}
        <div className="flex items-center">
          <span className="text-green-400 mr-2">{username || 'user'}@gensin:~/{currentDir}$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-cyber-blue caret-cyber-blue"
            autoFocus
          />
        </div>
      </div>
      
      <style jsx>{`
        .matrix-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }
        .matrix-column {
          position: absolute;
          font-size: 1.2rem;
          line-height: 1;
          white-space: nowrap;
        }
        .matrix-char {
          opacity: 0.8;
          animation: flicker 0.5s infinite;
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
 