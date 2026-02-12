'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import FeaturedTrips from '@/src/components/featured-trips'
import Footer from '@/src/components/footer'
import Hero from '@/src/components/hero'
import HowItWorks from '@/src/components/how-it-works'
import Testimonials from '@/src/components/testimonials'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20" suppressHydrationWarning>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-primary/10 backdrop-blur-lg border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">⛵</span>
            </div>
            <p className="font-bold text-xl text-primary">Blue Waters</p>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#trips" className="text-foreground/70 hover:text-primary transition-colors">
              Book Now
            </Link>
            <Link href="#how" className="text-foreground/70 hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-foreground/70 hover:text-primary transition-colors">
              Reviews
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Sign In
            </Link>
            <Link href="/signup" className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Featured Trips */}
      <section id="trips" className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Featured Journeys</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Explore the most popular boat trips across the beautiful Bayelsa waterways
          </p>
        </div>
        <FeaturedTrips />
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6"
          >
            Ready to Start Your Journey?
          </motion.h2>
          <p className="text-xl mb-8 text-white/90">
            Book your boat trip today and experience the beauty of Bayelsa waterways
          </p>
          <Link
            href="/book"
            className="inline-block bg-accent text-white px-8 py-3 text-lg font-semibold hover:bg-accent/90 transition-colors rounded-lg"
          >
            Book Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
