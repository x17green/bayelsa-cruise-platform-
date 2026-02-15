'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Icon from '@mdi/react'
import {
  mdiClock,
  mdiMapMarker,
  mdiStar,
  mdiAccountGroup,
  mdiArrowRight,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiFerry,
  mdiCalendar,
  mdiInformation,
  mdiChevronLeft,
  mdiLoading,
} from '@mdi/js'
import { cn } from '@/lib/utils'

// API Response Types
interface ApiTrip {
  id: string
  title: string
  description: string
  category: string | null
  durationMinutes: number
  highlights: string[]
  amenities: string[]
  vessel: {
    id: string
    name: string
    registrationNo: string
    capacity: number
  }
  operator: {
    id: string
    companyName: string
    rating: number | null
    contact: {
      fullName: string
      phone: string
    }
  } | null
  schedules: ApiSchedule[]
  reviews: any[]
  statistics: {
    totalBookings: number
    averageRating: number
    reviewCount: number
    upcomingSchedules: number
  }
  createdAt: string
  updatedAt: string
}

interface ApiSchedule {
  id: string
  startTime: string
  endTime: string
  capacity: number
  bookedSeats: number
  availableSeats: number
  status: string
  bookingsCount: number
}

interface DetailedSchedule extends ApiSchedule {
  departurePort: string
  arrivalPort: string
  priceTiers: Array<{
    id: string
    name: string
    description: string | null
    price: number
    capacity: number | null
  }>
}

