/**
 * Operator Trips Management Page
 * 
 * Lists all trips created by the operator with actions to edit, create schedules
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Calendar, Edit, Archive, BarChart3, MapPin } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { useAuth } from '@/src/hooks/use-auth'

interface Trip {
  id: string
  title: string
  description: string
  category: string
  durationMinutes: number
  status: string
  vessel: {
    name: string
    capacity: number
  }
  pricing: {
    minPrice: number
    maxPrice: number
  }
  statistics?: {
    totalBookings: number
    upcomingSchedules: number
    averageRating: number
  }
  createdAt: string
}

export default function OperatorTripsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchTrips()
    }
  }, [user, loading, router])

  const fetchTrips = async () => {
    try {
      setIsLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch('/api/trips?operatorId=' + operatorId)
      // const data = await response.json()
      
      // Mock data for now
      const mockTrips: Trip[] = [
        {
          id: '1',
          title: 'Sunset Bay Tour',
          description: 'Beautiful sunset cruise across the bay',
          category: 'tour',
          durationMinutes: 120,
          status: 'active',
          vessel: { name: 'Ocean Star', capacity: 50 },
          pricing: { minPrice: 5000, maxPrice: 15000 },
          statistics: {
            totalBookings: 45,
            upcomingSchedules: 8,
            averageRating: 4.7,
          },
          createdAt: new Date().toISOString(),
        },
      ]
      setTrips(mockTrips)
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTrips = trips.filter((trip) => {
    if (activeTab === 'all') return true
    return trip.status === activeTab
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      tour: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      transport: 'bg-green-500/10 text-green-500 border-green-500/20',
      charter: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      event: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    }
    return colors[category] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      archived: 'bg-red-500/10 text-red-500 border-red-500/20',
    }
    return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground mt-1">
            Manage your boat trips and schedules
          </p>
        </div>
        <Link href="/operator/trips/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create New Trip
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
            <p className="text-xs text-muted-foreground">
              Active trips available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trips.reduce((sum, t) => sum + (t.statistics?.totalBookings || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all trips
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Schedules</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trips.reduce((sum, t) => sum + (t.statistics?.upcomingSchedules || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled departures
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(trips.reduce((sum, t) => sum + (t.statistics?.averageRating || 0), 0) / trips.length || 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Customer satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Trips</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredTrips.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No trips found</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-sm">
                  {activeTab === 'all' 
                    ? "You haven't created any trips yet. Get started by creating your first trip!"
                    : `No ${activeTab} trips found.`
                  }
                </p>
                {activeTab === 'all' && (
                  <Link href="/operator/trips/new">
                    <Button>Create Your First Trip</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.map((trip) => (
                <Card key={trip.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(trip.category)}>
                        {trip.category}
                      </Badge>
                      <Badge className={getStatusColor(trip.status)}>
                        {trip.status}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {trip.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Vessel:</span>
                        <span className="font-medium">{trip.vessel.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="font-medium">{trip.vessel.capacity} seats</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{trip.durationMinutes} min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Price Range:</span>
                        <span className="font-medium">
                          ₦{trip.pricing.minPrice.toLocaleString()} - ₦{trip.pricing.maxPrice.toLocaleString()}
                        </span>
                      </div>
                      
                      {trip.statistics && (
                        <>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Bookings:</span>
                              <span className="font-medium">{trip.statistics.totalBookings}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Schedules:</span>
                            <span className="font-medium">{trip.statistics.upcomingSchedules}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2 mt-6">
                      <Link href={`/operator/trips/${trip.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/operator/trips/${trip.id}/schedules`} className="flex-1">
                        <Button className="w-full gap-2">
                          <Calendar className="h-4 w-4" />
                          Schedules
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
