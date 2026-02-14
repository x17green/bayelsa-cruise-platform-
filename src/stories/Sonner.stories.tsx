import type { Meta, StoryObj } from '@storybook/react'
import { toast } from 'sonner'

import { Button } from '@/src/components/ui/button'
import { Toaster } from '@/src/components/ui/sonner'

const meta = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toast notifications using Sonner library with glassmorphism styling.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.success('Booking confirmed!', {
          description: 'Your trip to Brass Island has been booked.',
        })
      }
    >
      Show Success Toast
    </Button>
  ),
}

export const Error: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.error('Booking failed', {
          description: 'There was an error processing your booking.',
        })
      }
    >
      Show Error Toast
    </Button>
  ),
}

export const Info: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.info('Trip update', {
          description: 'The 2:00 PM trip has been delayed by 15 minutes.',
        })
      }
    >
      Show Info Toast
    </Button>
  ),
}

export const Warning: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.warning('Weather alert', {
          description: 'Strong winds expected. Trip may be rescheduled.',
        })
      }
    >
      Show Warning Toast
    </Button>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast('Booking reminder', {
          description: 'Your trip is tomorrow at 2:00 PM',
          action: {
            label: 'View',
            onClick: () => console.log('View booking'),
          },
        })
      }
    >
      Show Toast with Action
    </Button>
  ),
}

export const Promise: Story = {
  render: () => (
    <Button
      onClick={() => {
        const myPromise: Promise<void> = new (window as any).Promise((resolve: () => void) => setTimeout(resolve, 2000))
        toast.promise(myPromise, {
          loading: 'Processing booking...',
          success: 'Booking confirmed!',
          error: 'Booking failed',
        })
      }}
    >
      Show Promise Toast
    </Button>
  ),
}
