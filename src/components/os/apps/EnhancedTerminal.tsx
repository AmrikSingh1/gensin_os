'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useOsStore } from '@/store/osStore'
import { FaTerminal, FaUser, FaServer, FaNetworkWired, FaClock, FaLock, FaCode, FaWifi } from 'react-icons/fa'
import { SiMatrix } from 'react-icons/si'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { BiCommand } from 'react-icons/bi'
import Terminal, { TerminalHistoryItem, TerminalTheme } from '@/components/common/Terminal'
import FileSystemService, { FSNode } from '@/services/FileSystemService'

// Enhanced filesystem simulation
const fileSystem: Record<string, Record<string, any>> = {
  'home': {
    'Documents': {
      type: 'directory',
      'project_x.txt': { type: 'file', content: 'PROJECT X\n--------\nStatus: In Progress\nDeadline: ASAP\nSecurity Level: HIGHEST\n\nDetails classified.' },
      'meeting_notes.md': { type: 'file', content: '# Meeting with Proxima Corp\n- Discussed AI integration\n- Neural interface prototype demo\n- Security concerns re: backdoor access\n- Next meeting scheduled for 12/15' },
      'secrets.enc': { type: 'file', content: '[ENCRYPTED CONTENT - ACCESS DENIED]', encrypted: true },
      'nano.log': { type: 'file', content: 'Nano-enhancement session #42\nSubject: Anonymous\nEnhancements: Optical, Neural, Dermal\nSuccess rate: 87%\nSide effects: Minimal\n\nNext session scheduled for 2077-08-15' }
    },
    'Pictures': {
      type: 'directory',
      'screenshot.png': { type: 'file', content: '[IMAGE BINARY DATA]' },
      'profile.jpg': { type: 'file', content: '[IMAGE BINARY DATA]' },
      'cybercity.jpg': { type: 'file', content: '[IMAGE BINARY DATA]' }
    },
    'Music': {
      type: 'directory',
      'synthwave.mp3': { type: 'file', content: '[AUDIO BINARY DATA]' },
      'cyberpunk_mix.ogg': { type: 'file', content: '[AUDIO BINARY DATA]' },
      'darksynth_playlist.m3u': { type: 'file', content: 'synthwave.mp3\ncyberpunk_mix.ogg\n/shared/music/neon_drive.mp3' }
    },
    'Downloads': {
      type: 'directory',
      'security_patch.zip': { type: 'file', content: '[BINARY DATA]' },
      'neural_network.dat': { type: 'file', content: '[BINARY DATA]' },
      'encrypted_data.bin': { type: 'file', content: '[ENCRYPTED BINARY]', encrypted: true }
    },
    '.config': {
      type: 'directory',
      'system.ini': { type: 'file', content: '[SYSTEM]\ndebug=false\nencryption=enabled\nproxy=192.168.0.10:9050\nai_assist=true\n\n[NETWORK]\nfirewall=active\nvpn=enabled\nhostname=gensin-quantum' }
    },
    'config.ini': { type: 'file', content: 'username=neo\ndebug=false\nencryption=enabled\nproxy=192.168.0.10:9050' },
    '.bash_history': { type: 'file', content: 'ls\ncat config.ini\nifconfig\nping 192.168.0.1\nssh admin@192.168.0.254\nexit' }
  }
};

// Type for terminal command history
interface CommandHistoryItem {
  command: string;
  timestamp: number;
}

// Type for terminal settings
interface TerminalSettings {
  theme: 'dark' | 'cyberpunk' | 'matrix' | 'hacker';
  fontSize: number;
  showTimestamps: boolean;
  persistHistory: boolean;
}

// Type for command completions
interface CommandCompletion {
  value: string;
  description: string;
  type: 'command' | 'file' | 'directory' | 'option';
}

// Type for command execution context
interface CommandContext {
  currentDir: string;
  setCurrentDir: (dir: string) => void;
  fs: FileSystemService;
  username: string;
  theme: string;
  addToOutput: (content: string, isError?: boolean) => void;
  setMatrixMode: (enabled: boolean) => void;
  clearOutput: () => void;
}

// Type for command function 
type CommandFunction = (args: string[], context: CommandContext) => Promise<string> | string;

// Command definition interface
interface CommandDefinition {
  name: string;
  description: string;
  usage: string;
  examples?: string[];
  execute: CommandFunction;
  completions?: (partialArg: string, context: CommandContext) => CommandCompletion[];
}

// Type for commands registry
type CommandsRegistry = Record<string, CommandDefinition>;

// Get filesystem service
const fs = FileSystemService.getInstance();

