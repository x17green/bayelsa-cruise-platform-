'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: 'Amara Okafor',
    role: 'Business Executive',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amara',
    content:
      'Blue Waters has transformed my daily commute. Safe, reliable, and always on time. Highly recommended!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Chisom Ejiofor',
    role: 'Travel Blogger',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chisom',
    content:
      'The sunset cruise was absolutely magical. Great service and professional crew. Worth every naira!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Tunde Adeyemi',
    role: 'Student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde',
    content:
      'Affordable prices, clean boats, and friendly staff. Best way to travel in Bayelsa!',
    rating: 4,
  },
  {
    id: 4,
    name: 'Zainab Hassan',
    role: 'Entrepreneur',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab',
    content:
      'Used their service 20+ times. Never had any issues. Truly a game-changer for water transport.',
    rating: 5,
  },
]

export default function Testimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section id="testimonials" className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Blue Waters for their journeys
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <div className="h-full bg-gradient-to-br from-white to-secondary/20 border border-primary/10 hover:shadow-xl transition-all duration-300 rounded-lg p-6 flex flex-col">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'fill-accent text-accent'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground/80 mb-6 italic leading-relaxed flex-1">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-primary/10">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
