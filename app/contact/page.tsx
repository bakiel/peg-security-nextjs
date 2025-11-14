'use client'

import React, { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import MobileMenu from '@/components/layout/MobileMenu'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Send,
  CheckCircle2,
  AlertCircle,
  HeadphonesIcon,
  MessageSquare,
} from 'lucide-react'
import Image from 'next/image'

// Form data interface
interface ContactFormData {
  name: string
  email: string
  phone: string
  serviceType: string
  message: string
  preferredContact: 'phone' | 'email' | 'whatsapp'
}

// Form errors interface
interface FormErrors {
  name?: string
  email?: string
  phone?: string
  serviceType?: string
  message?: string
}

export default function ContactPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
    preferredContact: 'email',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  // Service types for dropdown
  const serviceTypes = [
    { value: '', label: 'Select a Service' },
    { value: 'armed-response', label: 'Armed Response' },
    { value: 'manned-security', label: 'Manned Security' },
    { value: 'cctv', label: 'CCTV & Surveillance' },
    { value: 'access-control', label: 'Access Control' },
    { value: 'alarm-systems', label: 'Alarm Systems' },
    { value: 'risk-assessment', label: 'Risk Assessment' },
    { value: 'event-security', label: 'Event Security' },
    { value: 'general-inquiry', label: 'General Inquiry' },
  ]

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    // South African phone number validation (10 digits)
    const phoneRegex = /^0[0-9]{9}$/
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    return phoneRegex.test(cleanPhone)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid South African phone number (10 digits)'
    }

    // Service type validation
    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type'
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle radio button changes
  const handleRadioChange = (value: 'phone' | 'email' | 'whatsapp') => {
    setFormData((prev) => ({ ...prev, preferredContact: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Send to backend API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle validation or server errors
        console.error('Submission error:', data)
        setErrors({ message: data.error || 'An error occurred. Please try again.' })
        setIsSubmitting(false)
        return
      }

      // Success
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceType: '',
          message: '',
          preferredContact: 'email',
        })
      }, 5000)
    } catch (error) {
      console.error('Network error:', error)
      setErrors({ message: 'Network error. Please check your connection and try again.' })
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-onyx">
      {/* Navigation */}
      <Navigation onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Hero Section */}
      <section className="relative pt-hero-top pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/Security_personnel_in_a_parking_lot.jpg"
            alt="Professional security services and support"
            fill
            className="object-cover object-top"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-onyx/90 via-onyx/80 to-onyx/90" />
        </div>
        <div className="container-peg relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="default" size="lg" className="mb-6">
              <Shield className="w-4 h-4" />
              Contact Us
            </Badge>

            <h1 className="font-montserrat font-black text-5xl md:text-7xl text-white mb-6">
              Get In <span className="text-gold">Touch</span>
            </h1>

            <p className="font-poppins text-lg md:text-xl text-grey-light max-w-3xl mx-auto">
              Ready to secure your premises? Contact our expert team for a free consultation
              and discover how we can protect what matters most to you.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Response Banner */}
      <section className="py-8 px-6 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 border-y border-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                <HeadphonesIcon className="w-8 h-8 text-gold" />
              </div>
              <div>
                <Badge variant="danger" size="sm" pulse className="mb-2">
                  24/7 Emergency Hotline
                </Badge>
                <h3 className="font-montserrat font-bold text-2xl text-white">
                  Need Immediate Assistance?
                </h3>
                <p className="text-grey-light">Armed response dispatched within 5 minutes</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+27861234567">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Phone className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Call 086 123 4567
                </Button>
              </a>
              <a href="https://wa.me/27821234567" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<MessageSquare className="w-5 h-5" />}
                  iconPosition="left"
                >
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form - 2 columns */}
            <div className="lg:col-span-2">
              <Card variant="glass" className="p-8 md:p-12">
                <h2 className="font-montserrat font-bold text-3xl text-white mb-4">
                  Request a Quote
                </h2>
                <p className="text-grey-light mb-8">
                  Fill out the form below and our security consultants will contact you within
                  24 hours to discuss your requirements.
                </p>

                {/* Success Message */}
                {isSubmitted && (
                  <div className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-poppins font-semibold text-green-400 mb-1">
                        Message Sent Successfully!
                      </h4>
                      <p className="text-green-300/80 text-sm">
                        Thank you for contacting PEG Security. Our team will respond to your
                        inquiry within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    required
                    error={errors.name}
                    disabled={isSubmitted}
                  />

                  {/* Email and Phone - Side by Side */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.smith@example.com"
                      icon={<Mail className="w-5 h-5" />}
                      required
                      error={errors.email}
                      disabled={isSubmitted}
                    />

                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0821234567"
                      icon={<Phone className="w-5 h-5" />}
                      required
                      error={errors.phone}
                      disabled={isSubmitted}
                    />
                  </div>

                  {/* Service Type Dropdown */}
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-white">
                      Service Type
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className={`
                        w-full px-4 py-3 bg-onyx/50 border rounded-lg
                        text-white
                        transition-all duration-300
                        focus:outline-none focus:ring-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          errors.serviceType
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gold/20 focus:border-gold focus:ring-gold/20'
                        }
                      `}
                      required
                      disabled={isSubmitted}
                    >
                      {serviceTypes.map((service) => (
                        <option key={service.value} value={service.value}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                    {errors.serviceType && (
                      <p className="mt-1 text-sm text-red-500">{errors.serviceType}</p>
                    )}
                  </div>

                  {/* Message Textarea */}
                  <Input
                    label="Message / Requirements"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide details about your security requirements..."
                    isTextarea
                    rows={6}
                    required
                    error={errors.message}
                    disabled={isSubmitted}
                  />

                  {/* Preferred Contact Method */}
                  <div className="w-full">
                    <label className="block mb-3 text-sm font-medium text-white">
                      Preferred Contact Method
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={() => handleRadioChange('email')}
                          className="w-4 h-4 text-gold bg-onyx/50 border-gold/20 focus:ring-gold focus:ring-2"
                          disabled={isSubmitted}
                        />
                        <span className="text-white">Email</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={formData.preferredContact === 'phone'}
                          onChange={() => handleRadioChange('phone')}
                          className="w-4 h-4 text-gold bg-onyx/50 border-gold/20 focus:ring-gold focus:ring-2"
                          disabled={isSubmitted}
                        />
                        <span className="text-white">Phone</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="whatsapp"
                          checked={formData.preferredContact === 'whatsapp'}
                          onChange={() => handleRadioChange('whatsapp')}
                          className="w-4 h-4 text-gold bg-onyx/50 border-gold/20 focus:ring-gold focus:ring-2"
                          disabled={isSubmitted}
                        />
                        <span className="text-white">WhatsApp</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitted}
                    icon={<Send className="w-5 h-5" />}
                  >
                    {isSubmitting ? 'Sending...' : isSubmitted ? 'Sent!' : 'Send Message'}
                  </Button>

                  {/* PSIRA Notice */}
                  <p className="text-xs text-grey-light text-center mt-4">
                    PSIRA Registered Security Company - All consultations are confidential
                  </p>
                </form>
              </Card>
            </div>

            {/* Contact Information Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Office Contact Card */}
              <Card variant="glass" hover>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-white mb-2">Phone</h3>
                    <a
                      href="tel:0130012849"
                      className="text-grey-light hover:text-gold transition-colors block"
                    >
                      013 001 2849
                    </a>
                  </div>
                </div>
              </Card>

              {/* Email Card */}
              <Card variant="glass" hover>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-white mb-2">Email</h3>
                    <a
                      href="mailto:info@pegsecurity.co.za"
                      className="text-grey-light hover:text-gold transition-colors block mb-1"
                    >
                      info@pegsecurity.co.za
                    </a>
                    <p className="text-grey-light/60 text-sm mt-2">
                      General Inquiries
                    </p>
                  </div>
                </div>
              </Card>

              {/* Address Card */}
              <Card variant="glass" hover>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-white mb-2">Address</h3>
                    <p className="text-grey-light leading-relaxed">
                      2 Blesbok Street
                      <br />
                      Uitbreiding 3, Bethal
                      <br />
                      Mpumalanga, 2310
                    </p>
                    <p className="text-grey-light/60 text-sm mt-2">
                      PEG Holdings (Pty) Ltd
                      <br />
                      Reg: 2019/447310/07
                    </p>
                  </div>
                </div>
              </Card>

              {/* Office Hours Card */}
              <Card variant="glass" hover>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-white mb-2">
                      Office Hours
                    </h3>
                    <div className="text-grey-light space-y-1">
                      <p>Monday - Friday: 08:00 - 17:00</p>
                      <p>Saturday: 09:00 - 13:00</p>
                      <p>Sunday: Closed</p>
                      <Badge variant="success" size="sm" pulse className="mt-2">
                        Armed Response: 24/7
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Response Time Card */}
              <Card variant="outlined" className="bg-gradient-to-br from-gold/10 to-gold/5">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-gold flex-shrink-0" />
                  <div>
                    <h3 className="font-poppins font-bold text-white mb-2">
                      Response Time Guarantee
                    </h3>
                    <p className="text-grey-light text-sm mb-3">
                      Our armed response teams are strategically positioned to reach you
                      quickly.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold" />
                        <span className="text-white text-sm">
                          Emergency: &lt;5 minutes
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold" />
                        <span className="text-white text-sm">Quote: Within 24 hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold" />
                        <span className="text-white text-sm">
                          Installation: 3-5 business days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-6 bg-onyx/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-4xl text-white mb-4">
              Visit Our Office
            </h2>
            <p className="text-grey-light max-w-2xl mx-auto">
              Professional security services across Mpumalanga region from our Bethal headquarters
            </p>
          </div>

          {/* Interactive Google Map */}
          <div className="relative h-[500px] rounded-card overflow-hidden border border-gold/20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3576.1234567890!2d29.465!3d-26.461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDI3JzM5LjYiUyAyOcKwMjcnNTQuMCJF!5e0!3m2!1sen!2sza!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PEG Security Office Location - Bethal, Mpumalanga"
            />
          </div>

          {/* Service Area Badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <Badge variant="default">Bethal</Badge>
            <Badge variant="default">Morgenzon</Badge>
            <Badge variant="default">Mpumalanga Region</Badge>
            <Badge variant="default">Gert Sibande District</Badge>
          </div>

          {/* Service Area Cards */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <Card variant="glass" className="text-center">
              <MapPin className="w-10 h-10 text-gold mx-auto mb-4" />
              <h4 className="font-poppins font-semibold text-white mb-2">Headquarters</h4>
              <p className="text-grey-light text-sm">Bethal, Mpumalanga</p>
            </Card>

            <Card variant="glass" className="text-center">
              <Shield className="w-10 h-10 text-gold mx-auto mb-4" />
              <h4 className="font-poppins font-semibold text-white mb-2">PSIRA Registered</h4>
              <p className="text-grey-light text-sm">Reg: 2019/447310/07</p>
            </Card>

            <Card variant="glass" className="text-center">
              <CheckCircle2 className="w-10 h-10 text-gold mx-auto mb-4" />
              <h4 className="font-poppins font-semibold text-white mb-2">BBBEE Certified</h4>
              <p className="text-grey-light text-sm">Transformation Compliant</p>
            </Card>

            <Card variant="glass" className="text-center">
              <Clock className="w-10 h-10 text-gold mx-auto mb-4" />
              <h4 className="font-poppins font-semibold text-white mb-2">24/7 Service</h4>
              <p className="text-grey-light text-sm">Regional Coverage</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-onyx to-onyx/90">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="default" size="lg" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            Professional Security Services
          </Badge>

          <h2 className="font-montserrat font-black text-4xl md:text-5xl text-white mb-6">
            Your Security is Our <span className="text-gold">Priority</span>
          </h2>

          <p className="font-poppins text-lg text-grey-light mb-8 max-w-2xl mx-auto">
            Professional security services for homes, businesses, and communities across South Africa.
            PSIRA registered and fully compliant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+27861234567">
              <Button
                variant="primary"
                size="lg"
                icon={<Phone className="w-5 h-5" />}
                iconPosition="left"
              >
                Call for Free Quote
              </Button>
            </a>
            <a href="/services">
              <Button variant="secondary" size="lg">
                View Our Services
              </Button>
            </a>
          </div>

          <div className="mt-12 p-6 bg-gold/5 border border-gold/20 rounded-lg">
            <p className="text-sm text-grey-light">
              <strong className="text-white">Company Reg:</strong> 2019/447310/07
              <span className="mx-3">|</span>
              <strong className="text-white">PSIRA Registered</strong>
              <span className="mx-3">|</span>
              <strong className="text-white">BBBEE Certified</strong>
              <span className="mx-3">|</span>
              <strong className="text-white">Fully Insured</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
