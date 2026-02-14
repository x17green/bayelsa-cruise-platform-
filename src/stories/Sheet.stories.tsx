import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/src/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/src/components/ui/sheet'

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Sheet (drawer) component with glassmorphism styling. Can slide from any side of the screen.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Booking Details</SheetTitle>
          <SheetDescription>
            Review your trip details and confirm your booking.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination</label>
            <p className="text-sm text-fg-muted">Brass Island</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Departure</label>
            <p className="text-sm text-fg-muted">2:00 PM</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Passengers</label>
            <p className="text-sm text-fg-muted">2 Adults</p>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Confirm Booking</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const FromLeft: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open from Left</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Access your dashboard and settings.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Button variant="ghost" className="justify-start">
            Dashboard
          </Button>
          <Button variant="ghost" className="justify-start">
            Bookings
          </Button>
          <Button variant="ghost" className="justify-start">
            Profile
          </Button>
          <Button variant="ghost" className="justify-start">
            Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const FromTop: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open from Top</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have 3 new notifications.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="rounded-md border border-border-default p-3">
            <p className="text-sm">Your booking has been confirmed</p>
            <p className="text-xs text-fg-muted">2 hours ago</p>
          </div>
          <div className="rounded-md border border-border-default p-3">
            <p className="text-sm">New trip available to Twon-Brass</p>
            <p className="text-xs text-fg-muted">5 hours ago</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const FromBottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open from Bottom</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>
            Choose an action to perform.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button variant="outline">New Booking</Button>
          <Button variant="outline">View Trips</Button>
          <Button variant="outline">My Bookings</Button>
          <Button variant="outline">Contact Us</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
}
