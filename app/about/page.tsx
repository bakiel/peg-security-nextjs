'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import MobileMenu from '@/components/layout/MobileMenu'
import Tabs, { TabItem } from '@/components/ui/Tabs'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import AnimatedSection from '@/components/animations/AnimatedSection'
import StaggeredGrid from '@/components/animations/StaggeredGrid'
import PageTransition from '@/components/animations/PageTransition'
import { Shield, Award, Users, FileCheck, Heart, CheckCircle, Phone, TrendingUp, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fadeInUp } from '@/lib/animations/variants'

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Company Overview',
      icon: <Shield size={16} />,
      content: <CompanyOverview />
    },
    {
      id: 'story',
      label: 'Our Story',
      icon: <Award size={16} />,
      content: <OurStory />
    },
    {
      id: 'leadership',
      label: 'Leadership Team',
      icon: <Users size={16} />,
      content: <LeadershipTeam />
    },
    {
      id: 'certifications',
      label: 'Certifications',
      icon: <FileCheck size={16} />,
      content: <CertificationsCompliance />
    },
    {
      id: 'community',
      label: 'Community',
      icon: <Heart size={16} />,
      content: <CommunityInvolvement />
    },
    {
      id: 'why-choose',
      label: 'Why Choose Us',
      icon: <CheckCircle size={16} />,
      content: <WhyChooseUs />
    }
  ]

  return (
    <PageTransition>
      <main className="min-h-screen bg-gradient-dark">
        {/* Navigation */}
        <Navigation onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Hero Section */}
        <section className="relative pt-hero-top pb-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/Security_personnel_standing_outdoors.jpg"
              alt="Professional security team standing together"
              fill
              className="object-cover object-top"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-onyx/90 via-onyx/80 to-onyx/90" />
          </div>
          <div className="container-peg relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.1,
                  },
                },
              }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="default" size="md" className="mb-6">
                  <Shield size={16} />
                  About PEG Security
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="font-display text-hero-title font-black text-white leading-hero mb-6"
              >
                Protection Excellence,{' '}
                <span className="text-gold">Elite Service</span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg text-white/80 leading-body max-w-3xl mx-auto"
              >
                Dedicated to providing professional security solutions that exceed industry standards and client expectations across South Africa.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Tabs Section */}
        <AnimatedSection className="section-padding bg-onyx/30">
          <div className="container-peg">
            <Tabs tabs={tabs} variant="underline" defaultTab="overview" />
          </div>
        </AnimatedSection>

        {/* Call to Action */}
        <AnimatedSection className="section-padding bg-gradient-to-b from-onyx to-onyx-light">
          <div className="container-peg">
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-12 text-center">
              <h2 className="font-display text-4xl font-black text-white mb-4">
                Ready to Experience Excellence?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Discover how our professional security solutions can provide peace of mind for your property and loved ones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="primary" size="lg" icon={<Phone size={20} />}>
                    Contact Us Today
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="secondary" size="lg" icon={<Shield size={20} />}>
                    Explore Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Footer */}
        <Footer />
      </main>
    </PageTransition>
  )
}

// Tab Content Components

