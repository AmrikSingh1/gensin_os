'use client'

import { useEffect, Suspense } from 'react'
import { useOsStore } from '@/store/osStore'
import dynamic from 'next/dynamic'

// Dynamically import components to prevent bundling issues
const BootScreen = dynamic(() => import('@/components/os/boot/BootScreen'), { ssr: false })
const LoginScreen = dynamic(() => import('@/components/os/login/LoginScreen'), { ssr: false })
const Desktop = dynamic(() => import('@/components/os/desktop/Desktop'), { ssr: false })
const Taskbar = dynamic(() => import('@/components/os/taskbar/Taskbar'), { ssr: false })
const WindowManager = dynamic(() => import('@/components/os/windows/WindowManager'), { ssr: false })
const StartMenu = dynamic(() => import('@/components/os/startmenu/StartMenu'), { ssr: false })

// Loading fallback component
const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-cyber-black text-cyber-blue">
    <div className="text-2xl font-cyber">Loading...</div>
  </div>
)

export default function Home() {
  const { isBooted, isLoggedIn, boot } = useOsStore()
  
  useEffect(() => {
    // Simulate boot process
    setTimeout(() => {
      boot()
    }, 3000)
  }, [boot])
  
  if (!isBooted) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <BootScreen />
      </Suspense>
    )
  }
  
  if (!isLoggedIn) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LoginScreen />
      </Suspense>
    )
  }
  
  return (
    <main className="h-screen w-screen overflow-hidden relative">
      <Suspense fallback={<LoadingFallback />}>
        <Desktop />
        <WindowManager />
        <Taskbar />
        <StartMenu />
      </Suspense>
    </main>
  )
} 