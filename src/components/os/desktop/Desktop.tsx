'use client'

import React from 'react'
import { useOsStore } from '@/store/osStore'
import DesktopIcon from './DesktopIcon'
import { FaFolder, FaTerminal, FaCog, FaGlobe, FaEdit, FaMusic, FaImage, FaCalculator } from 'react-icons/fa'

// Define desktop app structure
interface DesktopApp {
  id: string;
  name: string;
  icon: string;
  type: string;
}

// Desktop apps to display
const desktopApps: DesktopApp[] = [
  { id: 'file-explorer', name: 'Files', icon: 'folder', type: 'FileExplorer' },
  { id: 'terminal', name: 'Terminal', icon: 'terminal', type: 'Terminal' },
  { id: 'text-editor', name: 'Editor', icon: 'edit', type: 'TextEditor' },
  { id: 'browser', name: 'Browser', icon: 'globe', type: 'Browser' },
  { id: 'music-player', name: 'Music', icon: 'music', type: 'MusicPlayer' },
  { id: 'image-viewer', name: 'Images', icon: 'image', type: 'ImageViewer' },
  { id: 'calculator', name: 'Calculator', icon: 'calculator', type: 'Calculator' },
  { id: 'settings', name: 'Settings', icon: 'settings', type: 'Settings' },
]

const iconMap: Record<string, React.ReactNode> = {
  folder: <FaFolder size={32} />,
  terminal: <FaTerminal size={32} />,
  settings: <FaCog size={32} />,
  globe: <FaGlobe size={32} />,
  edit: <FaEdit size={32} />,
  music: <FaMusic size={32} />,
  image: <FaImage size={32} />,
  calculator: <FaCalculator size={32} />,
}

export default function Desktop() {
  const { wallpaper, openApp } = useOsStore()
  
  const handleOpenApp = (app: DesktopApp) => {
    openApp(app.type as any);
  }
  
  return (
    <div 
      className="absolute top-0 left-0 w-full h-full overflow-hidden cyber-grid"
      style={{
        backgroundImage: `url('${wallpaper}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {desktopApps.map((app) => (
          <DesktopIcon 
            key={app.id}
            id={app.id}
            label={app.name}
            icon={iconMap[app.icon] || iconMap.folder}
            onClick={() => handleOpenApp(app)}
          />
        ))}
      </div>
    </div>
  )
} 