'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-background to-secondary/30">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-accent/20 rounded-full filter blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold mb-6 text-primary"
        >
          <span>Sail Across</span>
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Bayelsa Waterways
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-3xl mx-auto"
        >
          Experience the safest, most convenient way to book and enjoy boat trips across beautiful Bayelsa. From scenic cruises to daily commutes, we've got your journey covered.
        </motion.p>

        {/* Search Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-primary/10 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">From</label>
              <div className="flex items-center border border-primary/20 rounded-lg px-3 py-2 bg-white/50">
                <span className="text-primary mr-2">📍</span>
                <input
                  type="text"
                  placeholder="Departure location"
                  className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/40"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">To</label>
              <div className="flex items-center border border-primary/20 rounded-lg px-3 py-2 bg-white/50">
                <span className="text-primary mr-2">📍</span>
                <input
                  type="text"
                  placeholder="Arrival location"
                  className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/40"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Date</label>
              <input
                type="date"
                className="w-full border border-primary/20 rounded-lg px-3 py-2 bg-white/50 text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <Link
            href="/search"
            className="inline-block w-full bg-gradient-to-r from-primary to-accent text-white text-lg font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all text-center"
          >
            Search Trips
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-8 mt-16 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-primary">10K+</div>
            <div className="text-foreground/60">Happy Travelers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-foreground/60">Daily Trips</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-foreground/60">Safe & Verified</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-32 left-10 text-6xl opacity-40"
      >
        🌊
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-32 right-10 text-6xl opacity-40"
      >
        ⛵
      </motion.div>
    </section>
  )
}
