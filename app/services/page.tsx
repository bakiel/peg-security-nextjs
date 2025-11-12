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
import {
  Shield,
  Radio,
  Camera,
  Users,
  Lock,
  AlertTriangle,
  Zap,
  FileCheck,
  Phone,
  CheckCircle,
  Clock,
  Target,
  Activity,
  Eye,
  Bell,
  Smartphone,
  Database,
  Settings,
  Award,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fadeInUp } from '@/lib/animations/variants'

// Tab Content Components

function MannedSecurityContent() {
  return (
    <div className="space-y-8 relative">
      <div className="relative z-10">
        <h2 className="font-display text-3xl font-black text-white mb-4">
          Professional Manned Guarding Services
        </h2>
        <p className="text-white/80 leading-body mb-6">
          Our manned security services provide visible, professional presence at your property. Highly trained security officers deliver comprehensive access control, perimeter patrols, visitor management, and immediate incident response. All personnel are PSIRA-registered, uniformed, and equipped to handle diverse security scenarios with professionalism and discretion.
        </p>
        <p className="text-white/80 leading-body">
          We specialise in deploying security officers to residential estates, commercial properties, industrial facilities, construction sites, and special events. Each deployment is tailored to specific site requirements, with officers trained in relevant protocols, emergency procedures, and client-specific security policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Shield className="text-gold" size={24} />
            Static Guarding
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Fixed-position security officers providing access control, visitor management, and perimeter monitoring at designated entry points and strategic locations.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Access control and visitor verification</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>CCTV monitoring and surveillance</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Incident logging and reporting</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Emergency response coordination</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Activity className="text-gold" size={24} />
            Mobile Patrols
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Regular security patrols covering designated routes and checkpoints, providing visible deterrence and comprehensive site monitoring throughout operational hours.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Scheduled perimeter patrols</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Checkpoint verification systems</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Facility inspection and reporting</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Real-time GPS tracking</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Users className="text-gold" size={24} />
            Event Security
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Specialised security teams for corporate events, private functions, conferences, and public gatherings, ensuring guest safety and smooth event operations.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Crowd management and control</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>VIP and guest protection</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Asset and equipment security</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Emergency evacuation procedures</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Target className="text-gold" size={24} />
            Site Security
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Construction site and industrial facility security with specialised protocols for high-risk environments, asset protection, and contractor management.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Equipment and materials protection</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Contractor access management</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Safety compliance monitoring</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Theft prevention protocols</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold p-6 rounded mt-8">
        <h3 className="text-white font-bold mb-2">Service Guarantee</h3>
        <p className="text-white/80 text-sm">
          All manned security personnel undergo rigorous screening, comprehensive training, and regular competency assessments. We guarantee professional, uniformed officers with valid PSIRA registration, equipped with necessary communication devices and emergency response protocols.
        </p>
      </div>
    </div>
  )
}

