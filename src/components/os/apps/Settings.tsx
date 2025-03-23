'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useOsStore } from '@/store/osStore'
import { FaPalette, FaDesktop, FaVolumeUp, FaUserShield, FaNetworkWired, FaInfo } from 'react-icons/fa'

// Define available themes
const themes = [
  { id: 'default', name: 'Default', color: '#0ff4f4' },
  { id: 'neon', name: 'Neon', color: '#00ff9f' },
  { id: 'cybernight', name: 'Cyber Night', color: '#7d56f4' },
  { id: 'ghostinwire', name: 'Ghost in Wire', color: '#ff2a6d' },
  { id: 'retrowave', name: 'Retrowave', color: '#f9f871' }
]

// Define wallpapers
const wallpapers = [
  { id: 'default.jpg', name: 'Default' },
  { id: 'cyberpunk1.jpg', name: 'Night City' },
  { id: 'cyberpunk-city.jpg', name: 'Cyber City' },
  { id: 'digital-landscape.jpg', name: 'Digital Landscape' },
  { id: 'neon-grid.jpg', name: 'Neon Grid' },
  { id: 'hacker-terminal.jpg', name: 'Terminal' }
]

export default function Settings() {
  const { theme, setTheme, wallpaper, setWallpaper, username } = useOsStore()
  const [activeTab, setActiveTab] = useState('appearance')
  
  // Tabs for settings
  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: <FaPalette /> },
    { id: 'display', name: 'Display', icon: <FaDesktop /> },
    { id: 'sound', name: 'Sound', icon: <FaVolumeUp /> },
    { id: 'privacy', name: 'Privacy', icon: <FaUserShield /> },
    { id: 'network', name: 'Network', icon: <FaNetworkWired /> },
    { id: 'about', name: 'About', icon: <FaInfo /> }
  ]
  
  // Handle theme change
  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as any)
  }
  
  // Handle wallpaper change
  const handleWallpaperChange = (wallpaperId: string) => {
    setWallpaper(`/wallpapers/${wallpaperId}`)
  }
  
  return (
    <div className="h-full flex bg-cyber-dark/90">
      {/* Sidebar */}
      <div className="w-56 bg-cyber-black/50 border-r border-cyber-blue/20 flex flex-col">
        <div className="p-4 border-b border-cyber-blue/20">
          <h2 className="text-cyber-blue font-cyber text-lg tracking-wider">SETTINGS</h2>
          <p className="text-cyber-blue/50 text-xs mt-1 font-mono">User: {username}</p>
        </div>
        
        <nav className="flex-1 p-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`w-full text-left px-4 py-3 mb-1 rounded flex items-center ${
                activeTab === tab.id
                  ? 'bg-cyber-blue/20 text-cyber-blue'
                  : 'text-cyber-blue/60 hover:bg-cyber-blue/10 hover:text-cyber-blue/80'
              } transition-colors`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-cyber-blue/20">
          <div className="text-cyber-blue/50 text-xs font-mono">GensinOS v2.0</div>
          <div className="text-cyber-blue/50 text-xs font-mono">Build 20230915</div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'appearance' && (
          <div>
            <h3 className="text-cyber-blue text-xl font-cyber mb-6">Appearance Settings</h3>
            
            {/* Theme Selection */}
            <div className="mb-8">
              <h4 className="text-cyber-blue/80 text-sm font-cyber mb-4 uppercase tracking-wider">System Theme</h4>
              <div className="grid grid-cols-3 gap-4">
                {themes.map(item => (
                  <motion.div
                    key={item.id}
                    className={`bg-cyber-black/60 border ${
                      theme === item.id 
                        ? 'border-cyber-blue' 
                        : 'border-cyber-blue/20 hover:border-cyber-blue/50'
                    } rounded-lg p-4 cursor-pointer relative overflow-hidden`}
                    onClick={() => handleThemeChange(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="absolute inset-0 opacity-20" 
                      style={{ 
                        background: `linear-gradient(45deg, ${item.color}, transparent)`,
                        filter: 'blur(10px)'
                      }} 
                    />
                    <div className="relative z-10">
                      <div 
                        className="w-8 h-8 rounded-full mb-3" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <div className="text-white font-cyber">{item.name}</div>
                      {theme === item.id && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-cyber-blue rounded-full" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Wallpaper Selection */}
            <div>
              <h4 className="text-cyber-blue/80 text-sm font-cyber mb-4 uppercase tracking-wider">Desktop Wallpaper</h4>
              <div className="grid grid-cols-3 gap-4">
                {wallpapers.map(item => (
                  <motion.div
                    key={item.id}
                    className={`aspect-video bg-cyber-black/60 border ${
                      wallpaper === `/wallpapers/${item.id}` 
                        ? 'border-cyber-blue shadow-neon-blue' 
                        : 'border-cyber-blue/20 hover:border-cyber-blue/50'
                    } rounded-lg overflow-hidden cursor-pointer relative`}
                    onClick={() => handleWallpaperChange(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-cyber-blue/40">
                      <FaDesktop size={24} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-cyber-black/60 backdrop-blur-sm p-2">
                      <div className="text-white/80 text-sm truncate">{item.name}</div>
                    </div>
                    {wallpaper === `/wallpapers/${item.id}` && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-cyber-blue rounded-full" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'display' && (
          <div>
            <h3 className="text-cyber-blue text-xl font-cyber mb-6">Display Settings</h3>
            <p className="text-cyber-blue/60">Display settings will be available in a future update.</p>
          </div>
        )}
        
        {activeTab === 'sound' && (
          <div>
            <h3 className="text-cyber-blue text-xl font-cyber mb-6">Sound Settings</h3>
            <p className="text-cyber-blue/60">Sound settings will be available in a future update.</p>
          </div>
        )}
        
        {activeTab === 'privacy' && (
          <div>
            <h3 className="text-cyber-blue text-xl font-cyber mb-6">Privacy Settings</h3>
            <p className="text-cyber-blue/60">Privacy settings will be available in a future update.</p>
          </div>
        )}
        
        {activeTab === 'network' && (
          <div>
            <h3 className="text-cyber-blue text-xl font-cyber mb-6">Network Settings</h3>
            <p className="text-cyber-blue/60">Network settings will be available in a future update.</p>
          </div>
        )}
        
        {activeTab === 'about' && (
          <div>
            <h3 className="text-cyber-blue text-xl font-cyber mb-6">About GensinOS</h3>
            <div className="bg-cyber-black/40 rounded-lg p-6 border border-cyber-blue/20">
              <div className="flex items-center mb-6">
                <div className="mr-6">
                  <h1 className="text-4xl font-cyber text-cyber-blue tracking-wider">GENSIN<span className="text-cyber-pink">OS</span></h1>
                  <div className="h-0.5 w-32 bg-gradient-to-r from-cyber-blue to-cyber-pink"></div>
                </div>
                <div className="text-cyber-blue/70 font-mono text-sm">
                  <div>Version 2.0 (Cybernetic Edition)</div>
                  <div>Build 20230915</div>
                  <div>© 2023 GensinCorp</div>
                </div>
              </div>
              
              <p className="text-cyber-blue/70 mb-4">
                GensinOS is a next-generation cyberpunk-themed web operating system, designed to provide a futuristic computing experience with advanced UI and functionality.
              </p>
              
              <div className="font-mono text-xs text-cyber-blue/60">
                <div className="mb-2">System Information:</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>Kernel:</div>
                  <div>QUANTUM-CORE_x64</div>
                  <div>Memory:</div>
                  <div>128TB NEURAL-RAM</div>
                  <div>Display:</div>
                  <div>HOLOGRAPHIC_8K</div>
                  <div>Security:</div>
                  <div>QUANTUM-SHIELD v3.5</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 