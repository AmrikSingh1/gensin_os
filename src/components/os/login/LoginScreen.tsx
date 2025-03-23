'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaLock, FaFingerprint, FaShieldAlt } from 'react-icons/fa'
import { useOsStore } from '@/store/osStore'

export default function LoginScreen() {
  const [username, setUsername] = useState('user')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [biometricAuth, setBiometricAuth] = useState(false)
  const [authInProgress, setAuthInProgress] = useState(false)
  const { login } = useOsStore()

  // Simulate biometric auth
  useEffect(() => {
    if (biometricAuth) {
      let timer = setTimeout(() => {
        login(username)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [biometricAuth, login, username])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (username.trim() === '') {
      setError('Please enter a username')
      return
    }
    
    setAuthInProgress(true)
    
    // For demo purposes, simulate auth process
    setTimeout(() => {
      setAuthInProgress(false)
      login(username)
    }, 1000)
  }
  
  const handleBiometricAuth = () => {
    setBiometricAuth(true)
    setAuthInProgress(true)
  }
  
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-gradient-to-br from-cyber-black via-cyber-dark to-cyber-black">
      {/* Animated grid background */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      {/* Glowing elements */}
      <div className="absolute top-[20%] left-[15%] w-40 h-40 rounded-full bg-cyber-blue/5 blur-3xl"></div>
      <div className="absolute bottom-[20%] right-[15%] w-60 h-60 rounded-full bg-cyber-pink/5 blur-3xl"></div>
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanlines"></div>
      </div>
      
      {/* Login card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-cyber-dark/70 backdrop-blur-xl border border-cyber-blue/20 rounded-lg p-8 w-[420px] shadow-neon-blue"
        >
          {/* OS Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-cyber text-cyber-blue mb-1 tracking-wider">GENSIN<span className="text-cyber-pink">OS</span></h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-cyber-blue to-cyber-pink mx-auto mb-2"></div>
            <p className="text-cyber-blue/70 font-mono text-xs">AUTHENTICATE TO CONTINUE</p>
          </div>
          
          {!biometricAuth ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-cyber-blue/80 font-mono text-xs mb-2 flex items-center">
                  <FaUser size={11} className="mr-1.5" />
                  USERNAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-cyber-black/40 border border-cyber-blue/20 rounded-md px-4 py-3 text-white outline-none focus:border-cyber-blue/60 transition-colors font-mono"
                    disabled={authInProgress}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-blue/30 text-xs font-mono">
                    SYSTEM
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-cyber-blue/80 font-mono text-xs mb-2 flex items-center">
                  <FaLock size={11} className="mr-1.5" />
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-cyber-black/40 border border-cyber-blue/20 rounded-md px-4 py-3 text-white outline-none focus:border-cyber-blue/60 transition-colors font-mono"
                    disabled={authInProgress}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-blue/30">
                    <FaShieldAlt size={14} />
                  </div>
                </div>
                {error && <p className="text-cyber-red text-xs mt-1">{error}</p>}
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  type="submit"
                  className="flex-1 bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30 py-2.5 rounded-md font-cyber text-sm transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={authInProgress}
                >
                  {authInProgress ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-cyber-blue border-t-transparent rounded-full mr-2"></div>
                      VERIFYING
                    </div>
                  ) : (
                    'ACCESS SYSTEM'
                  )}
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={handleBiometricAuth}
                  className="bg-cyber-black/50 hover:bg-cyber-black/70 text-cyber-blue/70 hover:text-cyber-blue border border-cyber-blue/20 p-2.5 rounded-md transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={authInProgress}
                >
                  <FaFingerprint size={20} />
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative mb-5">
                <FaFingerprint size={80} className="text-cyber-blue animate-pulse" />
                <div className="absolute inset-0 bg-cyber-blue/10 rounded-full animate-ping"></div>
              </div>
              <p className="text-cyber-blue font-mono text-sm mb-1">BIOMETRIC AUTHENTICATION</p>
              <p className="text-cyber-blue/50 font-mono text-xs mb-4">SCANNING FINGERPRINT...</p>
              <div className="w-48 h-1 bg-cyber-black/60 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyber-blue to-cyber-pink"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                />
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center text-cyber-blue/40 text-xs font-mono">
            {biometricAuth ? 
              'AUTHENTICATING WITH NEURO-SCAN TECHNOLOGY' : 
              'ANY PASSWORD WILL WORK FOR THIS DEMO'
            }
          </div>
        </motion.div>
      </div>
      
      {/* Current date/time */}
      <motion.div 
        className="absolute top-8 right-8 text-right text-cyber-blue/70 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 1 }}
      >
        <div className="text-3xl mb-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        <div className="text-sm text-cyber-blue/40">{new Date().toLocaleDateString([], {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</div>
      </motion.div>
      
      {/* Security notice */}
      <div className="absolute bottom-8 left-8 text-cyber-blue/40 text-xs font-mono max-w-xs">
        <div className="flex items-center mb-1">
          <FaShieldAlt size={10} className="mr-2" /> 
          <span>SECURITY PROTOCOL ACTIVE</span>
        </div>
        <div>SYSTEM WILL LOCK AFTER 3 FAILED ATTEMPTS. ALL ACCESS IS MONITORED AND LOGGED.</div>
      </div>
    </div>
  )
} 