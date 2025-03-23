'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const bootSequenceMessages = [
  "Initializing system core...",
  "Loading kernel modules...",
  "Detecting hardware...",
  "Starting system services...",
  "Connecting to network...",
  "Initializing virtual environment...",
  "Applying security protocols...",
  "Loading user interface...",
  "System ready."
]

export default function BootScreen() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const messageInterval = setInterval(() => {
      if (currentMessageIndex < bootSequenceMessages.length - 1) {
        setCurrentMessageIndex(prev => prev + 1)
        setLoadingProgress(prev => prev + (100 / bootSequenceMessages.length))
      } else {
        clearInterval(messageInterval)
        setLoadingProgress(100)
      }
    }, 500)

    return () => clearInterval(messageInterval)
  }, [currentMessageIndex])

  return (
    <div className="w-screen h-screen bg-cyber-black flex flex-col items-center justify-center p-8 cyber-grid">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-cyber text-cyber-blue mb-4 glitch-effect">
            GENSIN OS
          </h1>
          <p className="text-xl text-cyber-pink font-mono">CYBERPUNK EDITION v1.0</p>
        </div>

        <div className="mb-8 border border-cyber-blue/30 bg-cyber-black/80 rounded p-6 shadow-neon-blue">
          <div className="font-mono text-sm text-cyber-blue mb-4">
            {bootSequenceMessages.slice(0, currentMessageIndex + 1).map((message, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-1"
              >
                &gt; {message}
              </motion.div>
            ))}
          </div>

          <div className="w-full h-2 bg-cyber-gray rounded overflow-hidden">
            <motion.div 
              className="h-full bg-cyber-blue"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="text-center text-cyber-green font-mono text-sm">
          <p>// SYSTEM INITIALIZING</p>
          <p>// DO NOT POWER OFF</p>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 text-cyber-blue/50 p-4 text-center font-mono text-xs">
        <p>GENSIN CYBERSYSTEMS &copy; 2023</p>
      </div>
    </div>
  )
} 