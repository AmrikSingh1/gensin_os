import '@/app/globals.css'
import type { Metadata } from 'next'
import React from 'react'
import { OsProvider } from '@/providers/OsProvider'

export const metadata: Metadata = {
  title: 'GensinOS - Cyberpunk Web Operating System',
  description: 'A modern, cyberpunk-themed web operating system interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="cyberpunk">
      <body>
        <OsProvider>
          {children}
          <div className="scanlines" />
        </OsProvider>
      </body>
    </html>
  )
} 