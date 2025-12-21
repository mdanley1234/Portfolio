// components/ProjectLayoutWrapper.tsx
"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProjectLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black">
      {/* Sidebar - Fixed width, top-to-bottom */}
      <aside 
        className={`${
          isOpen ? "w-64" : "w-0"
        } transition-all duration-300 ease-in-out border-r border-white/10 bg-zinc-950 flex-shrink-0 overflow-y-auto`}
      >
        <div className={isOpen ? "p-4 opacity-100" : "opacity-0 invisible"}>
          {/* Nav items will go here */}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex-1 h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-8 left-8 z-50 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        <div className="max-w-4xl mx-auto p-8 lg:p-16">
          {children}
        </div>
      </main>
    </div>
  )
}