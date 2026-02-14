import type { Meta, StoryObj } from '@storybook/react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table'

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Table component with proper semantic HTML and accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>;

const trips = [
  {
    id: 'TRP-001',
    destination: 'Brass Island',
    departure: '2:00 PM',
    seats: 42,
    status: 'Available',
  },
  {
    id: 'TRP-002',
    destination: 'Twon-Brass',
    departure: '3:30 PM',
    seats: 18,
    status: 'Available',
  },
  {
    id: 'TRP-003',
    destination: 'Oporoma',
    departure: '4:00 PM',
    seats: 0,
    status: 'Fully Booked',
  },
  {
    id: 'TRP-004',
    destination: 'Brass Island',
    departure: '5:00 PM',
    seats: 35,
    status: 'Available',
  },
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Available trips for today</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Trip ID</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Departure</TableHead>
          <TableHead className="text-right">Available Seats</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trips.map((trip) => (
          <TableRow key={trip.id}>
            <TableCell className="font-medium">{trip.id}</TableCell>
            <TableCell>{trip.destination}</TableCell>
            <TableCell>{trip.departure}</TableCell>
            <TableCell className="text-right">{trip.seats}</TableCell>
            <TableCell>{trip.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

const bookings = [
  {
    bookingId: 'BK-2401',
    passenger: 'John Doe',
    destination: 'Brass Island',
    date: '2026-02-15',
    seats: 2,
    amount: '$45.00',
  },
  {
    bookingId: 'BK-2402',
    passenger: 'Jane Smith',
    destination: 'Twon-Brass',
    date: '2026-02-15',
    seats: 1,
    amount: '$25.00',
  },
  {
    bookingId: 'BK-2403',
    passenger: 'Bob Johnson',
    destination: 'Oporoma',
    date: '2026-02-16',
    seats: 3,
    amount: '$60.00',
  },
]

export const Bookings: Story = {
  render: () => (
    <Table>
      <TableCaption>Recent booking transactions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead>Passenger</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Seats</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.bookingId}>
            <TableCell className="font-medium">{booking.bookingId}</TableCell>
            <TableCell>{booking.passenger}</TableCell>
            <TableCell>{booking.destination}</TableCell>
            <TableCell>{booking.date}</TableCell>
            <TableCell className="text-right">{booking.seats}</TableCell>
            <TableCell className="text-right">{booking.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const Compact: Story = {
  render: () => (
    <Table className="text-sm">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right">Seats</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trips.slice(0, 3).map((trip) => (
          <TableRow key={trip.id}>
            <TableCell className="font-medium">{trip.id}</TableCell>
            <TableCell>{trip.destination}</TableCell>
            <TableCell>{trip.departure}</TableCell>
            <TableCell className="text-right">{trip.seats}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
