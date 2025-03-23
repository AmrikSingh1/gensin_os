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
      className={`os-window pointer-events-auto absolute ${isActive ? 'shadow-neon-blue' : ''}`}
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
        className="window-titlebar os-window-title-bar select-none cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center">
          <div className="font-cyber text-sm truncate">{title}</div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 text-cyber-blue/70 hover:text-cyber-blue hover:bg-cyber-blue/20 rounded"
            onClick={() => onMinimize(id)}
          >
            <FaWindowMinimize size={12} />
          </button>
          
          <button 
            className="p-1 text-cyber-blue/70 hover:text-cyber-blue hover:bg-cyber-blue/20 rounded"
            onClick={handleMaximizeToggle}
          >
            {isMaximized ? <FaWindowRestore size={12} /> : <FaWindowMaximize size={12} />}
          </button>
          
          <button 
            className="p-1 text-cyber-red/70 hover:text-cyber-red hover:bg-cyber-red/20 rounded"
            onClick={() => onClose(id)}
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="p-4 h-[calc(100%-32px)] overflow-auto">
        {children}
      </div>
    </motion.div>
  )
} 