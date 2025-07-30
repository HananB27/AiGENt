import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import App from './page'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Agent Studio',
  description: 'Create and deploy AI agents with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <App />
      </body>
    </html>
  )
} 