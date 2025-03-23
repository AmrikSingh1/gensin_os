'use client'

import React, { createContext } from 'react'
import { create } from 'zustand'
import { produce } from 'immer'
import { v4 as uuidv4 } from 'uuid'

// Define types for our OS state
interface Window {
  id: string
  title: string
  icon: string
  component: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  isFocused: boolean
  zIndex: number
}

interface AppInfo {
  id: string
  name: string
  icon: string
  component: string
  description: string
  category: string
}

interface OsState {
  isBooted: boolean
  isLoggedIn: boolean
  username: string
  windows: Window[]
  apps: AppInfo[]
  activeWindowId: string | null
  startMenuOpen: boolean
  darkMode: boolean
  bootTime: Date | null
  systemSettings: {
    wallpaper: string
    theme: 'blue' | 'pink' | 'green' | 'purple'
    soundEnabled: boolean
    notifications: boolean
  }
  // Actions
  boot: () => void
  login: (username: string) => void
  logout: () => void
  openWindow: (appId: string) => void
  closeWindow: (windowId: string) => void
  minimizeWindow: (windowId: string) => void
  maximizeWindow: (windowId: string) => void
  focusWindow: (windowId: string) => void
  moveWindow: (windowId: string, position: { x: number; y: number }) => void
  resizeWindow: (windowId: string, size: { width: number; height: number }) => void
  toggleStartMenu: () => void
  toggleDarkMode: () => void
  updateSettings: (settings: Partial<OsState['systemSettings']>) => void
}

// Define initial set of applications
const initialApps: AppInfo[] = [
  {
    id: 'file-explorer',
    name: 'File Explorer',
    icon: 'folder',
    component: 'FileExplorer',
    description: 'Browse and manage files',
    category: 'system'
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: 'terminal',
    component: 'Terminal',
    description: 'Command line interface',
    category: 'system'
  },
  {
    id: 'text-editor',
    name: 'Text Editor',
    icon: 'edit',
    component: 'TextEditor',
    description: 'Edit text files',
    category: 'productivity'
  },
  {
    id: 'browser',
    name: 'Web Browser',
    icon: 'globe',
    component: 'Browser',
    description: 'Browse the web',
    category: 'internet'
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'settings',
    component: 'Settings',
    description: 'System settings',
    category: 'system'
  },
  {
    id: 'music-player',
    name: 'Music Player',
    icon: 'music',
    component: 'MusicPlayer',
    description: 'Play music',
    category: 'media'
  },
  {
    id: 'image-viewer',
    name: 'Image Viewer',
    icon: 'image',
    component: 'ImageViewer',
    description: 'View images',
    category: 'media'
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: 'calculator',
    component: 'Calculator',
    description: 'Perform calculations',
    category: 'tools'
  }
]

