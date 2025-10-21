
import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-white/10">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              <span className="text-white">Medi</span>
              <span className="text-metallicPurple">Burgh</span>
              <span className="text-white"> • PracticeOps</span>
            </Link>
            <nav className="flex gap-4">
              <Link href="/tasks" className="btn">Tasks</Link>
              <Link href="/dashboard" className="btn">Dashboard</Link>
              <Link href="/auth" className="btn">Sign in</Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  )
}
