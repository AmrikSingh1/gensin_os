'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOsStore } from '@/store/osStore'
import { FaFolder, FaTerminal, FaCog, FaGlobe, FaEdit, FaMusic, FaImage, FaCalculator, FaPowerOff, FaUser } from 'react-icons/fa'

// Define the menu apps structure
interface StartMenuItem {
  id: string;
  name: string;
  icon: string;
  type: string;
}

// Menu apps to display
const menuItems: StartMenuItem[] = [
  { id: 'file-explorer', name: 'Files', icon: 'folder', type: 'FileExplorer' },
  { id: 'terminal', name: 'Terminal', icon: 'terminal', type: 'Terminal' },
  { id: 'text-editor', name: 'Editor', icon: 'edit', type: 'TextEditor' },
  { id: 'browser', name: 'Browser', icon: 'globe', type: 'Browser' },
  { id: 'music-player', name: 'Music', icon: 'music', type: 'MusicPlayer' },
  { id: 'image-viewer', name: 'Images', icon: 'image', type: 'ImageViewer' },
  { id: 'calculator', name: 'Calculator', icon: 'calculator', type: 'Calculator' },
  { id: 'settings', name: 'Settings', icon: 'settings', type: 'Settings' },
]

const iconMap: Record<string, React.ReactNode> = {
  folder: <FaFolder size={20} />,
  terminal: <FaTerminal size={20} />,
  settings: <FaCog size={20} />,
  globe: <FaGlobe size={20} />,
  edit: <FaEdit size={20} />,
  music: <FaMusic size={20} />,
  image: <FaImage size={20} />,
  calculator: <FaCalculator size={20} />,
}

export default function StartMenu() {
  const { isStartMenuOpen, toggleStartMenu, openApp, logout, username } = useOsStore()
  
  const handleAppClick = (app: StartMenuItem) => {
    openApp(app.type as any)
    toggleStartMenu()
  }
  
  const menuVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }
  
  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleStartMenu()}
          />
          
          <motion.div
            className="fixed bottom-14 left-2 w-80 bg-cyber-gray/90 backdrop-blur-md border border-cyber-blue/30 shadow-neon-blue rounded-md z-50 overflow-hidden"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.15 }}
          >
            <div className="p-4 border-b border-cyber-blue/30">
              <div className="flex items-center">
                <div className="bg-cyber-blue/20 p-3 rounded-full">
                  <FaUser size={24} className="text-cyber-blue" />
                </div>
                <div className="ml-3">
                  <div className="text-lg font-cyber text-cyber-blue">{username}</div>
                  <div className="text-xs text-cyber-blue/70 font-mono">Admin</div>
                </div>
              </div>
            </div>
            
            <div className="p-3">
              <div className="text-xs text-cyber-blue/70 font-mono mb-2">APPLICATIONS</div>
              <div className="grid grid-cols-3 gap-2">
                {menuItems.map((app) => (
                  <motion.button
                    key={app.id}
                    className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-cyber-blue/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAppClick(app)}
                  >
                    <div className="flex items-center justify-center bg-cyber-black/60 w-10 h-10 rounded-md mb-1">
                      {iconMap[app.icon] || iconMap.folder}
                    </div>
                    <span className="text-xs text-white font-cyber truncate w-full text-center">
                      {app.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <button 
              className="w-full p-3 border-t border-cyber-blue/30 flex items-center text-cyber-red font-cyber hover:bg-cyber-blue/10"
              onClick={() => logout()}
            >
              <FaPowerOff size={16} className="mr-2" />
              <span>Log Out</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 