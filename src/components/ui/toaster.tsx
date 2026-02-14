'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/src/components/ui/toast'
import { useToast } from '@/src/hooks/use-toast'

/**
 * Toaster - Toast notification container component.
 *
 * @description
 * Renders all active toast notifications using the useToast hook.
 * This component is the container that displays Toast components from the toast queue.
 * Uses the already-migrated Toast component (Phase 3) with glassmorphism design.
 *
 * Usage:
 * 1. Import this component in your root layout (app/layout.tsx)
 * 2. Use the toast() function from useToast hook to show notifications
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * import { Toaster } from '@/src/components/ui/toaster'
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <Toaster />
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // In any component
 * import { useToast } from '@/src/hooks/use-toast'
 *
 * export function MyComponent() {
 *   const { toast } = useToast()
 *
 *   return (
 *     <Button
 *       onClick={() => {
 *         toast({
 *           title: 'Success!',
 *           description: 'Your changes have been saved.',
 *         })
 *       }}
 *     >
 *       Save Changes
 *     </Button>
 *   )
 * }
 * ```
 *
 * @see Toast component (Phase 3) for glassmorphism implementation
 * @see useToast hook for toast management
 */
export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
