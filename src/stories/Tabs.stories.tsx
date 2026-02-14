import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/src/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tabs component for organizing content with keyboard navigation support.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="available" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="booked">Booked</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="available">
        <div className="space-y-2 rounded-md border border-border-default p-4">
          <h3 className="font-semibold">Available Trips</h3>
          <p className="text-sm text-fg-muted">
            View all currently available trips and book your seat.
          </p>
          <Button className="mt-4">Browse Trips</Button>
        </div>
      </TabsContent>
      <TabsContent value="booked">
        <div className="space-y-2 rounded-md border border-border-default p-4">
          <h3 className="font-semibold">Your Bookings</h3>
          <p className="text-sm text-fg-muted">
            View and manage your upcoming trip bookings.
          </p>
          <Button variant="outline" className="mt-4">
            View Bookings
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="history">
        <div className="space-y-2 rounded-md border border-border-default p-4">
          <h3 className="font-semibold">Trip History</h3>
          <p className="text-sm text-fg-muted">
            Review your past trips and journeys.
          </p>
          <Button variant="outline" className="mt-4">
            View History
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <div className="space-y-4 rounded-md border border-border-default p-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="h-10 w-full rounded-md border border-border-default bg-bg-700 px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="h-10 w-full rounded-md border border-border-default bg-bg-700 px-3 text-sm"
            />
          </div>
          <Button className="w-full">Login</Button>
        </div>
      </TabsContent>
      <TabsContent value="signup">
        <div className="space-y-4 rounded-md border border-border-default p-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="h-10 w-full rounded-md border border-border-default bg-bg-700 px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              className="h-10 w-full rounded-md border border-border-default bg-bg-700 px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="signup-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              className="h-10 w-full rounded-md border border-border-default bg-bg-700 px-3 text-sm"
            />
          </div>
          <Button className="w-full">Sign Up</Button>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const WithBadges: Story = {
  render: () => (
    <Tabs defaultValue="all" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">
          All
          <span className="ml-2 rounded-full bg-bg-600 px-2 py-0.5 text-xs">
            12
          </span>
        </TabsTrigger>
        <TabsTrigger value="active">
          Active
          <span className="ml-2 rounded-full bg-accent-primary px-2 py-0.5 text-xs">
            3
          </span>
        </TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="space-y-2 rounded-md border border-border-default p-4">
          <p className="text-sm">Showing all 12 trips</p>
        </div>
      </TabsContent>
      <TabsContent value="active">
        <div className="space-y-2 rounded-md border border-border-default p-4">
          <p className="text-sm">Showing 3 active trips</p>
        </div>
      </TabsContent>
      <TabsContent value="completed">
        <div className="space-y-2 rounded-md border border-border-default p-4">
          <p className="text-sm">Showing completed trips</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}
