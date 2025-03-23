'use client'

import React, { useState } from 'react'
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'

export default function MusicPlayer({ windowId }: { windowId: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [currentTrack, setCurrentTrack] = useState({
    title: "Neon Pulse",
    artist: "CyberWave",
    duration: "3:45",
    cover: "/music/cover1.jpg"
  })
  
  const sampleTracks = [
    {
      title: "Neon Pulse",
      artist: "CyberWave",
      duration: "3:45"
    },
    {
      title: "Digital Dreams",
      artist: "SynthMatrix",
      duration: "4:20"
    },
    {
      title: "Night City Vibes",
      artist: "ElectroPunk",
      duration: "5:12"
    },
    {
      title: "Cybernetic Soul",
      artist: "Neural Link",
      duration: "3:37"
    }
  ]
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }
  
  return (
    <div className="h-full flex flex-col bg-cyber-black/30 rounded-md">
      <div className="p-4 border-b border-cyber-blue/20">
        <h3 className="text-cyber-blue font-cyber text-lg mb-3">Music Player</h3>
        
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-cyber-blue/30 rounded-md mr-3 flex items-center justify-center">
            <FaPlay className="text-cyber-blue" size={24} />
          </div>
          <div>
            <div className="text-white font-cyber">{currentTrack.title}</div>
            <div className="text-cyber-blue/70 text-sm">{currentTrack.artist}</div>
            <div className="text-cyber-blue/50 text-xs">{currentTrack.duration}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="w-full bg-cyber-gray h-1 rounded-full mb-1">
            <div 
              className="bg-cyber-blue h-1 rounded-full" 
              style={{ width: '35%' }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-cyber-blue/50">
            <span>1:23</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>
        
        <div className="flex justify-center items-center space-x-4">
          <button className="text-cyber-blue/70 hover:text-cyber-blue transition-colors">
            <FaBackward size={16} />
          </button>
          <button 
            className="w-10 h-10 rounded-full bg-cyber-blue/20 text-cyber-blue flex items-center justify-center hover:bg-cyber-blue/30 transition-colors"
            onClick={togglePlay}
          >
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>
          <button className="text-cyber-blue/70 hover:text-cyber-blue transition-colors">
            <FaForward size={16} />
          </button>
        </div>
        
        <div className="flex items-center mt-4">
          <button className="text-cyber-blue/70 mr-2">
            {volume === 0 ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="flex-1 accent-cyber-blue"
          />
          <span className="text-xs text-cyber-blue/70 ml-2">{volume}%</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <h4 className="text-cyber-blue/80 font-mono text-sm mb-2">PLAYLIST</h4>
        <div className="space-y-2">
          {sampleTracks.map((track, index) => (
            <div 
              key={index}
              className={`p-2 rounded-md hover:bg-cyber-blue/10 flex justify-between items-center cursor-pointer ${
                track.title === currentTrack.title ? 'bg-cyber-blue/20' : ''
              }`}
            >
              <div>
                <div className="text-white text-sm">{track.title}</div>
                <div className="text-cyber-blue/70 text-xs">{track.artist}</div>
              </div>
              <div className="text-cyber-blue/50 text-xs">{track.duration}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 