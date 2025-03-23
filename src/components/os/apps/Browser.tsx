'use client'

import React, { useState } from 'react'
import { FaSearch, FaArrowLeft, FaArrowRight, FaHome, FaRedo } from 'react-icons/fa'

export default function Browser({ windowId }: { windowId: string }) {
  const [url, setUrl] = useState('https://gensin-os.vercel.app')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }
  
  return (
    <div className="h-full flex flex-col bg-cyber-black/30 rounded-md overflow-hidden">
      <div className="p-2 border-b border-cyber-blue/20">
        <div className="flex items-center space-x-2">
          <button className="p-1.5 text-cyber-blue/70 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded">
            <FaArrowLeft size={14} />
          </button>
          <button className="p-1.5 text-cyber-blue/70 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded">
            <FaArrowRight size={14} />
          </button>
          <button className="p-1.5 text-cyber-blue/70 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded">
            <FaRedo size={14} />
          </button>
          <button className="p-1.5 text-cyber-blue/70 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded">
            <FaHome size={14} />
          </button>
          
          <form className="flex-1" onSubmit={handleUrlSubmit}>
            <div className="flex bg-cyber-gray rounded-md border border-cyber-blue/20">
              <div className="flex items-center justify-center px-2 text-cyber-blue/70">
                <FaSearch size={12} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-transparent border-none outline-none w-full py-1 px-1 text-sm text-cyber-blue/90"
              />
            </div>
          </form>
        </div>
      </div>
      
      <div className="flex-1 bg-white overflow-auto flex items-center justify-center">
        {isLoading ? (
          <div className="text-cyber-black">Loading...</div>
        ) : (
          <div className="text-cyber-black p-4 text-center">
            <h1 className="text-2xl mb-4">Welcome to GensinOS Browser</h1>
            <p>Web browsing feature coming soon...</p>
            <p className="text-sm mt-4 text-gray-500">Current URL: {url}</p>
          </div>
        )}
      </div>
    </div>
  )
} 