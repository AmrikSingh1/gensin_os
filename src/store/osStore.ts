import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define window types for the OS
export type AppType = 
  | 'FileExplorer'
  | 'Terminal'
  | 'TextEditor'
  | 'Browser'
  | 'MusicPlayer'
  | 'ImageViewer'
  | 'Calculator'
  | 'Settings';

// Define theme types
export type ThemeType = 'default' | 'neon' | 'cybernight' | 'ghostinwire' | 'retrowave';

// Define notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Define notification object
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  autoClose?: boolean;
}

// Define window states
export interface Window {
  id: string;
  title: string;
  type: AppType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isActive: boolean;
  isMinimized: boolean;
  isMaximized?: boolean;
  zIndex: number;
  content?: any;
  icon?: string;
}

// Define the OS store state
interface OsState {
  isBooted: boolean;
  isLoggedIn: boolean;
  username: string;
  windows: Window[];
  activeWindowId: string | null;
  isStartMenuOpen: boolean;
  highestZIndex: number;
  wallpaper: string;
  theme: ThemeType;
  notifications: Notification[];
  isMuted: boolean;
  systemTime: Date;
  batteryLevel: number;
  isCharging: boolean;
  
  // Actions
  boot: () => void;
  login: (username: string) => void;
  logout: () => void;
  openApp: (type: AppType, content?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  setActiveWindow: (id: string) => void;
  moveWindow: (id: string, position: { x: number; y: number }) => void;
  resizeWindow: (id: string, size: { width: number; height: number }) => void;
  toggleStartMenu: () => void;
  setWallpaper: (wallpaper: string) => void;
  setTheme: (theme: ThemeType) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  toggleMute: () => void;
  updateSystemTime: () => void;
  setBatteryLevel: (level: number, isCharging: boolean) => void;
}

// Create the OS store with persistence
export const useOsStore = create<OsState>()(
  persist(
    (set, get) => ({
      isBooted: false,
      isLoggedIn: false,
      username: '',
      windows: [],
      activeWindowId: null,
      isStartMenuOpen: false,
      highestZIndex: 10,
      wallpaper: '/wallpapers/default.jpg',
      theme: 'default',
      notifications: [],
      isMuted: false,
      systemTime: new Date(),
      batteryLevel: 85,
      isCharging: true,
      
      // Boot the OS
      boot: () => set({ isBooted: true }),
      
      // Login to the OS
      login: (username) => {
        set({ isLoggedIn: true, username });
        // Add welcome notification
        get().addNotification({
          type: 'info',
          title: 'Welcome',
          message: `Welcome back, ${username}!`,
          autoClose: true
        });
      },
      
      // Logout from the OS
      logout: () => set({ 
        isLoggedIn: false, 
        username: '', 
        windows: [], 
        activeWindowId: null, 
        isStartMenuOpen: false 
      }),
      
      // Open a new app window
      openApp: (type, content) => {
        const { windows, highestZIndex } = get();
        const newZIndex = highestZIndex + 1;
        const id = `window-${Date.now()}`;
        
        // Default window sizes and positions based on app type
        let size = { width: 800, height: 600 };
        let position = { x: 100 + (windows.length * 20) % 200, y: 100 + (windows.length * 20) % 200 };
        let title = type;
        let icon = '';
        
        // Customize based on app type
        switch (type) {
          case 'FileExplorer':
            title = 'FileExplorer';
            icon = '📁';
            break;
          case 'Terminal':
            size = { width: 700, height: 400 };
            icon = '💻';
            break;
          case 'TextEditor':
            title = 'TextEditor';
            icon = '📝';
            break;
          case 'Browser':
            title = 'Browser';
            icon = '🌐';
            break;
          case 'MusicPlayer':
            title = 'MusicPlayer';
            size = { width: 400, height: 500 };
            icon = '🎵';
            break;
          case 'ImageViewer':
            title = 'ImageViewer';
            size = { width: 700, height: 500 };
            icon = '🖼️';
            break;
          case 'Calculator':
            size = { width: 300, height: 400 };
            icon = '🔢';
            break;
          case 'Settings':
            size = { width: 600, height: 500 };
            icon = '⚙️';
            break;
        }
        
        const newWindow: Window = {
          id,
          title,
          type,
          position,
          size,
          isActive: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: newZIndex,
          content,
          icon
        };
        
        // Deactivate all other windows
        const updatedWindows = windows.map(window => ({
          ...window,
          isActive: false,
          zIndex: window.zIndex < newZIndex ? window.zIndex : window.zIndex
        }));
        
        set({
          windows: [...updatedWindows, newWindow],
          activeWindowId: id,
          highestZIndex: newZIndex
        });
      },
      
      // Close a window
      closeWindow: (id) => {
        const { windows, activeWindowId } = get();
        const updatedWindows = windows.filter(window => window.id !== id);
        
        // If the closed window was active, activate the top-most window
        let newActiveWindowId = activeWindowId;
        if (activeWindowId === id) {
          const topWindow = [...updatedWindows].sort((a, b) => b.zIndex - a.zIndex)[0];
          newActiveWindowId = topWindow ? topWindow.id : null;
          
          // Update the activated window
          if (newActiveWindowId) {
            updatedWindows.forEach(window => {
              if (window.id === newActiveWindowId) {
                window.isActive = true;
              }
            });
          }
        }
        
        set({ windows: updatedWindows, activeWindowId: newActiveWindowId });
      },
      
      // Minimize a window
      minimizeWindow: (id) => {
        const { windows, activeWindowId } = get();
        const updatedWindows = windows.map(window => {
          if (window.id === id) {
            return { ...window, isMinimized: true, isActive: false };
          }
          return window;
        });
        
        // If the minimized window was active, activate the top-most window
        let newActiveWindowId = activeWindowId;
        if (activeWindowId === id) {
          const visibleWindows = updatedWindows.filter(w => !w.isMinimized);
          const topWindow = [...visibleWindows].sort((a, b) => b.zIndex - a.zIndex)[0];
          newActiveWindowId = topWindow ? topWindow.id : null;
          
          // Update the activated window
          if (newActiveWindowId) {
            updatedWindows.forEach(window => {
              if (window.id === newActiveWindowId) {
                window.isActive = true;
              }
            });
          }
        }
        
        set({ windows: updatedWindows, activeWindowId: newActiveWindowId });
      },
      
      // Maximize a window
      maximizeWindow: (id) => {
        const { windows } = get();
        const updatedWindows = windows.map(window => {
          if (window.id === id) {
            return { 
              ...window, 
              isMaximized: !window.isMaximized,
              // If unmaximizing, keep the same relative position 
              position: window.isMaximized ? window.position : { x: 0, y: 0 },
              size: window.isMaximized ? window.size : { width: window.size.width * 1.5, height: window.size.height * 1.5 }
            };
          }
          return window;
        });
        
        set({ windows: updatedWindows });
      },
      
      // Restore a minimized window
      restoreWindow: (id) => {
        const { windows, highestZIndex } = get();
        const newZIndex = highestZIndex + 1;
        
        const updatedWindows = windows.map(window => {
          if (window.id === id) {
            return {
              ...window,
              isMinimized: false,
              isActive: true,
              zIndex: newZIndex
            };
          }
          return {
            ...window,
            isActive: false
          };
        });
        
        set({
          windows: updatedWindows,
          activeWindowId: id,
          highestZIndex: newZIndex
        });
      },
      
      // Set a window as active
      setActiveWindow: (id) => {
        const { windows, highestZIndex } = get();
        const newZIndex = highestZIndex + 1;
        
        const updatedWindows = windows.map(window => {
          if (window.id === id) {
            return {
              ...window,
              isActive: true,
              zIndex: newZIndex
            };
          }
          return {
            ...window,
            isActive: false
          };
        });
        
        set({
          windows: updatedWindows,
          activeWindowId: id,
          highestZIndex: newZIndex
        });
      },
      
      // Move a window
      moveWindow: (id, position) => {
        const { windows } = get();
        const updatedWindows = windows.map(window => {
          if (window.id === id) {
            return { ...window, position };
          }
          return window;
        });
        
        set({ windows: updatedWindows });
      },
      
      // Resize a window
      resizeWindow: (id, size) => {
        const { windows } = get();
        const updatedWindows = windows.map(window => {
          if (window.id === id) {
            return { ...window, size };
          }
          return window;
        });
        
        set({ windows: updatedWindows });
      },
      
      // Toggle start menu
      toggleStartMenu: () => {
        set(state => ({ isStartMenuOpen: !state.isStartMenuOpen }));
      },
      
      // Set wallpaper
      setWallpaper: (wallpaper) => {
        set({ wallpaper });
        get().addNotification({
          type: 'success',
          title: 'Wallpaper Changed',
          message: 'Your desktop wallpaper has been updated.',
          autoClose: true
        });
      },
      
      // Set theme
      setTheme: (theme) => {
        set({ theme });
        get().addNotification({
          type: 'success',
          title: 'Theme Changed',
          message: `The ${theme} theme has been applied.`,
          autoClose: true
        });
      },
      
      // Add notification
      addNotification: (notification) => {
        const { notifications } = get();
        const newNotification: Notification = {
          id: `notification-${Date.now()}`,
          timestamp: Date.now(),
          isRead: false,
          ...notification,
        };
        
        set({ notifications: [newNotification, ...notifications].slice(0, 20) });
        
        // Auto-close notifications if specified
        if (notification.autoClose) {
          setTimeout(() => {
            get().clearNotification(newNotification.id);
          }, 5000);
        }
      },
      
      // Mark notification as read
      markNotificationAsRead: (id) => {
        const { notifications } = get();
        const updatedNotifications = notifications.map(notification => {
          if (notification.id === id) {
            return { ...notification, isRead: true };
          }
          return notification;
        });
        
        set({ notifications: updatedNotifications });
      },
      
      // Clear a notification
      clearNotification: (id) => {
        const { notifications } = get();
        const updatedNotifications = notifications.filter(
          notification => notification.id !== id
        );
        
        set({ notifications: updatedNotifications });
      },
      
      // Clear all notifications
      clearAllNotifications: () => {
        set({ notifications: [] });
      },
      
      // Toggle mute
      toggleMute: () => {
        set(state => ({ isMuted: !state.isMuted }));
      },
      
      // Update system time
      updateSystemTime: () => {
        set({ systemTime: new Date() });
      },
      
      // Set battery level
      setBatteryLevel: (level, isCharging) => {
        set({ batteryLevel: level, isCharging });
        
        // Notify if battery is low
        if (level <= 20 && !get().isCharging) {
          get().addNotification({
            type: 'warning',
            title: 'Low Battery',
            message: `Battery level is at ${level}%. Please connect to power.`,
            autoClose: false
          });
        }
      },
    }),
    {
      name: 'gensin-os-storage',
      partialize: (state) => ({
        theme: state.theme,
        wallpaper: state.wallpaper,
        username: state.username,
      }),
    }
  )
); 