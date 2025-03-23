'use client'

import React, { useState } from 'react'
import { FaPlus, FaMinus, FaRedo, FaSave } from 'react-icons/fa'

export default function ImageViewer({ windowId }: { windowId: string }) {
  const [zoomLevel, setZoomLevel] = useState(100)
  
  const increaseZoom = () => {
    if (zoomLevel < 200) {
      setZoomLevel(prev => prev + 10)
    }
  }
  
  const decreaseZoom = () => {
    if (zoomLevel > 50) {
      setZoomLevel(prev => prev - 10)
    }
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-cyber text-cyber-blue">Image Viewer</h3>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-1.5 text-cyber-blue/70 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded-md"
            onClick={decreaseZoom}
          >
            <FaMinus size={14} />
          </button>
          
          <span className="text-sm text-cyber-blue/90 w-12 text-center font-mono">
            {zoomLevel}%
          </span>
          
          <button 
            className="p-1.5 text-cyber-blue/70 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded-md"
            onClick={increaseZoom}
          >
            <FaPlus size={14} />
          </button>
          
          <button className="p-1.5 text-cyber-blue/70 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded-md">
            <FaRedo size={14} />
          </button>
          
          <button className="p-1.5 text-cyber-blue/70 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded-md">
            <FaSave size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center bg-cyber-black/30 rounded-md overflow-hidden">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto bg-cyber-gray/50 flex items-center justify-center">
            <div className="text-cyber-blue/40 font-cyber text-lg">No Image Selected</div>
          </div>
          <div className="mt-4 text-cyber-blue/70 text-sm">
            Select an image to view
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-cyber-blue/80 text-sm mb-2 font-cyber">Recent Images</h4>
        <div className="grid grid-cols-4 gap-2">
          <div className="h-16 bg-cyber-black/30 rounded-md cursor-pointer hover:border hover:border-cyber-blue/50"></div>
          <div className="h-16 bg-cyber-black/30 rounded-md cursor-pointer hover:border hover:border-cyber-blue/50"></div>
          <div className="h-16 bg-cyber-black/30 rounded-md cursor-pointer hover:border hover:border-cyber-blue/50"></div>
          <div className="h-16 bg-cyber-black/30 rounded-md cursor-pointer hover:border hover:border-cyber-blue/50"></div>
        </div>
      </div>
    </div>
  )
} 