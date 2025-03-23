'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { useOsStore } from '@/store/osStore'
import Window from './Window'
import FileExplorer from '../apps/FileExplorer'
import Terminal from '../apps/Terminal'
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
  TextEditor,
  Browser,
  Settings,
  MusicPlayer,
  ImageViewer,
  Calculator,
}

// Map for app types to icon names
const iconMap: Record<string, string> = {
  FileExplorer: 'folder',
  Terminal: 'terminal',
  TextEditor: 'edit',
  Browser: 'globe',
  Settings: 'settings',
  MusicPlayer: 'music',
  ImageViewer: 'image',
  Calculator: 'calculator',
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
          
          return (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
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