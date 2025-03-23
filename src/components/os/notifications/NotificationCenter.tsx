'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOsStore } from '@/store/osStore'
import { 
  FaBell, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimesCircle, 
  FaTimes,
  FaTrash
} from 'react-icons/fa'

export default function NotificationCenter() {
  const { 
    notifications, 
    clearNotification, 
    markNotificationAsRead, 
    clearAllNotifications 
  } = useOsStore()
  
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(notification => !notification.isRead).length
  
  // Auto-close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.notification-center') && !target.closest('.notification-bell')) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-400" size={16} />
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-400" size={16} />
      case 'error':
        return <FaTimesCircle className="text-red-400" size={16} />
      case 'info':
      default:
        return <FaInfoCircle className="text-cyber-blue" size={16} />
    }
  }
  
  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30'
      case 'error':
        return 'bg-red-500/10 border-red-500/30'
      case 'info':
      default:
        return 'bg-cyber-blue/10 border-cyber-blue/30'
    }
  }
  
  return (
    <>
      {/* Notification Bell */}
      <div className="relative notification-bell">
        <button 
          className="bg-cyber-black/30 hover:bg-cyber-black/50 p-2 rounded-full relative"
          onClick={() => {
            setIsOpen(!isOpen)
            notifications.forEach(notification => {
              if (!notification.isRead) {
                markNotificationAsRead(notification.id)
              }
            })
          }}
        >
          <FaBell size={16} className="text-cyber-blue/80" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-cyber-pink text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
      
      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute right-2 top-12 w-80 max-h-96 overflow-hidden rounded-lg shadow-neon-blue bg-cyber-dark/90 backdrop-blur-md border border-cyber-blue/20 notification-center z-50"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-3 border-b border-cyber-blue/20">
              <h3 className="text-cyber-blue font-cyber text-lg tracking-wider">
                NOTIFICATIONS
              </h3>
              {notifications.length > 0 && (
                <button 
                  className="text-cyber-blue/60 hover:text-cyber-pink flex items-center text-xs"
                  onClick={clearAllNotifications}
                >
                  <FaTrash size={12} className="mr-1" />
                  Clear All
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto max-h-80 p-1">
              {notifications.length > 0 ? (
                <AnimatePresence>
                  {notifications.map(notification => (
                    <motion.div 
                      key={notification.id}
                      className={`p-3 mb-2 rounded border ${getNotificationBg(notification.type)} relative group`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, padding: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button 
                        className="absolute top-1.5 right-1.5 text-cyber-blue/40 hover:text-cyber-pink opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => clearNotification(notification.id)}
                      >
                        <FaTimes size={14} />
                      </button>
                      <div className="flex">
                        <div className="mt-0.5 mr-3">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <h4 className="text-white/90 font-semibold text-sm mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-white/70 text-xs mb-2">
                            {notification.message}
                          </p>
                          <p className="text-white/40 text-xs font-mono">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-cyber-blue/40">
                  <FaBell size={36} className="mb-4 opacity-30" />
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {notifications.filter(n => !n.isRead).slice(0, 3).map(notification => (
            <motion.div
              key={notification.id}
              className={`p-3 rounded border ${getNotificationBg(notification.type)} shadow-lg pointer-events-auto`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                markNotificationAsRead(notification.id)
              }}
            >
              <div className="flex">
                <div className="mt-0.5 mr-2">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">
                    {notification.title}
                  </h4>
                  <p className="text-white/80 text-xs">
                    {notification.message}
                  </p>
                </div>
                <button 
                  className="text-cyber-blue/40 hover:text-cyber-pink ml-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearNotification(notification.id)
                  }}
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
} 