function CompanyOverview() {
  return (
    <div className="space-y-8">
      <AnimatedSection>
        <h2 className="font-display text-3xl font-black text-white mb-4">
          Professional Security Solutions
        </h2>
        <p className="text-white/80 leading-body mb-6">
          PEG Security delivers professional security services across South Africa. We specialise in providing comprehensive protection solutions that combine advanced technology, trained personnel, and strategic security planning. Our approach integrates industry best practices with modern methodologies to ensure safety and peace of mind.
        </p>
        <p className="text-white/80 leading-body mb-6">
          Operating across major metropolitan areas, we provide 24/7 armed response, VIP protection, K9 security units, and state-of-the-art surveillance systems. Our commitment to excellence is reflected in our professional standards, rigorous training, and industry compliance.
        </p>
        <p className="text-white/80 leading-body">
          We maintain full compliance with industry regulations and hold all necessary certifications, including PSIRA registration and SAIDSA membership. Our operations are underpinned by rigorous training programmes, quality assurance protocols, and continuous improvement initiatives.
        </p>
      </AnimatedSection>

      <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-gold/20">
        <div className="text-center">
          <div className="text-4xl font-black text-gold mb-2">24/7</div>
          <div className="text-white/70 uppercase tracking-nav text-sm">Emergency Response</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-gold mb-2">&lt;5min</div>
          <div className="text-white/70 uppercase tracking-nav text-sm">Response Time</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-gold mb-2">100%</div>
          <div className="text-white/70 uppercase tracking-nav text-sm">PSIRA Compliant</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-gold mb-2">Elite</div>
          <div className="text-white/70 uppercase tracking-nav text-sm">Professional Standards</div>
        </div>
      </StaggeredGrid>

      <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 mt-8">
        <h3 className="font-display text-xl font-bold text-white mb-4">Core Service Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Shield className="text-gold mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-white font-semibold mb-1">Armed Response</h4>
              <p className="text-white/70 text-sm">Rapid deployment teams available around the clock</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="text-gold mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-white font-semibold mb-1">VIP Protection</h4>
              <p className="text-white/70 text-sm">Executive and high-profile individual security</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="text-gold mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-white font-semibold mb-1">K9 Security Units</h4>
              <p className="text-white/70 text-sm">Specialist trained canine detection and patrol teams</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileCheck className="text-gold mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-white font-semibold mb-1">Technology Solutions</h4>
              <p className="text-white/70 text-sm">Advanced CCTV, access control, and monitoring systems</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OurStory() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-black text-white mb-4">
          Built on Excellence
        </h2>
        <p className="text-white/80 leading-body mb-6">
          PEG Security delivers professional, reliable security services that combine traditional security expertise with modern technological solutions. Our focus centres on exceptional service standards, industry compliance, and professional excellence across all operations.
        </p>
        <p className="text-white/80 leading-body mb-6">
          Our foundation is built on core principles of professionalism, integrity, and continuous improvement. Effective security requires more than just physical presence—it demands strategic thinking, advanced technology integration, and a commitment to ongoing training and development. This philosophy guides our operations and shapes our service delivery model.
        </p>
        <p className="text-white/80 leading-body">
          We serve residential, commercial, and industrial sectors across South Africa, maintaining dedication to security excellence. Our commitment to staying at the forefront of industry developments whilst maintaining a professional service approach remains central to our operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gold/20">
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <div className="text-gold font-black text-2xl mb-3">Our Vision</div>
          <p className="text-white/70 text-sm leading-relaxed">
            To be recognised as South Africa&apos;s leading security service provider, setting industry standards for professionalism, innovation, and client satisfaction.
          </p>
        </div>
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <div className="text-gold font-black text-2xl mb-3">Our Mission</div>
          <p className="text-white/70 text-sm leading-relaxed">
            Delivering comprehensive security solutions through highly trained personnel, advanced technology, and unwavering commitment to client protection and peace of mind.
          </p>
        </div>
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <div className="text-gold font-black text-2xl mb-3">Our Values</div>
          <p className="text-white/70 text-sm leading-relaxed">
            Excellence, integrity, professionalism, innovation, accountability, and client-focused service delivery underpin everything we do.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold p-6 rounded">
        <p className="text-white/90 italic text-lg">
          &ldquo;Excellence is not a destination—it&apos;s a continuous journey of improvement, innovation, and unwavering commitment to our clients&apos; safety and security.&rdquo;
        </p>
      </div>
    </div>
  )
}

