'use client'

import React, { useState, useEffect } from 'react'
import { FaFolder, FaFile, FaChevronRight, FaSearch, FaDownload, FaTrash, FaCopy, FaCut, FaPaste, FaPlus } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useOsStore } from '@/store/osStore'

// File system types
type FileType = {
  id: string
  name: string
  type: 'file'
  size: number
  modified: Date
  content?: string
}

type FolderType = {
  id: string
  name: string
  type: 'folder'
  children: (FileType | FolderType)[]
  modified: Date
}

// Initial file system structure
const initialFileSystem: FolderType = {
  id: 'root',
  name: 'Root',
  type: 'folder',
  modified: new Date(),
  children: [
    {
      id: 'documents',
      name: 'Documents',
      type: 'folder',
      modified: new Date(),
      children: [
        {
          id: 'project-neo',
          name: 'Project Neo',
          type: 'folder',
          modified: new Date(),
          children: [
            {
              id: 'specs.txt',
              name: 'specs.txt',
              type: 'file',
              size: 2048,
              modified: new Date(),
              content: 'Top secret specifications for Project Neo. Access level: CONFIDENTIAL'
            },
            {
              id: 'timeline.txt',
              name: 'timeline.txt',
              type: 'file',
              size: 1024,
              modified: new Date(),
              content: 'Project milestones and deadlines. Phase 1 completion expected by Q3.'
            }
          ]
        },
        {
          id: 'report.txt',
          name: 'report.txt',
          type: 'file',
          size: 4096,
          modified: new Date(),
          content: 'Quarterly performance report. All metrics trending positively.'
        }
      ]
    },
    {
      id: 'pictures',
      name: 'Pictures',
      type: 'folder',
      modified: new Date(),
      children: [
        {
          id: 'wallpapers',
          name: 'Wallpapers',
          type: 'folder',
          modified: new Date(),
          children: [
            {
              id: 'city.jpg',
              name: 'city.jpg',
              type: 'file',
              size: 307200,
              modified: new Date()
            },
            {
              id: 'abstract.jpg',
              name: 'abstract.jpg',
              type: 'file',
              size: 204800,
              modified: new Date()
            }
          ]
        }
      ]
    },
    {
      id: 'system',
      name: 'System',
      type: 'folder',
      modified: new Date(),
      children: [
        {
          id: 'logs',
          name: 'Logs',
          type: 'folder',
          modified: new Date(),
          children: [
            {
              id: 'system.log',
              name: 'system.log',
              type: 'file',
              size: 8192,
              modified: new Date(),
              content: '[INFO] System booted successfully\n[INFO] All services running\n[WARN] Memory usage at 62%'
            }
          ]
        },
        {
          id: 'config.sys',
          name: 'config.sys',
          type: 'file',
          size: 1024,
          modified: new Date(),
          content: 'SYS.INIT=TRUE\nMEM.ALLOC=4096\nGFX.MODE=ULTRA'
        }
      ]
    }
  ]
}

