'use client'

import React, { useState } from 'react'
import { useOsStore } from '@/store/osStore'
import { FaDesktop, FaVolumeUp, FaBell, FaPalette, FaUser, FaLock, FaWifi, FaLanguage } from 'react-icons/fa'

export default function Settings({ windowId }: { windowId: string }) {
  const { wallpaper, setWallpaper } = useOsStore()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notifications, setNotifications] = useState(true)
  
  const wallpaperOptions = [
    { value: '/wallpapers/default.jpg', label: 'Cyberpunk City' },
    { value: '/wallpapers/cyberpunk1.jpg', label: 'Neon Grid' },
  ]
  
  const handleWallpaperChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWallpaper(e.target.value)
  }
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-cyber text-cyber-blue mb-4">System Settings</h2>
      
      <div className="flex h-full">
        <div className="w-48 bg-cyber-black/30 p-4 rounded-l-md">
          <ul className="space-y-2">
            <li className="flex items-center text-cyber-blue p-2 bg-cyber-blue/20 rounded">
              <FaDesktop className="mr-2" /> Appearance
            </li>
            <li className="flex items-center text-cyber-blue/70 hover:text-cyber-blue p-2 hover:bg-cyber-blue/10 rounded transition-colors">
              <FaVolumeUp className="mr-2" /> Sound
            </li>
            <li className="flex items-center text-cyber-blue/70 hover:text-cyber-blue p-2 hover:bg-cyber-blue/10 rounded transition-colors">
              <FaBell className="mr-2" /> Notifications
            </li>
            <li className="flex items-center text-cyber-blue/70 hover:text-cyber-blue p-2 hover:bg-cyber-blue/10 rounded transition-colors">
              <FaUser className="mr-2" /> User
            </li>
            <li className="flex items-center text-cyber-blue/70 hover:text-cyber-blue p-2 hover:bg-cyber-blue/10 rounded transition-colors">
              <FaLock className="mr-2" /> Security
            </li>
            <li className="flex items-center text-cyber-blue/70 hover:text-cyber-blue p-2 hover:bg-cyber-blue/10 rounded transition-colors">
              <FaWifi className="mr-2" /> Network
            </li>
            <li className="flex items-center text-cyber-blue/70 hover:text-cyber-blue p-2 hover:bg-cyber-blue/10 rounded transition-colors">
              <FaLanguage className="mr-2" /> Language
            </li>
          </ul>
        </div>
        
        <div className="flex-1 bg-cyber-black/20 p-6 rounded-r-md">
          <h3 className="text-lg font-cyber text-cyber-blue mb-6 flex items-center">
            <FaPalette className="mr-2" /> 
            Appearance Settings
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-cyber-blue/80 font-mono text-sm mb-2">
                WALLPAPER
              </label>
              <select 
                className="os-input w-full bg-cyber-black"
                value={wallpaper}
                onChange={handleWallpaperChange}
              >
                {wallpaperOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={soundEnabled}
                    onChange={() => setSoundEnabled(!soundEnabled)}
                  />
                  <div className={`block w-14 h-8 rounded-full ${soundEnabled ? 'bg-cyber-blue' : 'bg-cyber-gray'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${soundEnabled ? 'transform translate-x-full bg-cyber-black' : 'bg-cyber-dark'}`}></div>
                </div>
                <div className="ml-3 text-cyber-blue/80 font-mono text-sm">
                  SYSTEM SOUNDS
                </div>
              </label>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <div className={`block w-14 h-8 rounded-full ${notifications ? 'bg-cyber-blue' : 'bg-cyber-gray'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${notifications ? 'transform translate-x-full bg-cyber-black' : 'bg-cyber-dark'}`}></div>
                </div>
                <div className="ml-3 text-cyber-blue/80 font-mono text-sm">
                  NOTIFICATIONS
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 