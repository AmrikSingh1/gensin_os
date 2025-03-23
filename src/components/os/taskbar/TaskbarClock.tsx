'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOsStore } from '@/store/osStore'

export default function TaskbarClock() {
  const [time, setTime] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const { systemTime } = useOsStore()
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  // Format date to display
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return time.toLocaleDateString(undefined, options)
  }
  
  return (
    <div className="relative group">
      <div 
        className="text-cyber-blue/80 hover:text-cyber-blue font-mono text-sm cursor-pointer transition-colors duration-200 flex items-center"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      
      {/* Date tooltip */}
      <motion.div 
        className="absolute bottom-full mb-2 right-0 bg-cyber-dark/90 backdrop-blur-md border border-cyber-blue/20 text-cyber-blue rounded px-3 py-2 text-xs font-mono shadow-neon-blue z-10 whitespace-nowrap"
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ 
          opacity: showCalendar ? 1 : 0,
          y: showCalendar ? 0 : 10,
          scale: showCalendar ? 1 : 0.95
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-center">
          <div className="text-cyber-blue/90 mb-1">{formatDate()}</div>
          <div className="text-lg font-semibold text-cyber-blue">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
        
        {/* Simple calendar visualization */}
        <div className="mt-2 pt-2 border-t border-cyber-blue/20">
          <div className="grid grid-cols-7 gap-1 text-center text-[9px]">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-cyber-blue/60">{day}</div>
            ))}
            
            {Array.from({ length: 31 }, (_, i) => {
              const currentDate = time.getDate();
              const day = i + 1;
              
              return (
                <div 
                  key={i} 
                  className={`${
                    day === currentDate 
                      ? 'bg-cyber-blue text-cyber-black font-bold rounded-sm' 
                      : day < currentDate 
                        ? 'text-cyber-blue/40' 
                        : 'text-cyber-blue/80'
                  }`}
                >
                  {day <= 31 ? day : ''}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
} 