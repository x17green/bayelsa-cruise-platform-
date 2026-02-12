'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
// eslint-disable-next-line import/named
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Avatar Variants using CVA
 * 
 * Glassmorphism avatars with size variants
 */
const avatarVariants = cva(
  [
    'relative flex shrink-0',
    'overflow-hidden rounded-full',
    'border border-border-default',
    'transition-all duration-normal',
  ],
  {
    variants: {
      size: {
        xs: ['size-6'],
        sm: ['size-8'],
        md: ['size-10'],
        lg: ['size-12'],
        xl: ['size-16'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

const avatarFallbackVariants = cva(
  [
    'flex h-full w-full',
    'items-center justify-center',
    'rounded-full',
    'text-fg font-medium',
  ],
  {
    variants: {
      variant: {
        default: ['bg-bg-800'],
        glass: ['bg-glass-02', 'backdrop-blur-subtle'],
        accent: ['bg-accent-900/50', 'backdrop-blur-subtle'],
      },
      size: {
        xs: ['text-xs'],
        sm: ['text-xs'],
        md: ['text-sm'],
        lg: ['text-base'],
        xl: ['text-lg'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarFallbackVariants> {
  variant?: 'default' | 'glass' | 'accent'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = 'md', ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square size-full', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, variant = 'default', size = 'md', ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(avatarFallbackVariants({ variant, size }), className)}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
