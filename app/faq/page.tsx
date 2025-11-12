'use client'

import React, { useState, useMemo } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import MobileMenu from '@/components/layout/MobileMenu'
import Accordion from '@/components/ui/Accordion'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import {
  HelpCircle,
  Search,
  Phone,
  Mail,
  MessageSquare,
  Shield,
  Radio,
  Camera,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Users,
  Clock,
  FileText,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// FAQ Category Interface
interface FAQCategory {
  id: string
  title: string
  icon: React.ReactNode
  count: number
  faqs: FAQItem[]
}

// FAQ Item Interface
interface FAQItem {
  id: string
  question: string
  answer: string
}

export default function FAQPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // FAQ Data - wrapped in useMemo to prevent re-creation on every render
  const faqCategories: FAQCategory[] = useMemo(() => [
    {
      id: 'general',
      title: 'General Information',
      icon: <HelpCircle size={20} />,
      count: 6,
      faqs: [
        {
          id: 'general-1',
          question: 'What services does PEG Security offer?',
          answer: 'PEG Security provides comprehensive security solutions including 24/7 armed response, manned guarding services, CCTV surveillance systems, access control installations, alarm monitoring, VIP protection, K9 security units, and professional risk assessment consultations. All services are delivered by PSIRA-registered personnel with extensive training and industry experience.',
        },
        {
          id: 'general-2',
          question: 'Are you PSIRA registered and compliant?',
          answer: 'Yes, PEG Security is fully registered with the Private Security Industry Regulatory Authority (PSIRA) and maintains complete compliance with all South African security industry regulations. All our security officers hold valid PSIRA registration cards, and our company adheres to strict operational standards and continuous training requirements.',
        },
        {
          id: 'general-3',
          question: 'What areas do you service?',
          answer: 'We provide security services across Gauteng Province, including Centurion, Pretoria, Johannesburg, Midrand, Sandton, and surrounding areas within a 50km radius of our main operations centre. Our armed response units are strategically positioned to ensure rapid deployment throughout our service areas.',
        },
        {
          id: 'general-4',
          question: 'How long have you been in business?',
          answer: 'PEG Security has established itself as a trusted security provider in the region, building a reputation for professional excellence, reliable service delivery, and client satisfaction. Our team comprises experienced security professionals with backgrounds in law enforcement, military service, and corporate security management.',
        },
        {
          id: 'general-5',
          question: 'What makes you different from other security companies?',
          answer: 'We distinguish ourselves through superior response times (sub-5 minutes for priority zones), advanced technology integration, comprehensive training programmes, transparent operations with GPS-tracked vehicles, and personalised service delivery. Our focus on professional excellence, regulatory compliance, and client communication sets us apart in the security industry.',
        },
        {
          id: 'general-6',
          question: 'Do you offer customised security solutions?',
          answer: 'Absolutely. Every property and situation presents unique security requirements. Our security specialists conduct thorough assessments of your specific needs, analyse risk profiles, and design comprehensive protection strategies tailored to your requirements, budget, and operational constraints.',
        },
      ],
    },
    {
      id: 'armed-response',
      title: 'Armed Response',
      icon: <Radio size={20} />,
      count: 5,
      faqs: [
        {
          id: 'armed-1',
          question: 'What is your guaranteed response time?',
          answer: 'Response times vary by service zone: Priority zones receive sub-5 minute response, standard zones under 8 minutes, and outer zones under 12 minutes. All response vehicles are GPS-tracked, and deployment times are monitored in real-time by our control room to ensure consistent service delivery.',
        },
        {
          id: 'armed-2',
          question: 'How does armed response service work?',
          answer: 'When your alarm is activated or you press your panic button, our control room immediately receives the alert and dispatches the nearest armed response vehicle. Our officers arrive on-site, conduct a thorough security assessment, secure the premises, and contact emergency services if required. You receive real-time updates via our mobile application.',
        },
        {
          id: 'armed-3',
          question: 'What happens when my alarm is triggered?',
          answer: 'Upon alarm activation, our control room verifies the alert, dispatches armed response immediately, contacts you for confirmation, and coordinates with SAPS if criminal activity is detected. Our officers conduct a comprehensive property inspection, provide an incident report, and remain on-site until the property is secured.',
        },
        {
          id: 'armed-4',
          question: 'Do I need a long-term contract for armed response?',
          answer: 'We offer flexible contract options including month-to-month agreements and longer-term contracts with preferential rates. No lengthy lock-in periods are required, though clients who commit to annual contracts benefit from discounted monthly rates and priority service allocation.',
        },
        {
          id: 'armed-5',
          question: 'What equipment is required for armed response service?',
          answer: 'A monitored alarm system with panic buttons is required. If you don\'t have existing equipment, we provide and install compatible alarm systems, panic buttons, and communication devices. Our mobile application also serves as a digital panic button for immediate response activation.',
        },
      ],
    },
    {
      id: 'manned-security',
      title: 'Manned Security',
      icon: <Users size={20} />,
      count: 5,
      faqs: [
        {
          id: 'manned-1',
          question: 'What training do your security officers receive?',
          answer: 'All security officers complete comprehensive PSIRA-accredited training including tactical response, access control, emergency procedures, first aid, conflict resolution, and customer service. Officers undergo regular competency assessments, scenario-based training, and continuous professional development to maintain service excellence.',
        },
        {
          id: 'manned-2',
          question: 'Can I request specific security officers for my site?',
          answer: 'Yes, we accommodate requests for specific officers where operationally feasible. Many clients develop preferred officer relationships, and we endeavour to maintain consistency in officer assignments to ensure familiarity with site-specific protocols, access procedures, and client preferences.',
        },
        {
          id: 'manned-3',
          question: 'What hours and shifts are available for manned security?',
          answer: 'We provide security officers for any schedule required: 24/7 operations, day shifts only, night shifts only, weekend coverage, or custom rotation schedules. Shift patterns are designed to meet your specific operational requirements whilst ensuring officer alertness and effectiveness.',
        },
        {
          id: 'manned-4',
          question: 'How do you screen and vet security personnel?',
          answer: 'Our recruitment process includes comprehensive background checks, criminal record verification, employment history confirmation, reference checks, psychological assessments, and physical fitness evaluations. All officers must hold valid PSIRA registration and undergo probationary periods before permanent placement.',
        },
        {
          id: 'manned-5',
          question: 'What uniforms and equipment do security officers have?',
          answer: 'Officers are provided with professional uniforms, communication radios, torches, incident report books, and personal protective equipment. Armed officers carry licensed firearms with appropriate ammunition. All equipment meets industry standards and is regularly inspected for functionality and compliance.',
        },
      ],
    },
    {
      id: 'technology',
      title: 'Technology & Systems',
      icon: <Camera size={20} />,
      count: 5,
      faqs: [
        {
          id: 'tech-1',
          question: 'What CCTV systems do you install and support?',
          answer: 'We install high-definition IP camera systems from leading manufacturers, featuring 4K resolution, night vision, motion detection, facial recognition, and number plate recognition capabilities. Systems include network video recorders (NVRs), cloud storage options, and mobile viewing applications for remote access.',
        },
        {
          id: 'tech-2',
          question: 'Can I view my cameras remotely from my phone?',
          answer: 'Yes, all our CCTV installations include mobile applications for iOS and Android devices, allowing remote viewing, playback of recorded footage, motion alert notifications, and camera control from anywhere with internet connectivity. Multi-site management is available for clients with multiple properties.',
        },
        {
          id: 'tech-3',
          question: 'What happens if the internet or power fails?',
          answer: 'Our systems include backup battery power supplies (UPS) ensuring continued operation during power outages, and cellular backup connections maintaining alarm communication when primary internet fails. CCTV systems continue recording locally even without internet, with footage uploaded once connectivity is restored.',
        },
        {
          id: 'tech-4',
          question: 'How long is CCTV footage stored and retained?',
          answer: 'Standard retention is 30 days, with options for extended storage periods of 60 or 90 days depending on recording quality settings and storage capacity. Cloud backup options provide additional redundancy and longer retention periods for critical footage or compliance requirements.',
        },
        {
          id: 'tech-5',
          question: 'Do you provide ongoing maintenance for security systems?',
          answer: 'Yes, comprehensive maintenance packages include regular system inspections, software updates, cleaning and adjustment of cameras, battery replacements, functionality testing, and priority technical support. Preventative maintenance ensures optimal system performance and longevity of equipment.',
        },
      ],
    },
    {
      id: 'billing',
      title: 'Billing & Contracts',
      icon: <CreditCard size={20} />,
      count: 5,
      faqs: [
        {
          id: 'billing-1',
          question: 'How does your billing and payment system work?',
          answer: 'Monthly billing is conducted via automated invoicing with payment due on the first of each month. We accept electronic funds transfer (EFT), debit orders, credit card payments, and direct deposits. Invoices are delivered electronically with detailed breakdowns of services and charges.',
        },
        {
          id: 'billing-2',
          question: 'What payment methods do you accept?',
          answer: 'We accept electronic funds transfer (EFT), recurring debit orders, credit and debit card payments, and cash deposits at our offices during business hours. Automatic debit order arrangements are recommended for convenience and to ensure uninterrupted service delivery.',
        },
        {
          id: 'billing-3',
          question: 'Can I cancel my contract anytime?',
          answer: 'Month-to-month contracts require 30 days written notice for cancellation. Annual contracts may include early termination clauses with applicable fees. We encourage clients to discuss any service concerns with our management team before cancellation, as we often can adjust services to better meet changing requirements.',
        },
        {
          id: 'billing-4',
          question: 'Are there setup fees or installation charges?',
          answer: 'Armed response services typically include minimal setup fees covering equipment configuration and system testing. Technology installations (CCTV, access control, alarms) involve installation charges based on system complexity, equipment quantity, and site-specific requirements. Detailed quotations specify all costs upfront.',
        },
        {
          id: 'billing-5',
          question: 'Do you offer discounts for multiple services or properties?',
          answer: 'Yes, we provide discounted rates for clients requiring multiple services (armed response plus CCTV, for example) or securing multiple properties. Annual contracts receive preferential pricing compared to month-to-month arrangements. Volume discounts are available for larger commercial and estate deployments.',
        },
      ],
    },
    {
      id: 'emergency',
      title: 'Emergency & Support',
      icon: <AlertTriangle size={20} />,
      count: 4,
      faqs: [
        {
          id: 'emergency-1',
          question: 'What do I do if I have an emergency after hours?',
          answer: 'Our armed response and emergency services operate 24/7 without interruption. Contact our emergency hotline immediately via phone call, panic button activation, or mobile application alert. Our control room is continuously staffed with experienced operators ready to dispatch assistance instantly.',
        },
        {
          id: 'emergency-2',
          question: 'How do I report a security incident or concern?',
          answer: 'Incidents can be reported via our 24/7 emergency hotline, mobile application incident reporting feature, email to our operations centre, or in person at our offices during business hours. All incidents receive immediate attention, investigation where appropriate, and documented responses.',
        },
        {
          id: 'emergency-3',
          question: 'Do you work with SAPS and other emergency services?',
          answer: 'Yes, we maintain professional relationships with the South African Police Service (SAPS), fire departments, and emergency medical services. Our control room coordinates with these agencies during incidents requiring their involvement, ensuring comprehensive emergency response and proper documentation.',
        },
        {
          id: 'emergency-4',
          question: 'What if I\'m not satisfied with the service provided?',
          answer: 'Client satisfaction is our priority. Concerns should be directed to your account manager or our customer service team immediately. We investigate all complaints thoroughly, take corrective action where necessary, and implement improvements to prevent recurrence. Our management team is committed to resolving issues promptly and professionally.',
        },
      ],
    },
  ], [])

  // Calculate total FAQ count
  const totalFAQCount = useMemo(() => {
    return faqCategories.reduce((total, category) => total + category.faqs.length, 0)
  }, [faqCategories])

  // Filter FAQs based on search query and active category
  const filteredCategories = useMemo(() => {
    if (!searchQuery && !activeCategory) return faqCategories

    return faqCategories
      .map((category) => {
        // If active category filter is set, only include that category
        if (activeCategory && category.id !== activeCategory) return null

        // Filter FAQs based on search query
        const filteredFAQs = category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )

        if (filteredFAQs.length === 0) return null

        return {
          ...category,
          faqs: filteredFAQs,
          count: filteredFAQs.length,
        }
      })
      .filter((category): category is FAQCategory => category !== null)
  }, [searchQuery, activeCategory, faqCategories])

  // Count filtered results
  const filteredCount = useMemo(() => {
    return filteredCategories.reduce((total, category) => total + category.faqs.length, 0)
  }, [filteredCategories])

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('')
    setActiveCategory(null)
  }

  return (
    <main className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <Navigation onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Hero Section */}
      <section className="relative pt-hero-top pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/Armed_security_guards_with_guns.jpg"
            alt="Professional security team and support"
            fill
            className="object-cover object-top"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-onyx/90 via-onyx/80 to-onyx/90" />
        </div>
        <div className="container-peg relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="default" size="md" className="mb-6">
              <HelpCircle size={16} />
              Frequently Asked Questions
            </Badge>
            <h1 className="font-display text-hero-title font-black text-white leading-hero mb-6">
              Questions? We Have{' '}
              <span className="text-gold">Answers</span>
            </h1>
            <p className="text-lg text-white/80 leading-body max-w-3xl mx-auto mb-8">
              Find answers to common questions about our security services, pricing, operations, and support. Can&apos;t find what you&apos;re looking for? Our team is ready to help.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Search FAQs (e.g., 'response time', 'pricing', 'PSIRA')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={20} />}
                className="text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="section-padding bg-onyx/30 border-b border-gold/10">
        <div className="container-peg">
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={activeCategory === null ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveCategory(null)}
              icon={<Shield size={16} />}
            >
              All Categories
            </Button>
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                icon={category.icon}
              >
                {category.title} ({category.count})
              </Button>
            ))}
          </div>

          {/* Results Counter */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              {searchQuery || activeCategory ? (
                <>
                  Showing <span className="text-gold font-semibold">{filteredCount}</span> of{' '}
                  <span className="font-semibold">{totalFAQCount}</span> questions
                  {(searchQuery || activeCategory) && (
                    <button
                      onClick={clearFilters}
                      className="ml-3 text-gold hover:text-gold-light underline transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span className="text-gold font-semibold">{totalFAQCount}</span> questions across{' '}
                  <span className="font-semibold">{faqCategories.length}</span> categories
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories and Accordions */}
      <section className="section-padding bg-onyx/50">
        <div className="container-peg">
          <div className="max-w-5xl mx-auto">
            {filteredCategories.length > 0 ? (
              <div className="space-y-12">
                {filteredCategories.map((category) => (
                  <div key={category.id} id={category.id}>
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center">
                        <span className="text-gold">{category.icon}</span>
                      </div>
                      <div>
                        <h2 className="font-display text-3xl font-black text-white">
                          {category.title}
                        </h2>
                        <p className="text-white/60 text-sm">
                          {category.count} {category.count === 1 ? 'question' : 'questions'}
                        </p>
                      </div>
                    </div>

                    {/* FAQ Accordion */}
                    <Accordion
                      items={category.faqs.map((faq) => ({
                        id: faq.id,
                        title: faq.question,
                        content: <p className="text-white/80 leading-relaxed">{faq.answer}</p>,
                      }))}
                      variant="separated"
                    />
                  </div>
                ))}
              </div>
            ) : (
              // No Results State
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gold/50 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  No Questions Found
                </h3>
                <p className="text-white/70 mb-6">
                  We couldn&apos;t find any FAQs matching &ldquo;{searchQuery}&rdquo;. Try different keywords or
                  browse all categories.
                </p>
                <Button variant="primary" size="md" onClick={clearFilters}>
                  View All Questions
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Topics Quick Links */}
      <section className="section-padding bg-gradient-to-b from-onyx to-onyx-light">
        <div className="container-peg">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-4xl font-black text-white mb-4">
              Popular Topics
            </h2>
            <p className="text-white/80 text-lg leading-body">
              Quick access to our most frequently asked questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Response Time Card */}
            <button
              onClick={() => {
                setActiveCategory('armed-response')
                setSearchQuery('response time')
              }}
              className="bg-onyx/50 border border-gold/20 rounded-card p-6 text-left hover:border-gold/40 hover:-translate-y-1 transition-all group"
            >
              <Zap className="text-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-white font-bold mb-2">Response Time</h3>
              <p className="text-white/70 text-sm">
                Learn about our guaranteed response times and service zones
              </p>
            </button>

            {/* Pricing Card */}
            <button
              onClick={() => {
                setActiveCategory('billing')
                setSearchQuery('pricing')
              }}
              className="bg-onyx/50 border border-gold/20 rounded-card p-6 text-left hover:border-gold/40 hover:-translate-y-1 transition-all group"
            >
              <CreditCard className="text-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-white font-bold mb-2">Pricing & Payment</h3>
              <p className="text-white/70 text-sm">
                Information about billing, payment methods, and contract options
              </p>
            </button>

            {/* PSIRA Card */}
            <button
              onClick={() => {
                setActiveCategory('general')
                setSearchQuery('PSIRA')
              }}
              className="bg-onyx/50 border border-gold/20 rounded-card p-6 text-left hover:border-gold/40 hover:-translate-y-1 transition-all group"
            >
              <Shield className="text-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-white font-bold mb-2">PSIRA Registration</h3>
              <p className="text-white/70 text-sm">
                Our compliance, certifications, and regulatory information
              </p>
            </button>

            {/* Systems Card */}
            <button
              onClick={() => {
                setActiveCategory('technology')
                setSearchQuery('CCTV')
              }}
              className="bg-onyx/50 border border-gold/20 rounded-card p-6 text-left hover:border-gold/40 hover:-translate-y-1 transition-all group"
            >
              <Camera className="text-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-white font-bold mb-2">CCTV & Systems</h3>
              <p className="text-white/70 text-sm">
                Technology installations, remote access, and maintenance
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="section-padding bg-onyx/50">
        <div className="container-peg">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border border-gold/30 rounded-card p-12 text-center">
              <HelpCircle className="w-16 h-16 text-gold mx-auto mb-6" />
              <h2 className="font-display text-4xl font-black text-white mb-4">
                Didn&apos;t Find Your Answer?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto leading-body">
                Our expert security consultants are available to answer any questions about our services, provide detailed quotations, and discuss your specific security requirements.
              </p>

              {/* Contact Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Call */}
                <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
                  <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="text-gold" size={24} />
                  </div>
                  <h3 className="text-white font-bold mb-2">Call Us</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Speak to our team directly
                  </p>
                  <a href="tel:+27861234567">
                    <Button variant="secondary" size="sm" fullWidth>
                      086 123 4567
                    </Button>
                  </a>
                </div>

                {/* Email */}
                <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
                  <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="text-gold" size={24} />
                  </div>
                  <h3 className="text-white font-bold mb-2">Email Us</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Get a detailed response
                  </p>
                  <a href="mailto:info@pegsecurity.co.za">
                    <Button variant="secondary" size="sm" fullWidth>
                      Send Email
                    </Button>
                  </a>
                </div>

                {/* Live Chat */}
                <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
                  <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="text-gold" size={24} />
                  </div>
                  <h3 className="text-white font-bold mb-2">WhatsApp</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Quick chat support
                  </p>
                  <a href="https://wa.me/27821234567" target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm" fullWidth>
                      Chat Now
                    </Button>
                  </a>
                </div>
              </div>

              {/* Primary CTA */}
              <Link href="/contact">
                <Button variant="primary" size="lg" icon={<Phone size={20} />}>
                  Request Free Consultation
                </Button>
              </Link>

              {/* Office Hours */}
              <div className="mt-8 pt-8 border-t border-gold/20">
                <div className="flex items-center justify-center gap-8 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Clock className="text-gold" size={16} />
                    <span>Office Hours: Mon-Fri 08:00-17:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-gold" size={16} />
                    <span>Emergency Response: 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="section-padding bg-gradient-to-b from-onyx-light to-onyx">
        <div className="container-peg">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-4xl font-black text-white mb-4">
              Additional Resources
            </h2>
            <p className="text-white/80 text-lg leading-body">
              Explore more information about our services and company
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Services Overview */}
            <Link href="/services">
              <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 hover:-translate-y-2 transition-all group text-center">
                <Shield className="w-12 h-12 text-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Our Services
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Comprehensive overview of all security solutions we offer
                </p>
                <Badge variant="default" size="sm">View Services</Badge>
              </div>
            </Link>

            {/* About Us */}
            <Link href="/about">
              <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 hover:-translate-y-2 transition-all group text-center">
                <Users className="w-12 h-12 text-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  About PEG Security
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Learn about our company, values, and commitment to excellence
                </p>
                <Badge variant="default" size="sm">Learn More</Badge>
              </div>
            </Link>

            {/* Contact Page */}
            <Link href="/contact">
              <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 hover:-translate-y-2 transition-all group text-center">
                <FileText className="w-12 h-12 text-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Get a Quote
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Request a free consultation and customised security assessment
                </p>
                <Badge variant="default" size="sm">Request Quote</Badge>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