export default function TripDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.id as string

  const [trip, setTrip] = useState<ApiTrip | null>(null)
  const [schedules, setSchedules] = useState<DetailedSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(getNextAvailableDate())

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch trip details
        const tripResponse = await fetch(`/api/trips/${tripId}`)
        if (!tripResponse.ok) {
          throw new Error('Failed to fetch trip details')
        }
        const tripData = await tripResponse.json()
        setTrip(tripData.trip)

        // Fetch detailed schedules
        const schedulesResponse = await fetch(`/api/trips/${tripId}/schedules`)
        if (!schedulesResponse.ok) {
          throw new Error('Failed to fetch schedules')
        }
        const schedulesData = await schedulesResponse.json()
        setSchedules(schedulesData.schedules)

      } catch (err) {
        console.error('Error fetching trip data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load trip data')
      } finally {
        setLoading(false)
      }
    }

    if (tripId) {
      fetchTripData()
    }
  }, [tripId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon path={mdiLoading} size={1.33} className="text-muted-foreground animate-spin" aria-hidden={true} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Loading Trip Details...</h1>
        <p className="text-muted-foreground">Please wait while we fetch the latest information.</p>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon path={mdiAlertCircle} size={1.33} className="text-muted-foreground" aria-hidden={true} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Trip Not Found</h1>
        <p className="text-muted-foreground mb-6">
          {error || "The trip you're looking for doesn't exist or has been removed."}
        </p>
        <Button asChild>
          <Link href="/trips">Browse All Trips</Link>
        </Button>
      </div>
    )
  }

  const schedule = schedules.find((s) => s.id === selectedSchedule)

  const handleBookNow = () => {
    if (!selectedSchedule) return
    // Navigate to booking page with trip and schedule info
    router.push(`/book?trip=${trip.id}&schedule=${selectedSchedule}&date=${selectedDate}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-9xl opacity-20">🚢</span>
            </div>
          </div>

          {/* Trip Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon path={mdiStar} size={0.83} className="fill-yellow-400 text-yellow-400" aria-hidden={true} />
                    <span className="font-semibold text-foreground">{trip.statistics.averageRating.toFixed(1)}</span>
                    <span>({trip.statistics.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                <p className="text-3xl font-bold">₦{Math.min(...schedules.flatMap(s => s.priceTiers?.map(pt => pt.price) || [0])).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">per person</p>
              </div>
            </div>

            {/* Route Details */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Route Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Icon path={mdiMapMarker} size={0.83} className="text-green-600 dark:text-green-400" aria-hidden={true} />
                    </div>
                    <div>
                      <p className="font-semibold">Departure Port</p>
                      <p className="text-sm text-muted-foreground">Bayelsa Port</p>
                    </div>
                  </div>
                  <Icon path={mdiArrowRight} size={1} className="text-muted-foreground" aria-hidden={true} />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Icon path={mdiMapMarker} size={0.83} className="text-blue-600 dark:text-blue-400" aria-hidden={true} />
                    </div>
                    <div>
                      <p className="font-semibold">Arrival Port</p>
                      <p className="text-sm text-muted-foreground">Destination Port</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Icon path={mdiClock} size={0.83} className="text-muted-foreground" aria-hidden={true} />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{Math.floor(trip.durationMinutes / 60)}h {trip.durationMinutes % 60}m</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon path={mdiAccountGroup} size={0.83} className="text-muted-foreground" aria-hidden={true} />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="font-semibold">{trip.statistics.totalBookings}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>About This Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{trip.description}</p>
              {trip.highlights.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Highlights:</h4>
                  <ul className="space-y-2">
                    {trip.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Icon path={mdiCheckCircle} size={0.83} className="text-green-600 flex-shrink-0" aria-hidden={true} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vessel Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon path={mdiFerry} size={0.83} className="" aria-hidden={true} />
                Vessel Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-lg mb-1">{trip.vessel.name}</p>
                <p className="text-muted-foreground">Registration: {trip.vessel.registrationNo}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Icon path={mdiAccountGroup} size={0.83} className="text-muted-foreground" aria-hidden={true} />
                  <span>Capacity: {trip.vessel.capacity} passengers</span>
                </div>
              </div>

              {trip.amenities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {trip.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="glass-subtle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon path={mdiCalendar} size={0.83} className="" aria-hidden={true} />
                  Select Schedule
                </CardTitle>
                <CardDescription>
                  Choose your preferred departure time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selector - Mock for now */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Travel Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getNextAvailableDate()}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                {/* Schedule Options */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Departure Time</label>
                  <div className="space-y-2">
                    {schedules.map((schedule) => (
                      <ScheduleOption
                        key={schedule.id}
                        schedule={schedule}
                        isSelected={selectedSchedule === schedule.id}
                        onSelect={() => setSelectedSchedule(schedule.id)}
                      />
                    ))}
                  </div>
                  {schedules.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No schedules available for this trip.
                    </p>
                  )}
                </div>

                {/* Price Summary */}
                {schedule && schedule.priceTiers && schedule.priceTiers.length > 0 && (
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price per person</span>
                      <span className="font-semibold">₦{Math.min(...schedule.priceTiers.map(pt => pt.price)).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Available seats</span>
                      <span className="font-semibold">{schedule.availableSeats}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selectedSchedule}
                  onClick={handleBookNow}
                >
                  {!selectedSchedule ? 'Select a Schedule' : 'Book Now'}
                  <Icon path={mdiArrowRight} size={0.67} className="ml-2" aria-hidden={true} />
                </Button>
                <Alert>
                  <Icon path={mdiInformation} size={0.67} className="" aria-hidden={true} />
                  <AlertDescription className="text-xs">
                    Free cancellation up to 24 hours before departure
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScheduleOption({
  schedule,
  isSelected,
  onSelect,
}: {
  schedule: DetailedSchedule
  isSelected: boolean
  onSelect: () => void
}) {
  const isAvailable = schedule.status === 'scheduled' && schedule.availableSeats > 0
  const isSoldOut = schedule.availableSeats === 0
  const isCancelled = schedule.status === 'cancelled'

  const startTime = new Date(schedule.startTime)
  const endTime = new Date(schedule.endTime)

  return (
    <button
      onClick={onSelect}
      disabled={!isAvailable}
      className={cn(
        'w-full p-3 border rounded-lg text-left transition-all',
        isSelected && 'border-primary bg-primary/5',
        !isAvailable && 'opacity-50 cursor-not-allowed',
        isAvailable && !isSelected && 'hover:border-primary/50'
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold">{startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="text-sm text-muted-foreground">→ {endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{schedule.availableSeats} seats left</span>
        {schedule.availableSeats < 10 && schedule.availableSeats > 0 && (
          <Badge variant="outline" className="border-orange-500 text-orange-600">
            Filling Fast
          </Badge>
        )}
        {isSoldOut && (
          <Badge variant="destructive">Sold Out</Badge>
        )}
        {isCancelled && (
          <Badge variant="secondary">Cancelled</Badge>
        )}
      </div>
      {schedule.priceTiers && schedule.priceTiers.length > 0 && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">From </span>
          <span className="font-semibold">₦{Math.min(...schedule.priceTiers.map(pt => pt.price)).toLocaleString()}</span>
        </div>
      )}
    </button>
  )
}

function getNextAvailableDate() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}
