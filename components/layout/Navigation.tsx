'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { NAVIGATION, SITE_INFO } from '@/lib/constants'
import Dropdown from '@/components/ui/Dropdown'

interface NavigationProps {
  onMobileMenuToggle?: () => void
}

const Navigation: React.FC<NavigationProps> = ({ onMobileMenuToggle }) => {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300',
        scrolled
          ? 'py-2 bg-[rgba(26,26,26,0.98)] shadow-lg backdrop-blur-nav'
          : 'py-3 bg-[rgba(26,26,26,0.95)] backdrop-blur-nav',
        'border-b border-gold/10'
      )}
    >
      <div className="container max-w-container mx-auto px-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/images/PEG_Profile_Design_Logo.png"
                alt="PEG Security Logo"
                width={45}
                height={45}
                className="transition-all duration-300 group-hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(208, 185, 109, 0.5))'
                }}
              />
            </div>
            <div className="font-display font-black text-xl text-gold transition-all duration-300 group-hover:text-gold-light"
                 style={{
                   textShadow: '0 0 20px rgba(208, 185, 109, 0.4)'
                 }}>
              {SITE_INFO.name}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {NAVIGATION.map((item) => {
              if ('dropdown' in item && item.dropdown) {
                return (
                  <Dropdown
                    key={item.label}
                    trigger={
                      <span
                        className={cn(
                          'relative text-[15px] font-medium uppercase tracking-nav whitespace-nowrap',
                          'transition-colors duration-300',
                          'hover:text-gold',
                          'after:absolute after:bottom-[-5px] after:left-0 after:w-0',
                          'after:h-0.5 after:bg-gold after:transition-all after:duration-300',
                          'hover:after:w-full',
                          isActive(item.href)
                            ? 'text-gold after:w-full'
                            : 'text-white'
                        )}
                      >
                        {item.label}
                      </span>
                    }
                    items={item.dropdown.map(subItem => ({
                      label: subItem.label,
                      href: subItem.href
                    }))}
                    position="bottom-left"
                  />
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'relative text-[15px] font-medium uppercase tracking-nav whitespace-nowrap',
                    'transition-colors duration-300',
                    'hover:text-gold',
                    'after:absolute after:bottom-[-5px] after:left-0 after:w-0',
                    'after:h-0.5 after:bg-gold after:transition-all after:duration-300',
                    'hover:after:w-full',
                    isActive(item.href)
                      ? 'text-gold after:w-full'
                      : 'text-white'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Emergency Button + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Emergency Button */}
            <a
              href={`tel:${SITE_INFO.phone.replace(/\s/g, '')}`}
              className={cn(
                'hidden md:flex items-center gap-2',
                'px-5 py-2.5 rounded-button',
                'bg-gradient-to-r from-gold to-gold-dark',
                'text-onyx font-semibold text-sm',
                'shadow-gold hover:shadow-gold-hover',
                'transition-all duration-300',
                'hover:-translate-y-0.5 hover:scale-105'
              )}
            >
              <Phone size={18} />
              <span className="uppercase tracking-nav">24/7 Response</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation
