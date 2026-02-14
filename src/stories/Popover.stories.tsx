import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/src/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover'

const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Glassmorphism popover with Radix UI. Supports keyboard navigation (Esc to close, Tab for focus trap) and reduced-motion fallback for accessibility.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-semibold text-fg">Booking Options</h4>
          <p className="text-sm text-fg-muted">
            Select your preferred sail time for the trip to Brass Island.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold leading-none text-fg">Dimensions</h4>
            <p className="text-sm text-fg-muted">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="width" className="text-sm">Width</label>
              <input id="width" defaultValue="100%" className="col-span-2 h-8 rounded-md border border-border-default bg-bg-700 px-3 text-sm" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="height" className="text-sm">Height</label>
              <input id="height" defaultValue="25px" className="col-span-2 h-8 rounded-md border border-border-default bg-bg-700 px-3 text-sm" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const WithReducedMotion: Story = {
  ...Default,
  parameters: {
    docs: {
      description: {
        story: 'Tests motion-reduce:backdrop-blur-none and motion-reduce:animate-none classes for users with vestibular motion disorders. The glassmorphism blur effect is disabled when reduced motion is preferred.',
      },
    },
  },
}
