'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOsStore } from '@/store/osStore'
import { 
  FaFolder, FaFile, FaFileImage, FaFileAlt, FaFileCode, 
  FaFilePdf, FaFileAudio, FaVideo, FaArrowLeft, FaArrowRight, 
  FaSearch, FaEllipsisV, FaPlus, FaTrash, FaHome,
  FaListUl, FaThLarge
} from 'react-icons/fa'

// File type icons mapping
const fileTypeIcons: Record<string, React.ReactNode> = {
  folder: <FaFolder className="text-yellow-400" />,
  image: <FaFileImage className="text-blue-400" />,
  document: <FaFileAlt className="text-gray-300" />,
  code: <FaFileCode className="text-green-400" />,
  pdf: <FaFilePdf className="text-red-400" />,
  audio: <FaFileAudio className="text-purple-400" />,
  video: <FaVideo className="text-pink-400" />,
  default: <FaFile className="text-gray-400" />
}

// Sample file system data
const initialFileSystem = {
  'Desktop': {
    type: 'folder',
    children: {
      'Welcome.txt': { type: 'document', content: 'Welcome to GensinOS!', size: '14B', modified: '2023-09-15' },
      'System Info.txt': { type: 'document', content: 'CPU: QUANTUM-CORE_x64\nMemory: 128TB NEURAL-RAM', size: '64B', modified: '2023-09-14' },
      'Screenshot.png': { type: 'image', content: '', size: '1.2MB', modified: '2023-09-13' },
    }
  },
  'Documents': {
    type: 'folder',
    children: {
      'Projects': {
        type: 'folder',
        children: {
          'Project_X.pdf': { type: 'pdf', content: '', size: '3.5MB', modified: '2023-09-10' },
          'code_sample.js': { type: 'code', content: 'console.log("Hello, Cyberpunk World!");', size: '48B', modified: '2023-09-08' },
        }
      },
      'Notes': {
        type: 'folder',
        children: {
          'meeting_notes.txt': { type: 'document', content: 'Met with AI division about neural implants', size: '128B', modified: '2023-09-05' },
          'todo.txt': { type: 'document', content: '1. Update security protocols\n2. Review new tech specs', size: '86B', modified: '2023-09-02' },
        }
      },
      'Report.pdf': { type: 'pdf', content: '', size: '2.8MB', modified: '2023-08-30' },
    }
  },
  'Media': {
    type: 'folder',
    children: {
      'Music': {
        type: 'folder',
        children: {
          'synthwave_mix.mp3': { type: 'audio', content: '', size: '8.4MB', modified: '2023-08-25' },
          'cyberpunk_beats.mp3': { type: 'audio', content: '', size: '7.2MB', modified: '2023-08-20' },
        }
      },
      'Videos': {
        type: 'folder',
        children: {
          'night_city_tour.mp4': { type: 'video', content: '', size: '45.6MB', modified: '2023-08-15' },
        }
      },
      'cyberscape.jpg': { type: 'image', content: '', size: '2.4MB', modified: '2023-08-10' },
      'neon_city.jpg': { type: 'image', content: '', size: '3.1MB', modified: '2023-08-05' },
    }
  },
  'Programs': {
    type: 'folder',
    children: {
      'TextEditor.exe': { type: 'code', content: '', size: '4.2MB', modified: '2023-08-01' },
      'Terminal.exe': { type: 'code', content: '', size: '3.8MB', modified: '2023-07-28' },
      'ImageViewer.exe': { type: 'code', content: '', size: '5.6MB', modified: '2023-07-25' },
    }
  },
  'System': {
    type: 'folder',
    children: {
      'Logs': {
        type: 'folder',
        children: {
          'system.log': { type: 'document', content: 'System boot: OK\nMemory check: PASSED\nNetwork: CONNECTED', size: '246B', modified: '2023-07-20' },
          'security.log': { type: 'document', content: 'No security breaches detected', size: '28B', modified: '2023-07-15' },
        }
      },
      'config.ini': { type: 'document', content: 'theme=default\naudio=on\nfirst_run=false', size: '34B', modified: '2023-07-10' },
    }
  }
}

type FileSystemItem = {
  type: string;
  content?: string;
  size?: string;
  modified?: string;
  children?: Record<string, FileSystemItem>;
}

type FileSystemState = Record<string, FileSystemItem>;

