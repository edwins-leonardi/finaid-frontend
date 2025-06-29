import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-green-500"></div>
        <div className="absolute top-32 right-20 w-24 h-24 rounded-full bg-blue-500"></div>
        <div className="absolute bottom-20 left-32 w-40 h-40 rounded-full bg-purple-500"></div>
        <div className="absolute bottom-32 right-10 w-28 h-28 rounded-full bg-indigo-500"></div>
        
        {/* Dollar signs pattern */}
        <div className="absolute top-1/4 left-1/4 text-6xl text-green-500 opacity-10">$</div>
        <div className="absolute top-1/3 right-1/3 text-4xl text-blue-500 opacity-10">$</div>
        <div className="absolute bottom-1/3 left-1/2 text-5xl text-purple-500 opacity-10">$</div>
        <div className="absolute bottom-1/4 right-1/4 text-3xl text-indigo-500 opacity-10">$</div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
} 