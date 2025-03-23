'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface TaskbarItemProps {
  id: string
  icon: React.ReactNode
  title: string
  isActive: boolean
  isMinimized: boolean
  onClick: () => void
}

export default function TaskbarItem({ id, icon, title, isActive, isMinimized, onClick }: TaskbarItemProps) {
  return (
    <motion.button
      className={`taskbar-item relative ${isActive ? 'bg-cyber-blue/30' : 'hover:bg-cyber-blue/20'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
    >
      <div className="relative">
        {icon}
        {isActive && (
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-0.5 bg-cyber-blue" 
            layoutId="taskbar-active-indicator"
          />
        )}
      </div>
    </motion.button>
  )
} 