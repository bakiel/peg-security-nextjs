'use client'

import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface DropdownItem {
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  divider?: boolean
  disabled?: boolean
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  className?: string
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'bottom-left',
  className
}) => {
  const positionStyles = {
    'bottom-left': 'origin-top-left left-0 mt-2',
    'bottom-right': 'origin-top-right right-0 mt-2',
    'top-left': 'origin-bottom-left left-0 bottom-full mb-2',
    'top-right': 'origin-bottom-right right-0 bottom-full mb-2',
  }

  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <Menu.Button className="outline-none">
        {trigger}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute z-50 w-56 rounded-lg',
            'bg-onyx border border-gold/20',
            'shadow-xl shadow-black/50',
            'overflow-hidden',
            'focus:outline-none',
            positionStyles[position]
          )}
        >
          <div className="py-1">
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    className="my-1 border-t border-gold/10"
                  />
                )
              }

              return (
                <Menu.Item key={index} disabled={item.disabled}>
                  {({ active }) => {
                    const itemContent = (
                      <div
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5',
                          'text-sm font-medium transition-colors',
                          active && !item.disabled
                            ? 'bg-gold/10 text-gold'
                            : 'text-white',
                          item.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {item.icon && (
                          <span className={cn(
                            'transition-colors',
                            active ? 'text-gold' : 'text-white/50'
                          )}>
                            {item.icon}
                          </span>
                        )}
                        <span>{item.label}</span>
                      </div>
                    )

                    if (item.href && !item.disabled) {
                      return (
                        <Link href={item.href} className="block">
                          {itemContent}
                        </Link>
                      )
                    }

                    if (item.onClick && !item.disabled) {
                      return (
                        <button
                          onClick={item.onClick}
                          className="w-full text-left"
                        >
                          {itemContent}
                        </button>
                      )
                    }

                    return itemContent
                  }}
                </Menu.Item>
              )
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default Dropdown
