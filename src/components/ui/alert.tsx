// eslint-disable-next-line import/named
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Alert Variants using CVA
 * 
 * Glassmorphism alerts with semantic color variants
 */
const alertVariants = cva(
  [
    'relative w-full rounded-lg p-4',
    '[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]',
    '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
    'transition-all duration-normal',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-bg-800',
          'border border-border-default',
          'text-fg',
          '[&>svg]:text-fg',
        ],
        glass: [
          'bg-glass-02',
          'backdrop-blur-base',
          'border border-border-subtle',
          'text-fg',
          '[&>svg]:text-fg',
        ],
        success: [
          'bg-success-900/50',
          'border border-success-700/50',
          'text-success-300',
          '[&>svg]:text-success-500',
          'backdrop-blur-subtle',
        ],
        warning: [
          'bg-warning-900/50',
          'border border-warning-700/50',
          'text-warning-300',
          '[&>svg]:text-warning-500',
          'backdrop-blur-subtle',
        ],
        error: [
          'bg-error-900/50',
          'border border-error-700/50',
          'text-error-300',
          '[&>svg]:text-error-500',
          'backdrop-blur-subtle',
        ],
        info: [
          'bg-info-900/50',
          'border border-info-700/50',
          'text-info-300',
          '[&>svg]:text-info-500',
          'backdrop-blur-subtle',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
