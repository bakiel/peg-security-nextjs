'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import MobileMenu from '@/components/layout/MobileMenu'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import {
  Shield,
  Briefcase,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Heart,
  Award,
  CheckCircle,
  Phone,
  GraduationCap,
  Target,
  Camera,
  FileText,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Job Listing Interface
interface JobListing {
  id: string
  title: string
  category: string
  location: string
  employmentType: string
  psiraRequired: boolean
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
}

// Helper function to parse list strings from API
function parseListString(str: string): string[] {
  if (!str) return []
  return str.split('\n').filter(line => line.trim()).map(line => line.replace(/^[•\-*]\s*/, '').trim())
}

// Categories for filtering
const categories = [
  { value: 'all', label: 'All Positions', icon: <Briefcase size={16} /> },
  { value: 'operations', label: 'Security Operations', icon: <Shield size={16} /> },
  { value: 'management', label: 'Management', icon: <Users size={16} /> },
  { value: 'technology', label: 'Technology', icon: <Camera size={16} /> },
  { value: 'administration', label: 'Administration', icon: <FileText size={16} /> }
]

const locations = [
  { value: 'all', label: 'All Locations' },
  { value: 'Gauteng', label: 'Gauteng' },
  { value: 'Western Cape', label: 'Western Cape' },
  { value: 'Nationwide', label: 'Nationwide' }
]

const employmentTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' }
]