export const useOsStore = create<OsState>((set, get) => ({
  isBooted: false,
  isLoggedIn: false,
  username: '',
  windows: [],
  apps: initialApps,
  activeWindowId: null,
  startMenuOpen: false,
  darkMode: true,
  bootTime: null,
  systemSettings: {
    wallpaper: 'cyberpunk-city.jpg',
    theme: 'blue',
    soundEnabled: true,
    notifications: true
  },
  
  boot: () => set({ isBooted: true, bootTime: new Date() }),
  
  login: (username) => set({ isLoggedIn: true, username }),
  
  logout: () => set({ isLoggedIn: false, username: '', windows: [] }),
  
  openWindow: (appId) => {
    const { apps, windows } = get()
    const app = apps.find(a => a.id === appId)
    
    if (!app) return
    
    // Check if window is already open
    const existingWindow = windows.find(w => w.id.startsWith(appId))
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        set(produce((state: OsState) => {
          const window = state.windows.find(w => w.id === existingWindow.id)
          if (window) {
            window.isMinimized = false
            window.isFocused = true
          }
          state.activeWindowId = existingWindow.id
          
          // Update zIndex for all windows
          state.windows.forEach(w => {
            w.zIndex = w.id === existingWindow.id ? 10 : 1
          })
        }))
      } else {
        // Just focus it
        get().focusWindow(existingWindow.id)
      }
      return
    }
    
    // Add new window
    const windowId = `${appId}-${uuidv4()}`
    
    // Random position within the central area of the screen
    const position = {
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 100
    }
    
    // Default sizes based on app type
    let size = { width: 600, height: 500 }
    if (app.component === 'Terminal') {
      size = { width: 650, height: 400 }
    } else if (app.component === 'Settings') {
      size = { width: 700, height: 550 }
    }
    
    const newWindow: Window = {
      id: windowId,
      title: app.name,
      icon: app.icon,
      component: app.component,
      position,
      size,
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      zIndex: 10
    }
    
    set(produce((state: OsState) => {
      // Reset focus on all other windows
      state.windows.forEach(window => {
        window.isFocused = false
        window.zIndex = 1
      })
      
      state.windows.push(newWindow)
      state.activeWindowId = windowId
    }))
  },
  
  closeWindow: (windowId) => set(produce((state: OsState) => {
    state.windows = state.windows.filter(w => w.id !== windowId)
    
    // If we still have windows, set the active one to the highest zIndex
    if (state.windows.length > 0) {
      const highestZIndexWindow = state.windows.reduce((prev, current) => {
        return (prev.zIndex > current.zIndex) ? prev : current
      })
      
      state.activeWindowId = highestZIndexWindow.id
      highestZIndexWindow.isFocused = true
    } else {
      state.activeWindowId = null
    }
  })),
  
  minimizeWindow: (windowId) => set(produce((state: OsState) => {
    const window = state.windows.find(w => w.id === windowId)
    if (window) {
      window.isMinimized = true
      window.isFocused = false
    }
    
    // Find the next highest zIndex window to focus
    const visibleWindows = state.windows.filter(w => !w.isMinimized)
    if (visibleWindows.length > 0) {
      const highestZIndexWindow = visibleWindows.reduce((prev, current) => {
        return (prev.zIndex > current.zIndex) ? prev : current
      })
      
      state.activeWindowId = highestZIndexWindow.id
      highestZIndexWindow.isFocused = true
    } else {
      state.activeWindowId = null
    }
  })),
  
  maximizeWindow: (windowId) => set(produce((state: OsState) => {
    const window = state.windows.find(w => w.id === windowId)
    if (window) {
      window.isMaximized = !window.isMaximized
    }
  })),
  
  focusWindow: (windowId) => set(produce((state: OsState) => {
    // Reset focus and zIndex for all windows
    state.windows.forEach(window => {
      if (window.id === windowId) {
        window.isFocused = true
        window.isMinimized = false
        window.zIndex = 10
      } else {
        window.isFocused = false
        window.zIndex = 1
      }
    })
    
    state.activeWindowId = windowId
  })),
  
  moveWindow: (windowId, position) => set(produce((state: OsState) => {
    const window = state.windows.find(w => w.id === windowId)
    if (window) {
      window.position = position
    }
  })),
  
  resizeWindow: (windowId, size) => set(produce((state: OsState) => {
    const window = state.windows.find(w => w.id === windowId)
    if (window) {
      window.size = size
    }
  })),
  
  toggleStartMenu: () => set(state => ({ startMenuOpen: !state.startMenuOpen })),
  
  toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
  
  updateSettings: (settings) => set(produce((state: OsState) => {
    state.systemSettings = { ...state.systemSettings, ...settings }
  }))
}))

// Create context
type OsContextType = {
  children: React.ReactNode
}

// Create context for components to access the store through useContext instead
const OsContext = createContext<null>(null)

export const OsProvider: React.FC<OsContextType> = ({ children }) => {
  return (
    <OsContext.Provider value={null}>
      {children}
    </OsContext.Provider>
  )
}

export const useOs = () => {
  return useOsStore()
} 