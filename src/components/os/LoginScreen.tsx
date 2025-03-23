'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOsStore } from '@/context/OsContext'

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [time, setTime] = useState(new Date())
  
  const { login } = useOsStore()
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Simulate login process
    setTimeout(() => {
      if (password === '') {
        // For demo purposes, any username with any password works
        login(username || 'Guest')
      } else {
        setError('Authentication failed. Try again.')
        setIsLoading(false)
      }
    }, 1500)
  }
  
  return (
    <div 
      className="w-screen h-screen bg-cyber-black flex flex-col items-center justify-center p-4 cyber-grid"
      style={{
        backgroundImage: "url('/wallpapers/cyberpunk-city.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="fixed top-0 left-0 w-full h-full bg-cyber-black/50 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="p-8 bg-cyber-gray/80 backdrop-blur-md border border-cyber-blue/30 rounded-lg shadow-neon-blue">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-cyber text-cyber-blue">GENSIN OS</h1>
            <p className="text-cyber-blue/70 font-mono">Login required</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-cyber-blue font-mono text-sm mb-2">
                USERNAME
              </label>
              <input 
                type="text" 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="os-input w-full bg-cyber-black border-cyber-blue/50 focus:border-cyber-blue"
                placeholder="user_name"
                autoFocus
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-cyber-blue font-mono text-sm mb-2">
                PASSWORD
              </label>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="os-input w-full bg-cyber-black border-cyber-blue/50 focus:border-cyber-blue"
                placeholder="••••••••"
              />
              <p className="text-xs text-cyber-blue/50 font-mono mt-1">
                * Leave empty for guest access
              </p>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-cyber-red text-sm font-mono"
              >
                {error}
              </motion.div>
            )}
            
            <button 
              type="submit" 
              className={`os-button-primary w-full ${isLoading ? 'opacity-70' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'AUTHENTICATING...' : 'LOG IN'}
            </button>
          </form>
        </div>
        
        <div className="mt-10 text-center">
          <div className="text-3xl font-cyber text-cyber-blue">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-cyber-blue/70 font-mono">
            {time.toLocaleDateString([], { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </motion.div>
      
      <div className="fixed bottom-4 w-full text-center text-cyber-blue/50 font-mono text-xs z-10">
        <p>GENSIN CYBERSYSTEMS &copy; 2023</p>
        <p>SYSTEM BUILD 1.0.134</p>
      </div>
    </div>
  )
} 