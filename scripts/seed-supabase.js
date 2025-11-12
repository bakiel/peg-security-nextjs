/**
 * Supabase Data Seeding Script for PEG Security
 *
 * Populates Supabase with realistic PEG Security data
 * Run with: node scripts/seed-supabase.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Services Data - matches services table schema
const services = [
  {
    title: 'Armed Response Services',
    slug: 'armed-response',
    short_description: 'Rapid 24/7 armed response with professional officers',
    full_description: 'Professional 24/7 armed response services with rapid deployment teams ready to respond to any security threat. Our highly trained officers provide immediate assistance during emergencies, ensuring your property and personnel remain protected at all times.',
    icon_name: 'shield-alt',
    category: 'Physical Security',
    features: JSON.stringify(['24/7 Emergency Response', 'Armed Security Officers', 'Rapid Deployment', 'SAPS Liaison', 'Incident Reporting']),
    pricing_model: 'Monthly Retainer',
    pricing_details: 'From R1,500 per month',
    image_url: null,
    image_public_id: null,
    status: 'Active',
    display_order: 1
  },
  {
    title: 'CCTV Surveillance Systems',
    slug: 'cctv-surveillance',
    short_description: 'Professional CCTV installation with remote monitoring',
    full_description: 'Advanced CCTV surveillance solutions with high-resolution cameras, remote monitoring capabilities, and 24/7 recording. We specialise in custom installations for residential, commercial, and industrial properties, ensuring comprehensive visual coverage of your premises.',
    icon_name: 'video',
    category: 'Electronic Security',
    features: JSON.stringify(['High-Resolution Cameras', 'Remote Monitoring', '24/7 Recording', 'Night Vision', 'Mobile App Access', 'Cloud Storage']),
    pricing_model: 'Custom Quote',
    pricing_details: 'Contact us for a tailored quote',
    image_url: null,
    image_public_id: null,
    status: 'Active',
    display_order: 2
  },
  {
    title: 'Manned Guarding Services',
    slug: 'manned-guarding',
    short_description: 'Professional security officers for site protection',
    full_description: 'Professional manned guarding services for residential estates, commercial properties, and industrial facilities. Our trained security officers provide visible deterrence and comprehensive site protection, ensuring peace of mind for property owners and managers.',
    icon_name: 'user-shield',
    category: 'Physical Security',
    features: JSON.stringify(['Trained Security Officers', 'Access Control', 'Visitor Management', 'Patrol Services', 'Incident Response', 'PSIRA Registered']),
    pricing_model: 'Hourly Rate',
    pricing_details: 'From R80 per hour',
    image_url: null,
    image_public_id: null,
    status: 'Active',
    display_order: 3
  },
  {
    title: 'Access Control Systems',
    slug: 'access-control',
    short_description: 'Advanced access control with biometric technology',
    full_description: 'Modern access control solutions featuring biometric technology, smart card systems, and visitor management. Control and monitor entry points with advanced security technology, maintaining comprehensive audit trails for all access events.',
    icon_name: 'key',
    category: 'Electronic Security',
    features: JSON.stringify(['Biometric Systems', 'Smart Card Access', 'Visitor Registration', 'Real-time Monitoring', 'Audit Trails', 'Mobile Credentials']),
    pricing_model: 'Custom Quote',
    pricing_details: 'From R15,000 per installation',
    image_url: null,
    image_public_id: null,
    status: 'Active',
    display_order: 4
  },
  {
    title: 'Event Security Services',
    slug: 'event-security',
    short_description: 'Professional security for events and functions',
    full_description: 'Comprehensive event security services for corporate functions, private events, and public gatherings. Our professional teams ensure guest safety and smooth event operations, providing crowd management, access control, and emergency response capabilities.',
    icon_name: 'calendar-check',
    category: 'Specialised Services',
    features: JSON.stringify(['Crowd Management', 'Access Control', 'VIP Protection', 'Emergency Response', 'Security Planning', 'Trained Personnel']),
    pricing_model: 'Contact Us',
    pricing_details: 'Pricing varies by event size and requirements',
    image_url: null,
    image_public_id: null,
    status: 'Active',
    display_order: 5
  },
  {
    title: 'VIP Protection Services',
    slug: 'vip-protection',
    short_description: 'Executive protection and close protection services',
    full_description: 'Discreet executive protection services for high-profile individuals, corporate executives, and visiting dignitaries. Our trained close protection officers provide professional security with minimal intrusion, ensuring safety while maintaining normal activities.',
    icon_name: 'user-tie',
    category: 'Specialised Services',
    features: JSON.stringify(['Close Protection Officers', 'Risk Assessment', 'Secure Transportation', 'Route Planning', 'Discreet Security', 'Advance Security']),
    pricing_model: 'Contact Us',
    pricing_details: 'Custom pricing based on requirements',
    image_url: null,
    image_public_id: null,
    status: 'Active',
    display_order: 6
  }
]

// Team Members Data - matches team_members table schema
const teamMembers = [
  {
    name: 'Vusi Zwane',
    position: 'Managing Director',
    bio: 'Leading PEG Security\'s regional operations with dedication to professional excellence and community protection. With extensive experience in the security industry, Vusi ensures every client receives personalised, professional security solutions tailored to their specific requirements.',
    photo_url: '/images/team/vusi-zwane.jpg',
    photo_public_id: 'team/vusi-zwane',
    email: 'info@pegsecurity.co.za',
    phone: '+27 65 640 1943',
    linkedin_url: null,
    display_order: 1,
    status: 'Active'
  },
  {
    name: 'Goodman Mabanga',
    position: 'Operations Manager',
    bio: 'Overseeing day-to-day security operations across the Mpumalanga region, Goodman brings tactical expertise and operational excellence to PEG Security. His hands-on approach ensures seamless coordination between our response teams, security personnel, and technical installations.',
    photo_url: '/images/team/goodman-mabanga.jpg',
    photo_public_id: 'team/goodman-mabanga',
    email: 'goodman@pegsecurity.co.za',
    phone: '+27 60 952 7988',
    linkedin_url: null,
    display_order: 2,
    status: 'Active'
  }
]

// Jobs Data - matches jobs table schema
const jobs = [
  {
    title: 'Armed Response Officer - Bethal',
    slug: 'armed-response-officer-bethal',
    category: 'Armed Response',
    location: 'Bethal, Mpumalanga',
    employment_type: 'Full-time',
    psira_required: true,
    description: 'We are seeking experienced Armed Response Officers to join our professional team serving the Bethal and surrounding areas. This critical role requires quick response times, professional conduct, and dedication to client safety.',
    responsibilities: '• Respond to alarm activations within prescribed timeframes\n• Patrol assigned zones and conduct security assessments\n• Liaise with SAPS when required\n• Complete incident reports and maintain accurate logs\n• Provide exceptional client service\n• Maintain vehicle and equipment in excellent condition',
    requirements: '• Valid PSIRA registration (Grade A or higher)\n• Firearm competency certificate\n• Minimum 2 years armed response experience\n• Clean criminal record\n• Valid driver\'s licence (Code 08 minimum)\n• Excellent physical fitness\n• Strong communication skills in English and at least one other South African language',
    benefits: '• Competitive salary package (R12,000 - R15,000)\n• Company vehicle and fuel card\n• Full PPE and equipment provided\n• Medical aid contribution\n• Career advancement opportunities\n• Ongoing training and development',
    status: 'Open',
    application_count: 0
  },
  {
    title: 'Security Officer - Commercial Property',
    slug: 'security-officer-commercial',
    category: 'Security Guard',
    location: 'Bethal, Mpumalanga',
    employment_type: 'Full-time',
    psira_required: true,
    description: 'PEG Security is recruiting professional Security Officers for commercial property assignments. This role involves access control, visitor management, and maintaining security at client premises.',
    responsibilities: '• Control access points and verify authorisation\n• Conduct regular patrols of premises\n• Monitor CCTV systems and respond to incidents\n• Maintain visitor logs and access records\n• Report suspicious activities or security breaches\n• Assist with emergency evacuations if required',
    requirements: '• Valid PSIRA registration (Grade C minimum)\n• Matric certificate\n• Minimum 1 year security experience\n• Clear criminal record\n• Good communication skills\n• Ability to work shifts including nights and weekends\n• Professional appearance and conduct',
    benefits: '• Stable employment with established company (R8,000 - R10,000)\n• Uniform provided\n• Training opportunities\n• Medical aid contribution after probation\n• Annual leave\n• Public holiday compensation',
    status: 'Open',
    application_count: 0
  },
  {
    title: 'CCTV Installation Technician',
    slug: 'cctv-installation-technician',
    category: 'Technical Support',
    location: 'Bethal & Surrounding Areas',
    employment_type: 'Full-time',
    psira_required: false,
    description: 'We are looking for a skilled CCTV Installation Technician to join our technical team. This role involves installing, configuring, and maintaining surveillance systems for residential and commercial clients.',
    responsibilities: '• Install and configure CCTV camera systems\n• Run cabling and set up network infrastructure\n• Configure DVR/NVR systems and remote viewing\n• Perform system maintenance and troubleshooting\n• Provide client training on system operation\n• Document installations and maintain service records',
    requirements: '• Matric with relevant technical qualifications\n• Minimum 2 years CCTV installation experience\n• Knowledge of IP cameras and network configurations\n• Valid driver\'s licence\n• Good problem-solving abilities\n• Ability to work at heights and in various weather conditions\n• Excellent customer service skills',
    benefits: '• Competitive salary (R10,000 - R14,000)\n• Company vehicle for site visits\n• Tools and equipment provided\n• Technical training and certifications\n• Career growth opportunities\n• Stable work environment',
    status: 'Open',
    application_count: 0
  },
  {
    title: 'Control Room Operator',
    slug: 'control-room-operator',
    category: 'Technical Support',
    location: 'Bethal, Mpumalanga',
    employment_type: 'Full-time',
    psira_required: true,
    description: 'Join our 24/7 Control Room team as an Operator, monitoring alarms, coordinating response teams, and ensuring efficient security operations. This critical role requires excellent communication and decision-making skills.',
    responsibilities: '• Monitor alarm systems and CCTV feeds\n• Dispatch armed response officers to incidents\n• Maintain communication with field personnel\n• Log all incidents and actions taken\n• Coordinate with SAPS and emergency services\n• Generate daily operational reports',
    requirements: '• Valid PSIRA registration (Grade D minimum)\n• Matric certificate\n• Computer literacy essential\n• Previous control room or dispatch experience preferred\n• Excellent telephone manner and communication skills\n• Ability to remain calm under pressure\n• Willing to work shifts (day, night, weekends)',
    benefits: '• Monthly salary (R9,000 - R11,000)\n• Shift allowances\n• Climate-controlled work environment\n• Comprehensive training provided\n• Medical aid after probation\n• Opportunity for career advancement',
    status: 'Open',
    application_count: 0
  },
  {
    title: 'VIP Protection Officer',
    slug: 'vip-protection-officer',
    category: 'VIP Protection',
    location: 'Bethal & Witbank',
    employment_type: 'Contract',
    psira_required: true,
    description: 'We require experienced VIP Protection Officers for executive protection assignments. This role demands professionalism, discretion, and advanced security skills to protect high-profile individuals.',
    responsibilities: '• Provide close protection for VIP clients\n• Conduct threat assessments and risk analyses\n• Plan and execute secure transportation\n• Advance security for venues and locations\n• Maintain situational awareness at all times\n• Coordinate with security teams and venues',
    requirements: '• Valid PSIRA registration (Grade A)\n• Minimum 3 years close protection experience\n• Defensive driving certification preferred\n• Advanced firearm proficiency\n• Excellent physical fitness\n• Professional appearance and conduct\n• Ability to travel and work irregular hours',
    benefits: '• Premium daily rates (R1,500 - R2,000 per day)\n• Project-based assignments\n• Professional development opportunities\n• Work with high-profile clients\n• Networking opportunities\n• Potential for permanent placement',
    status: 'Open',
    application_count: 0
  }
]

// Contact Messages (sample)
const contacts = [
  {
    name: 'Thabo Dlamini',
    email: 'thabo.dlamini@example.co.za',
    phone: '+27 82 345 6789',
    service_type: 'Armed Response',
    message: 'Good day, I need armed response services for my business in Bethal. Please contact me to discuss coverage options and pricing.',
    preferred_contact: 'Phone',
    status: 'New'
  },
  {
    name: 'Nomsa Khumalo',
    email: 'nomsa.k@business.co.za',
    phone: '+27 83 456 7890',
    service_type: 'CCTV Installation',
    message: 'Hello, we require CCTV installation for our warehouse facility. Can you provide a quote for 16 cameras with remote viewing?',
    preferred_contact: 'Email',
    status: 'New'
  },
  {
    name: 'Johan van der Merwe',
    email: 'jvdm@farmhouse.co.za',
    phone: '+27 84 567 8901',
    service_type: 'Security Guard',
    message: 'We need 24/7 security guards for our agricultural property. Looking for 2 guards per shift. Please contact me.',
    preferred_contact: 'Phone',
    status: 'Read'
  },
  {
    name: 'Sipho Nkosi',
    email: 'sipho.nkosi@events.co.za',
    phone: '+27 71 234 5678',
    service_type: 'Event Security',
    message: 'Planning a corporate event for 500 people next month. Need professional security team. When can we discuss requirements?',
    preferred_contact: 'Email',
    status: 'Responded'
  },
  {
    name: 'Linda Mbatha',
    email: 'linda@retailshop.co.za',
    phone: '+27 76 345 6789',
    service_type: 'Access Control',
    message: 'Interested in biometric access control system for our retail store. Need 3 entry points covered.',
    preferred_contact: 'Email',
    status: 'New'
  }
]

async function seedDatabase() {
  console.log('🌱 Starting PEG Security database seeding...\n')

  try {
    // Seed Services
    console.log('📋 Seeding Services...')
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .insert(services)
      .select()

    if (servicesError) {
      console.error('❌ Services error:', servicesError.message)
    } else {
      console.log(`✅ Seeded ${servicesData.length} services`)
    }

    // Seed Team Members
    console.log('\n👥 Seeding Team Members...')
    const { data: teamData, error: teamError } = await supabase
      .from('team_members')
      .insert(teamMembers)
      .select()

    if (teamError) {
      console.error('❌ Team error:', teamError.message)
    } else {
      console.log(`✅ Seeded ${teamData.length} team members`)
    }

    // Seed Jobs
    console.log('\n💼 Seeding Jobs...')
    const { data: jobsData, error: jobsError } = await supabase
      .from('jobs')
      .insert(jobs)
      .select()

    if (jobsError) {
      console.error('❌ Jobs error:', jobsError.message)
    } else {
      console.log(`✅ Seeded ${jobsData.length} jobs`)
    }

    // Seed Contacts
    console.log('\n📧 Seeding Contact Messages...')
    const { data: contactsData, error: contactsError } = await supabase
      .from('contacts')
      .insert(contacts)
      .select()

    if (contactsError) {
      console.error('❌ Contacts error:', contactsError.message)
    } else {
      console.log(`✅ Seeded ${contactsData.length} contact messages`)
    }

    console.log('\n✅ Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   Services: ${servicesData?.length || 0}`)
    console.log(`   Team: ${teamData?.length || 0}`)
    console.log(`   Jobs: ${jobsData?.length || 0}`)
    console.log(`   Contacts: ${contactsData?.length || 0}`)
    console.log(`   Gallery: 12 (already uploaded)\n`)

  } catch (error) {
    console.error('\n❌ Fatal error during seeding:', error)
    process.exit(1)
  }
}

// Run the seeding
seedDatabase()
