'use client'

import React, { useEffect, useState } from 'react'
import { useOsStore } from '@/store/osStore'

export default function WallpaperDebug() {
  const { 
    animatedWallpaper, 
    animatedWallpaperOpacity,
    setAnimatedWallpaper,
    videoWallpaper,
    videoWallpaperSrc,
    videoWallpaperOpacity,
    toggleVideoWallpaper,
    setVideoWallpaperOpacity
  } = useOsStore()
  
  const [isVisible, setIsVisible] = useState(false)
  
  // Add keyboard shortcut Alt+Shift+D to toggle debug panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === 'D') {
        setIsVisible(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  if (!isVisible) return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 border border-cyan-500 text-white p-4 rounded-lg z-50 text-sm">
      <h3 className="text-cyan-400 text-lg mb-2">Wallpaper Debug</h3>
      
      <div className="mb-4">
        <h4 className="text-cyan-300 border-b border-cyan-800 pb-1 mb-2">Animated Wallpaper</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>Type:</div>
          <div className="text-cyan-300">{animatedWallpaper}</div>
          
          <div>Opacity:</div>
          <div className="text-cyan-300">{animatedWallpaperOpacity}</div>
        </div>
        
        <div className="mt-2 space-y-2">
          <button 
            className="bg-cyan-800 hover:bg-cyan-700 text-white px-3 py-1 rounded w-full"
            onClick={() => setAnimatedWallpaper('matrix')}
          >
            Set Matrix
          </button>
          
          <button 
            className="bg-cyan-800 hover:bg-cyan-700 text-white px-3 py-1 rounded w-full"
            onClick={() => setAnimatedWallpaper('particles')}
          >
            Set Particles
          </button>
          
          <button 
            className="bg-cyan-800 hover:bg-cyan-700 text-white px-3 py-1 rounded w-full"
            onClick={() => setAnimatedWallpaper('digital-rain')}
          >
            Set Digital Rain
          </button>
          
          <button 
            className="bg-cyan-800 hover:bg-cyan-700 text-white px-3 py-1 rounded w-full"
            onClick={() => setAnimatedWallpaper('cybercity')}
          >
            Set Cyber City
          </button>
          
          <button 
            className="bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded w-full"
            onClick={() => setAnimatedWallpaper('none')}
          >
            Disable Animation
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-cyan-300 border-b border-cyan-800 pb-1 mb-2">Video Wallpaper</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>Enabled:</div>
          <div className="text-cyan-300">{videoWallpaper ? 'Yes' : 'No'}</div>
          
          <div>Source:</div>
          <div className="text-cyan-300 truncate max-w-[120px]">{videoWallpaperSrc}</div>
          
          <div>Opacity:</div>
          <div className="text-cyan-300">{videoWallpaperOpacity}</div>
        </div>
        
        <div className="mt-2">
          <div className="mb-2">
            <label className="block text-xs mb-1">Opacity:</label>
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.1" 
              value={videoWallpaperOpacity} 
              onChange={(e) => setVideoWallpaperOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <button 
            className={`${videoWallpaper ? 'bg-red-800 hover:bg-red-700' : 'bg-green-800 hover:bg-green-700'} text-white px-3 py-1 rounded w-full mt-2`}
            onClick={() => {
              console.log('Toggling video wallpaper:', !videoWallpaper);
              toggleVideoWallpaper(!videoWallpaper);
            }}
          >
            {videoWallpaper ? 'Disable Video' : 'Enable Video'}
          </button>
          
          <div className="mt-2 text-xs text-amber-400">
            Video source: {videoWallpaperSrc}
          </div>
          
          <button 
            className="bg-blue-800 hover:bg-blue-700 text-white px-3 py-1 rounded w-full mt-2"
            onClick={() => {
              console.log('Forcing video wallpaper reload with src:', videoWallpaperSrc);
              toggleVideoWallpaper(false);
              setTimeout(() => {
                toggleVideoWallpaper(true);
              }, 100);
            }}
          >
            Force Video Reload
          </button>

          <div className="mt-2 text-xs text-cyan-400">
            Debug Info:
            <pre className="mt-1 text-xs overflow-auto">
              {JSON.stringify({
                videoWallpaper,
                videoWallpaperSrc,
                videoWallpaperOpacity,
                animatedWallpaper,
                animatedWallpaperOpacity
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">Press Alt+Shift+D to hide</div>
    </div>
  )
} 