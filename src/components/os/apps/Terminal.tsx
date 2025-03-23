'use client'

import React, { useState, useRef, useEffect } from 'react'

export default function Terminal({ windowId }: { windowId: string }) {
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentCommand.trim()) return
    
    const newHistory = [...commandHistory, `$ ${currentCommand}`]
    
    // Add command response based on input
    if (currentCommand === 'help') {
      newHistory.push('Available commands: help, clear, echo, date, whoami')
    } else if (currentCommand === 'clear') {
      setCommandHistory([])
      setCurrentCommand('')
      return
    } else if (currentCommand.startsWith('echo ')) {
      newHistory.push(currentCommand.substring(5))
    } else if (currentCommand === 'date') {
      newHistory.push(new Date().toString())
    } else if (currentCommand === 'whoami') {
      newHistory.push('user@gensin-os')
    } else {
      newHistory.push(`Command not found: ${currentCommand}`)
    }
    
    setCommandHistory(newHistory)
    setCurrentCommand('')
  }
  
  // Auto-scroll to the bottom when new commands are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commandHistory])
  
  // Focus input when terminal is clicked
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }
  
  return (
    <div 
      className="h-full flex flex-col terminal-container text-cyber-green font-mono bg-cyber-black/80 rounded-md"
      onClick={focusInput}
    >
      <div 
        ref={terminalRef}
        className="terminal-output flex-1 p-3 overflow-auto"
      >
        <p className="text-cyber-blue mb-2">GensinOS Terminal v1.0</p>
        <p className="mb-3">Type 'help' for available commands</p>
        
        {commandHistory.map((line, index) => (
          <div key={index} className="mb-1">
            {line}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleCommand} className="terminal-input-line flex items-center p-2 border-t border-cyber-green/30">
        <span className="mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          className="bg-transparent flex-1 outline-none text-cyber-green"
          autoFocus
        />
      </form>
    </div>
  )
}
 