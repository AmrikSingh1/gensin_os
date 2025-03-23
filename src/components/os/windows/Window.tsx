'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useDraggable, type DragEventData } from '@neodrag/react'
import { FaTimes, FaWindowMinimize, FaWindowMaximize, FaWindowRestore } from 'react-icons/fa'

interface WindowProps {
  id: string
  title: string
  icon?: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  isActive: boolean
  zIndex: number
  children: React.ReactNode
  onFocus: (id: string) => void
  onClose: (id: string) => void
  onMinimize: (id: string) => void
  onRestore: (id: string) => void
  onMove: (id: string, position: { x: number; y: number }) => void
  onResize: (id: string, size: { width: number; height: number }) => void
}

export default function Window({
  id,
  title,
  icon,
  position,
  size,
  isActive,
  zIndex,
  children,
  onFocus,
  onClose,
  onMinimize,
  onRestore,
  onMove,
  onResize,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [preMaximizeState, setPreMaximizeState] = useState({ position, size })
  
  useDraggable(windowRef, {
    handle: ".window-titlebar",
    defaultPosition: { x: position.x, y: position.y },
    onDrag: (data: DragEventData) => {
      if (!isMaximized) {
        onMove(id, { x: data.offsetX, y: data.offsetY })
      }
    },
    disabled: isMaximized,
  })
  
  const handleWindowClick = () => {
    if (!isActive) {
      onFocus(id)
    }
  }
  
  const handleMaximizeToggle = () => {
    if (isMaximized) {
      setIsMaximized(false)
      onMove(id, preMaximizeState.position)
      onResize(id, preMaximizeState.size)
    } else {
      setPreMaximizeState({ position, size })
      setIsMaximized(true)
      onMove(id, { x: 0, y: 0 })
      onResize(id, { width: window.innerWidth, height: window.innerHeight - 60 })
    }
  }
  
  return (
    <motion.div
      ref={windowRef}
      className={`os-window pointer-events-auto absolute rounded-lg overflow-hidden backdrop-blur-sm bg-slate-800/80 border border-slate-700 ${isActive ? 'shadow-xl shadow-cyan-500/30' : 'shadow-lg'}`}
      style={{
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? 'calc(100% - 56px)' : size.height,
        left: isMaximized ? 0 : undefined,
        top: isMaximized ? 0 : undefined,
        zIndex,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={handleWindowClick}
    >
      {/* Title Bar */}
      <div 
        className="window-titlebar select-none cursor-grab active:cursor-grabbing flex justify-between items-center px-3 py-2 bg-gradient-to-r from-slate-900/90 to-slate-800/90 text-white"
      >
        <div className="flex items-center space-x-2">
          {icon && (
            <div className="w-4 h-4 flex items-center justify-center">
              <img src={icon} alt={title} className="max-w-full max-h-full" />
            </div>
          )}
          <div className="font-medium text-sm truncate">{title}</div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            onClick={() => onMinimize(id)}
          >
            <FaWindowMinimize size={10} />
          </button>
          
          <button 
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            onClick={handleMaximizeToggle}
          >
            {isMaximized ? <FaWindowRestore size={10} /> : <FaWindowMaximize size={10} />}
          </button>
          
          <button 
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-red-500/80 transition-colors"
            onClick={() => onClose(id)}
          >
            <FaTimes size={12} />
          </button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="h-[calc(100%-40px)] overflow-auto bg-gradient-to-b from-slate-800/95 to-slate-900/95">
        {children}
      </div>
    </motion.div>
  )
} 