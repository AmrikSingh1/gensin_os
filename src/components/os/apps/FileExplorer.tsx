'use client'

import React from 'react'

export default function FileExplorer({ windowId }: { windowId: string }) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-cyber text-cyber-blue mb-4">File Explorer</h2>
      <div className="flex-1 bg-cyber-black/50 p-4 rounded-md border border-cyber-blue/20">
        <div className="text-cyber-blue/80 font-mono">
          <p>File system access will be implemented in future updates.</p>
          <p className="mt-2">// TODO: Implement virtual file system</p>
        </div>
      </div>
    </div>
  )
} 