export default function FileExplorer() {
  const { addNotification } = useOsStore();
  const [fileSystem, setFileSystem] = useState<FileSystemState>(initialFileSystem);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [history, setHistory] = useState<Array<string[]>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, item: string} | null>(null);
  
  // Get current folder based on path
  const getCurrentFolder = (): Record<string, FileSystemItem> => {
    let current: any = fileSystem;
    
    for (const folder of currentPath) {
      if (current[folder] && current[folder].children) {
        current = current[folder].children;
      } else {
        return {};
      }
    }
    
    return current;
  };
  
  // Navigate to a folder
  const navigateTo = (folder: string) => {
    const newPath = [...currentPath, folder];
    
    // Update history
    const newHistory = [...history.slice(0, historyIndex + 1), currentPath];
    
    setCurrentPath(newPath);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSelectedItems([]);
  };
  
  // Navigate up one level
  const navigateUp = () => {
    if (currentPath.length === 0) return;
    
    const newPath = [...currentPath.slice(0, -1)];
    
    // Update history
    const newHistory = [...history.slice(0, historyIndex + 1), currentPath];
    
    setCurrentPath(newPath);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSelectedItems([]);
  };
  
  // Navigate back in history
  const navigateBack = () => {
    if (historyIndex > 0) {
      const previousIndex = historyIndex - 1;
      const previousPath = history[previousIndex];
      
      setCurrentPath(previousPath);
      setHistoryIndex(previousIndex);
      setSelectedItems([]);
    }
  };
  
  // Navigate forward in history
  const navigateForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextPath = history[nextIndex];
      
      setCurrentPath(nextPath);
      setHistoryIndex(nextIndex);
      setSelectedItems([]);
    }
  };
  
  // Handle file/folder selection
  const handleItemClick = (name: string, item: FileSystemItem, event: React.MouseEvent) => {
    // Check if holding Ctrl key for multi-select
    if (event.ctrlKey || event.metaKey) {
      setSelectedItems(prev => {
        if (prev.includes(name)) {
          return prev.filter(item => item !== name);
        } else {
          return [...prev, name];
        }
      });
      return;
    }
    
    // Single selection
    setSelectedItems([name]);
    
    // If it's a folder, navigate to it on double click
    if (item.type === 'folder' && event.detail === 2) {
      navigateTo(name);
    }
    
    // If it's a file, open it with appropriate app on double click
    if (item.type !== 'folder' && event.detail === 2) {
      addNotification({
        title: 'File Opened',
        message: `Opening ${name}...`,
        type: 'info',
        autoClose: true
      });
      // In a real app, we would open the file with the appropriate application
    }
  };
  
  // Handle right-click context menu
  const handleContextMenu = (event: React.MouseEvent, name: string) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      item: name
    });
    
    // If item isn't already selected, select it
    if (!selectedItems.includes(name)) {
      setSelectedItems([name]);
    }
  };
  
  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Filter items based on search query
  const filteredItems = () => {
    const currentFolder = getCurrentFolder();
    if (!searchQuery) return currentFolder;
    
    const filtered: Record<string, FileSystemItem> = {};
    
    Object.entries(currentFolder).forEach(([name, item]) => {
      if (name.toLowerCase().includes(searchQuery.toLowerCase())) {
        filtered[name] = item;
      }
    });
    
    return filtered;
  };
  
  // Get breadcrumb navigation
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { name: 'Home', path: [] }
    ];
    
    let currentBreadcrumbPath: string[] = [];
    
    currentPath.forEach(folder => {
      currentBreadcrumbPath = [...currentBreadcrumbPath, folder];
      breadcrumbs.push({
        name: folder,
        path: [...currentBreadcrumbPath]
      });
    });
    
    return breadcrumbs;
  };
  
  // Get appropriate icon for file type
  const getFileIcon = (item: FileSystemItem) => {
    return fileTypeIcons[item.type] || fileTypeIcons.default;
  };
  
  return (
    <div className="h-full flex flex-col bg-cyber-dark/95 text-cyber-blue overflow-hidden">
      {/* Toolbar */}
      <div className="p-2 border-b border-cyber-blue/20 flex items-center space-x-2">
        <button 
          className={`p-1.5 rounded ${historyIndex > 0 ? 'bg-cyber-blue/10 hover:bg-cyber-blue/20' : 'text-cyber-blue/30'}`}
          onClick={navigateBack}
          disabled={historyIndex <= 0}
        >
          <FaArrowLeft />
        </button>
        <button 
          className={`p-1.5 rounded ${historyIndex < history.length - 1 ? 'bg-cyber-blue/10 hover:bg-cyber-blue/20' : 'text-cyber-blue/30'}`}
          onClick={navigateForward}
          disabled={historyIndex >= history.length - 1}
        >
          <FaArrowRight />
        </button>
        <button 
          className="p-1.5 rounded bg-cyber-blue/10 hover:bg-cyber-blue/20"
          onClick={navigateUp}
        >
          <FaHome />
        </button>
        
        {/* Breadcrumb navigation */}
        <div className="flex-1 flex items-center space-x-1 px-2 text-sm overflow-x-auto scrollbar-hide">
          {getBreadcrumbs().map((breadcrumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-cyber-blue/40">/</span>}
              <button
                className={`px-1.5 py-0.5 rounded hover:bg-cyber-blue/10 ${
                  index === getBreadcrumbs().length - 1 ? 'text-cyber-blue' : 'text-cyber-blue/70'
                }`}
                onClick={() => setCurrentPath(breadcrumb.path)}
              >
                {breadcrumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
        
        {/* Search bar */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-blue/40" />
          <input
            type="text"
            placeholder="Search"
            className="bg-cyber-black/60 text-cyber-blue pl-9 pr-4 py-1.5 rounded border border-cyber-blue/20 focus:border-cyber-blue/50 outline-none w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button
          className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-cyber-blue/20' : 'bg-cyber-blue/10 hover:bg-cyber-blue/20'}`}
          onClick={() => setViewMode('list')}
        >
          <FaListUl />
        </button>
        <button
          className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-cyber-blue/20' : 'bg-cyber-blue/10 hover:bg-cyber-blue/20'}`}
          onClick={() => setViewMode('grid')}
        >
          <FaThLarge />
        </button>
      </div>
      
      {/* File display area */}
      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Object.entries(filteredItems()).map(([name, item]) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-3 rounded-lg border ${
                  selectedItems.includes(name) 
                    ? 'bg-cyber-blue/20 border-cyber-blue/50' 
                    : 'bg-cyber-black/40 border-cyber-blue/10 hover:border-cyber-blue/30'
                } cursor-pointer relative group`}
                onClick={(e) => handleItemClick(name, item, e)}
                onContextMenu={(e) => handleContextMenu(e, name)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl mb-2">
                    {getFileIcon(item)}
                  </div>
                  <div className="text-sm truncate w-full">
                    {name}
                  </div>
                  <div className="text-xs text-cyber-blue/50 mt-1">
                    {item.size}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-cyber-blue/20 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-cyber-black/60 border-b border-cyber-blue/20">
                  <th className="text-left py-2 px-4 text-xs uppercase tracking-wider font-medium text-cyber-blue/70">Name</th>
                  <th className="text-left py-2 px-4 text-xs uppercase tracking-wider font-medium text-cyber-blue/70">Type</th>
                  <th className="text-left py-2 px-4 text-xs uppercase tracking-wider font-medium text-cyber-blue/70">Size</th>
                  <th className="text-left py-2 px-4 text-xs uppercase tracking-wider font-medium text-cyber-blue/70">Modified</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(filteredItems()).map(([name, item]) => (
                  <motion.tr
                    key={name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`border-b border-cyber-blue/10 ${
                      selectedItems.includes(name) 
                        ? 'bg-cyber-blue/20' 
                        : 'hover:bg-cyber-blue/10'
                    } cursor-pointer`}
                    onClick={(e) => handleItemClick(name, item, e)}
                    onContextMenu={(e) => handleContextMenu(e, name)}
                  >
                    <td className="py-2 px-4 flex items-center">
                      <div className="mr-3">
                        {getFileIcon(item)}
                      </div>
                      {name}
                    </td>
                    <td className="py-2 px-4 text-cyber-blue/70">{item.type}</td>
                    <td className="py-2 px-4 text-cyber-blue/70">{item.size || '-'}</td>
                    <td className="py-2 px-4 text-cyber-blue/70">{item.modified || '-'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Empty state */}
        {Object.keys(filteredItems()).length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-cyber-blue/40">
            <FaFolder className="text-5xl mb-4" />
            {searchQuery ? (
              <>
                <div className="text-xl">No results found</div>
                <div className="text-sm mt-2">Try a different search term</div>
              </>
            ) : (
              <>
                <div className="text-xl">This folder is empty</div>
                <div className="text-sm mt-2">Add files or folders to get started</div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Status bar */}
      <div className="px-4 py-2 text-xs text-cyber-blue/60 border-t border-cyber-blue/20 flex justify-between">
        <div>
          {Object.keys(filteredItems()).length} items
          {selectedItems.length > 0 && ` (${selectedItems.length} selected)`}
        </div>
        <div>
          {currentPath.length > 0 ? `/${currentPath.join('/')}` : '/'}
        </div>
      </div>
      
      {/* Context menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 bg-cyber-black/95 border border-cyber-blue/20 rounded-lg shadow-lg overflow-hidden w-48"
            style={{ 
              left: `${contextMenu.x}px`, 
              top: `${contextMenu.y}px`,
              transform: `translate(${contextMenu.x + 192 > window.innerWidth ? -100 : 0}%, ${contextMenu.y + 240 > window.innerHeight ? -100 : 0}%)`
            }}
          >
            <div className="py-1">
              <button className="w-full text-left px-4 py-2 text-cyber-blue/80 hover:bg-cyber-blue/20 flex items-center">
                <FaPlus className="mr-3" size={12} />
                <span>New</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-cyber-blue/80 hover:bg-cyber-blue/20 flex items-center">
                <FaTrash className="mr-3" size={12} />
                <span>Delete</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-cyber-blue/80 hover:bg-cyber-blue/20 flex items-center">
                <FaEllipsisV className="mr-3" size={12} />
                <span>Properties</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 