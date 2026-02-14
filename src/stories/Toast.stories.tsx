import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/src/components/ui/button'
import { Toast, ToastAction, ToastProvider, ToastViewport } from '@/src/components/ui/toast'
import { useToast } from '@/src/hooks/use-toast'

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toast notifications with glassmorphism styling using Radix UI Toast primitive.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <ToastViewport />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>;

const ToastDemo = () => {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: 'Booking confirmed',
          description: 'Your trip to Brass Island has been booked.',
        })
      }}
    >
      Show Toast
    </Button>
  )
}

export const Default: Story = {
  render: () => <ToastDemo />,
}

const ToastWithActionDemo = () => {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: 'Booking reminder',
          description: 'Your trip is tomorrow at 2:00 PM',
          action: <ToastAction altText="View booking">View</ToastAction>,
        })
      }}
    >
      Show Toast with Action
    </Button>
  )
}

export const WithAction: Story = {
  render: () => <ToastWithActionDemo />,
}

const DestructiveToastDemo = () => {
  const { toast } = useToast()

  return (
    <Button
      variant="destructive"
      onClick={() => {
        toast({
          variant: 'error',
          title: 'Booking failed',
          description: 'There was an error processing your booking.',
        })
      }}
    >
      Show Error Toast
    </Button>
  )
}

export const Destructive: Story = {
  render: () => <DestructiveToastDemo />,
}
