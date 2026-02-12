'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Toaster (Sonner) - Toast notification container using Sonner library.
 *
 * @description
 * A beautiful, customizable toast notification system built on top of Sonner.
 * Automatically syncs with the current theme (light/dark) and uses glassmorphism design.
 *
 * Features:
 * - Glassmorphism toast design (glass-03, backdrop-blur-base)
 * - Theme-aware (syncs with next-themes)
 * - Multiple toast types (default, success, error, warning, info)
 * - Swipe-to-dismiss on mobile
 * - Keyboard accessible (Escape to dismiss)
 * - Beautiful animations and transitions
 * - Action buttons and custom descriptions
 *
 * @example
 * Import in your root layout and use the toast() function:
 * ```tsx
 * // In layout.tsx
 * import { Toaster } from '@/src/components/ui/sonner'
 *
 * export default function RootLayout() {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <Toaster />
 *       </body>
 *     </html>
 *   )
 * }
 *
 * // In any component
 * import { toast } from 'sonner'
 *
 * toast('Event created', {
 *   description: 'Your event has been scheduled.',
 *   action: {
 *     label: 'Undo',
 *     onClick: () => console.log('Undo')
 *   }
 * })
 *
 * toast.success('Payment successful')
 * toast.error('Something went wrong')
 * toast.warning('This action cannot be undone')
 * toast.info('New updates available')
 * ```
 *
 * @see {@link https://sonner.emilkowal.ski | Sonner Documentation}
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Toast container - glassmorphism
          toast:
            'group toast group-[.toaster]:bg-glass-03 group-[.toaster]:backdrop-blur-base group-[.toaster]:text-fg-DEFAULT group-[.toaster]:border-glass group-[.toaster]:shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
          // Description text - muted
          description: 'group-[.toast]:text-fg-muted',
          // Action button - primary styling
          actionButton:
            'group-[.toast]:bg-accent-500 group-[.toast]:text-white group-[.toast]:hover:bg-accent-600',
          // Cancel button - muted styling
          cancelButton:
            'group-[.toast]:bg-glass-02 group-[.toast]:text-fg-muted group-[.toast]:hover:bg-glass-03',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
