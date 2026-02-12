'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import * as React from 'react'

import { buttonVariants } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'

/**
 * AlertDialog - Modal dialog for important confirmations.
 *
 * @description
 * A modal dialog that interrupts the user with important content and waits for a response.
 * Built on Radix UI AlertDialog primitive with glassmorphism styling.
 * Typically used for destructive actions (delete, logout) or critical decisions.
 *
 * Features:
 * - Modal overlay with backdrop blur
 * - Glassmorphism content panel
 * - Keyboard accessible (Escape to close)
 * - Focus trap and auto-focus management
 * - Smooth fade and zoom animations
 *
 * @example
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger asChild>
 *     <Button variant="error">Delete Account</Button>
 *   </AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 *       <AlertDialogDescription>
 *         This action cannot be undone. This will permanently delete your
 *         account and remove your data from our servers.
 *       </AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Cancel</AlertDialogCancel>
 *       <AlertDialogAction>Continue</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 *
 * @see {@link https://www.radix-ui.com/docs/primitives/components/alert-dialog | Radix UI AlertDialog}
 */
const AlertDialog = AlertDialogPrimitive.Root

/**
 * AlertDialogTrigger - Button that opens the alert dialog.
 *
 * @description
 * Clickable element that controls the dialog's open state.
 * Use asChild prop to compose with Button or other interactive elements.
 */
const AlertDialogTrigger = AlertDialogPrimitive.Trigger

/**
 * AlertDialogPortal - Portal container for dialog content.
 *
 * @description
 * Renders dialog content in a portal outside the React tree.
 * Automatically handled by AlertDialogContent.
 */
const AlertDialogPortal = AlertDialogPrimitive.Portal

/**
 * AlertDialogOverlay - Semi-transparent backdrop behind dialog.
 *
 * @description
 * Glassmorphism overlay with modal backdrop blur.
 * Prevents interaction with content behind dialog.
 */
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      // Fixed positioning and stacking
      'fixed inset-0 z-50',
      // Glassmorphism backdrop
      'bg-bg-950/80 backdrop-blur-modal',
      // Animations - entry
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      // Animations - exit
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className,
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

/**
 * AlertDialogContent - Main content container for the alert dialog.
 *
 * @description
 * Glassmorphism panel centered on screen with smooth animations.
 * Includes automatic overlay and portal rendering.
 *
 * Features:
 * - Glassmorphism design (glass-03, backdrop-blur-base)
 * - Center-screen positioning
 * - Fade, zoom, and slide animations
 * - Focus trap and keyboard navigation
 * - Responsive max-width (lg = 32rem)
 */
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        // Fixed positioning (centered)
        'fixed left-[50%] top-[50%] z-50',
        'translate-x-[-50%] translate-y-[-50%]',
        // Layout
        'grid w-full max-w-lg gap-4 p-6',
        // Border radius
        'sm:rounded-lg',
        // Glassmorphism
        'bg-glass-03 backdrop-blur-base',
        'border border-glass',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        // Animation duration
        'duration-200',
        // Animations - entry
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=open]:zoom-in-95',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        // Animations - exit
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        'data-[state=closed]:zoom-out-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        // Reduced motion
        'motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

/**
 * AlertDialogHeader - Header section of the alert dialog.
 *
 * @description
 * Container for AlertDialogTitle and AlertDialogDescription.
 * Automatically centered on mobile, left-aligned on desktop.
 */
const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

/**
 * AlertDialogFooter - Footer section of the alert dialog.
 *
 * @description
 * Container for action buttons (Confirm, Cancel).
 * Mobile: stacked vertical, Desktop: row with Cancel left, Action right.
 */
const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

/**
 * AlertDialogTitle - Title text for the alert dialog.
 *
 * @description
 * Semantic heading for alert content (typically h2).
 * Should clearly state the action or warning.
 */
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold',
      'text-fg-DEFAULT',
      className,
    )}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

/**
 * AlertDialogDescription - Description text for the alert dialog.
 *
 * @description
 * Secondary text that explains the consequences of the action.
 * Should provide context and help users make informed decisions.
 */
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-fg-muted', className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

/**
 * AlertDialogAction - Primary action button (e.g., "Confirm", "Delete").
 *
 * @description
 * Button that confirms the alert action and closes the dialog.
 * Uses Button component's default variant (inherits glassmorphism).
 * For destructive actions, consider using variant="error".
 */
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

/**
 * AlertDialogCancel - Cancel button that dismisses the dialog.
 *
 * @description
 * Button that cancels the action and closes the dialog without side effects.
 * Uses Button component's outline variant by default.
 */
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: 'outline' }),
      'mt-2 sm:mt-0',
      className,
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
