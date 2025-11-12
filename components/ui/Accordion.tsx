'use client'

import React from 'react'
import { Disclosure } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
  defaultOpen?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  variant?: 'default' | 'bordered' | 'separated'
  className?: string
}

const AccordionItemComponent: React.FC<{
  item: AccordionItem
  variant: 'default' | 'bordered' | 'separated'
}> = ({ item, variant }) => {
  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        height: { duration: 0.3, ease: 'easeInOut' as any },
        opacity: { duration: 0.2 }
      }
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        height: { duration: 0.3, ease: 'easeInOut' as any },
        opacity: { duration: 0.3, delay: 0.1 }
      }
    }
  }

  return (
    <Disclosure defaultOpen={item.defaultOpen}>
      {({ open }) => (
        <div
          className={cn(
            variant === 'default' && 'border-b border-gold/10',
            variant === 'bordered' && 'border border-gold/20 rounded-lg overflow-hidden',
            variant === 'separated' && 'border border-gold/10 rounded-lg mb-4'
          )}
        >
          <Disclosure.Button
            className={cn(
              'flex items-center justify-between w-full px-6 py-4',
              'text-left font-semibold text-white',
              'transition-colors duration-300',
              'hover:text-gold focus:outline-none',
              open && 'text-gold'
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <span className={cn(
                  'transition-colors',
                  open ? 'text-gold' : 'text-white/50'
                )}>
                  {item.icon}
                </span>
              )}
              <span>{item.title}</span>
            </div>

            <ChevronDown
              className={cn(
                'w-5 h-5 transition-transform duration-300',
                open ? 'rotate-180 text-gold' : 'text-white/50'
              )}
            />
          </Disclosure.Button>

          <AnimatePresence initial={false}>
            {open && (
              <Disclosure.Panel static>
                <motion.div
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  variants={contentVariants}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      'px-6 pb-4 text-white/80 leading-relaxed',
                      item.icon && 'pl-14'
                    )}
                  >
                    {item.content}
                  </div>
                </motion.div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </div>
      )}
    </Disclosure>
  )
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  variant = 'default',
  className
}) => {
  return (
    <div className={cn('w-full', className)}>
      {items.map((item) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          variant={variant}
        />
      ))}
    </div>
  )
}

export default Accordion
