import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card with multiple variants including glassmorphism. Glass variant includes motion-reduce:backdrop-blur-none for accessibility compliance.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'glass', 'bordered', 'flat', 'elevated', 'interactive'],
      description: 'Visual style variant',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    className: 'w-96',
  },
  render: (args: any) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Trip to Brass Island</CardTitle>
        <CardDescription>Departing at 2:00 PM</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-fg-muted">
          Available seats: 42 | Duration: 2.5 hours
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Book Now</Button>
      </CardFooter>
    </Card>
  ),
}

export const Glass: Story = {
  args: {
    variant: 'glass',
    className: 'w-96',
  },
  render: (args: any) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Glassmorphism Card</CardTitle>
        <CardDescription>With backdrop blur effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-fg-muted">
          This card uses glassmorphism styling with backdrop-blur and semi-transparent background.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Learn More</Button>
      </CardFooter>
    </Card>
  ),
}

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    className: 'w-96 cursor-pointer',
  },
  render: (args: any) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover for effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-fg-muted">
          This card has hover and focus states for interactive elements.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Bordered: Story = {
  args: {
    variant: 'bordered',
    className: 'w-96',
  },
  render: (args: any) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Bordered Card</CardTitle>
        <CardDescription>Minimal with border</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-fg-muted">
          Simple card with border styling.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    className: 'w-96',
  },
  render: (args: any) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>With shadow elevation</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-fg-muted">
          Card with prominent shadow for depth.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Flat: Story = {
  args: {
    variant: 'flat',
    className: 'w-96',
  },
  render: (args: any) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Flat Card</CardTitle>
        <CardDescription>Minimal style</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-fg-muted">
          Simple flat card with no border or shadow.
        </p>
      </CardContent>
    </Card>
  ),
}
