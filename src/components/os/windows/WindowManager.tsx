'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { useOsStore } from '@/store/osStore'
import Window from './Window'
import FileExplorer from '../apps/FileExplorer'
import Terminal from '../apps/Terminal'
import EnhancedTerminal from '../apps/EnhancedTerminal'
import TextEditor from '../apps/TextEditor'
import Browser from '../apps/Browser'
import Settings from '../apps/Settings'
import MusicPlayer from '../apps/MusicPlayer'
import ImageViewer from '../apps/ImageViewer'
import Calculator from '../apps/Calculator'

// Map component names to their actual components
const componentMap: Record<string, React.ComponentType<any>> = {
  FileExplorer,
  Terminal,
  EnhancedTerminal,
  TextEditor,
  Browser,
  Settings,
  MusicPlayer,
  ImageViewer,
  Calculator,
}

// Map for app types to icon paths
const iconMap: Record<string, string> = {
  FileExplorer: '/icons/folder.svg',
  Terminal: '/icons/terminal.svg',
  EnhancedTerminal: '/icons/terminal-alt.svg',
  TextEditor: '/icons/edit.svg',
  Browser: '/icons/globe.svg',
  Settings: '/icons/settings.svg',
  MusicPlayer: '/icons/music.svg',
  ImageViewer: '/icons/image.svg',
  Calculator: '/icons/calculator.svg',
};

export default function WindowManager() {
  const { windows, setActiveWindow, closeWindow, minimizeWindow, restoreWindow, moveWindow, resizeWindow } = useOsStore()
  
  const handleFocus = (windowId: string) => {
    setActiveWindow(windowId)
  }
  
  const handleClose = (windowId: string) => {
    closeWindow(windowId)
  }
  
  const handleMinimize = (windowId: string) => {
    minimizeWindow(windowId)
  }
  
  const handleRestore = (windowId: string) => {
    restoreWindow(windowId)
  }
  
  const handleMove = (windowId: string, position: { x: number; y: number }) => {
    moveWindow(windowId, position)
  }
  
  const handleResize = (windowId: string, size: { width: number; height: number }) => {
    resizeWindow(windowId, size)
  }
  
  return (
    <div className="window-manager absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {windows.filter(window => !window.isMinimized).map((window) => {
          const AppComponent = componentMap[window.type]
          const iconPath = iconMap[window.type] || '/icons/app-default.svg'
          
          return (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
              icon={iconPath}
              position={window.position}
              size={window.size}
              isActive={window.isActive}
              zIndex={window.zIndex}
              onFocus={handleFocus}
              onClose={handleClose}
              onMinimize={handleMinimize}
              onRestore={handleRestore}
              onMove={handleMove}
              onResize={handleResize}
            >
              {AppComponent ? <AppComponent windowId={window.id} content={window.content} /> : <div>App not found</div>}
            </Window>
          )
        })}
      </AnimatePresence>
    </div>
  )
} 