function ArmedResponseContent() {
  return (
    <div className="space-y-8 relative">
      <div className="relative z-10">
        <h2 className="font-display text-3xl font-black text-white mb-4">
          24/7 Armed Response Services
        </h2>
        <p className="text-white/80 leading-body mb-6">
          Our armed response service provides immediate security intervention across designated service areas. Professional response officers operate 24/7 with GPS-tracked vehicles, advanced communication systems, and direct links to emergency services. All response teams are strategically positioned to ensure sub-5 minute deployment times for priority clients.
        </p>
        <p className="text-white/80 leading-body">
          Armed response services include alarm monitoring, panic button response, property inspections, and proactive security presence. Our control room coordinates all deployments, maintains client communication, and ensures comprehensive incident documentation and follow-up procedures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Radio className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">Emergency Response</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Immediate deployment to alarm activations, panic button alerts, and security emergencies with professional threat assessment and incident resolution.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Bell className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">Alarm Monitoring</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            24/7 monitoring of intrusion detection systems, perimeter alarms, and electronic security devices with instant response protocols.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Eye className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">Property Checks</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Regular property inspections whilst you&apos;re away, including perimeter checks, gate security, and interior patrols as authorised.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Smartphone className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">Mobile Access</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Dedicated mobile application for panic activation, response tracking, incident reports, and direct communication with control room.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Database className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">GPS Tracking</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Real-time GPS tracking of all response vehicles ensures optimal deployment routes and transparent service delivery monitoring.
          </p>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <FileCheck className="text-gold" size={24} />
            </div>
            <h3 className="font-bold text-white">Incident Reporting</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Comprehensive documentation of all callouts, incidents, and security events with detailed reports accessible via client portal.
          </p>
        </div>
      </div>

      <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 mt-8">
        <h3 className="font-display text-xl font-bold text-white mb-6">Response Time Guarantees</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gold/10 rounded-lg">
            <div className="text-3xl font-black text-gold mb-2">&lt;5min</div>
            <div className="text-white font-semibold mb-1">Priority Zones</div>
            <p className="text-white/70 text-sm">High-density residential and commercial areas</p>
          </div>
          <div className="text-center p-4 bg-gold/10 rounded-lg">
            <div className="text-3xl font-black text-gold mb-2">&lt;8min</div>
            <div className="text-white font-semibold mb-1">Standard Zones</div>
            <p className="text-white/70 text-sm">Extended metropolitan service areas</p>
          </div>
          <div className="text-center p-4 bg-gold/10 rounded-lg">
            <div className="text-3xl font-black text-gold mb-2">&lt;12min</div>
            <div className="text-white font-semibold mb-1">Outer Zones</div>
            <p className="text-white/70 text-sm">Semi-rural and peripheral locations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TechnologyContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-black text-white mb-4">
          Advanced Security Technology Solutions
        </h2>
        <p className="text-white/80 leading-body mb-6">
          Our technology solutions integrate cutting-edge security systems with professional monitoring and support services. From high-definition CCTV surveillance to biometric access control, we design, install, and maintain comprehensive electronic security systems tailored to specific property requirements and risk profiles.
        </p>
        <p className="text-white/80 leading-body">
          All systems feature remote access capabilities, mobile monitoring options, and integration with our 24/7 control room operations. We provide full technical support, regular maintenance, and system upgrades to ensure optimal performance and reliability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Camera className="text-gold" size={24} />
            CCTV & Surveillance
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            High-definition IP camera systems with advanced features including facial recognition, number plate recognition, motion detection, and intelligent analytics.
          </p>
          <div className="space-y-2 mb-4">
            <Badge variant="default" size="sm">4K Resolution</Badge>
            <Badge variant="default" size="sm">Night Vision</Badge>
            <Badge variant="default" size="sm">Remote Access</Badge>
            <Badge variant="default" size="sm">Cloud Storage</Badge>
          </div>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Interior and exterior coverage</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Mobile app viewing and playback</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Intelligent motion alerts</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>30-90 day recording retention</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Lock className="text-gold" size={24} />
            Access Control Systems
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Sophisticated access management systems using biometric authentication, smart cards, and digital credentials with comprehensive audit trails and time-based restrictions.
          </p>
          <div className="space-y-2 mb-4">
            <Badge variant="default" size="sm">Biometric</Badge>
            <Badge variant="default" size="sm">Card Access</Badge>
            <Badge variant="default" size="sm">Mobile Credentials</Badge>
            <Badge variant="default" size="sm">Audit Logs</Badge>
          </div>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Multi-site management capability</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Time-zone access restrictions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Real-time access reporting</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Integration with CCTV systems</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <AlertTriangle className="text-gold" size={24} />
            Intrusion Detection
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Advanced alarm systems with multiple detection technologies including PIR sensors, beam detection, vibration sensors, and perimeter protection systems.
          </p>
          <div className="space-y-2 mb-4">
            <Badge variant="default" size="sm">24/7 Monitoring</Badge>
            <Badge variant="default" size="sm">Zone Detection</Badge>
            <Badge variant="default" size="sm">Pet-Friendly</Badge>
          </div>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Perimeter and interior protection</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Wireless and hardwired options</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Mobile arming and disarming</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Backup battery and cellular systems</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Settings className="text-gold" size={24} />
            Integrated Platforms
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Unified security management platforms combining CCTV, access control, intrusion detection, and intercom systems into single, user-friendly interfaces.
          </p>
          <div className="space-y-2 mb-4">
            <Badge variant="default" size="sm">Unified Control</Badge>
            <Badge variant="default" size="sm">Smart Integration</Badge>
            <Badge variant="default" size="sm">Analytics</Badge>
          </div>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Single-platform management</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Cross-system automation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Advanced analytics and reporting</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Cloud-based management options</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold p-6 rounded mt-8">
        <h3 className="text-white font-bold mb-2">Technology Support</h3>
        <p className="text-white/80 text-sm">
          All technology solutions include professional installation, comprehensive user training, ongoing technical support, and regular maintenance schedules. Remote diagnostics and software updates ensure systems remain current with latest security protocols and features.
        </p>
      </div>
    </div>
  )
}

function SpecialistContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-black text-white mb-4">
          Specialist Security Services
        </h2>
        <p className="text-white/80 leading-body mb-6">
          Our specialist services address unique security requirements that demand advanced training, specialised equipment, and expert operational protocols. From K9 detection units to VIP protection details, these services provide enhanced security capabilities for high-risk environments and specialised operational needs.
        </p>
        <p className="text-white/80 leading-body">
          Each specialist service is delivered by extensively trained personnel with relevant certifications and experience in their respective disciplines. We maintain strict operational standards and regulatory compliance across all specialist service offerings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Users className="text-gold" size={24} />
            VIP & Executive Protection
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Professional close protection services for high-profile individuals, executives, and dignitaries. Discreet security presence with advanced threat assessment and counter-surveillance capabilities.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Personal security details (PSDs)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Advance security assessments</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Secure transportation services</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Event security coordination</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Residential security management</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Shield className="text-gold" size={24} />
            K9 Security Units
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Specialist trained canine units for detection, patrol, and security enhancement. Handler and dog teams certified in explosives detection, narcotics detection, and patrol operations.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Patrol and deterrence operations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Explosives detection services</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Narcotics detection capabilities</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Search and detection operations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Event and venue sweeps</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Lock className="text-gold" size={24} />
            Cash-in-Transit Security
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Secure transportation of cash, valuables, and sensitive documents with armoured vehicle support and professional security escort teams trained in high-risk operations.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Armoured vehicle transportation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Armed escort services</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>GPS tracking and monitoring</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Secure collection and delivery</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Insurance coverage included</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <AlertTriangle className="text-gold" size={24} />
            Investigations & Intelligence
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Professional investigation services including surveillance operations, background checks, fraud investigations, and intelligence gathering conducted by experienced investigators.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Covert surveillance operations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Due diligence investigations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Background verification services</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Fraud and theft investigations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Detailed investigation reporting</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold p-6 rounded mt-8">
        <h3 className="text-white font-bold mb-2">Specialist Training & Certification</h3>
        <p className="text-white/80 text-sm">
          All specialist service personnel undergo extensive additional training beyond standard security certifications. Regular competency assessments, scenario-based training, and continuous professional development ensure service excellence across all specialist disciplines.
        </p>
      </div>
    </div>
  )
}

function RiskManagementContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-black text-white mb-4">
          Risk Management & Consultation
        </h2>
        <p className="text-white/80 leading-body mb-6">
          Professional security risk assessment and strategic planning services designed to identify vulnerabilities, assess threats, and develop comprehensive security strategies. Our risk management consultants bring extensive experience in security operations, threat analysis, and strategic security planning.
        </p>
        <p className="text-white/80 leading-body">
          We conduct thorough site assessments, evaluate existing security measures, analyse threat profiles, and develop detailed recommendations for security enhancements. All assessments result in comprehensive reports with prioritised action plans and implementation roadmaps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FileCheck className="text-gold" size={24} />
            Security Assessments
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Comprehensive property and facility security audits examining physical security measures, access control, surveillance coverage, and operational procedures.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Physical security evaluation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Technology systems review</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Procedural protocol analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Vulnerability identification</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Detailed reporting and recommendations</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Target className="text-gold" size={24} />
            Threat Analysis
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Professional evaluation of potential security threats specific to property location, business operations, and individual risk profiles with strategic mitigation planning.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Location-based risk assessment</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Crime pattern analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Business-specific threat profiling</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Risk probability evaluation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Mitigation strategy development</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Settings className="text-gold" size={24} />
            Security Planning
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Strategic security planning services developing comprehensive protection strategies, operational protocols, and emergency response procedures tailored to specific requirements.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Customised security strategies</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Operational procedure development</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Emergency response protocols</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Technology integration planning</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Implementation roadmaps</span>
            </li>
          </ul>
        </div>

        <div className="bg-onyx/50 border border-gold/20 rounded-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Award className="text-gold" size={24} />
            Compliance Auditing
          </h3>
          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            Security compliance reviews ensuring adherence to industry regulations, insurance requirements, and best practice standards with detailed compliance reporting.
          </p>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Regulatory compliance verification</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Insurance requirement assessment</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Industry standard benchmarking</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Gap analysis and remediation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-gold mt-0.5 flex-shrink-0" size={16} />
              <span>Compliance documentation</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 mt-8">
        <h3 className="font-display text-xl font-bold text-white mb-6 text-center">
          Risk Assessment Process
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gold font-black text-2xl">1</span>
            </div>
            <h4 className="text-white font-bold mb-2">Initial Consultation</h4>
            <p className="text-white/70 text-sm">
              Understanding requirements and objectives
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gold font-black text-2xl">2</span>
            </div>
            <h4 className="text-white font-bold mb-2">Site Assessment</h4>
            <p className="text-white/70 text-sm">
              Comprehensive on-site evaluation
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gold font-black text-2xl">3</span>
            </div>
            <h4 className="text-white font-bold mb-2">Analysis & Planning</h4>
            <p className="text-white/70 text-sm">
              Detailed analysis and strategy development
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gold font-black text-2xl">4</span>
            </div>
            <h4 className="text-white font-bold mb-2">Implementation</h4>
            <p className="text-white/70 text-sm">
              Execution and ongoing support
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold p-6 rounded mt-8">
        <h3 className="text-white font-bold mb-2">Professional Consultation</h3>
        <p className="text-white/80 text-sm">
          All risk management services are delivered by experienced security professionals with backgrounds in law enforcement, military service, and corporate security management. Consultations remain confidential and reports are provided exclusively to authorised client personnel.
        </p>
      </div>
    </div>
  )
}

function ServicesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabs: TabItem[] = [
    {
      id: 'manned',
      label: 'Manned Security',
      icon: <Shield size={16} />,
      content: <MannedSecurityContent />
    },
    {
      id: 'armed-response',
      label: 'Armed Response',
      icon: <Radio size={16} />,
      content: <ArmedResponseContent />
    },
    {
      id: 'technology',
      label: 'Technology Solutions',
      icon: <Camera size={16} />,
      content: <TechnologyContent />
    },
    {
      id: 'specialist',
      label: 'Specialist Services',
      icon: <Users size={16} />,
      content: <SpecialistContent />
    },
    {
      id: 'risk',
      label: 'Risk Management',
      icon: <FileCheck size={16} />,
      content: <RiskManagementContent />
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
              src="/images/Armed_security_officer_in_black_gear.jpg"
              alt="Elite armed security services"
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
                  Professional Security Services
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="font-display text-hero-title font-black text-white leading-hero mb-6"
              >
                Comprehensive Security,{' '}
                <span className="text-gold">Elite Protection</span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg text-white/80 leading-body max-w-3xl mx-auto mb-8"
              >
                Industry-leading security solutions tailored to your specific requirements. From 24/7 armed response to advanced surveillance systems, we deliver professional protection that exceeds expectations.
              </motion.p>

              {/* Top CTA */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="primary" size="lg" icon={<Phone size={20} />}>
                    Request a Quote
                  </Button>
                </Link>
                <Link href="#services-overview">
                  <Button variant="secondary" size="lg" icon={<Shield size={20} />}>
                    Explore Services
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

      {/* Core Services Grid */}
      <section id="services-overview" className="section-padding bg-onyx/30">
        <div className="container-peg">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-black text-white mb-4">
              Core Security Services
            </h2>
            <p className="text-white/80 text-lg leading-body">
              Professional security solutions designed to protect what matters most. Each service is delivered by highly trained personnel using industry-leading methodologies and technology.
            </p>
          </AnimatedSection>

          <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" staggerDelay={0.15}>
            {/* Armed Response Card */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
                <Radio className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Armed Response
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                24/7 rapid deployment teams with sub-5 minute response times. Professional armed officers ready to respond to any security threat or emergency situation.
              </p>
              <div className="space-y-2 mb-6">
                <Badge variant="default" size="sm">24/7 Availability</Badge>
                <Badge variant="default" size="sm">Rapid Response</Badge>
                <Badge variant="default" size="sm">GPS Tracking</Badge>
              </div>
              <Link href="/contact">
                <Button variant="secondary" size="md" className="w-full" icon={<Phone size={18} />}>
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* Manned Guarding Card */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
                <Shield className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Manned Guarding
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Professional security officers deployed to your premises. Comprehensive access control, patrols, and visible deterrent services for residential, commercial, and industrial sites.
              </p>
              <div className="space-y-2 mb-6">
                <Badge variant="default" size="sm">PSIRA Registered</Badge>
                <Badge variant="default" size="sm">Uniformed Officers</Badge>
                <Badge variant="default" size="sm">Site Patrols</Badge>
              </div>
              <Link href="/contact">
                <Button variant="secondary" size="md" className="w-full" icon={<Phone size={18} />}>
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* CCTV & Surveillance Card */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
                <Camera className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                CCTV & Surveillance
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Advanced IP camera systems with remote monitoring capabilities. HD recording, motion detection, night vision, and mobile access for comprehensive visual security.
              </p>
              <div className="space-y-2 mb-6">
                <Badge variant="default" size="sm">HD Recording</Badge>
                <Badge variant="default" size="sm">Remote Access</Badge>
                <Badge variant="default" size="sm">24/7 Monitoring</Badge>
              </div>
              <Link href="/contact">
                <Button variant="secondary" size="md" className="w-full" icon={<Phone size={18} />}>
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* VIP Protection Card */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
                <Users className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                VIP Protection
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Executive and high-profile individual protection services. Discreet, professional close protection officers with advanced training in threat assessment and evasive driving.
              </p>
              <div className="space-y-2 mb-6">
                <Badge variant="default" size="sm">Close Protection</Badge>
                <Badge variant="default" size="sm">Discreet Service</Badge>
                <Badge variant="default" size="sm">Risk Assessment</Badge>
              </div>
              <Link href="/contact">
                <Button variant="secondary" size="md" className="w-full" icon={<Phone size={18} />}>
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* Access Control Card */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
                <Lock className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Access Control
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Biometric and card-based access control systems. Restrict and monitor entry points with advanced authentication technology and comprehensive audit trails.
              </p>
              <div className="space-y-2 mb-6">
                <Badge variant="default" size="sm">Biometric Systems</Badge>
                <Badge variant="default" size="sm">Card Access</Badge>
                <Badge variant="default" size="sm">Audit Logs</Badge>
              </div>
              <Link href="/contact">
                <Button variant="secondary" size="md" className="w-full" icon={<Phone size={18} />}>
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* Risk Consultation Card */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
                <FileCheck className="text-gold" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Risk Consultation
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Professional security assessments and strategic planning. Identify vulnerabilities, develop mitigation strategies, and implement comprehensive security protocols.
              </p>
              <div className="space-y-2 mb-6">
                <Badge variant="default" size="sm">Threat Assessment</Badge>
                <Badge variant="default" size="sm">Security Audits</Badge>
                <Badge variant="default" size="sm">Strategic Planning</Badge>
              </div>
              <Link href="/contact">
                <Button variant="secondary" size="md" className="w-full" icon={<Phone size={18} />}>
                  Get Quote
                </Button>
              </Link>
            </div>
          </StaggeredGrid>

          {/* Mid-page CTA */}
          <AnimatedSection>
            <div className="bg-gradient-to-r from-gold/10 to-transparent border-l-4 border-gold p-8 rounded-card text-center">
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Need a Customised Security Solution?
              </h3>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Every property and situation is unique. Our security specialists will assess your specific requirements and design a comprehensive protection strategy tailored to your needs.
              </p>
              <Link href="/contact">
                <Button variant="primary" size="lg" icon={<Phone size={20} />}>
                  Request Free Consultation
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Detailed Service Categories - Tabs */}
      <AnimatedSection className="section-padding bg-onyx/50">
        <div className="container-peg">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-4xl font-black text-white mb-4">
              Service Categories
            </h2>
            <p className="text-white/80 text-lg leading-body">
              Explore our comprehensive range of security services. Each category includes specialised solutions designed to address specific security challenges and requirements.
            </p>
          </div>

          <Tabs tabs={tabs} variant="underline" defaultTab="manned" />
        </div>
      </AnimatedSection>

      {/* Service Tiers Section */}
      <AnimatedSection className="section-padding bg-gradient-to-b from-onyx to-onyx-light">
        <div className="container-peg">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-black text-white mb-4">
              Service Tiers
            </h2>
            <p className="text-white/80 text-lg leading-body">
              Choose the level of protection that matches your security requirements. All tiers include 24/7 support and PSIRA-compliant operations.
            </p>
          </div>

          <StaggeredGrid className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Essential Tier */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
              <div className="text-center mb-6">
                <Badge variant="default" size="md" className="mb-4">Essential</Badge>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  Basic Protection
                </h3>
                <p className="text-white/70 text-sm">
                  Fundamental security services for residential and small commercial properties
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-gold font-semibold text-sm uppercase tracking-wide">Includes:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">24/7 armed response services</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Panic button and alarm monitoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Standard response times (&lt;10 min)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Basic incident reporting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Mobile app access</span>
                  </li>
                </ul>
              </div>

              <Link href="/contact" className="block">
                <Button variant="secondary" size="md" className="w-full" icon={<Phone size={18} />}>
                  Get Pricing
                </Button>
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-onyx/50 border-2 border-gold rounded-card p-8 relative hover:shadow-gold-hover transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge variant="success" size="md">Most Popular</Badge>
              </div>

              <div className="text-center mb-6">
                <Badge variant="default" size="md" className="mb-4">Premium</Badge>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  Enhanced Security
                </h3>
                <p className="text-white/70 text-sm">
                  Comprehensive protection for medium to large properties and businesses
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-gold font-semibold text-sm uppercase tracking-wide">Everything in Essential, plus:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Priority response (&lt;5 min)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">CCTV system integration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Quarterly security assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Advanced reporting and analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Regular site inspections</span>
                  </li>
                </ul>
              </div>

              <Link href="/contact" className="block">
                <Button variant="primary" size="md" className="w-full" icon={<Phone size={18} />}>
                  Get Pricing
                </Button>
              </Link>
            </div>

            {/* Elite Tier */}
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-8 hover:border-gold/40 transition-all">
              <div className="text-center mb-6">
                <Badge variant="default" size="md" className="mb-4">Elite</Badge>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  Complete Protection
                </h3>
                <p className="text-white/70 text-sm">
                  Premium security for high-risk properties, estates, and corporate facilities
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-gold font-semibold text-sm uppercase tracking-wide">Everything in Premium, plus:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Dedicated response unit</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">K9 patrol integration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">24/7 control room monitoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">VIP protection available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Customised security protocols</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-white/80 text-sm">Executive consultation services</span>
                  </li>
                </ul>
              </div>

              <Link href="/contact" className="block">
                <Button variant="secondary" size="md" className="w-full" icon={<Phone size={18} />}>
                  Get Pricing
                </Button>
              </Link>
            </div>
          </StaggeredGrid>

          {/* Custom Solutions CTA */}
          <div className="mt-12 text-center bg-onyx/50 border border-gold/20 rounded-card p-8">
            <h3 className="font-display text-xl font-bold text-white mb-3">
              Need a Custom Solution?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              We specialise in designing bespoke security solutions for unique requirements. Contact us to discuss your specific needs and receive a tailored proposal.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg" icon={<Phone size={20} />}>
                Discuss Custom Requirements
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Why Choose Our Services */}
      <section className="section-padding bg-onyx/30">
        <div className="container-peg">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-black text-white mb-4">
              Why Choose Our Services
            </h2>
            <p className="text-white/80 text-lg leading-body">
              Professional excellence, advanced technology, and unwavering commitment to your security distinguish our service delivery from industry competitors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-onyx/50 border border-gold/20 rounded-card p-6 text-center hover:border-gold/40 transition-all">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-gold" size={32} />
              </div>
              <h3 className="text-white font-bold mb-2">24/7 Availability</h3>
              <p className="text-white/70 text-sm">
                Round-the-clock operations with constant readiness for emergency response
              </p>
            </div>

            <div className="bg-onyx/50 border border-gold/20 rounded-card p-6 text-center hover:border-gold/40 transition-all">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-gold" size={32} />
              </div>
              <h3 className="text-white font-bold mb-2">Rapid Response</h3>
              <p className="text-white/70 text-sm">
                Sub-5 minute deployment ensuring immediate assistance when needed
              </p>
            </div>

            <div className="bg-onyx/50 border border-gold/20 rounded-card p-6 text-center hover:border-gold/40 transition-all">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-gold" size={32} />
              </div>
              <h3 className="text-white font-bold mb-2">PSIRA Certified</h3>
              <p className="text-white/70 text-sm">
                Fully registered and compliant with all regulatory requirements
              </p>
            </div>

            <div className="bg-onyx/50 border border-gold/20 rounded-card p-6 text-center hover:border-gold/40 transition-all">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-gold" size={32} />
              </div>
              <h3 className="text-white font-bold mb-2">Professional Standards</h3>
              <p className="text-white/70 text-sm">
                Compliance-focused service delivery and quality assurance protocols
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-b from-onyx-light to-onyx relative overflow-hidden">
        {/* Security Guard Cutout - Left Side Overlay */}
        <div className="absolute -left-20 bottom-20 w-80 h-[650px] pointer-events-none hidden xl:block z-0">
          <Image
            src="/images/Armed_security_officer_with_rifle.png"
            alt=""
            fill
            className="object-contain object-left-bottom opacity-50"
            style={{ filter: 'drop-shadow(0 0 40px rgba(208, 185, 109, 0.6))' }}
          />
        </div>

        <div className="container-peg relative z-10">
          <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border border-gold/30 rounded-card p-12 text-center">
            <h2 className="font-display text-4xl font-black text-white mb-4">
              Ready to Enhance Your Security?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto leading-body">
              Discover how our professional security services can provide comprehensive protection and genuine peace of mind. Request a free consultation and personalised security assessment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="primary" size="lg" icon={<Phone size={20} />}>
                  Request Free Quote
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
                <div className="text-3xl font-black text-gold mb-2">24/7</div>
                <div className="text-white/70 text-sm uppercase tracking-wide">Emergency Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gold mb-2">&lt;5min</div>
                <div className="text-white/70 text-sm uppercase tracking-wide">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gold mb-2">100%</div>
                <div className="text-white/70 text-sm uppercase tracking-wide">PSIRA Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
    </PageTransition>
  )
}

export default ServicesPage
