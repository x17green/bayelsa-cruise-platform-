'use client'

import { motion } from 'framer-motion'
import { Search, CreditCard, CheckCircle, Ship } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Search Trips',
    description: 'Browse available boat trips based on your route, date, and preferences',
    color: 'from-primary to-blue-600',
  },
  {
    icon: CheckCircle,
    title: 'Select & Book',
    description: 'Choose your preferred trip and secure your seats with just a few clicks',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: CreditCard,
    title: 'Make Payment',
    description: 'Pay securely using various payment methods including cards and mobile money',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: Ship,
    title: 'Set Sail',
    description: 'Check in at your designated time and enjoy your journey across the waters',
    color: 'from-teal-500 to-accent',
  },
]

export default function HowItWorks() {
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
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="how" className="py-20 px-4 md:px-8 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">How It Works</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Booking your next adventure is simple and straightforward
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-4"
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div key={index} variants={itemVariants} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-1/2 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent -z-10 transform translate-y-full" />
                )}

                <div className="h-full bg-white rounded-lg border border-primary/10 hover:shadow-lg transition-shadow p-6 text-center flex flex-col items-center justify-center">
                  {/* Step Number Circle */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <div className="absolute -top-4 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                  <p className="text-foreground/70 text-sm">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