export default function FileExplorer() {
  const [fileSystem, setFileSystem] = useState<FolderType>(initialFileSystem)
  const [currentPath, setCurrentPath] = useState<string[]>(['Root'])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [clipboard, setClipboard] = useState<{item: FileType | FolderType, action: 'copy' | 'cut'} | null>(null)
  const [showFileInfo, setShowFileInfo] = useState(false)
  const [activeFile, setActiveFile] = useState<FileType | null>(null)
  
  // Get current folder based on path
  const getCurrentFolder = (): FolderType => {
    let current: FolderType = fileSystem
    if (currentPath.length === 1) return current
    
    for (let i = 1; i < currentPath.length; i++) {
      const folder = current.children.find(
        item => item.type === 'folder' && item.name === currentPath[i]
      ) as FolderType
      
      if (!folder) return current
      current = folder
    }
    
    return current
  }
  
  // Get filtered and sorted items
  const getItems = () => {
    const currentFolder = getCurrentFolder()
    let items = [...currentFolder.children]
    
    // Filter by search query
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Sort items
    items.sort((a, b) => {
      // Folders first
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1
      }
      
      // Then sort by selected criteria
      switch (sortBy) {
        case 'name':
          return sortDirection === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        case 'date':
          return sortDirection === 'asc'
            ? a.modified.getTime() - b.modified.getTime()
            : b.modified.getTime() - a.modified.getTime()
        case 'size':
          if (a.type === 'folder' && b.type === 'folder') return 0
          if (a.type === 'folder') return -1
          if (b.type === 'folder') return 1
          return sortDirection === 'asc'
            ? (a as FileType).size - (b as FileType).size
            : (b as FileType).size - (a as FileType).size
        default:
          return 0
      }
    })
    
    return items
  }
  
  // Navigate to folder
  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName])
    setSelectedItem(null)
  }
  
  // Navigate up one level
  const navigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1))
      setSelectedItem(null)
    }
  }
  
  // Open file
  const openFile = (file: FileType) => {
    setActiveFile(file)
    setShowFileInfo(true)
  }
  
  // Format file size
  const formatSize = (size: number): string => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }
  
  // Modify file system (simulated operations)
  const createNewFolder = () => {
    const currentFolder = getCurrentFolder()
    const newFolderName = `New Folder ${currentFolder.children.filter(item => 
      item.type === 'folder' && item.name.startsWith('New Folder')).length + 1}`
    
    const newFolder: FolderType = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      type: 'folder',
      modified: new Date(),
      children: []
    }
    
    // Clone and update file system
    const updatedFileSystem = JSON.parse(JSON.stringify(fileSystem))
    let target = updatedFileSystem
    
    for (let i = 1; i < currentPath.length; i++) {
      target = target.children.find((item: any) => 
        item.type === 'folder' && item.name === currentPath[i]
      )
    }
    
    target.children.push(newFolder)
    target.modified = new Date()
    
    setFileSystem(updatedFileSystem)
    setSelectedItem(newFolder.id)
  }
  
  // Create new text file
  const createNewFile = () => {
    const currentFolder = getCurrentFolder()
    const newFileName = `New File ${currentFolder.children.filter(item => 
      item.type === 'file' && item.name.startsWith('New File')).length + 1}.txt`
    
    const newFile: FileType = {
      id: `file-${Date.now()}`,
      name: newFileName,
      type: 'file',
      size: 0,
      modified: new Date(),
      content: ''
    }
    
    // Clone and update file system
    const updatedFileSystem = JSON.parse(JSON.stringify(fileSystem))
    let target = updatedFileSystem
    
    for (let i = 1; i < currentPath.length; i++) {
      target = target.children.find((item: any) => 
        item.type === 'folder' && item.name === currentPath[i]
      )
    }
    
    target.children.push(newFile)
    target.modified = new Date()
    
    setFileSystem(updatedFileSystem)
    setSelectedItem(newFile.id)
  }
  
  // Delete selected item
  const deleteSelectedItem = () => {
    if (!selectedItem) return
    
    // Clone and update file system
    const updatedFileSystem = JSON.parse(JSON.stringify(fileSystem))
    let target = updatedFileSystem
    
    for (let i = 1; i < currentPath.length; i++) {
      target = target.children.find((item: any) => 
        item.type === 'folder' && item.name === currentPath[i]
      )
    }
    
    const itemIndex = target.children.findIndex((item: any) => item.id === selectedItem)
    if (itemIndex !== -1) {
      target.children.splice(itemIndex, 1)
      target.modified = new Date()
    }
    
    setFileSystem(updatedFileSystem)
    setSelectedItem(null)
  }
  
  // Handle item click
  const handleItemClick = (item: FileType | FolderType, e: React.MouseEvent) => {
    if (e.detail === 2) { // Double click
      if (item.type === 'folder') {
        navigateToFolder(item.name)
      } else {
        openFile(item as FileType)
      }
    } else { // Single click
      setSelectedItem(item.id)
    }
  }
  
  // Toggle sort direction or change sort column
  const toggleSort = (column: 'name' | 'size' | 'date') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }
  
  return (
    <div className="h-full flex flex-col bg-cyber-dark/95 text-cyber-blue">
      {/* Toolbar */}
      <div className="flex items-center p-2 border-b border-cyber-blue/20 bg-cyber-black/40">
        <button 
          onClick={navigateUp}
          className="p-1.5 hover:bg-cyber-blue/10 rounded text-cyber-blue/80 hover:text-cyber-blue mr-2"
          disabled={currentPath.length <= 1}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        
        <div className="flex items-center bg-cyber-black/30 rounded px-2 flex-1 mr-2">
          {currentPath.map((folder, index) => (
            <React.Fragment key={index}>
              <span 
                className="py-1 px-1 hover:text-cyber-blue cursor-pointer text-sm"
                onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
              >
                {folder}
              </span>
              {index < currentPath.length - 1 && (
                <FaChevronRight size={10} className="mx-1 text-cyber-blue/50" />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="relative">
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-cyber-blue/50" size={12} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="px-7 py-1.5 bg-cyber-black/40 border border-cyber-blue/20 rounded text-sm w-48 focus:outline-none focus:border-cyber-blue/50"
          />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex px-2 py-1.5 gap-2 border-b border-cyber-blue/20 bg-cyber-black/20">
        <button
          onClick={createNewFolder}
          className="flex items-center text-xs px-2 py-1 rounded bg-cyber-black/30 hover:bg-cyber-black/50 text-cyber-blue/70 hover:text-cyber-blue"
        >
          <FaFolder size={12} className="mr-1.5" /> New Folder
        </button>
        <button
          onClick={createNewFile} 
          className="flex items-center text-xs px-2 py-1 rounded bg-cyber-black/30 hover:bg-cyber-black/50 text-cyber-blue/70 hover:text-cyber-blue"
        >
          <FaFile size={12} className="mr-1.5" /> New File
        </button>
        <button
          onClick={deleteSelectedItem}
          disabled={!selectedItem}
          className={`flex items-center text-xs px-2 py-1 rounded ${
            selectedItem 
              ? 'bg-cyber-black/30 hover:bg-cyber-red/20 text-cyber-blue/70 hover:text-cyber-red' 
              : 'bg-cyber-black/10 text-cyber-blue/30 cursor-not-allowed'
          }`}
        >
          <FaTrash size={12} className="mr-1.5" /> Delete
        </button>
      </div>
      
      {/* File browser header */}
      <div className="flex items-center text-xs bg-cyber-black/30 text-cyber-blue/60 border-b border-cyber-blue/20 font-mono uppercase">
        <div 
          className="flex-1 p-2 flex items-center cursor-pointer hover:bg-cyber-blue/5"
          onClick={() => toggleSort('name')}
        >
          Name 
          {sortBy === 'name' && (
            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div 
          className="w-24 p-2 cursor-pointer hover:bg-cyber-blue/5"
          onClick={() => toggleSort('size')}
        >
          Size
          {sortBy === 'size' && (
            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div 
          className="w-40 p-2 cursor-pointer hover:bg-cyber-blue/5"
          onClick={() => toggleSort('date')}
        >
          Modified
          {sortBy === 'date' && (
            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
      </div>
      
      {/* File browser content */}
      <div className="flex-1 overflow-auto p-1">
        {getItems().map((item) => (
          <motion.div
            key={item.id}
            onClick={(e) => handleItemClick(item, e)}
            className={`flex items-center p-2 rounded-sm cursor-pointer mb-0.5 ${
              selectedItem === item.id 
                ? 'bg-cyber-blue/20 text-white' 
                : 'hover:bg-cyber-blue/10 text-cyber-blue/80'
            }`}
            whileHover={{ x: 2 }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="mr-3">
              {item.type === 'folder' ? (
                <FaFolder size={18} className="text-cyber-blue" />
              ) : (
                <FaFile size={18} className="text-cyber-blue/70" />
              )}
            </div>
            <div className="flex-1 truncate">{item.name}</div>
            <div className="w-24 text-xs">
              {item.type === 'file' 
                ? formatSize((item as FileType).size) 
                : '--'
              }
            </div>
            <div className="w-40 text-xs font-mono">
              {item.modified.toLocaleString()}
            </div>
          </motion.div>
        ))}
        {getItems().length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-cyber-blue/40">
            <FaFolder size={40} className="mb-4 opacity-30" />
            <p className="text-sm">This folder is empty</p>
          </div>
        )}
      </div>
      
      {/* Status bar */}
      <div className="px-3 py-1.5 bg-cyber-black/40 text-cyber-blue/60 text-xs border-t border-cyber-blue/20 flex items-center justify-between">
        <div>
          {getItems().length} {getItems().length === 1 ? 'item' : 'items'}
        </div>
        <div className="text-right">
          {getItems().filter(item => item.type === 'folder').length} folders, {getItems().filter(item => item.type === 'file').length} files
        </div>
      </div>
      
      {/* File info panel */}
      {showFileInfo && activeFile && (
        <motion.div 
          className="absolute right-0 top-0 bottom-0 w-64 bg-cyber-black/80 border-l border-cyber-blue/30 shadow-lg"
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
        >
          <div className="flex items-center justify-between p-3 border-b border-cyber-blue/20">
            <h3 className="font-cyber text-cyber-blue">FILE INFO</h3>
            <button 
              onClick={() => setShowFileInfo(false)}
              className="text-cyber-blue/70 hover:text-cyber-blue"
            >
              ×
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex justify-center mb-4">
              <FaFile size={48} className="text-cyber-blue opacity-80" />
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-cyber-blue/50 text-xs mb-1 uppercase">Name</p>
                <p className="text-cyber-blue font-mono">{activeFile.name}</p>
              </div>
              
              <div>
                <p className="text-cyber-blue/50 text-xs mb-1 uppercase">Size</p>
                <p className="text-cyber-blue font-mono">{formatSize(activeFile.size)}</p>
              </div>
              
              <div>
                <p className="text-cyber-blue/50 text-xs mb-1 uppercase">Modified</p>
                <p className="text-cyber-blue font-mono">{activeFile.modified.toLocaleString()}</p>
              </div>
              
              {activeFile.content && (
                <div>
                  <p className="text-cyber-blue/50 text-xs mb-1 uppercase">Content Preview</p>
                  <div className="bg-cyber-black/40 p-2 rounded border border-cyber-blue/20 text-cyber-blue/80 font-mono text-xs h-32 overflow-auto">
                    {activeFile.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 