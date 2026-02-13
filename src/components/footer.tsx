'use client'

import { motion } from 'framer-motion'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Platform: [
      { label: 'Search Trips', href: '/search' },
      { label: 'Book Now', href: '/book' },
      { label: 'My Bookings', href: '/bookings' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Safety Guidelines', href: '/safety' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
    Support: [
      { label: 'Help Center', href: '/help' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Report Issue', href: '/report' },
      { label: 'Feedback', href: '/feedback' },
    ],
  }

  return (
    <footer className="bg-[var(--bg-900)] text-[var(--fg-inverse)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-400)] flex items-center justify-center">
                <span className="text-2xl">⛵</span>
              </div>
              <span className="text-2xl font-bold">Blue Waters</span>
            </div>
            <p className="text-[var(--fg-inverse)]/70 mb-6">
              Your trusted partner for safe, convenient, and affordable boat travel across Bayelsa waterways.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-[var(--fg-inverse)]/80 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+234800000000">+234 (0) 800-000-0000</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@bluewaters.com">info@bluewaters.com</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Yenagoa, Bayelsa State, Nigeria</span>
              </div>
            </div>
          </motion.div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <h3 className="font-semibold text-lg mb-4 text-[var(--fg-inverse)]">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[var(--fg-inverse)]/70 hover:text-[var(--accent-400)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-8 border-t border-[var(--fg-inverse)]/10 flex justify-center gap-6"
        >
          <a
            href="#"
            className="text-[var(--fg-inverse)]/70 hover:text-[var(--accent-400)] transition-colors duration-200"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-[var(--fg-inverse)]/70 hover:text-[var(--accent-400)] transition-colors duration-200"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-[var(--fg-inverse)]/70 hover:text-[var(--accent-400)] transition-colors duration-200"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-[var(--fg-inverse)]/70 hover:text-[var(--accent-400)] transition-colors duration-200"
          >
            <Linkedin className="w-6 h-6" />
          </a>
        </motion.div>

        {/* Copyright */}
        <div className="py-6 border-t border-[var(--fg-inverse)]/10 text-center text-[var(--fg-inverse)]/60 text-sm">
          <p>
            © {currentYear} Blue Waters. Ministry of Blue Waters. All rights reserved.
          </p>
          <p className="mt-2">
            Committed to safe, sustainable, and inclusive water transportation in Bayelsa.
          </p>
        </div>
      </div>
    </footer>
  )
}
