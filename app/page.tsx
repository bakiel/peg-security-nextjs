'use client'

import React, { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Hero from '@/components/hero/Hero'
import Footer from '@/components/layout/Footer'
import MobileMenu from '@/components/layout/MobileMenu'
import PageTransition from '@/components/animations/PageTransition'
import GalleryFeed from '@/components/gallery/GalleryFeed'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import Image from 'next/image'
import {
  Shield,
  Users,
  Clock,
  Award,
  CheckCircle,
  Eye,
  Radio,
  Lock,
  Camera,
  MapPin,
  Phone,
  ArrowRight
} from 'lucide-react'

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <PageTransition>
      <main className="min-h-screen">
        {/* Navigation */}
        <Navigation onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Hero Section */}
        <Hero />

        {/* Company Introduction */}
        <section className="section-padding bg-gradient-dark">
          <div className="container-peg">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="default" size="md" className="mb-6">
                <Shield size={16} />
                Professional Security Services
              </Badge>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-6">
                Excellence in Security <span className="text-gold">Services</span>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                PEG Security delivers professional, reliable security services across Mpumalanga region. We combine traditional security expertise with modern technological solutions, maintaining full PSIRA compliance and industry certifications whilst serving residential, commercial, and industrial sectors.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/services">
                  <Button variant="primary" size="lg" icon={<Shield className="w-5 h-5" />}>
                    Our Services
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" icon={<Phone className="w-5 h-5" />}>
                    Get a Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Core Services Grid */}
        <section className="section-padding bg-onyx/30">
          <div className="container-peg">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-display text-4xl font-black text-white mb-4">
                Comprehensive Security Solutions
              </h2>
              <p className="text-white/70 text-lg">
                Professional protection services tailored to your specific security requirements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Armed Response */}
              <Card variant="glass" hover className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Armed Response</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  24/7 rapid deployment teams with professional armed officers ready for any security threat
                </p>
                <Link href="/services#armed-response" className="text-gold hover:text-gold/80 text-sm font-semibold inline-flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </Link>
              </Card>

              {/* Manned Security */}
              <Card variant="glass" hover className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Manned Guarding</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Professional security officers for residential estates, commercial properties, and industrial facilities
                </p>
                <Link href="/services#manned-guarding" className="text-gold hover:text-gold/80 text-sm font-semibold inline-flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </Link>
              </Card>

              {/* CCTV & Surveillance */}
              <Card variant="glass" hover className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">CCTV Systems</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Advanced surveillance technology with remote monitoring and 24/7 recording capabilities
                </p>
                <Link href="/services#cctv" className="text-gold hover:text-gold/80 text-sm font-semibold inline-flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </Link>
              </Card>

              {/* Access Control */}
              <Card variant="glass" hover className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Access Control</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Modern entry management systems with biometric technology and visitor registration
                </p>
                <Link href="/services#access-control" className="text-gold hover:text-gold/80 text-sm font-semibold inline-flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </Link>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Link href="/services">
                <Button variant="outline" size="lg">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose PEG Security */}
        <section className="section-padding bg-gradient-dark relative overflow-hidden">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/images/Security_guard_in_uniform.jpg"
              alt="Professional security services"
              fill
              className="object-cover"
            />
          </div>

          {/* Guard Cutout - Right Side */}
          <div className="absolute top-0 right-0 w-96 h-[650px] pointer-events-none hidden lg:block z-0">
            <Image
              src="/images/Armed_security_personnel_in_black.png"
              alt=""
              fill
              className="object-contain object-right-top opacity-70"
              style={{ filter: 'drop-shadow(0 0 40px rgba(208, 185, 109, 0.6))' }}
            />
          </div>

          <div className="container-peg relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-display text-4xl font-black text-white mb-4">
                Why Choose PEG Security
              </h2>
              <p className="text-white/70 text-lg">
                Professional excellence backed by industry compliance and regional expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* PSIRA Compliance */}
              <div className="bg-onyx/50 backdrop-blur-sm border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-bold text-white text-xl mb-3">Fully Compliant</h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  PSIRA registered (Reg: 2019/447310/07), BBBEE certified, and COIDA compliant. All personnel hold valid licenses and undergo regular compliance audits.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default" size="sm">PSIRA</Badge>
                  <Badge variant="default" size="sm">BBBEE</Badge>
                  <Badge variant="default" size="sm">COIDA</Badge>
                </div>
              </div>

              {/* 24/7 Service */}
              <div className="bg-onyx/50 backdrop-blur-sm border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-bold text-white text-xl mb-3">24/7 Availability</h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  Round-the-clock security services with rapid response capabilities. Our professional teams operate continuously to ensure your safety and peace of mind.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default" size="sm">24/7 Monitoring</Badge>
                  <Badge variant="default" size="sm">Rapid Response</Badge>
                </div>
              </div>

              {/* Regional Expertise */}
              <div className="bg-onyx/50 backdrop-blur-sm border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-bold text-white text-xl mb-3">Local Expertise</h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  Based in Bethal, serving Mpumalanga region with deep understanding of local security requirements and community-focused service delivery.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default" size="sm">Mpumalanga</Badge>
                  <Badge variant="default" size="sm">Regional</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section - Vusi Zwane */}
        <section className="py-20 px-6 bg-gradient-to-br from-onyx via-onyx/95 to-gold/10 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

          <div className="container-peg relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Column - Content */}
                <div>
                  <Badge variant="default" size="md" className="mb-4">
                    <Shield size={16} />
                    Executive Leadership
                  </Badge>

                  <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
                    Meet Our <span className="text-gold">Executive Representative</span>
                  </h2>

                  <div className="space-y-4 mb-6">
                    <p className="text-white/80 text-lg leading-relaxed">
                      Under the leadership of <strong className="text-gold">Vusi Z.</strong>, PEG Security delivers professional security excellence throughout the Mpumalanga region.
                    </p>

                    <p className="text-white/70 leading-relaxed">
                      With deep regional expertise and commitment to community safety, our executive team ensures every client receives personalised, professional security solutions tailored to their specific requirements.
                    </p>
                  </div>

                  {/* Contact Info Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-onyx/50 border border-gold/20 rounded-card p-4 hover:border-gold/40 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Direct Line</p>
                          <a href="tel:+27794139180" className="text-white font-semibold hover:text-gold transition-colors">
                            079 413 9180
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="bg-onyx/50 border border-gold/20 rounded-card p-4 hover:border-gold/40 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Location</p>
                          <p className="text-white font-semibold">
                            Bethal, Mpumalanga
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Visual Element */}
                <div className="relative">
                  <div className="relative rounded-card overflow-hidden border-2 border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-8">
                    <div className="text-center">
                      <div className="relative w-48 h-48 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/30 to-gold/10 rounded-full blur-xl" />
                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-gold/40 bg-onyx">
                          <Image
                            src="/images/vusi-zwane.png"
                            alt="Vusi Zwane - Executive Representative"
                            fill
                            className="object-cover object-top"
                            quality={95}
                          />
                        </div>
                      </div>

                      <h3 className="font-display text-3xl font-black text-white mb-2">
                        Vusi Z.
                      </h3>

                      <p className="text-gold font-semibold text-lg mb-4">
                        Executive Representative
                      </p>

                      <p className="text-white/70 text-sm mb-6 max-w-sm mx-auto">
                        Leading PEG Security's regional operations with dedication to professional excellence and community protection
                      </p>

                      <Link href="/contact">
                        <button className="inline-flex items-center gap-2 bg-gold text-onyx px-6 py-3 rounded-full font-semibold hover:bg-gold/90 transition-all hover:scale-105">
                          Contact Executive
                          <ArrowRight size={18} />
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Decorative Quote */}
                  <div className="mt-6 bg-onyx/50 border-l-4 border-gold p-4 rounded-r-card">
                    <p className="text-white/80 italic text-sm">
                      "Professional security excellence through regional expertise and community commitment."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Showcase */}
        <section className="section-padding bg-onyx/30">
          <div className="container-peg">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-display text-4xl font-black text-white mb-4">
                Certified & Accredited
              </h2>
              <p className="text-white/70 text-lg">
                Maintaining the highest industry standards through professional certifications and regulatory compliance
              </p>
            </div>

            {/* Three Certification Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              {/* PSIRA Certification */}
              <div className="relative rounded-card overflow-hidden border border-gold/30">
                <Image
                  src="/images/Security_personnel_with_weapons_1-1.jpg"
                  alt="PSIRA Registered Security Personnel"
                  width={1200}
                  height={1200}
                  className="w-full h-auto"
                  quality={90}
                />
              </div>

              {/* SAIDSA Certification */}
              <div className="relative rounded-card overflow-hidden border border-gold/30">
                <Image
                  src="/images/Armed_men_with_SAIDSA_logo_1-1.jpg"
                  alt="SAIDSA Accredited Security Personnel"
                  width={1200}
                  height={1200}
                  className="w-full h-auto"
                  quality={90}
                />
              </div>

              {/* TSASA Certification */}
              <div className="relative rounded-card overflow-hidden border border-gold/30">
                <Image
                  src="/images/Three_armed_security_personnel_posing_1-1.jpg"
                  alt="TSASA Certified Security Personnel"
                  width={1200}
                  height={1200}
                  className="w-full h-auto"
                  quality={90}
                />
              </div>
            </div>

            {/* Certification Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <Card variant="glass" className="text-center p-6">
                <Award className="w-12 h-12 text-gold mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-1">PSIRA</h4>
                <p className="text-white/60 text-sm">Registered</p>
              </Card>

              <Card variant="glass" className="text-center p-6">
                <CheckCircle className="w-12 h-12 text-gold mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-1">BBBEE</h4>
                <p className="text-white/60 text-sm">Certified</p>
              </Card>

              <Card variant="glass" className="text-center p-6">
                <Shield className="w-12 h-12 text-gold mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-1">SAIDSA</h4>
                <p className="text-white/60 text-sm">Member</p>
              </Card>

              <Card variant="glass" className="text-center p-6">
                <Eye className="w-12 h-12 text-gold mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-1">Insured</h4>
                <p className="text-white/60 text-sm">Fully Covered</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Gallery Feed */}
        <GalleryFeed />

        {/* Final CTA */}
        <section className="py-20 px-6 bg-gradient-to-b from-onyx to-onyx/90">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-montserrat font-black text-4xl md:text-5xl text-white mb-6">
              Protect What Matters Most
            </h2>
            <p className="font-poppins text-lg text-grey-light mb-8 max-w-2xl mx-auto">
              Professional security services for homes, businesses, and communities across Mpumalanga. PSIRA registered and fully compliant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Phone className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Request a Quote
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Shield className="w-5 h-5" />}
                  iconPosition="left"
                >
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </PageTransition>
  )
}
