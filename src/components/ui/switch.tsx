'use client'

import * as SwitchPrimitives from '@radix-ui/react-switch'
// eslint-disable-next-line import/named
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Switch Variants using CVA
 * 
 * Glassmorphism dark-first toggle design
 */
const switchVariants = cva(
  [
    // Base styles
    'peer inline-flex shrink-0',
    'cursor-pointer items-center rounded-full',
    'border',
    'transition-all duration-normal',
    
    // Focus styles
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-accent-400/30',
    'focus-visible:ring-offset-4',
    'focus-visible:ring-offset-bg-950',
    
    // Disabled styles
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        // Primary - solid accent when checked
        primary: [
          'data-[state=unchecked]:bg-bg-800',
          'data-[state=unchecked]:border-border-default',
          
          'data-[state=checked]:bg-accent-600',
          'data-[state=checked]:border-accent-500/30',
          'data-[state=checked]:shadow-soft',
          
          'hover:data-[state=unchecked]:bg-bg-700',
          'hover:data-[state=unchecked]:border-border-emphasis',
          'hover:data-[state=checked]:bg-accent-500',
        ],
        
        // Glass - glassmorphism effect
        glass: [
          'data-[state=unchecked]:bg-glass-02',
          'data-[state=unchecked]:backdrop-blur-subtle',
          'data-[state=unchecked]:border-border-subtle',
          
          'data-[state=checked]:bg-accent-600/90',
          'data-[state=checked]:backdrop-blur-base',
          'data-[state=checked]:border-accent-500/30',
          
          'hover:data-[state=unchecked]:bg-glass-03',
          'hover:data-[state=checked]:bg-accent-500/90',
        ],
        
        // Bordered - outline style
        bordered: [
          'data-[state=unchecked]:bg-transparent',
          'data-[state=unchecked]:border-2 border-border-default',
          
          'data-[state=checked]:bg-accent-600',
          'data-[state=checked]:border-2 border-accent-500',
          
          'hover:data-[state=unchecked]:border-accent-400/30',
          'hover:data-[state=checked]:bg-accent-500',
        ],
      },
      
      size: {
        sm: ['h-5 w-9'],
        md: ['h-6 w-11'],
        lg: ['h-7 w-14'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

const switchThumbVariants = cva(
  [
    'pointer-events-none block',
    'rounded-full',
    'bg-fg',
    'shadow-medium',
    'transition-transform duration-normal',
  ],
  {
    variants: {
      size: {
        sm: [
          'size-4',
          'data-[state=checked]:translate-x-4',
          'data-[state=unchecked]:translate-x-0.5',
        ],
        md: [
          'size-5',
          'data-[state=checked]:translate-x-5',
          'data-[state=unchecked]:translate-x-0.5',
        ],
        lg: [
          'size-6',
          'data-[state=checked]:translate-x-7',
          'data-[state=unchecked]:translate-x-0.5',
        ],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export interface SwitchProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
      'size'
    >,
    VariantProps<typeof switchVariants> {
  /**
   * Visual variant
   * @default 'primary'
   */
  variant?: 'primary' | 'glass' | 'bordered'
  
  /**
   * Size of the switch
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  
  /**
   * Label text
   */
  label?: string
  
  /**
   * Description text shown below label
   */
  description?: string
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, variant = 'primary', size = 'md', label, description, id, ...props }, ref) => {
  // Auto-generate ID from label if not provided
  const switchId = id || (label ? `switch-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)
  
  if (label || description) {
    return (
      <div className="flex items-start gap-3">
        <SwitchPrimitives.Root
          ref={ref}
          id={switchId}
          className={cn(switchVariants({ variant, size }), className)}
          {...props}
        >
          <SwitchPrimitives.Thumb className={switchThumbVariants({ size })} />
        </SwitchPrimitives.Root>
        
        <div className="grid gap-1">
          <label
            htmlFor={switchId}
            className="text-sm font-medium text-fg leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <p className="text-xs text-fg-muted">{description}</p>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <SwitchPrimitives.Root
      ref={ref}
      id={switchId}
      className={cn(switchVariants({ variant, size }), className)}
      {...props}
    >
      <SwitchPrimitives.Thumb className={switchThumbVariants({ size })} />
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
