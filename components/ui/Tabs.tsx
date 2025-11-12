'use client'

import React, { useState } from 'react'
import { Tab } from '@headlessui/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  variant?: 'underline' | 'pills' | 'enclosed'
  className?: string
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'underline',
  className
}) => {
  const defaultIndex = defaultTab
    ? tabs.findIndex(tab => tab.id === defaultTab)
    : 0

  const [selectedIndex, setSelectedIndex] = useState(defaultIndex >= 0 ? defaultIndex : 0)

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  }

  return (
    <div className={cn('w-full', className)}>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <Tab.List
            className={cn(
              'flex flex-nowrap gap-1 min-w-max',
              variant === 'underline' && 'border-b border-gold/20',
              variant === 'pills' && 'bg-onyx/30 rounded-lg p-1',
              variant === 'enclosed' && 'border-b border-gold/20'
            )}
          >
            {tabs.map((tab) => (
              <Tab key={tab.id} className="relative outline-none flex-shrink-0">
                {({ selected }) => (
                  <div
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 whitespace-nowrap',
                      'text-xs md:text-sm font-medium uppercase tracking-nav',
                      'transition-all duration-300 cursor-pointer',
                      variant === 'underline' && [
                        'border-b-2 -mb-px',
                        selected
                          ? 'text-gold border-gold'
                          : 'text-white/70 border-transparent hover:text-white hover:border-gold/50'
                      ],
                      variant === 'pills' && [
                        'rounded-md',
                        selected
                          ? 'bg-gold text-onyx'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      ],
                      variant === 'enclosed' && [
                        'border-x border-t rounded-t-lg -mb-px',
                        selected
                          ? 'bg-onyx border-gold/20 text-gold border-b-onyx'
                          : 'bg-transparent border-transparent text-white/70 hover:text-white hover:border-gold/10'
                      ]
                    )}
                  >
                    {tab.icon && (
                      <span className={cn(
                        'transition-colors',
                        selected ? 'text-gold' : 'text-white/50'
                      )}>
                        {tab.icon}
                      </span>
                    )}
                    {tab.label}
                  </div>
                )}
              </Tab>
            ))}
          </Tab.List>
        </div>

        <Tab.Panels className="mt-8">
          {tabs.map((tab) => (
            <Tab.Panel key={tab.id} className="outline-none">
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
              >
                {tab.content}
              </motion.div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default Tabs
