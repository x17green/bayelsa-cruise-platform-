'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '@/src/lib/utils'

/**
 * Drawer - Bottom sheet modal component using Vaul library.
 *
 * @description
 * A mobile-friendly bottom sheet that slides up from the bottom of the screen.
 * Built on Vaul (by Emil Kowalski) with drag-to-dismiss, smooth spring animations,
 * and optional background scaling.
 *
 * Features:
 * - Drag-to-dismiss with spring physics
 * - Snap points for multi-height drawers
 * - Background scaling effect
 * - Glassmorphism panel design
 * - Keyboard accessible (Escape to close)
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="glass">Open Menu</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Account Settings</DrawerTitle>
 *       <DrawerDescription>Manage your account preferences</DrawerDescription>
 *     </DrawerHeader>
 *     <div className="p-4">Content goes here</div>
 *     <DrawerFooter>
 *       <Button>Save Changes</Button>
 *       <DrawerClose asChild>
 *         <Button variant="outline">Cancel</Button>
 *       </DrawerClose>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 *
 * @see {@link https://vaul.emilkowal.ski | Vaul Documentation}
 */
const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = 'Drawer'

/**
 * DrawerTrigger - Button that opens the drawer.
 *
 * @description
 * Clickable element that controls the drawer's open state.
 * Use asChild prop to compose with Button or other interactive elements.
 */
const DrawerTrigger = DrawerPrimitive.Trigger

/**
 * DrawerPortal - Portal container for drawer content.
 *
 * @description
 * Renders drawer content in a portal outside the React tree.
 * Automatically used by DrawerContent.
 */
const DrawerPortal = DrawerPrimitive.Portal

/**
 * DrawerClose - Button that closes the drawer.
 *
 * @description
 * Clickable element that dismisses the drawer.
 * Use asChild prop to compose with Button or other elements.
 */
const DrawerClose = DrawerPrimitive.Close

/**
 * DrawerOverlay - Semi-transparent backdrop behind drawer.
 *
 * @description
 * Glassmorphism overlay with modal backdrop blur.
 * Clicking overlay dismisses drawer (default behavior).
 */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      // Fixed positioning and stacking
      'fixed inset-0 z-50',
      // Glassmorphism backdrop
      'bg-bg-950/80 backdrop-blur-modal',
      className,
    )}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

/**
 * DrawerContent - Main content container for the drawer.
 *
 * @description
 * Glassmorphism panel that slides up from the bottom with drag handle.
 * Includes automatic overlay and portal rendering.
 * Drag the handle or content to dismiss.
 *
 * Features:
 * - Glassmorphism design (glass-03, backdrop-blur-base)
 * - Visual drag handle (horizontal bar)
 * - Slide-up animation from bottom
 * - Auto-height based on content
 */
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        // Fixed positioning
        'fixed inset-x-0 bottom-0 z-50 mt-24',
        // Layout
        'flex h-auto flex-col',
        // Border radius (top only)
        'rounded-t-[10px]',
        // Glassmorphism
        'bg-glass-03 backdrop-blur-base',
        'border-t border-x border-glass',
        className,
      )}
      {...props}
    >
      {/* Drag Handle */}
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-glass-01" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = 'DrawerContent'

/**
 * DrawerHeader - Header section of the drawer.
 *
 * @description
 * Container for DrawerTitle and DrawerDescription.
 * Automatically centered on mobile, left-aligned on desktop.
 */
const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
)
DrawerHeader.displayName = 'DrawerHeader'

/**
 * DrawerFooter - Footer section of the drawer.
 *
 * @description
 * Container for action buttons (Save, Cancel, etc.).
 * Automatically sticks to bottom with margin-top: auto.
 */
const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
)
DrawerFooter.displayName = 'DrawerFooter'

/**
 * DrawerTitle - Title text for the drawer.
 *
 * @description
 * Semantic heading for drawer content (typically h2).
 * Automatically styled with design system typography.
 */
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      'text-fg-DEFAULT',
      className,
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

/**
 * DrawerDescription - Description text for the drawer.
 *
 * @description
 * Secondary text that explains the drawer's purpose.
 * Automatically styled with muted typography.
 */
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-fg-muted', className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
