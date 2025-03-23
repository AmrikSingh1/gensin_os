'use client'

import React from 'react'
import { useOsStore } from '@/store/osStore'
import { FaDesktop, FaVolumeUp, FaBell, FaPalette, FaUser, FaLock, FaWifi, FaLanguage } from 'react-icons/fa'

export default function Settings({ windowId }: { windowId: string }) {
  const { 
    wallpaper, 
    setWallpaper, 
    animatedWallpaper, 
    setAnimatedWallpaper, 
    animatedWallpaperOpacity, 
    setAnimatedWallpaperOpacity, 
    theme, 
    setTheme 
  } = useOsStore()
  
  const themeOptions = [
    { value: 'default', label: 'Default Cyberpunk' },
    { value: 'neon', label: 'Neon Glow' },
    { value: 'cybernight', label: 'Cyber Night' },
    { value: 'ghostinwire', label: 'Ghost in the Wire' },
    { value: 'retrowave', label: 'Retrowave' },
  ]
  
  const wallpaperOptions = [
    { value: '/wallpapers/default.jpg', label: 'Default' },
    { value: '/wallpapers/cyberpunk-city.jpg', label: 'Cyberpunk City' },
    { value: '/wallpapers/neon-grid.jpg', label: 'Neon Grid' },
    { value: '/wallpapers/digital-landscape.jpg', label: 'Digital Landscape' },
    { value: '/wallpapers/hacker-terminal.jpg', label: 'Hacker Terminal' },
    { value: '/wallpapers/cyberpunk1.jpg', label: 'Cyberpunk Cityscape' },
  ]
  
  const animatedWallpaperOptions = [
    { value: 'none', label: 'None' },
    { value: 'matrix', label: 'Matrix Code' },
    { value: 'digital-rain', label: 'Digital Rain' },
    { value: 'particles', label: 'Particle Network' },
    { value: 'cybercity', label: 'Cyber City Skyline' },
  ]
  
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
        
        <div className="flex-1 bg-cyber-black/20 p-6 rounded-r-md overflow-y-auto">
          <h3 className="text-lg font-cyber text-cyber-blue mb-6 flex items-center">
            <FaPalette className="mr-2" /> 
            Appearance Settings
          </h3>
          
          <div className="space-y-6">
            {/* Theme Settings */}
            <div>
              <label className="block text-cyber-blue/80 font-mono text-sm mb-2">
                COLOR THEME
              </label>
              <select 
                className="os-input w-full bg-cyber-black"
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
              >
                {themeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Wallpaper Settings */}
            <div>
              <label className="block text-cyber-blue/80 font-mono text-sm mb-2">
                STATIC WALLPAPER
              </label>
              <select 
                className="os-input w-full bg-cyber-black"
                value={wallpaper}
                onChange={(e) => setWallpaper(e.target.value)}
              >
                {wallpaperOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <div className="mt-3 grid grid-cols-3 gap-2">
                {wallpaperOptions.map(option => (
                  <div 
                    key={option.value}
                    className={`aspect-video cursor-pointer rounded-md overflow-hidden border-2 ${
                      wallpaper === option.value ? 'border-cyber-blue' : 'border-transparent'
                    }`}
                    onClick={() => setWallpaper(option.value)}
                  >
                    <img 
                      src={option.value} 
                      alt={option.label}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Animated Wallpaper Settings */}
            <div>
              <label className="block text-cyber-blue/80 font-mono text-sm mb-2">
                ANIMATED WALLPAPER OVERLAY
              </label>
              <select 
                className="os-input w-full bg-cyber-black"
                value={animatedWallpaper}
                onChange={(e) => setAnimatedWallpaper(e.target.value as any)}
              >
                {animatedWallpaperOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Opacity slider for animated wallpaper */}
            {animatedWallpaper !== 'none' && (
              <div>
                <label className="block text-cyber-blue/80 font-mono text-sm mb-2">
                  ANIMATION OPACITY: {Math.round(animatedWallpaperOpacity * 100)}%
                </label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05"
                  value={animatedWallpaperOpacity}
                  onChange={(e) => setAnimatedWallpaperOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-cyber-black rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
            
            {/* Preview section */}
            <div className="mt-4">
              <label className="block text-cyber-blue/80 font-mono text-sm mb-2">
                PREVIEW
              </label>
              <div className="w-full h-40 rounded-md overflow-hidden relative">
                <img 
                  src={wallpaper} 
                  alt="Current wallpaper"
                  className="w-full h-full object-cover" 
                />
                {animatedWallpaper !== 'none' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-cyber-blue animate-pulse">
                      {animatedWallpaperOptions.find(o => o.value === animatedWallpaper)?.label} Animation Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 