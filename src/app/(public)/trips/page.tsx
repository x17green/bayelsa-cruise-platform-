'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Icon from '@mdi/react'
import { mdiClock, mdiMapMarker, mdiStar, mdiAccountGroup, mdiArrowRight, mdiMagnify } from '@mdi/js'

// Trip interface matching API response
interface Trip {
  id: string
  title: string
  description: string
  category: string
  durationMinutes: number
  highlights: string[]
  amenities: string[]
  pricing: {
    minPrice: number
    maxPrice: number
    tiers: number
  }
  vessel?: {
    id: string
    name: string
    registrationNo: string
    capacity: number
  }
  operator?: {
    id: string
    companyName: string
    rating: number | null
  }
  createdAt: string
}

export default function TripsPage() {
  const [searchFrom, setSearchFrom] = useState('')
  const [searchTo, setSearchTo] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'duration'>('popularity')
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch trips from API
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/trips?includeSchedules=true&limit=50')
        if (!response.ok) {
          throw new Error('Failed to fetch trips')
        }
        const data = await response.json()
        setTrips(data.trips || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trips')
        console.error('Error fetching trips:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  // Filter and sort trips based on current state
  const filteredAndSortedTrips = useMemo(() => {
    let results = [...trips]

    // Apply search filters
    if (searchFrom) {
      results = results.filter(trip =>
        trip.title.toLowerCase().includes(searchFrom.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchFrom.toLowerCase())
      )
    }

    if (searchTo) {
      results = results.filter(trip =>
        trip.title.toLowerCase().includes(searchTo.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchTo.toLowerCase())
      )
    }

    if (maxPrice !== undefined) {
      results = results.filter(trip => trip.pricing.minPrice <= maxPrice)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.pricing.minPrice - b.pricing.minPrice)
        break
      case 'price-high':
        results.sort((a, b) => b.pricing.minPrice - a.pricing.minPrice)
        break
      case 'duration':
        results.sort((a, b) => a.durationMinutes - b.durationMinutes)
        break
      case 'popularity':
      default:
        // For now, sort by creation date (most recent first)
        // TODO: Add popularity score to API
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return results
  }, [trips, searchFrom, searchTo, maxPrice, sortBy])

  const handleClearFilters = () => {
    setSearchFrom('')
    setSearchTo('')
    setMaxPrice(undefined)
    setSortBy('popularity')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <Card className="glass-subtle mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon path={mdiMagnify} size={0.83} className="" aria-hidden={true} />
            Search Trips
          </CardTitle>
          <CardDescription>
            Filter trips by departure, destination, and price
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From */}
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                placeholder="e.g., Yenagoa"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
              />
            </div>

            {/* To */}
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                placeholder="e.g., Port Harcourt"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
              />
            </div>

            {/* Max Price */}
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Max Price (₦)</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="e.g., 10000"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Label htmlFor="sortBy">Sort by:</Label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger id="sortBy" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="duration">Shortest Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={!searchFrom && !searchTo && !maxPrice && sortBy === 'popularity'}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        {loading ? (
          <p className="text-muted-foreground">Loading trips...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : (
          <p className="text-muted-foreground">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} found
          </p>
        )}
      </div>

      {/* Trip Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass-subtle p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-48 bg-muted rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="glass-subtle p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Icon path={mdiMagnify} size={1} className="text-red-600" aria-hidden={true} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Error Loading Trips</h3>
          <p className="text-muted-foreground mb-4">
            {error}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </Card>
      ) : trips.length === 0 ? (
        <Card className="glass-subtle p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Icon path={mdiMagnify} size={1} className="text-muted-foreground" aria-hidden={true} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No trips found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search filters
          </p>
          <Button onClick={handleClearFilters} variant="outline">
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <Card className="glass-card overflow-hidden hover:glass-hover transition-all">
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-cyan-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-6xl opacity-20">🚢</span>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
        <CardDescription className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Icon path={mdiClock} size={0.67} className="" aria-hidden={true} />
            <span>{trip.durationMinutes} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="capitalize">{trip.category}</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rating */}
        {trip.operator?.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Icon path={mdiStar} size={0.67} className="fill-yellow-400 text-yellow-400" aria-hidden={true} />
              <span className="font-semibold">{trip.operator.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {trip.operator.companyName}
            </span>
          </div>
        )}

        {/* Vessel Info */}
        {trip.vessel && (
          <div className="flex items-center gap-2 text-sm">
            <Icon path={mdiAccountGroup} size={0.67} className="text-muted-foreground" aria-hidden={true} />
            <span className="text-muted-foreground">
              {trip.vessel.name} • {trip.vessel.capacity} seats
            </span>
          </div>
        )}

        {/* Amenities */}
        {trip.amenities && trip.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {trip.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {trip.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{trip.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Price */}
        <div className="pt-4 border-t">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-bold">₦{trip.pricing.minPrice.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">per person</span>
          </div>
          {trip.pricing.minPrice !== trip.pricing.maxPrice && (
            <p className="text-sm text-muted-foreground">
              Up to ₦{trip.pricing.maxPrice.toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/trips/${trip.id}`}>
            View Details
            <Icon path={mdiArrowRight} size={0.67} className="ml-2" aria-hidden={true} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
