import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import HoloText from '@/components/HoloText'
import MascotClock from '@/components/MascotClock'
import { swomp } from '@/app/fonts/swomp'
import AuthStatus from '@/components/AuthStatus'
import Sidebar from '@/components/Sidebar'


export const metadata: Metadata = {
  title: 'wakeup.wav',
  description: 'Actionable music data',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-zinc-100">

        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            {/* keep any existing header/brand you already render */}
            <header className="flex items-center gap-4 p-4 border-b border-zinc-800 sticky top-0 bg-black/70 backdrop-blur">
              <MascotClock />
              <div>
                <h1 className={`text-5xl md:text-7xl font-bold leading-tight tracking-tight ${swomp.className}`}>
                  <HoloText>wakeup.wav</HoloText>
                </h1>
                <p className="text-xs text-zinc-400 -mt-1">wake up your data • act on it</p>
              </div>
            </header>
            <AuthStatus />
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </div>
        </div>
      </body>
    </html>
  )
}
