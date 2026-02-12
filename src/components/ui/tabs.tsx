'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
// eslint-disable-next-line import/named
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

const Tabs = TabsPrimitive.Root

/**
 * TabsList Variants using CVA
 * 
 * Glassmorphism container for tab triggers
 */
const tabsListVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-md',
    'transition-all duration-normal',
  ],
  {
    variants: {
      variant: {
        // Primary - solid background with padding
        primary: [
          'bg-bg-800',
          'border border-border-default',
          'p-1',
          'gap-1',
        ],
        
        // Glass - glassmorphism effect
        glass: [
          'bg-glass-02',
          'backdrop-blur-subtle',
          'border border-border-subtle',
          'p-1',
          'gap-1',
        ],
        
        // Underline - minimal style with bottom border
        underline: [
          'bg-transparent',
          'border-b border-border-default',
          'gap-0',
          'pb-0',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

/**
 * TabsTrigger Variants using CVA
 * 
 * Individual tab button styles
 */
const tabsTriggerVariants = cva(
  [
    'inline-flex items-center justify-center',
    'whitespace-nowrap',
    'rounded-sm',
    'px-3 py-2',
    'text-sm font-medium',
    'transition-all duration-normal',
    
    // Focus styles
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-accent-400/30',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-bg-950',
    
    // Disabled styles
    'disabled:pointer-events-none disabled:opacity-50',
    
    // Inactive state
    'text-fg-muted',
  ],
  {
    variants: {
      variant: {
        // Primary - solid background when active
        primary: [
          'data-[state=active]:bg-bg-700',
          'data-[state=active]:text-fg',
          'data-[state=active]:shadow-soft',
          'hover:bg-bg-750',
          'hover:text-fg-muted',
        ],
        
        // Glass - glass effect when active
        glass: [
          'data-[state=active]:bg-glass-03',
          'data-[state=active]:backdrop-blur-base',
          'data-[state=active]:text-fg',
          'data-[state=active]:shadow-glass',
          'hover:bg-glass-02',
        ],
        
        // Underline - border bottom when active
        underline: [
          'rounded-none',
          'border-b-2 border-transparent',
          'pb-3',
          'data-[state=active]:border-accent-400',
          'data-[state=active]:text-fg',
          'hover:text-fg-muted',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {
  variant?: 'primary' | 'glass' | 'underline'
}

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  variant?: 'primary' | 'glass' | 'underline'
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'primary', ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant = 'primary', ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2',
      'ring-offset-background',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-accent-400/30',
      'focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
