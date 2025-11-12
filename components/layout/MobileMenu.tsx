'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X, Phone, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Disclosure } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { NAVIGATION, SITE_INFO } from '@/lib/constants'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-onyx border-l border-gold/20 z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gold/10">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/PEG_Profile_Design_Logo.png"
                  alt="PEG Security Logo"
                  width={40}
                  height={40}
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(208, 185, 109, 0.5))'
                  }}
                />
                <span className="font-display font-black text-lg text-gold">
                  {SITE_INFO.name}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Emergency Button */}
            <div className="p-5 border-b border-gold/10">
              <a
                href={`tel:${SITE_INFO.phone.replace(/\s/g, '')}`}
                className={cn(
                  'flex items-center justify-center gap-2 w-full',
                  'px-5 py-3 rounded-button',
                  'bg-gradient-to-r from-gold to-gold-dark',
                  'text-onyx font-semibold text-sm',
                  'shadow-gold',
                  'transition-all duration-300',
                  'hover:scale-105'
                )}
                onClick={onClose}
              >
                <Phone size={18} />
                <span className="uppercase tracking-nav">24/7 Response</span>
              </a>
            </div>

            {/* Navigation */}
            <nav className="p-5">
              {NAVIGATION.map((item) => {
                if ('dropdown' in item && item.dropdown) {
                  return (
                    <Disclosure key={item.label} as="div" className="mb-2">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={cn(
                              'flex items-center justify-between w-full',
                              'px-4 py-3 rounded-lg',
                              'text-base font-medium uppercase tracking-nav',
                              'transition-colors duration-300',
                              open || isActive(item.href)
                                ? 'bg-gold/10 text-gold'
                                : 'text-white hover:bg-white/5'
                            )}
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              className={cn(
                                'w-5 h-5 transition-transform duration-300',
                                open && 'rotate-180'
                              )}
                            />
                          </Disclosure.Button>

                          <AnimatePresence>
                            {open && (
                              <Disclosure.Panel static>
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-4 mt-2 space-y-1">
                                    {item.dropdown.map((subItem) => (
                                      <Link
                                        key={subItem.href}
                                        href={subItem.href}
                                        className={cn(
                                          'block px-4 py-2.5 rounded-lg',
                                          'text-sm font-medium',
                                          'transition-colors duration-300',
                                          pathname === subItem.href
                                            ? 'bg-gold/10 text-gold'
                                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                                        )}
                                        onClick={onClose}
                                      >
                                        {subItem.label}
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              </Disclosure.Panel>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </Disclosure>
                  )
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      'block px-4 py-3 mb-2 rounded-lg',
                      'text-base font-medium uppercase tracking-nav',
                      'transition-colors duration-300',
                      isActive(item.href)
                        ? 'bg-gold/10 text-gold'
                        : 'text-white hover:bg-white/5'
                    )}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Footer Info */}
            <div className="p-5 border-t border-gold/10 mt-auto">
              <div className="text-center space-y-2">
                <p className="text-sm text-white/70">{SITE_INFO.hours}</p>
                <p className="text-lg font-semibold text-gold">{SITE_INFO.phone}</p>
                <p className="text-sm text-white/50">{SITE_INFO.email}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
