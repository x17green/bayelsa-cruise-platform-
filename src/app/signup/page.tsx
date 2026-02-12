'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Input, Card, CardBody, Select, SelectItem, Checkbox } from '@nextui-org/react'
import Link from 'next/link'
import { Mail, Lock, User, Phone } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'customer',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!agreeToTerms) {
      setError('Please agree to terms and conditions')
      setLoading(false)
      return
    }

    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: formData.email,
              full_name: formData.fullName,
              phone: formData.phone,
              user_type: formData.userType,
            },
          ])

        if (profileError) throw profileError

        // Redirect to dashboard or verification page
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold">⛵</span>
            </div>
            <p className="font-bold text-xl text-primary">Blue Waters</p>
          </Link>
          <h1 className="text-4xl font-bold text-primary mb-2">Create Account</h1>
          <p className="text-foreground/60">Join us for amazing boat journeys</p>
        </div>

        {/* Form Card */}
        <Card className="bg-white border border-primary/10 shadow-xl">
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Full Name */}
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                startContent={<User className="w-4 h-4 text-primary" />}
                required
              />

              {/* Email */}
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                startContent={<Mail className="w-4 h-4 text-primary" />}
                required
              />

              {/* Phone */}
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234 (0) 800 000 0000"
                startContent={<Phone className="w-4 h-4 text-primary" />}
              />

              {/* User Type */}
              <Select
                label="I am a"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                defaultSelectedKeys={['customer']}
              >
                <SelectItem key="customer" value="customer">
                  Customer (Book Trips)
                </SelectItem>
                <SelectItem key="operator" value="operator">
                  Boat Operator (List Trips)
                </SelectItem>
              </Select>

              {/* Password */}
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                startContent={<Lock className="w-4 h-4 text-primary" />}
                required
              />

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                startContent={<Lock className="w-4 h-4 text-primary" />}
                required
              />

              {/* Terms Checkbox */}
              <Checkbox
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="text-primary"
              >
                <span className="text-sm text-foreground/70">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline font-semibold">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                </span>
              </Checkbox>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 mt-6"
                size="lg"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t border-primary/10">
              <p className="text-foreground/70 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </main>
  )
}