export default function CareersPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('all')
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch jobs from API
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs')
        const result = await response.json()

        if (result.success) {
          // Transform API data to component format
          const transformedJobs: JobListing[] = result.data.map((job: any) => ({
            id: job.id,
            title: job.title,
            category: job.category.toLowerCase().replace(/\s+/g, '-'),
            location: job.location,
            employmentType: job.employment_type,
            psiraRequired: job.psira_required,
            description: job.description,
            responsibilities: parseListString(job.responsibilities),
            requirements: parseListString(job.requirements),
            benefits: parseListString(job.benefits)
          }))

          setJobListings(transformedJobs)
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Filter jobs based on selected filters
  const filteredJobs = useMemo(() => {
    return jobListings.filter(job => {
      const categoryMatch = selectedCategory === 'all' || job.category === selectedCategory
      const locationMatch = selectedLocation === 'all' || job.location === selectedLocation
      const typeMatch = selectedEmploymentType === 'all' || job.employmentType === selectedEmploymentType

      return categoryMatch && locationMatch && typeMatch
    })
  }, [jobListings, selectedCategory, selectedLocation, selectedEmploymentType])

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId)
  }

  return (
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
            src="/images/Security_guard_in_uniform_outdoors.jpg"
            alt="Join our professional security team"
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
              <Briefcase size={16} />
              Join Our Team
            </Badge>
            <h1 className="font-display text-hero-title font-black text-white leading-hero mb-6">
              Build Your Career in{' '}
              <span className="text-gold">Professional Security</span>
            </h1>
            <p className="text-lg text-white/80 leading-body max-w-3xl mx-auto mb-8">
              Join our Mpumalanga-based team committed to excellence, professional development, and making a real difference in regional community safety. We offer competitive benefits, ongoing training, and genuine career advancement opportunities whilst supporting local employment.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="section-padding bg-onyx/30">
        <div className="container-peg">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-black text-white mb-4">
              Why Join PEG Security
            </h2>
            <p className="text-white/80 text-lg leading-body">
              We invest in our people because we know that exceptional service starts with exceptional team members. Build a rewarding career with a company that values professionalism, integrity, and continuous growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Competitive Packages */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Competitive Packages
              </h3>
              <p className="text-white/70 leading-relaxed mb-4">
                Industry-leading salary packages with performance incentives, shift allowances, and comprehensive benefits including medical aid contributions and retirement fund options.
              </p>
              <div className="space-y-2">
                <Badge variant="default" size="sm">Market-Related Salaries</Badge>
                <Badge variant="default" size="sm">Performance Bonuses</Badge>
              </div>
            </div>

            {/* Training & Development */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Training & Development
              </h3>
              <p className="text-white/70 leading-relaxed mb-4">
                Comprehensive training programmes, PSIRA certification support, skills development initiatives, and ongoing professional development opportunities to advance your career.
              </p>
              <div className="space-y-2">
                <Badge variant="default" size="sm">PSIRA Training</Badge>
                <Badge variant="default" size="sm">Skills Development</Badge>
              </div>
            </div>

            {/* Career Advancement */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Career Advancement
              </h3>
              <p className="text-white/70 leading-relaxed mb-4">
                Clear career progression pathways from entry-level positions through to supervisory and management roles. We promote from within and invest in leadership development.
              </p>
              <div className="space-y-2">
                <Badge variant="default" size="sm">Internal Promotion</Badge>
                <Badge variant="default" size="sm">Leadership Training</Badge>
              </div>
            </div>

            {/* Professional Standards */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6">
                <Award className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Professional Standards
              </h3>
              <p className="text-white/70 leading-relaxed mb-4">
                Work for a company that maintains the highest professional standards, full regulatory compliance, and genuine commitment to ethical operations and service excellence.
              </p>
              <div className="space-y-2">
                <Badge variant="success" size="sm">PSIRA Registered</Badge>
                <Badge variant="success" size="sm">Fully Compliant</Badge>
              </div>
            </div>

            {/* Equipment & Resources */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Equipment Provided
              </h3>
              <p className="text-white/70 leading-relaxed mb-4">
                Professional uniforms, communication equipment, and all necessary resources provided. Company vehicles for applicable roles and comprehensive insurance coverage for all personnel.
              </p>
              <div className="space-y-2">
                <Badge variant="default" size="sm">Full Uniform</Badge>
                <Badge variant="default" size="sm">Equipment Supplied</Badge>
              </div>
            </div>

            {/* Diversity & Transformation */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6">
                <Heart className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Diversity & Inclusion
              </h3>
              <p className="text-white/70 leading-relaxed mb-4">
                Committed to employment equity, transformation objectives, and creating inclusive work environments where all team members can thrive and contribute to their full potential.
              </p>
              <div className="space-y-2">
                <Badge variant="default" size="sm">Equal Opportunity</Badge>
                <Badge variant="default" size="sm">B-BBEE Compliant</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings Section */}
      <section className="section-padding bg-onyx/50">
        <div className="container-peg">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-4xl font-black text-white mb-4">
              Current Opportunities
            </h2>
            <p className="text-white/80 text-lg leading-body">
              Explore our current vacancies and find the perfect role to start or advance your security career. Filter by category, location, or employment type to find positions that match your skills and aspirations.
            </p>
          </div>

          {/* Filter Section */}
          <div className="bg-onyx/50 border border-gold/20 rounded-card p-6 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="text-gold" size={24} />
              <h3 className="font-display text-xl font-bold text-white">
                Filter Positions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-3 uppercase tracking-wide">
                  Category
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === category.value
                          ? 'bg-gold/20 border-2 border-gold text-white'
                          : 'bg-onyx/30 border border-gold/10 text-white/70 hover:border-gold/30 hover:bg-onyx/50'
                      }`}
                    >
                      {category.icon}
                      <span className="font-medium">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-3 uppercase tracking-wide">
                  Location
                </label>
                <div className="space-y-2">
                  {locations.map((location) => (
                    <button
                      key={location.value}
                      onClick={() => setSelectedLocation(location.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        selectedLocation === location.value
                          ? 'bg-gold/20 border-2 border-gold text-white'
                          : 'bg-onyx/30 border border-gold/10 text-white/70 hover:border-gold/30 hover:bg-onyx/50'
                      }`}
                    >
                      <MapPin size={16} />
                      <span className="font-medium">{location.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Employment Type Filter */}
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-3 uppercase tracking-wide">
                  Employment Type
                </label>
                <div className="space-y-2">
                  {employmentTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedEmploymentType(type.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        selectedEmploymentType === type.value
                          ? 'bg-gold/20 border-2 border-gold text-white'
                          : 'bg-onyx/30 border border-gold/10 text-white/70 hover:border-gold/30 hover:bg-onyx/50'
                      }`}
                    >
                      <Clock size={16} />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="mt-6 pt-6 border-t border-gold/10">
              <p className="text-white/70 text-center">
                <span className="text-gold font-bold">{filteredJobs.length}</span> position{filteredJobs.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full mb-4" />
                <p className="text-white/60">Loading job opportunities...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-onyx/50 border border-gold/20 rounded-card p-12 text-center">
                <Target className="text-gold/50 mx-auto mb-4" size={48} />
                <h3 className="font-display text-2xl font-bold text-white mb-3">
                  No Positions Found
                </h3>
                <p className="text-white/70 mb-6">
                  No positions match your current filter criteria. Try adjusting your filters or check back soon for new opportunities.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedLocation('all')
                    setSelectedEmploymentType('all')
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-onyx/50 border border-gold/20 rounded-card overflow-hidden hover:border-gold/40 transition-all"
                >
                  {/* Job Header */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-display text-2xl font-bold text-white mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-white/70 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gold" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gold" />
                            <span>{job.employmentType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase size={16} className="text-gold" />
                            <span className="capitalize">{job.category.replace('-', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {job.psiraRequired && (
                          <Badge variant="default" size="sm">
                            <Shield size={14} />
                            PSIRA Required
                          </Badge>
                        )}
                        <Badge variant="info" size="sm">{job.employmentType}</Badge>
                      </div>
                    </div>

                    <p className="text-white/80 leading-relaxed mb-6">
                      {job.description}
                    </p>

                    {/* Expand/Collapse Button */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => toggleJobExpansion(job.id)}
                        icon={expandedJob === job.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      >
                        {expandedJob === job.id ? 'Hide Details' : 'View Full Details'}
                      </Button>
                      <Link href="/contact">
                        <Button variant="primary" size="md" icon={<Phone size={18} />}>
                          Apply Now
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedJob === job.id && (
                    <div className="border-t border-gold/10 bg-onyx/30 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Responsibilities */}
                        <div>
                          <h4 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="text-gold" size={20} />
                            Key Responsibilities
                          </h4>
                          <ul className="space-y-3">
                            {job.responsibilities.map((responsibility, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-white/80 text-sm">{responsibility}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FileText className="text-gold" size={20} />
                            Requirements
                          </h4>
                          <ul className="space-y-3">
                            {job.requirements.map((requirement, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-white/80 text-sm">{requirement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Benefits */}
                        <div>
                          <h4 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Heart className="text-gold" size={20} />
                            Benefits Package
                          </h4>
                          <ul className="space-y-3">
                            {job.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-white/80 text-sm">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Apply CTA */}
                      <div className="mt-8 pt-6 border-t border-gold/10 text-center">
                        <p className="text-white/70 mb-4">
                          Interested in this position? Contact us to submit your application.
                        </p>
                        <Link href="/contact">
                          <Button variant="primary" size="lg" icon={<Phone size={20} />}>
                            Apply for This Position
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="section-padding bg-onyx/30">
        <div className="container-peg">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-black text-white mb-4">
              Application Process
            </h2>
            <p className="text-white/80 text-lg leading-body">
              Our recruitment process is designed to identify candidates who share our commitment to professionalism, integrity, and service excellence. Here&apos;s what to expect when you apply.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Step 1 */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 text-center hover:border-gold/40 transition-all">
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold font-black text-3xl">1</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Submit Application
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Contact us with your CV, qualifications, and PSIRA registration details (if applicable). Include references and relevant certifications.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 text-center hover:border-gold/40 transition-all">
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold font-black text-3xl">2</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Initial Screening
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Our recruitment team reviews applications and conducts initial phone screenings to assess basic qualifications and suitability for available positions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 text-center hover:border-gold/40 transition-all">
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold font-black text-3xl">3</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Interview & Assessment
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Successful candidates attend formal interviews and may undergo skills assessments, psychometric testing, and scenario-based evaluations.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 text-center hover:border-gold/40 transition-all">
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold font-black text-3xl">4</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Verification & Onboarding
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Background checks, reference verification, and vetting processes precede formal job offers. Successful candidates undergo comprehensive onboarding and training.
              </p>
            </div>
          </div>

          {/* Requirements Box */}
          <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold rounded-card p-8">
            <h3 className="font-display text-2xl font-bold text-white mb-6">
              General Application Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gold font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Essential Documents
                </h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Comprehensive CV with employment history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Certified copies of ID and qualifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>PSIRA registration certificate (where applicable)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Valid driver&apos;s licence (for relevant positions)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Minimum two contactable references</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-gold font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Screening Process
                </h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Criminal record and background checks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Reference verification and employment history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Qualification and certification verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Security vetting procedures (where applicable)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Medical assessment for operational roles</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-b from-onyx-light to-onyx">
        <div className="container-peg">
          <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border border-gold/30 rounded-card p-12 text-center">
            <h2 className="font-display text-4xl font-black text-white mb-4">
              Ready to Join Our Team?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto leading-body">
              Take the first step towards a rewarding career in professional security. Contact us today to discuss current opportunities or submit your CV for future positions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="primary" size="lg" icon={<Phone size={20} />}>
                  Contact HR Department
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="lg" icon={<Shield size={20} />}>
                  Learn About Us
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-gold/20">
              <div className="text-center">
                <div className="text-3xl font-black text-gold mb-2">{jobListings.length}+</div>
                <div className="text-white/70 text-sm uppercase tracking-wide">Current Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gold mb-2">100%</div>
                <div className="text-white/70 text-sm uppercase tracking-wide">Training Provided</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gold mb-2">Elite</div>
                <div className="text-white/70 text-sm uppercase tracking-wide">Career Development</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
