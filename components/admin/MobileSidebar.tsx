'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Image as ImageIcon,
  Users,
  Shield,
  Mail,
  LogOut,
  X
} from 'lucide-react'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Briefcase, label: 'Jobs', href: '/admin/jobs' },
  { icon: FileText, label: 'Applications', href: '/admin/applications' },
  { icon: ImageIcon, label: 'Gallery', href: '/admin/gallery' },
  { icon: Users, label: 'Team', href: '/admin/team' },
  { icon: Shield, label: 'Services', href: '/admin/services' },
  { icon: Mail, label: 'Messages', href: '/admin/messages' }
]

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[280px] transform transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col bg-gradient-to-br from-onyx via-onyx-light to-onyx border-r border-gold/20">
          {/* Logo Section */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gold/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-gold">
                <img
                  src="/images/PEG-Security-Logo.jpg"
                  alt="PEG Security"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg font-sans">PEG Security</h2>
                <p className="text-gold text-xs font-sans font-light">Admin Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colours"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-sans font-semibold ${
                        active
                          ? 'bg-gold text-onyx shadow-gold'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="px-4 py-4 border-t border-gold/10">
            <div className="bg-white/5 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold font-sans">Admin User</p>
                  <p className="text-white/50 text-xs font-sans font-light">admin@pegsecurity.co.za</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all font-sans font-semibold"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
