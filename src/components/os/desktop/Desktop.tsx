'use client'

import React, { useState, useEffect } from 'react'
import { useOsStore } from '@/store/osStore'
import DesktopIcon from './DesktopIcon'
import AnimatedWallpaper from './AnimatedWallpaper'
import WallpaperDebug from './WallpaperDebug'
import { FaFolder, FaTerminal, FaCog, FaGlobe, FaEdit, FaMusic, FaImage, FaCalculator } from 'react-icons/fa'
import { SiMatrix } from 'react-icons/si'
import VideoWallpaper from './VideoWallpaper'
import SimpleVideoBackground from './SimpleVideoBackground'

// Import required components
import StartMenu from '../startmenu/StartMenu'
import Taskbar from '../taskbar/Taskbar'
import WindowManager from '../windows/WindowManager'

// Define desktop app structure
interface DesktopApp {
  id: string;
  name: string;
  icon: string;
  type: string;
}

// Desktop apps to display
const desktopApps: DesktopApp[] = [
  { id: 'file-explorer', name: 'Files', icon: 'folder', type: 'FileExplorer' },
  { id: 'terminal', name: 'Terminal', icon: 'terminal', type: 'Terminal' },
  { id: 'enhanced-terminal', name: 'CyberTerm', icon: 'terminal-alt', type: 'EnhancedTerminal' },
  { id: 'text-editor', name: 'Editor', icon: 'edit', type: 'TextEditor' },
  { id: 'browser', name: 'Browser', icon: 'globe', type: 'Browser' },
  { id: 'music-player', name: 'Music', icon: 'music', type: 'MusicPlayer' },
  { id: 'image-viewer', name: 'Images', icon: 'image', type: 'ImageViewer' },
  { id: 'calculator', name: 'Calculator', icon: 'calculator', type: 'Calculator' },
  { id: 'settings', name: 'Settings', icon: 'settings', type: 'Settings' },
]

const iconMap: Record<string, React.ReactNode> = {
  folder: <FaFolder size={32} />,
  terminal: <FaTerminal size={32} />,
  'terminal-alt': <SiMatrix size={32} className="text-cyan-400" />,
  settings: <FaCog size={32} />,
  globe: <FaGlobe size={32} />,
  edit: <FaEdit size={32} />,
  music: <FaMusic size={32} />,
  image: <FaImage size={32} />,
  calculator: <FaCalculator size={32} />,
}

const Desktop: React.FC = () => {
  const { 
    wallpaper, 
    animatedWallpaper, 
    animatedWallpaperOpacity,
    videoWallpaper,
    videoWallpaperSrc,
    videoWallpaperOpacity,
    openApp
  } = useOsStore()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate OS loading time
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Force a video reload whenever videoWallpaper or videoWallpaperSrc changes
  useEffect(() => {
    if (videoWallpaper) {
      console.log("Video wallpaper enabled with source:", videoWallpaperSrc);
    }
  }, [videoWallpaper, videoWallpaperSrc]);

  // Handle opening apps
  const handleOpenApp = (app: DesktopApp) => {
    openApp(app.type as any);
  }

  // Use simple video background for better compatibility
  const useSimpleVideo = true;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <h1 className="text-4xl text-cyan-500 font-mono mb-4">GensinOS</h1>
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" 
              style={{ width: '60%' }}
            ></div>
          </div>
          <p className="text-gray-400 mt-2 font-mono text-sm">Booting system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      {/* Static Wallpaper (lowest layer) */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: `url(${wallpaper})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          zIndex: 0
        }}
      />
      
      {/* Video Wallpaper Layer */}
      {videoWallpaper && (
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ opacity: videoWallpaperOpacity }}
          >
            <source src={videoWallpaperSrc} type="video/mp4" />
          </video>
        </div>
      )}
      
      {/* Animated Wallpaper Layer */}
      {animatedWallpaper !== 'none' && !videoWallpaper && (
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <AnimatedWallpaper 
            type={animatedWallpaper} 
            opacity={animatedWallpaperOpacity}
          />
        </div>
      )}
      
      {/* Desktop Content Container (highest layer) */}
      <div className="relative flex flex-col h-full z-10">
        {/* Wallpaper Debug Panel */}
        <WallpaperDebug />
        
        {/* Desktop Icons */}
        <div className="flex-1 p-2 grid grid-cols-12 grid-rows-8 gap-1">
          {desktopApps.map((app, index) => (
            <DesktopIcon 
              key={app.id}
              id={app.id}
              label={app.name}
              icon={iconMap[app.icon]}
              onClick={() => handleOpenApp(app)}
            />
          ))}
        </div>
        
        {/* Window Manager */}
        <WindowManager />
        
        {/* Taskbar */}
        <Taskbar />
        
        {/* Start Menu */}
        <StartMenu />
      </div>
    </div>
  )
}

export default Desktop 