function LeadershipTeam() {
  return (
    <div className="space-y-12">
      {/* Title Section */}
      <div className="text-center">
        <h2 className="font-display text-4xl font-black text-white mb-3">
          Meet Our Managing Director
        </h2>
        <p className="text-gold text-lg font-semibold">
          Visionary leadership driving South Africa&apos;s premier security force
        </p>
      </div>

      {/* Main Profile Card */}
      <AnimatedSection>
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 md:p-12 hover:border-gold/40 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
            {/* Profile Image */}
            <div className="mx-auto lg:mx-0">
              <div className="relative w-[280px] h-[280px] rounded-card overflow-hidden border-4 border-gold/30">
                <Image
                  src="/images/vusi-zwane.png"
                  alt="Vusi Zwane - Managing Director"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>

            {/* Profile Content */}
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-3xl font-black text-white mb-2">
                  Vusi Zwane
                </h3>
                <p className="text-gold text-xl font-semibold mb-1">
                  Managing Director & Founder
                </p>
                <p className="text-white/60 text-sm">
                  PEG Holdings (Pty) Ltd
                </p>
              </div>

              <div className="h-px bg-gold/20" />

              <p className="text-white/80 leading-relaxed text-lg">
                Leading PEG Security with unwavering commitment to excellence and innovation in South Africa&apos;s security industry. Under visionary leadership, PEG Security has grown to become Mpumalanga&apos;s premier security force.
              </p>

              {/* Contact Information */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="tel:0794139180"
                  className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors group"
                >
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                    <Phone size={18} className="text-gold" />
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Direct Line</div>
                    <div className="font-semibold">079 413 9180</div>
                  </div>
                </a>
                <a
                  href="mailto:vusiz@pegholdings.co.za"
                  className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors group"
                >
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                    <Mail size={18} className="text-gold" />
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Email</div>
                    <div className="font-semibold">vusiz@pegholdings.co.za</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Achievement Cards */}
      <StaggeredGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
            <Award className="text-gold" size={32} />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-3">
            Leadership Excellence
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Guided by professional security industry experience, creating integrated security and construction solutions.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
            <Users className="text-gold" size={32} />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-3">
            Security Excellence
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Professional team of PSIRA certified officers delivering 24/7 protection services across Mpumalanga.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="text-gold" size={32} />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-3">
            Community Focus
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Committed to empowering local communities through professional security services and job creation.
          </p>
        </div>
      </StaggeredGrid>

      {/* Quote Section */}
      <AnimatedSection>
        <div className="bg-gradient-to-r from-gold/10 to-transparent border-2 border-gold/30 rounded-card p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl text-gold/30 mb-4">&ldquo;</div>
            <blockquote className="text-white text-xl md:text-2xl font-semibold leading-relaxed mb-6">
              Excellence in security is not just our business—it&apos;s our promise to every client we serve. We protect what matters most.
            </blockquote>
            <cite className="text-gold text-lg font-semibold not-italic">
              - Vusi Zwane, Managing Director
            </cite>
          </div>
        </div>
      </AnimatedSection>

      {/* Divider */}
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gold/20" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-onyx px-6 text-gold/60 text-sm font-semibold uppercase tracking-wider">
            Leadership Structure
          </span>
        </div>
      </div>

      {/* Organizational Leadership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8">
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
            <Users className="text-gold" size={32} />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-2">Executive Leadership</h3>
          <p className="text-white/70 mb-4 text-sm leading-relaxed">
            Strategic direction and oversight ensuring operational excellence, regulatory compliance, and continuous service improvement across all business units.
          </p>
          <div className="space-y-2">
            <Badge variant="default" size="sm">Strategic Planning</Badge>
            <Badge variant="default" size="sm">Operations Management</Badge>
            <Badge variant="default" size="sm">Quality Assurance</Badge>
          </div>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8">
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
            <Shield className="text-gold" size={32} />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-2">Operations Command</h3>
          <p className="text-white/70 mb-4 text-sm leading-relaxed">
            24/7 operational oversight of all security deployments, emergency response coordination, and tactical decision-making to ensure optimal service delivery.
          </p>
          <div className="space-y-2">
            <Badge variant="default" size="sm">Tactical Operations</Badge>
            <Badge variant="default" size="sm">Response Coordination</Badge>
            <Badge variant="default" size="sm">Field Management</Badge>
          </div>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8">
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
            <Award className="text-gold" size={32} />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-2">Training & Development</h3>
          <p className="text-white/70 mb-4 text-sm leading-relaxed">
            Comprehensive training programmes ensuring all personnel maintain the highest professional standards, technical competencies, and regulatory compliance.
          </p>
          <div className="space-y-2">
            <Badge variant="default" size="sm">Personnel Training</Badge>
            <Badge variant="default" size="sm">Skills Development</Badge>
            <Badge variant="default" size="sm">Certification Management</Badge>
          </div>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8">
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
            <FileCheck className="text-gold" size={32} />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-2">Technology & Innovation</h3>
          <p className="text-white/70 mb-4 text-sm leading-relaxed">
            Leading the integration of advanced security technologies, data analytics, and digital platforms to enhance service effectiveness and client experience.
          </p>
          <div className="space-y-2">
            <Badge variant="default" size="sm">Systems Integration</Badge>
            <Badge variant="default" size="sm">Technology Innovation</Badge>
            <Badge variant="default" size="sm">Digital Solutions</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

function CertificationsCompliance() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-black text-white mb-4">
          Industry Certifications & Regulatory Compliance
        </h2>
        <p className="text-white/80 leading-body mb-6">
          PEG Security maintains full compliance with all relevant South African security industry regulations and holds all required certifications and memberships. Our commitment to regulatory excellence ensures clients receive services that meet or exceed industry standards whilst providing peace of mind regarding legal compliance and professional accountability.
        </p>
        <p className="text-white/80 leading-body">
          We undergo regular audits, maintain comprehensive documentation, and ensure all personnel hold valid qualifications and registrations. This rigorous approach to compliance reflects our dedication to professional excellence and client protection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 text-center">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-gold" size={40} />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-3">PSIRA Registered</h3>
          <Badge variant="success" size="sm" className="mb-4">Active Registration</Badge>
          <p className="text-white/70 text-sm leading-relaxed">
            Full registration with the Private Security Industry Regulatory Authority, ensuring compliance with all legislative requirements and professional standards.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 text-center">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="text-gold" size={40} />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-3">SAIDSA Member</h3>
          <Badge variant="success" size="sm" className="mb-4">Active Membership</Badge>
          <p className="text-white/70 text-sm leading-relaxed">
            Member of the South African Intruder Detection Services Association, demonstrating commitment to industry best practices and professional standards.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 text-center">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheck className="text-gold" size={40} />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-3">B-BBEE Compliant</h3>
          <Badge variant="success" size="sm" className="mb-4">Compliant</Badge>
          <p className="text-white/70 text-sm leading-relaxed">
            Broad-Based Black Economic Empowerment compliance, supporting transformation objectives and economic development initiatives.
          </p>
        </div>
      </div>

      <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 mt-8">
        <h3 className="font-display text-xl font-bold text-white mb-6">Compliance Framework</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-gold font-semibold mb-3 flex items-center gap-2">
              <CheckCircle size={20} />
              Personnel Standards
            </h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>All security personnel hold valid PSIRA registration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>Comprehensive background screening and vetting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>Regular training and skills development programmes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>Ongoing competency assessments and certifications</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold font-semibold mb-3 flex items-center gap-2">
              <CheckCircle size={20} />
              Operational Standards
            </h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>ISO-aligned quality management systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>Documented standard operating procedures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>Regular compliance audits and reviews</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span>Comprehensive incident reporting and analysis</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Accreditation Showcase */}
      <AnimatedSection className="mt-12">
        <div className="text-center mb-8">
          <h3 className="font-display text-2xl font-bold text-white mb-3">
            Certified & Accredited Security Professionals
          </h3>
          <p className="text-white/70 max-w-2xl mx-auto">
            Our team maintains full PSIRA registration, SAIDSA membership, and TSASA accreditation, ensuring the highest standards of professional security services.
          </p>
        </div>

        {/* Three Certification Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PSIRA Certification */}
          <div className="relative rounded-card overflow-hidden border border-gold/30 bg-onyx/50">
            <Image
              src="/images/Security_personnel_with_weapons_1-1.jpg"
              alt="PSIRA Registered Security Personnel"
              width={1200}
              height={1200}
              className="w-full h-auto"
              quality={90}
            />
            <div className="p-4 text-center">
              <Badge variant="success" size="md" className="mb-2">
                <Shield size={16} />
                PSIRA Registered
              </Badge>
              <p className="text-white/60 text-sm">
                Reg: 2019/447310/07
              </p>
            </div>
          </div>

          {/* SAIDSA Certification */}
          <div className="relative rounded-card overflow-hidden border border-gold/30 bg-onyx/50">
            <Image
              src="/images/Armed_men_with_SAIDSA_logo_1-1.jpg"
              alt="SAIDSA Accredited Security Personnel"
              width={1200}
              height={1200}
              className="w-full h-auto"
              quality={90}
            />
            <div className="p-4 text-center">
              <Badge variant="success" size="md" className="mb-2">
                <Award size={16} />
                SAIDSA Member
              </Badge>
              <p className="text-white/60 text-sm">
                Active Membership
              </p>
            </div>
          </div>

          {/* TSASA Certification */}
          <div className="relative rounded-card overflow-hidden border border-gold/30 bg-onyx/50">
            <Image
              src="/images/Three_armed_security_personnel_posing_1-1.jpg"
              alt="TSASA Certified Security Personnel"
              width={1200}
              height={1200}
              className="w-full h-auto"
              quality={90}
            />
            <div className="p-4 text-center">
              <Badge variant="success" size="md" className="mb-2">
                <FileCheck size={16} />
                TSASA Certified
              </Badge>
              <p className="text-white/60 text-sm">
                Tracking & Security
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}

function CommunityInvolvement() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-black text-white mb-4">
          Community Engagement & Social Responsibility
        </h2>
        <p className="text-white/80 leading-body mb-6">
          At PEG Security, we recognise our responsibility extends beyond commercial security services to include meaningful community engagement and social contribution. We actively support initiatives that enhance community safety, provide skills development opportunities, and contribute to broader social development objectives.
        </p>
        <p className="text-white/80 leading-body mb-6">
          Our community involvement reflects our commitment to sustainable business practices and our belief in contributing positively to the communities we serve. Through partnerships with local organisations, educational institutions, and community groups, we work to create lasting positive impact.
        </p>
        <p className="text-white/80 leading-body">
          We maintain ongoing engagement with community policing forums, neighbourhood watch organisations, and local authorities to support collaborative approaches to community safety and crime prevention.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-gold" size={32} />
            <h3 className="font-display text-xl font-bold text-white">Skills Development</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            We provide training and employment opportunities that support skills development and career advancement in the security sector, contributing to economic empowerment and professional development.
          </p>
          <div className="space-y-2">
            <Badge variant="default" size="sm">Training Programmes</Badge>
            <Badge variant="default" size="sm">Career Development</Badge>
            <Badge variant="default" size="sm">Skills Transfer</Badge>
          </div>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-gold" size={32} />
            <h3 className="font-display text-xl font-bold text-white">Community Safety</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Active participation in community safety initiatives, supporting neighbourhood watch programmes, and collaborating with local authorities to enhance overall community security.
          </p>
          <div className="space-y-2">
            <Badge variant="default" size="sm">Community Partnerships</Badge>
            <Badge variant="default" size="sm">Safety Awareness</Badge>
            <Badge variant="default" size="sm">Crime Prevention</Badge>
          </div>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-gold" size={32} />
            <h3 className="font-display text-xl font-bold text-white">Educational Support</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Engagement with educational institutions to provide security awareness training, career guidance, and support for students interested in pursuing careers in the security industry.
          </p>
          <div className="space-y-2">
            <Badge variant="default" size="sm">Youth Development</Badge>
            <Badge variant="default" size="sm">Career Guidance</Badge>
            <Badge variant="default" size="sm">Industry Awareness</Badge>
          </div>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-gold" size={32} />
            <h3 className="font-display text-xl font-bold text-white">Transformation</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Commitment to transformation objectives through B-BBEE compliance, employment equity initiatives, and support for previously disadvantaged individuals entering the security sector.
          </p>
          <div className="space-y-2">
            <Badge variant="default" size="sm">Employment Equity</Badge>
            <Badge variant="default" size="sm">Economic Empowerment</Badge>
            <Badge variant="default" size="sm">Social Development</Badge>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold p-6 rounded mt-8">
        <p className="text-white/90 italic text-lg">
          &ldquo;True security extends beyond individual properties—it encompasses building safer, stronger communities through collaboration, education, and shared responsibility.&rdquo;
        </p>
      </div>
    </div>
  )
}

