'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useOsStore } from '@/store/osStore'

interface DesktopIconProps {
  id: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
}

export default function DesktopIcon({ id, label, icon, onClick }: DesktopIconProps) {
  const handleDoubleClick = () => {
    if (onClick) onClick();
  }
  
  return (
    <motion.div
      className="desktop-icon select-none cursor-pointer w-20 h-24"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex flex-col items-center justify-center text-center h-full">
        <div className="flex items-center justify-center bg-cyber-black/40 text-cyber-blue p-2 rounded-md mb-2 border border-cyber-blue/20 w-16 h-16">
          {icon}
        </div>
        <span className="text-sm font-cyber text-white drop-shadow-lg">{label}</span>
      </div>
    </motion.div>
  )
} 