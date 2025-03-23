'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function BootScreen() {
  const [bootProgress, setBootProgress] = useState(0)
  const [bootMessage, setBootMessage] = useState('')
  const [glitchEffect, setGlitchEffect] = useState(false)
  
  const bootMessages = [
    'Initializing system core...',
    'Loading neural interface...',
    'Establishing quantum connection...',
    'Mounting virtual filesystems...',
    'Calibrating holographic display...',
    'Activating cybernetic protocols...',
    'Synchronizing temporal matrices...',
    'Launching GensinOS v2.0...'
  ]
  
  useEffect(() => {
    // Progress increment per step
    const progressIncrement = 100 / bootMessages.length
    let currentIndex = 0
    
    // Update boot progress and message at regular intervals
    const timer = setInterval(() => {
      if (currentIndex < bootMessages.length) {
        setBootMessage(bootMessages[currentIndex])
        setBootProgress((prevProgress) => prevProgress + progressIncrement)
        
        // Random glitch effect occasionally
        if (Math.random() > 0.7) {
          setGlitchEffect(true)
          setTimeout(() => setGlitchEffect(false), 150)
        }
        
        currentIndex++
      } else {
        clearInterval(timer)
      }
    }, 400)
    
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div className="h-screen w-screen overflow-hidden bg-cyber-black flex flex-col items-center justify-center relative">
      {/* Background grid animation */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      {/* Glowing scanline effect */}
      <motion.div 
        className="absolute h-[2px] w-full bg-cyber-blue/50 blur-sm" 
        animate={{ 
          y: ['-40vh', '100vh'],
          opacity: [0.1, 0.8, 0.1] 
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity,
          ease: "linear" 
        }}
      />
      
      {/* OS Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`mb-16 ${glitchEffect ? 'animate-glitch' : ''}`}
      >
        <h1 className="text-6xl font-cyber text-cyber-blue mb-2 tracking-wider">GENSIN<span className="text-cyber-pink">OS</span></h1>
        <div className="h-0.5 w-full bg-gradient-to-r from-cyber-blue via-cyber-pink to-transparent"></div>
        <p className="text-right text-xs text-cyber-blue/70 font-mono mt-1">v2.0 CYBERNETIC EDITION</p>
      </motion.div>
      
      {/* Boot progress */}
      <div className="w-80 mb-8">
        <div className="flex justify-between text-xs text-cyber-blue/70 font-mono mb-2">
          <span>SYSTEM BOOT</span>
          <span>{Math.round(bootProgress)}%</span>
        </div>
        
        <div className="h-1.5 w-full bg-cyber-dark/50 rounded-full overflow-hidden backdrop-blur-lg border border-cyber-blue/10">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyber-blue to-cyber-pink"
            initial={{ width: '0%' }}
            animate={{ width: `${bootProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      {/* Boot messages */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-24 flex items-center justify-center"
      >
        <div className="font-mono text-cyber-blue/90 text-sm">
          <span className="text-cyber-pink mr-2">&gt;</span>
          {bootMessage}
          <span className="animate-pulse">_</span>
        </div>
      </motion.div>
      
      {/* Additional background elements */}
      <div className="absolute bottom-10 left-10 text-cyber-blue/30 text-xs font-mono">
        <div>KERNEL: QUANTUM-CORE_x64</div>
        <div>MEMORY: 128TB NEURAL-RAM</div>
        <div>DISPLAY: HOLOGRAPHIC_8K</div>
      </div>
      
      <div className="absolute top-10 right-10 text-cyber-blue/30 text-xs font-mono">
        <div className="flex justify-end">SECURE-BOOT: ENABLED</div>
        <div className="flex justify-end">ENCRYPTION: QUANTUM-SHIELD</div>
        <div className="flex justify-end">NETWORK: CONNECTED</div>
      </div>
    </div>
  )
} 