function WhyChooseUs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-black text-white mb-4">
          Why Choose PEG Security
        </h2>
        <p className="text-white/80 leading-body mb-6">
          Selecting the right security partner is crucial for protecting your assets, property, and loved ones. PEG Security distinguishes itself through unwavering commitment to professional excellence, advanced technological capabilities, and client-focused service delivery that consistently exceeds expectations.
        </p>
        <p className="text-white/80 leading-body">
          Our comprehensive approach combines highly trained personnel, cutting-edge technology, strategic security planning, and 24/7 operational support to deliver security solutions that provide genuine peace of mind and measurable protection outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6 hover:border-gold/40 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Shield className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">Rapid Response</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Sub-5 minute response times across our service areas, ensuring immediate assistance when you need it most. Our strategically positioned teams guarantee rapid deployment.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6 hover:border-gold/40 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Award className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">Trained Professionals</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            All personnel undergo rigorous training, hold valid certifications, and participate in ongoing professional development to maintain elite service standards.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6 hover:border-gold/40 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <FileCheck className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">Full Compliance</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Complete regulatory compliance including PSIRA registration, SAIDSA membership, and B-BBEE compliance, ensuring legitimate and professional service delivery.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6 hover:border-gold/40 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">24/7 Availability</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Round-the-clock operational support, emergency response capability, and dedicated control room monitoring ensure continuous protection and immediate assistance.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6 hover:border-gold/40 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Users className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">Client-Focused</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Personalised security solutions tailored to specific client requirements, with dedicated account management and responsive customer service throughout.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6 hover:border-gold/40 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Heart className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">Advanced Technology</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            State-of-the-art surveillance systems, GPS tracking, mobile applications, and integrated technology platforms enhance service effectiveness and client experience.
          </p>
        </div>
      </div>

      <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 mt-8">
        <h3 className="font-display text-2xl font-bold text-white mb-6 text-center">
          Service Commitment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-gold font-semibold mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              Our Guarantees
            </h4>
            <ul className="space-y-3 text-white/80 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1 font-bold">✓</span>
                <span>Sub-5 minute response times in designated service areas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1 font-bold">✓</span>
                <span>Fully registered and compliant operations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1 font-bold">✓</span>
                <span>Professional, uniformed personnel at all times</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1 font-bold">✓</span>
                <span>24/7 emergency response capability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1 font-bold">✓</span>
                <span>Comprehensive liability insurance coverage</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold font-semibold mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              What Sets Us Apart
            </h4>
            <ul className="space-y-3 text-white/80 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1 font-bold">✓</span>
                <span>Strategic security planning and risk assessment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1 font-bold">✓</span>
                <span>Advanced technology integration and monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1 font-bold">✓</span>
                <span>Specialist K9 units and detection capabilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1 font-bold">✓</span>
                <span>VIP and executive protection expertise</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-1 font-bold">✓</span>
                <span>Transparent communication and reporting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold p-6 rounded mt-8">
        <p className="text-white/90 italic text-lg">
          &ldquo;Excellence is our standard, not our goal. Every client interaction, every response, every service delivery reflects our unwavering commitment to professional security excellence.&rdquo;
        </p>
      </div>
    </div>
  )
}
