'use client'

import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import MobileSidebar from './MobileSidebar'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-grey-medium hover:text-onyx transition-colours"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
              <div className="hidden sm:block">
                <p className="text-sm text-grey-medium font-sans font-light">{currentDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-onyx font-sans">Welcome back, Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