// Terminal commands with enhanced functionality
const commands: CommandsRegistry = {
  help: {
    name: 'help',
    description: 'Display help information for commands',
    usage: 'help [command]',
    examples: ['help', 'help ls'],
    execute: (args, context) => {
      if (args.length === 0) {
        // List all commands
        let output = '<span class="highlight">Available Commands:</span>\n\n';
        
        Object.values(commands).sort((a, b) => a.name.localeCompare(b.name)).forEach(cmd => {
          output += `<span class="command">${cmd.name}</span> - ${cmd.description}\n`;
        });
        
        output += '\nType <span class="command">help &lt;command&gt;</span> for more information on a specific command.';
        return output;
      } else {
        // Show detailed help for a specific command
        const cmdName = args[0].toLowerCase();
        const cmd = commands[cmdName];
        
        if (!cmd) {
          return `<span class="error">Error: Command '${cmdName}' not found.</span>`;
        }
        
        let output = `<span class="highlight">Help for '${cmd.name}':</span>\n\n`;
        output += `<span class="info">Description:</span> ${cmd.description}\n`;
        output += `<span class="info">Usage:</span> ${cmd.usage}\n`;
        
        if (cmd.examples && cmd.examples.length > 0) {
          output += `<span class="info">Examples:</span>\n`;
          cmd.examples.forEach(example => {
            output += `  ${example}\n`;
          });
        }
        
        return output;
      }
    },
    completions: (partialArg, context) => {
      return Object.keys(commands)
        .filter(cmd => cmd.startsWith(partialArg))
        .map(cmd => ({
          value: cmd,
          description: commands[cmd].description,
          type: 'command'
        }));
    }
  },
  
  ls: {
    name: 'ls',
    description: 'List directory contents',
    usage: 'ls [options] [directory]',
    examples: ['ls', 'ls -l', 'ls /etc'],
    execute: (args, context) => {
      try {
        const path = args.length > 0 && !args[0].startsWith('-') 
          ? args[0] 
          : context.currentDir;
        
        // Check if options include -l (long format)
        const longFormat = args.some(arg => arg === '-l' || arg === '--long');
        
        // Get directory contents
        const contents = context.fs.listDirectory(path);
        
        if (Object.keys(contents).length === 0) {
          return '';
        }
        
        // Sort entries: directories first, then files
        const entries = Object.entries(contents).sort(([aName, a], [bName, b]) => {
          const aIsDir = a.type === 'directory';
          const bIsDir = b.type === 'directory';
          if (aIsDir && !bIsDir) return -1;
          if (!aIsDir && bIsDir) return 1;
          return aName.localeCompare(bName);
        });
        
        let output = '';
        
        if (longFormat) {
          // Long format: show permissions, owner, size, date
          output = '<table style="width:100%;">';
          output += '<tr><th style="text-align:left;">Permissions</th><th style="text-align:left;">Owner</th><th style="text-align:right;">Size</th><th style="text-align:left;">Modified</th><th style="text-align:left;">Name</th></tr>';
          
          for (const [name, node] of entries) {
            const isDir = node.type === 'directory';
            const isExecutable = name.endsWith('.sh') || name.endsWith('.exe');
            const isEncrypted = 'encrypted' in node && node.encrypted;
            
            let itemClass = isDir ? 'dir' : (isExecutable ? 'executable' : 'file');
            if (isEncrypted) itemClass = 'encrypted';
            
            const dateStr = new Date(node.modifiedAt).toLocaleString();
            const size = isDir ? '-' : `${node.size}B`;
            
            output += '<tr>';
            output += `<td>${node.permissions}</td>`;
            output += `<td>${node.owner}</td>`;
            output += `<td style="text-align:right;">${size}</td>`;
            output += `<td>${dateStr}</td>`;
            output += `<td class="${itemClass}">${isDir ? name + '/' : name}</td>`;
            output += '</tr>';
          }
          
          output += '</table>';
        } else {
          // Regular format: just names with formatting
          for (const [name, node] of entries) {
            const isDir = node.type === 'directory';
            const isExecutable = name.endsWith('.sh') || name.endsWith('.exe');
            const isEncrypted = 'encrypted' in node && node.encrypted;
            
            if (isDir) {
              output += `<span class="dir">${name}/</span>  `;
            } else if (isEncrypted) {
              output += `<span class="encrypted">${name}</span>  `;
            } else if (isExecutable) {
              output += `<span class="executable">${name}</span>  `;
            } else {
              output += `<span class="file">${name}</span>  `;
            }
          }
        }
        
        return output;
      } catch (error: any) {
        return `<span class="error">ls: ${error.message}</span>`;
      }
    },
    completions: (partialArg, context) => {
      if (partialArg.startsWith('-')) {
        // Option completions
        return [
          { value: '-l', description: 'Long format', type: 'option' },
          { value: '--long', description: 'Long format', type: 'option' }
        ].filter(opt => opt.value.startsWith(partialArg));
      }
      
      // Path completions
      try {
        const pathParts = partialArg.split('/');
        const dirPath = pathParts.length > 1 
          ? pathParts.slice(0, -1).join('/') 
          : context.currentDir;
        
        const fileName = pathParts[pathParts.length - 1];
        const dirContents = context.fs.listDirectory(dirPath);
        
        return Object.entries(dirContents)
          .filter(([name]) => name.startsWith(fileName))
          .map(([name, node]) => ({
            value: pathParts.length > 1 
              ? `${pathParts.slice(0, -1).join('/')}/${name}` 
              : name,
            description: node.type === 'directory' ? 'Directory' : 'File',
            type: node.type === 'directory' ? 'directory' : 'file'
          }));
      } catch (error) {
        return [];
      }
    }
  },
  
  cd: {
    name: 'cd',
    description: 'Change the current directory',
    usage: 'cd [directory]',
    examples: ['cd', 'cd /home/user', 'cd ..'],
    execute: (args, context) => {
      if (args.length === 0 || args[0] === '~') {
        // Default to /home/user when no argument is provided
        context.setCurrentDir('/home/user');
        return '';
      }
      
      const path = args[0];
      
      try {
        // Check if the path exists and is a directory
        const node = context.fs.getNode(path);
        
        if (!node) {
          return `<span class="error">cd: ${path}: No such file or directory</span>`;
        }
        
        if (node.type !== 'directory') {
          return `<span class="error">cd: ${path}: Not a directory</span>`;
        }
        
        // Set the new current directory
        if (path.startsWith('/')) {
          // Absolute path
          context.setCurrentDir(path);
        } else if (path === '..') {
          // Parent directory
          const parts = context.currentDir.split('/').filter(Boolean);
          if (parts.length > 0) {
            parts.pop();
            context.setCurrentDir('/' + parts.join('/'));
          }
        } else {
          // Relative path
          const newPath = context.currentDir === '/' 
            ? `/${path}` 
            : `${context.currentDir}/${path}`;
          context.setCurrentDir(newPath);
        }
        
        return '';
      } catch (error: any) {
        return `<span class="error">cd: ${error.message}</span>`;
      }
    },
    completions: (partialArg, context) => {
      if (partialArg === '~') {
        return [{ value: '~', description: 'Home directory', type: 'directory' }];
      }
      
      try {
        const pathParts = partialArg.split('/');
        const dirPath = pathParts.length > 1 
          ? pathParts.slice(0, -1).join('/') 
          : context.currentDir;
        
        const fileName = pathParts[pathParts.length - 1];
        const dirContents = context.fs.listDirectory(dirPath);
        
        return Object.entries(dirContents)
          .filter(([name, node]) => 
            name.startsWith(fileName) && node.type === 'directory'
          )
          .map(([name, node]) => ({
            value: pathParts.length > 1 
              ? `${pathParts.slice(0, -1).join('/')}/${name}` 
              : name,
            description: 'Directory',
            type: 'directory'
          }));
      } catch (error) {
        return [];
      }
    }
  },
  
  cat: {
    name: 'cat',
    description: 'Display the contents of a file',
    usage: 'cat [file]',
    examples: ['cat /etc/hosts', 'cat config.ini'],
    execute: (args, context) => {
      if (args.length === 0) {
        return `<span class="error">cat: missing file operand</span>`;
      }
      
      const path = args[0];
      
      try {
        // Read file content
        const content = context.fs.readFile(path);
        
        // Add syntax highlighting based on file extension
        const extension = path.split('.').pop()?.toLowerCase();
        
        if (extension === 'md') {
          // Simple markdown highlighting
          return content
            .replace(/^# (.+)$/gm, '<span style="color:#00FFFF;font-weight:bold;font-size:1.2em;">$1</span>')
            .replace(/^## (.+)$/gm, '<span style="color:#00FFFF;font-weight:bold;font-size:1.1em;">$1</span>')
            .replace(/^### (.+)$/gm, '<span style="color:#00FFFF;font-weight:bold;">$1</span>')
            .replace(/\*\*(.+?)\*\*/g, '<span style="font-weight:bold;">$1</span>')
            .replace(/\*(.+?)\*/g, '<span style="font-style:italic;">$1</span>')
            .replace(/`(.+?)`/g, '<span style="background-color:rgba(0,0,0,0.3);padding:0 3px;border-radius:3px;">$1</span>')
            .replace(/^- (.+)$/gm, '• $1');
        } else if (extension === 'ini' || extension === 'conf') {
          // INI file highlighting
          return content
            .replace(/^\[(.+)\]$/gm, '<span style="color:#FF00FF;font-weight:bold;">[$1]</span>')
            .replace(/^([^=\n]+)=(.*)$/gm, '<span style="color:#00AAFF;">$1</span>=<span style="color:#FFAA00;">$2</span>');
        } else if (extension === 'json') {
          // Basic JSON highlighting
          return content
            .replace(/"([^"]+)":/g, '<span style="color:#00AAFF;">"$1"</span>:')
            .replace(/: "([^"]+)"/g, ': <span style="color:#FFAA00;">"$1"</span>')
            .replace(/: (true|false|null)/g, ': <span style="color:#FF00FF;">$1</span>')
            .replace(/: (\d+)/g, ': <span style="color:#00FF41;">$1</span>');
        } else if (content.includes('[ENCRYPTED CONTENT]')) {
          return '<span class="encrypted">ENCRYPTED CONTENT - ACCESS DENIED</span>';
        }
        
        return content;
      } catch (error: any) {
        return `<span class="error">cat: ${error.message}</span>`;
      }
    },
    completions: (partialArg, context) => {
      try {
        const pathParts = partialArg.split('/');
        const dirPath = pathParts.length > 1 
          ? pathParts.slice(0, -1).join('/') 
          : context.currentDir;
        
        const fileName = pathParts[pathParts.length - 1];
        const dirContents = context.fs.listDirectory(dirPath);
        
        return Object.entries(dirContents)
          .filter(([name, node]) => 
            name.startsWith(fileName) && node.type === 'file'
          )
          .map(([name, node]) => ({
            value: pathParts.length > 1 
              ? `${pathParts.slice(0, -1).join('/')}/${name}` 
              : name,
            description: 'File',
            type: 'file'
          }));
      } catch (error) {
        return [];
      }
    }
  },
  
  clear: {
    name: 'clear',
    description: 'Clear the terminal screen',
    usage: 'clear',
    execute: () => {
      return 'CLEAR';
    }
  },
  
  echo: {
    name: 'echo',
    description: 'Display a line of text',
    usage: 'echo [text]',
    examples: ['echo Hello World'],
    execute: (args: string[]) => {
      return args.join(' ');
    }
  },
  
  date: {
    name: 'date',
    description: 'Display the current date and time',
    usage: 'date',
    execute: () => {
      return new Date().toString();
    }
  },
  
  whoami: {
    name: 'whoami',
    description: 'Print the current user name',
    usage: 'whoami',
    execute: (_: string[], { username }: CommandContext) => {
      return username || 'user@gensin';
    }
  },
  
  hostname: {
    name: 'hostname',
    description: 'Show or set the system hostname',
    usage: 'hostname',
    execute: () => {
      return 'gensin-quantum';
    }
  },
  
  ifconfig: {
    name: 'ifconfig',
    description: 'Configure a network interface',
    usage: 'ifconfig',
    execute: () => {
      return `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.42  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::215:5dff:fe44:ae10  prefixlen 64  scopeid 0x20<link>
        ether 00:15:5d:44:ae:10  txqueuelen 1000  (Ethernet)
        RX packets 14236  bytes 13202737 (12.5 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2693  bytes 275296 (268.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 2692  bytes 382990 (374.0 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2692  bytes 382990 (374.0 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`;
    }
  },
  
  ping: {
    name: 'ping',
    description: 'Send ICMP ECHO_REQUEST to network hosts',
    usage: 'ping [hostname/IP]',
    examples: ['ping 192.168.1.1', 'ping localhost'],
    execute: (args: string[]) => {
      const host = args[0] || 'localhost';
      const packetLoss = host.includes('192.168.1') ? '0' : Math.floor(Math.random() * 30).toString();
      const time = (Math.random() * 0.1 + 0.01).toFixed(3);
      
      return `PING ${host} (${host === 'localhost' ? '127.0.0.1' : host}) 56(84) bytes of data.
64 bytes from ${host === 'localhost' ? '127.0.0.1' : host}: icmp_seq=1 ttl=64 time=${time} ms
64 bytes from ${host === 'localhost' ? '127.0.0.1' : host}: icmp_seq=2 ttl=64 time=${time} ms
64 bytes from ${host === 'localhost' ? '127.0.0.1' : host}: icmp_seq=3 ttl=64 time=${time} ms
64 bytes from ${host === 'localhost' ? '127.0.0.1' : host}: icmp_seq=4 ttl=64 time=${time} ms

--- ${host} ping statistics ---
4 packets transmitted, 4 received, ${packetLoss}% packet loss, time 3004ms
rtt min/avg/max/mdev = ${time}/${time}/${time}/0.000 ms`;
    }
  },
  
  neofetch: {
    name: 'neofetch',
    description: 'Display system information',
    usage: 'neofetch',
    execute: (_: string[], { username }: CommandContext) => {
      return `                    ..,
                   .:::::::.
             .:: ::::::::::'::.        ${username || 'user'}@gensin-quantum
            :::: :::::::::::::::       ------------------
           ':::: ::::::::::::::::.     OS: GensinOS v1.0.0
            :::. '::::::::::::::::     Kernel: CypherCore 5.16.8-cyberpunk
            ::::.  ':::::::::::::.     Uptime: ${Math.floor(Math.random() * 48)} hours, ${Math.floor(Math.random() * 60)} mins
            '::::.  ':::::::::::.      Packages: 1458
             '::::.   ':::::::::.      Shell: zsh 5.9
              '::::.    '::::::.       Resolution: 1920x1080
               ':::::..  ':::::.       DE: GensinDE
                '::::::.  '::.         WM: NeonFlex
                  '::::::.. '::.       WM Theme: Cyberpunk
                   ..::::::::::.       Terminal: EnhancedTerminal
                 .::::::::::::::::     CPU: Quantum Core i9-15900X (32) @ 5.2GHz
               .:::::::::::::::::::    GPU: NVIDIA RTX 5090 ULTRA
              .:::::::::::::::::::::   Memory: ${Math.floor(Math.random() * 16) + 16}GB / 64GB
            .:::::::::::::::::::::·    Disk: ${Math.floor(Math.random() * 500) + 500}GB / 2.0TB`;
    }
  },
  
  ps: {
    name: 'ps',
    description: 'Report a snapshot of the current processes',
    usage: 'ps',
    execute: () => {
      return `  PID TTY          TIME CMD
    1 ?        00:00:01 systemd
   24 ?        00:00:00 systemd-journal
   30 ?        00:00:00 systemd-udevd
  413 ?        00:00:00 NetworkManager
  538 ?        00:00:00 systemd-logind
  657 ?        00:01:22 Xorg
  795 ?        00:00:05 lightdm
  977 ?        00:00:00 sshd
 1034 tty1     00:00:02 gensin-session
 1210 tty1     00:00:01 gensin-panel
 1244 tty1     00:00:00 dbus-daemon
 1320 tty1     00:00:29 gensin-desktop
 1482 tty1     00:00:22 terminal-server
 1824 pts/3    00:00:00 zsh
 2107 pts/3    00:00:00 ps`;
    }
  },
  
  top: {
    name: 'top',
    description: 'Display system tasks',
    usage: 'top',
    execute: () => {
      const uptime = `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`;
      const load = `${(Math.random() * 2).toFixed(2)}, ${(Math.random() * 1.5).toFixed(2)}, ${(Math.random() * 1).toFixed(2)}`;
      const memUsed = Math.floor(Math.random() * 8000) + 8000;
      const memTotal = 16384;
      
      return `top - ${new Date().toLocaleTimeString()} up ${uptime},  2 users,  load average: ${load}
Tasks: 208 total,   1 running, 207 sleeping,   0 stopped,   0 zombie
%Cpu(s):  5.9 us,  2.4 sy,  0.0 ni, 91.7 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :  ${memTotal} total,   ${memTotal - memUsed} free,    ${memUsed} used,    1280 buff/cache
MiB Swap:   2048 total,   2037 free,     11 used.   7200 avail Mem 

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND                                                                 
   2312 user      20   0 4043112 223388 101452 S   6.2   1.3   4:20.48 gensin-desktop
   1530 user      20   0 1126996  69024  47092 S   0.7   0.4   0:48.79 gensin-panel
   9817 user      20   0  931904  53416  37920 S   0.3   0.3   1:01.57 terminal-server
      1 root      20   0  166296  12032   8444 S   0.0   0.1   0:01.38 systemd
   1047 user      20   0  244748   7620   6008 S   0.0   0.0   0:00.17 dbus-daemon`;
    }
  },
  
  ssh: {
    name: 'ssh',
    description: 'OpenSSH SSH client (remote login program)',
    usage: 'ssh [user@]hostname',
    examples: ['ssh admin@192.168.1.1'],
    execute: (args: string[]) => {
      if (!args[0]) {
        return 'ssh: missing hostname';
      }
      
      const target = args[0];
      
      if (target.includes('192.168.1.') || target.includes('localhost')) {
        const authResult = Math.random() > 0.2;
        if (authResult) {
          return `Connected to ${target}\nAuthentication successful\nWelcome to GensinOS Server\nConnection closed.`;
        } else {
          return `ssh: connect to host ${target} port 22: Connection refused`;
        }
      } else {
        return `ssh: Could not resolve hostname ${target}: Name or service not known`;
      }
    }
  },
  
  curl: {
    name: 'curl',
    description: 'Transfer data from or to a server',
    usage: 'curl [options] [URL]',
    examples: ['curl https://api.example.com'],
    execute: (args: string[]) => {
      if (!args[0]) {
        return 'curl: try \'curl --help\' or \'curl --manual\' for more information';
      }
      
      const url = args[0];
      
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        return `<!DOCTYPE html>
<html>
<head>
  <title>GensinOS Server</title>
</head>
<body>
  <h1>Welcome to GensinOS Server</h1>
  <p>Local server running on GensinOS</p>
  <p>Server time: ${new Date().toISOString()}</p>
</body>
</html>`;
      } else if (url.includes('https://api.')) {
        return `{
  "status": "success",
  "data": {
    "id": "gen-${Math.floor(Math.random() * 1000000)}",
    "name": "GensinAPI",
    "version": "1.2.3",
    "timestamp": "${Date.now()}"
  }
}`;
      } else {
        return `curl: (6) Could not resolve host: ${url.split('/')[2]}`;
      }
    }
  },
  
  grep: {
    name: 'grep',
    description: 'Print lines that match patterns',
    usage: 'grep [PATTERN] [FILE]',
    examples: ['grep error system.log'],
    execute: (args: string[]) => {
      if (args.length < 2) {
        return 'grep: usage: grep [PATTERN] [FILE]';
      }
      
      const pattern = args[0];
      const filename = args[1];
      
      // Simulated files
      const files = {
        'system.log': `[2023-01-01 00:00:01] System initialized
[2023-01-01 00:00:02] Network service started
[2023-01-01 00:00:03] Error: Failed to load module X11
[2023-01-01 00:00:04] Warning: Low disk space
[2023-01-01 00:00:05] Error: Database connection failed
[2023-01-01 00:00:06] Service gensin-core started
[2023-01-01 00:00:07] User login: admin
[2023-01-01 00:00:08] Error: Permission denied for /etc/secure
[2023-01-01 00:00:09] System update available`,
        'config.ini': `[SYSTEM]
name=GensinOS
version=1.0.0
debug=false

[NETWORK]
hostname=gensin-quantum
proxy=127.0.0.1:9050
firewall=active

[USER]
name=user
permissions=admin`
      };
      
      if (!files[filename]) {
        return `grep: ${filename}: No such file or directory`;
      }
      
      const lines = files[filename].split('\n');
      const matches = lines.filter(line => line.includes(pattern));
      
      if (matches.length === 0) {
        return '';
      }
      
      return matches.map(line => line.replace(pattern, `<match>${pattern}</match>`)).join('\n');
    }
  },
  
  sudo: {
    name: 'sudo',
    description: 'Execute a command as another user',
    usage: 'sudo [command]',
    examples: ['sudo apt-get update'],
    execute: (args: string[]) => {
      if (args.length === 0) {
        return 'sudo: a command is required';
      }
      
      if (args[0] === 'apt-get' && args[1] === 'update') {
        return 'Reading package lists... Done\nBuilding dependency tree... Done\nReading state information... Done\nAll packages are up to date.';
      } else if (args[0] === 'apt-get' && args[1] === 'upgrade') {
        return 'Reading package lists... Done\nBuilding dependency tree... Done\nReading state information... Done\nCalculating upgrade... Done\n0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.';
      } else {
        return `sudo: ${args.join(' ')}: command not found`;
      }
    }
  },
  
  'apt-get': {
    name: 'apt-get',
    description: 'APT package handling utility',
    usage: 'apt-get [update|upgrade|install] [package]',
    examples: ['apt-get update', 'apt-get install nmap'],
    execute: (args: string[]) => {
      if (args.length === 0) {
        return 'apt-get: missing operation\nTry \'apt-get --help\' for more information.';
      }
      
      const operation = args[0];
      
      if (operation === 'update') {
        return 'Reading package lists... Done';
      } else if (operation === 'upgrade') {
        return 'Reading package lists... Done\nBuilding dependency tree... Done\nReading state information... Done\nCalculating upgrade... Done\n0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.';
      } else if (operation === 'install') {
        if (args.length < 2) {
          return 'apt-get: you must give at least one package name';
        }
        const pkg = args[1];
        return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  ${pkg}
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 2,136 kB of archives.
After this operation, 6,388 kB of additional disk space will be used.
Get:1 https://packages.gensin.os/cyberpunk ${pkg} amd64 1.2.3-1 [2,136 kB]
Fetched 2,136 kB in 0s (4,583 kB/s)
Selecting previously unselected package ${pkg}.
(Reading database ... 231099 files and directories currently installed.)
Preparing to unpack .../${pkg}.deb ...
Unpacking ${pkg} (1.2.3-1) ...
Setting up ${pkg} (1.2.3-1) ...
Processing triggers for man-db (2.10.2-1) ...`;
      } else {
        return `E: Invalid operation ${operation}`;
      }
    }
  },
  
  matrix: {
    name: 'matrix',
    description: 'Activate matrix mode',
    usage: 'matrix',
    execute: () => {
      return 'MATRIX_MODE';
    }
  },
  
  hack: {
    name: 'hack',
    description: 'Simulate hacking into a system',
    usage: 'hack [target]',
    examples: ['hack firewall', 'hack 192.168.1.1'],
    execute: (args: string[]) => {
      if (!args[0]) {
        return 'hack: missing target operand\nUsage: hack [target]';
      }
      
      const target = args[0];
      const steps = [
        `Targeting ${target}...`,
        `Scanning ports...`,
        `Detected open ports: 22, 80, 443, 3389`,
        `Analyzing firewall...`,
        `Firewall vulnerability detected`,
        `Exploiting CVE-2023-1337...`,
        `Bypassing authentication...`,
        `[■■■■■■■■□□] 80%`,
        `Access granted!`,
        `Connected to ${target}`,
        `Downloading data...`,
        `[■■■■■■■■■■] 100%`,
        `Hack complete. Access granted to ${target}`
      ];
      
      return steps.join('\n');
    }
  },
  
  exit: {
    name: 'exit',
    description: 'Exit the terminal session',
    usage: 'exit',
    execute: () => {
      return 'EXIT';
    }
  },
  
  completions: (partialArg: string, context: CommandContext): CommandCompletion[] => {
    if (partialArg.startsWith('-')) {
      // Option completions
      return [
        { value: '--help', description: 'Show help message', type: 'option' },
        { value: '--all', description: 'Show all entries', type: 'option' },
        { value: '--long', description: 'Use long listing format', type: 'option' }
      ];
    } else {
      // Path completions - this is a simplified example
      const parts = context.currentDir.split('/').filter(Boolean);
      let currentNode = fileSystem['home'];
      
      for (const part of parts) {
        if (part === 'home') continue;
        if (currentNode[part]?.type === 'directory') {
          currentNode = currentNode[part];
        } else {
          break;
        }
      }
      
      // Filter items based on partial input
      return Object.keys(currentNode)
        .filter(key => key !== 'type' && key.startsWith(partialArg))
        .map(key => ({
          value: key,
          description: currentNode[key]?.type === 'directory' ? 'Directory' : 'File',
          type: currentNode[key]?.type === 'directory' ? 'directory' : 'file'
        }));
    }
  },
  
  clearOutput: () => {
    setHistory([])
  }
}; 

export default function EnhancedTerminal() {
  const { addNotification, username } = useOsStore()
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentCommand, setCurrentCommand] = useState('')
  const [history, setHistory] = useState<TerminalHistoryItem[]>([])
  const [matrixMode, setMatrixMode] = useState(false)
  const [currentDir, setCurrentDir] = useState('/home')
  const [settings, setSettings] = useState<TerminalSettings>({
    theme: 'dark',
    fontSize: 14,
    showTimestamps: true,
    persistHistory: true,
  })
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [showEditDropdown, setShowEditDropdown] = useState(false)
  const [showViewDropdown, setShowViewDropdown] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  
  // Terminal themes
  const themes: Record<string, TerminalTheme> = {
    dark: {
      backgroundColor: '#1a1a1a',
      textColor: '#f0f0f0',
      promptColor: '#00ff00',
      accentColor: '#0088ff',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: settings.fontSize,
    },
    cyberpunk: {
      backgroundColor: '#0d0221',
      textColor: '#00ff9f',
      promptColor: '#ff00ff',
      accentColor: '#00ccff',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: settings.fontSize,
    },
    matrix: {
      backgroundColor: '#000000',
      textColor: '#00ff41',
      promptColor: '#00ff41',
      accentColor: '#00ff41',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: settings.fontSize,
    },
    hacker: {
      backgroundColor: '#000000',
      textColor: '#33ff33',
      promptColor: '#ff3333',
      accentColor: '#3333ff',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: settings.fontSize,
    },
  }
  
  // Load history from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('terminal_history')
      if (savedHistory && settings.persistHistory) {
        setCommandHistory(JSON.parse(savedHistory))
      }
    }
  }, [settings.persistHistory])
  
  // Create command context for passing to commands
  const commandContext: CommandContext = {
    currentDir,
    setCurrentDir,
    fs,
    username,
    theme: settings.theme,
    addToOutput: (content, isError = false) => {
      setHistory(prev => [...prev, { content, isError }])
    },
    setMatrixMode,
    clearOutput: () => {
      setHistory([])
    }
  }
  
  const handleCommand = () => {
    if (!currentCommand.trim()) return
    
    // Add command to history
    setHistory(prev => [...prev, { content: `${username}@gensin:${currentDir}$ ${currentCommand}`, isCommand: true }])
    
    // Add to command history
    if (commandHistory[0] !== currentCommand) {
      const newHistory = [currentCommand, ...commandHistory.slice(0, 99)]
      setCommandHistory(newHistory)
      if (settings.persistHistory && typeof window !== 'undefined') {
        localStorage.setItem('terminal_history', JSON.stringify(newHistory))
      }
    }
    
    // Parse command
    const parts = currentCommand.trim().split(' ')
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)
    
    // Execute command
    if (commands[cmd]) {
      try {
        const output = commands[cmd].execute(args, commandContext)
        
        if (output === 'CLEAR') {
          setHistory([''])
        } else if (output === 'MATRIX_MODE') {
          setMatrixMode(true)
        } else if (output === 'EXIT') {
          setHistory(prev => [...prev, { content: 'Terminal session ended. Type any key to restart.', isError: false }])
        } else {
          setHistory(prev => [...prev, { content: output, isError: false }])
        }
      } catch (error) {
        setHistory(prev => [...prev, { content: `Error: ${error}`, isError: true }])
      }
    } else {
      setHistory(prev => [...prev, { content: `Command not found: ${cmd}`, isError: true }])
    }
    
    // Reset current command and history index
    setCurrentCommand('')
    setHistoryIndex(-1)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle arrow keys for history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1)
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentCommand('')
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleCommand()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      handleTabCompletion()
    }
  }
  
  const handleTabCompletion = () => {
    if (!currentCommand) return
    
    const parts = currentCommand.split(' ')
    const cmd = parts[0].toLowerCase()
    const lastPart = parts[parts.length - 1]
    
    // Command completion
    if (parts.length === 1) {
      const possibleCommands = Object.keys(commands).filter(c => c.startsWith(cmd))
      if (possibleCommands.length === 1) {
        setCurrentCommand(possibleCommands[0])
      } else if (possibleCommands.length > 0) {
        setHistory(prev => [...prev, { 
          content: `Possible commands: ${possibleCommands.join(', ')}`, 
          isError: false 
        }])
      }
    } 
    // Argument completion
    else if (commands[cmd] && commands[cmd].completions) {
      const completions = commands[cmd].completions(lastPart, commandContext)
      if (completions.length === 1) {
        // Replace the last argument with the completion
        const newParts = [...parts.slice(0, -1), completions[0].value]
        setCurrentCommand(newParts.join(' '))
      } else if (completions.length > 0) {
        // Show possible completions
        setHistory(prev => [...prev, { 
          content: 'Possible completions:\n' + completions.map(c => 
            `${c.value.padEnd(20)} [${c.type}] ${c.description}`).join('\n'), 
          isError: false 
        }])
      }
    }
  }
  
  // Handle theme change
  const changeTheme = (theme: 'dark' | 'cyberpunk' | 'matrix' | 'hacker') => {
    setSettings(prev => ({ ...prev, theme }))
    setShowViewDropdown(false)
  }
  
  // Handle font size change
  const changeFontSize = (size: number) => {
    setSettings(prev => ({ ...prev, fontSize: size }))
    setShowViewDropdown(false)
  }
  
  // Toggle timestamps
  const toggleTimestamps = () => {
    setSettings(prev => ({ ...prev, showTimestamps: !prev.showTimestamps }))
    setShowViewDropdown(false)
  }
  
  // Toggle history persistence
  const toggleHistoryPersistence = () => {
    setSettings(prev => ({ ...prev, persistHistory: !prev.persistHistory }))
    setShowSettingsDropdown(false)
  }
  
  return (
    <div className="enhanced-terminal h-full flex flex-col bg-gradient-to-b from-slate-800 to-slate-900">
      {/* Terminal Toolbar */}
      <div className="terminal-toolbar flex items-center p-1 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-1">
          {/* File Menu */}
          <div className="relative">
            <button 
              className="px-2 py-1 text-xs text-slate-200 hover:bg-slate-700 rounded"
              onClick={() => {
                setShowEditDropdown(false)
                setShowViewDropdown(false)
                setShowSettingsDropdown(!showSettingsDropdown)
              }}
            >
              File
            </button>
            {showSettingsDropdown && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded shadow-lg z-10">
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => {
                    commandContext.clearOutput()
                    setShowSettingsDropdown(false)
                  }}
                >
                  New Terminal
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={toggleHistoryPersistence}
                >
                  {settings.persistHistory ? '✓ ' : ''}Persist History
                </button>
                <div className="border-t border-slate-700 my-1"></div>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => setShowSettingsDropdown(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
          
          {/* Edit Menu */}
          <div className="relative">
            <button 
              className="px-2 py-1 text-xs text-slate-200 hover:bg-slate-700 rounded"
              onClick={() => {
                setShowSettingsDropdown(false)
                setShowViewDropdown(false)
                setShowEditDropdown(!showEditDropdown)
              }}
            >
              Edit
            </button>
            {showEditDropdown && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded shadow-lg z-10">
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => {
                    navigator.clipboard.writeText(currentCommand)
                    setShowEditDropdown(false)
                  }}
                >
                  Copy
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={async () => {
                    const text = await navigator.clipboard.readText()
                    setCurrentCommand(prev => prev + text)
                    setShowEditDropdown(false)
                  }}
                >
                  Paste
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => {
                    setCurrentCommand("")
                    setShowEditDropdown(false)
                  }}
                >
                  Clear Input
                </button>
                <div className="border-t border-slate-700 my-1"></div>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => setShowEditDropdown(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
          
          {/* View Menu */}
          <div className="relative">
            <button 
              className="px-2 py-1 text-xs text-slate-200 hover:bg-slate-700 rounded"
              onClick={() => {
                setShowSettingsDropdown(false)
                setShowEditDropdown(false)
                setShowViewDropdown(!showViewDropdown)
              }}
            >
              View
            </button>
            {showViewDropdown && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded shadow-lg z-10">
                <div className="px-3 py-1 text-xs text-slate-400">Theme</div>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => changeTheme('dark')}
                >
                  {settings.theme === 'dark' ? '✓ ' : ''}Dark
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => changeTheme('cyberpunk')}
                >
                  {settings.theme === 'cyberpunk' ? '✓ ' : ''}Cyberpunk
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => changeTheme('matrix')}
                >
                  {settings.theme === 'matrix' ? '✓ ' : ''}Matrix
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => changeTheme('hacker')}
                >
                  {settings.theme === 'hacker' ? '✓ ' : ''}Hacker
                </button>
                
                <div className="border-t border-slate-700 my-1"></div>
                <div className="px-3 py-1 text-xs text-slate-400">Font Size</div>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => changeFontSize(12)}
                >
                  {settings.fontSize === 12 ? '✓ ' : ''}Small
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => changeFontSize(14)}
                >
                  {settings.fontSize === 14 ? '✓ ' : ''}Medium
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => changeFontSize(16)}
                >
                  {settings.fontSize === 16 ? '✓ ' : ''}Large
                </button>
                
                <div className="border-t border-slate-700 my-1"></div>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={toggleTimestamps}
                >
                  {settings.showTimestamps ? '✓ ' : ''}Show Timestamps
                </button>
                <div className="border-t border-slate-700 my-1"></div>
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                  onClick={() => setShowViewDropdown(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right side of toolbar */}
        <div className="ml-auto flex items-center space-x-2 text-xs text-slate-300">
          <div className="flex items-center">
            <FaUser className="mr-1 text-cyan-400" size={10} />
            {username}
          </div>
          <div className="flex items-center">
            <FaServer className="mr-1 text-emerald-400" size={10} />
            gensin-quantum
          </div>
          <div className="flex items-center">
            <FaNetworkWired className="mr-1 text-amber-400" size={10} />
            connected
          </div>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="flex-1 overflow-hidden p-1">
        <Terminal
          initialHistory={history}
          theme={themes[settings.theme]}
          prompt={`${username}@gensin:${currentDir}$ `}
          autoFocus={true}
          onCommand={() => {}}
          className="h-full"
        />
      </div>
      
      {/* Matrix Mode Overlay */}
      {matrixMode && (
        <div 
          className="absolute inset-0 bg-black text-green-500 overflow-hidden flex flex-col justify-center items-center"
          onClick={() => setMatrixMode(false)}
        >
          <SiMatrix size={100} className="animate-pulse mb-4" />
          <div className="text-xl font-semibold mb-4">MATRIX MODE ACTIVATED</div>
          <div className="text-sm mb-2">Click anywhere to exit</div>
          {/* Matrix-like character rain would be added here */}
        </div>
      )}
      
      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={currentCommand}
        onChange={(e) => setCurrentCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        className="hidden"
      />
    </div>
  )
} 