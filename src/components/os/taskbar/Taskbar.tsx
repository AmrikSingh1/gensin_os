'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOsStore } from '@/store/osStore'
import { 
  FaWindows, 
  FaFolder, 
  FaTerminal, 
  FaCog, 
  FaGlobe, 
  FaEdit, 
  FaMusic, 
  FaImage, 
  FaCalculator,
  FaWifi, 
  FaVolumeUp, 
  FaVolumeMute,
  FaBatteryFull, 
  FaBatteryThreeQuarters,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaChargingStation,
  FaUserCircle
} from 'react-icons/fa'
import TaskbarItem from './TaskbarItem'
import TaskbarClock from './TaskbarClock'
import NotificationCenter from '../notifications/NotificationCenter'

const iconMap: Record<string, React.ReactNode> = {
  FileExplorer: <FaFolder size={20} />,
  Terminal: <FaTerminal size={20} />,
  Settings: <FaCog size={20} />,
  Browser: <FaGlobe size={20} />,
  TextEditor: <FaEdit size={20} />,
  MusicPlayer: <FaMusic size={20} />,
  ImageViewer: <FaImage size={20} />,
  Calculator: <FaCalculator size={20} />,
}

export default function Taskbar() {
  const { 
    windows, 
    toggleStartMenu, 
    activeWindowId, 
    setActiveWindow, 
    restoreWindow,
    username,
    isMuted,
    toggleMute,
    batteryLevel,
    isCharging,
    updateSystemTime
  } = useOsStore()
  
  // Update system time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      updateSystemTime()
    }, 60000)
    
    return () => clearInterval(interval)
  }, [updateSystemTime])
  
  const handleWindowClick = (windowId: string, isMinimized: boolean) => {
    if (isMinimized) {
      restoreWindow(windowId)
    } else {
      setActiveWindow(windowId)
    }
  }
  
  // Get battery icon based on level
  const getBatteryIcon = () => {
    if (batteryLevel > 75) return <FaBatteryFull size={16} />
    if (batteryLevel > 50) return <FaBatteryThreeQuarters size={16} />
    if (batteryLevel > 25) return <FaBatteryHalf size={16} />
    return <FaBatteryQuarter size={16} className="text-cyber-red/70" />
  }
  
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 h-14 bg-cyber-black/80 backdrop-blur-md border-t border-cyber-blue/30 px-2 z-50 shadow-neon-blue"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-1">
          <motion.button 
            onClick={() => toggleStartMenu()}
            className="flex items-center justify-center h-12 w-12 text-cyber-blue hover:bg-cyber-blue/20 rounded-md transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaWindows size={24} />
          </motion.button>
          
          <div className="h-8 mx-1 w-px bg-cyber-blue/30" />
          
          {/* Active windows */}
          <div className="flex items-center space-x-1">
            {windows.map((window) => (
              <TaskbarItem
                key={window.id}
                id={window.id}
                icon={window.icon ? <span className="text-xl">{window.icon}</span> : (iconMap[window.type] || iconMap.FileExplorer)}
                title={window.title}
                isActive={window.id === activeWindowId}
                isMinimized={window.isMinimized}
                onClick={() => handleWindowClick(window.id, window.isMinimized)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center text-cyber-blue/70">
          {/* System Tray */}
          <div className="bg-cyber-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center mr-2 border border-cyber-blue/10">
            <div className="flex items-center space-x-3 px-2">
              <NotificationCenter />
              
              <div className="h-4 w-px bg-cyber-blue/20 mx-1" />

              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className="hover:text-cyber-blue cursor-pointer relative group"
              >
                {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-cyber-dark/90 text-cyber-blue text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-cyber-blue/20">
                  {isMuted ? 'Unmute' : 'Mute'} System
                </span>
              </motion.button>
              
              <div className="hover:text-cyber-blue cursor-pointer relative group">
                <FaWifi size={16} />
                <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-cyber-dark/90 text-cyber-blue text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-cyber-blue/20">
                  Connected
                </span>
              </div>
              
              <div className="hover:text-cyber-blue cursor-pointer relative group flex items-center">
                {getBatteryIcon()}
                {isCharging && <FaChargingStation size={10} className="ml-0.5 text-green-400" />}
                <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-cyber-dark/90 text-cyber-blue text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-cyber-blue/20">
                  Battery: {batteryLevel}% {isCharging ? '(Charging)' : ''}
                </span>
              </div>

              <TaskbarClock />
            </div>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2 ml-2 bg-cyber-black/40 px-3 py-1.5 rounded-lg border border-cyber-blue/10 cursor-pointer hover:bg-cyber-blue/10 transition-colors">
            <FaUserCircle size={20} className="text-cyber-blue" />
            <span className="text-sm font-mono">{username}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 