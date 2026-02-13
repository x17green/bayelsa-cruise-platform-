'use client'

import { motion } from 'framer-motion'
import { Clock, MapPin, Star, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const trips = [
  {
    id: 1,
    name: 'Bayelsa Heritage Cruise',
    route: 'Yenagoa → Nembe',
    price: 5000,
    rating: 4.8,
    reviews: 342,
    duration: '3 hours',
    capacity: 45,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
    tag: 'Popular',
  },
  {
    id: 2,
    name: 'Scenic Waterfront Tour',
    route: 'Yenagoa → Brass',
    price: 6000,
    rating: 4.9,
    reviews: 521,
    duration: '4 hours',
    capacity: 60,
    image: 'https://images.unsplash.com/photo-1745412219587-d9c91c383e14?w=500&h=300&fit=crop',
    tag: 'Best Rated',
  },
  {
    id: 3,
    name: 'Express Commute',
    route: 'Yenagoa → Kaiama',
    price: 3500,
    rating: 4.6,
    reviews: 289,
    duration: '1.5 hours',
    capacity: 80,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop',
    tag: 'Most Booked',
  },
  {
    id: 4,
    name: 'Sunset Luxury Cruise',
    route: 'Yenagoa → Opobo',
    price: 12000,
    rating: 5.0,
    reviews: 156,
    duration: '5 hours',
    capacity: 30,
    image: 'https://images.unsplash.com/photo-1766939367026-5ddcdf16f362?w=500&h=300&fit=crop',
    tag: 'Premium',
  },
]

export default function FeaturedTrips() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {trips.map((trip) => (
        <motion.div key={trip.id} variants={itemVariants}>
          <div className="h-full glass-subtle rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[var(--border)] flex flex-col">
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={trip.image}
                alt={trip.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    trip.tag === 'Premium'
                      ? 'bg-gradient-to-r from-[var(--accent-600)] to-[var(--accent-400)]'
                      : trip.tag === 'Best Rated'
                        ? 'bg-[var(--success-500)]'
                        : trip.tag === 'Most Booked'
                          ? 'bg-[var(--info-500)]'
                          : 'bg-[var(--accent-500)]'
                  }`}
                >
                  {trip.tag}
                </div>
              </div>
            </div>

            <div className="px-4 py-4 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-[var(--accent-500)] mb-2">{trip.name}</h3>

              <div className="space-y-3 mb-4 flex-1">
                <div className="flex items-center gap-2 text-[var(--fg-muted)]">
                  <MapPin className="w-4 h-4 text-[var(--accent-500)]" />
                  <span className="text-sm">{trip.route}</span>
                </div>

                <div className="flex gap-4 text-sm text-[var(--fg-muted)]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-[var(--accent-500)]" />
                    {trip.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-[var(--accent-500)]" />
                    {trip.capacity} seats
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(trip.rating)
                            ? 'fill-[var(--accent-500)] text-[var(--accent-500)]'
                            : 'text-[var(--fg-dim)]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[var(--fg)]">
                    {trip.rating}
                  </span>
                  <span className="text-xs text-[var(--fg-muted)]">
                    ({trip.reviews})
                  </span>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-3 mb-4">
                <div>
                  <span className="text-2xl font-bold text-[var(--accent-500)]">
                    ₦{trip.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-[var(--fg-muted)] ml-1">/person</span>
                </div>
              </div>

              <Link
                href={`/book/${trip.id}`}
                className="w-full bg-gradient-to-r from-[var(--accent-600)] to-[var(--accent-500)] text-white font-semibold py-2 px-4 rounded text-center hover:shadow-md transition-all"
              >
                Book Now
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
