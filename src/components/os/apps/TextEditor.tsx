'use client'

import React, { useState } from 'react'

export default function TextEditor({ windowId }: { windowId: string }) {
  const [text, setText] = useState('')
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 flex justify-between items-center">
        <div className="font-cyber text-lg text-cyber-blue">Text Editor</div>
        <div className="text-xs text-cyber-blue/70 font-mono">
          {text.length} characters
        </div>
      </div>
      
      <textarea
        className="flex-1 p-3 bg-cyber-black/30 text-cyber-blue/90 font-mono text-sm rounded-md border border-cyber-blue/20 resize-none focus:outline-none focus:border-cyber-blue"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing..."
      />
    </div>
  )
} 