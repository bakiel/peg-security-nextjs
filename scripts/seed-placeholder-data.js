/**
 * Placeholder Data Seeding Script for PEG Security Admin System
 *
 * This script populates Airtable with sample data for testing the admin system.
 * Run with: node scripts/seed-placeholder-data.js
 */

const Airtable = require('airtable')
require('dotenv').config({ path: '.env.local' })

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID)

const contactsTable = base(process.env.AIRTABLE_CONTACTS_TABLE_ID)
const jobsTable = base(process.env.AIRTABLE_JOBS_TABLE_ID)
const applicationsTable = base(process.env.AIRTABLE_APPLICATIONS_TABLE_ID)
const galleryTable = base(process.env.AIRTABLE_GALLERY_TABLE_ID)

// Placeholder data
const contacts = [
  {
    fields: {
      Name: 'Thabo Mbeki',
      Email: 'thabo.mbeki@example.co.za',
      Phone: '+27 11 234 5678',
      'Service Type': 'Armed Response',
      Message: 'I need 24/7 armed response services for my business in Sandton. Please contact me urgently.',
      'Preferred Contact': 'Email',
      Status: 'New',
      'Submitted At': new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    fields: {
      Name: 'Sarah Johnson',
      Email: 'sarah.j@example.com',
      Phone: '+27 21 456 7890',
      'Service Type': 'CCTV Installation',
      Message: 'Looking for a complete CCTV system for a warehouse in Cape Town. Need quote for 20 cameras.',
      'Preferred Contact': 'Phone',
      Status: 'Read',
      'Submitted At': new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    fields: {
      Name: 'Peter Ndlovu',
      Email: 'p.ndlovu@example.co.za',
      Phone: '+27 31 789 0123',
      'Service Type': 'Event Security',
      Message: 'We are hosting a corporate event with 500+ attendees in Durban next month. Need professional security team.',
      'Preferred Contact': 'Email',
      Status: 'Responded',
      'Submitted At': new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    fields: {
      Name: 'Linda Williams',
      Email: 'lwilliams@example.com',
      Phone: '+27 12 345 6789',
      'Service Type': 'VIP Protection',
      Message: 'Need executive protection services for visiting international delegates. Two-week assignment.',
      'Preferred Contact': 'Phone',
      Status: 'New',
      'Submitted At': new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    fields: {
      Name: 'Sipho Khumalo',
      Email: 'sipho.k@example.co.za',
      Phone: '+27 11 987 6543',
      'Service Type': 'Access Control',
      Message: 'Need biometric access control system installed for office building with 3 entrances.',
      'Preferred Contact': 'Email',
      Status: 'New',
      'Submitted At': new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
  }
]

const jobs = [
  {
    fields: {
      Title: 'Armed Response Officer - Sandton',
      Slug: 'armed-response-officer-sandton',
      Category: 'Armed Response',
      Location: 'Sandton, Johannesburg',
      'Employment Type': 'Full-time',
      'PSIRA Required': true,
      Description: 'We are seeking experienced Armed Response Officers to join our elite team serving the Sandton business district. This is a critical role requiring quick response times and professional conduct.',
      Responsibilities: '• Respond to alarm activations within 3-5 minutes\n• Patrol assigned zones and conduct security assessments\n• Liaise with SAPS when required\n• Complete incident reports and maintain logs\n• Provide exceptional client service',
      Requirements: '• Valid PSIRA registration (Grade A)\n• Firearm competency certificate\n• Minimum 2 years armed response experience\n• Clean criminal record\n• Valid driver\'s license (Code 08 minimum)\n• Excellent physical fitness',
      Benefits: '• Competitive salary (R12,000 - R15,000)\n• Company vehicle and fuel card\n• Full PPE and equipment provided\n• Medical aid contribution\n• Career advancement opportunities',
      Status: 'Open',
      'Created At': new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      'Updated At': new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      'Application Count': 0
    }
  },
  {
    fields: {
      Title: 'Security Guard - Shopping Centre',
      Slug: 'security-guard-shopping-centre',
      Category: 'Security Guard',
      Location: 'Rosebank, Johannesburg',
      'Employment Type': 'Full-time',
      'PSIRA Required': true,
      Description: 'Join our team providing security services at a busy shopping centre in Rosebank. We need reliable, professional guards for day and night shifts.',
      Responsibilities: '• Monitor CCTV cameras and alarm systems\n• Control access points and verify credentials\n• Conduct regular patrols of the premises\n• Respond to security incidents\n• Assist customers and provide directions',
      Requirements: '• Valid PSIRA registration (Grade C minimum)\n• Previous retail security experience preferred\n• Good communication skills in English\n• Ability to work shifts (including weekends)\n• Professional appearance and conduct',
      Benefits: '• Salary: R6,500 - R8,000 per month\n• Uniform provided\n• Shift allowances\n• Training provided\n• Stable employment',
      Status: 'Open',
      'Created At': new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      'Updated At': new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      'Application Count': 0
    }
  },
  {
    fields: {
      Title: 'CCTV Technician',
      Slug: 'cctv-technician',
      Category: 'Technical',
      Location: 'Johannesburg (Various Sites)',
      'Employment Type': 'Full-time',
      'PSIRA Required': false,
      Description: 'We need a skilled CCTV technician to install and maintain surveillance systems for our clients across Johannesburg.',
      Responsibilities: '• Install IP and analog CCTV systems\n• Configure NVRs/DVRs and network equipment\n• Conduct site surveys and cable runs\n• Troubleshoot and repair camera systems\n• Train clients on system operation',
      Requirements: '• 3+ years CCTV installation experience\n• Knowledge of IP networking and PoE\n• Familiar with major CCTV brands (Hikvision, Dahua)\n• Valid driver\'s license\n• Own tools preferred',
      Benefits: '• Competitive salary (R10,000 - R14,000)\n• Company vehicle or travel allowance\n• Phone and data allowance\n• Performance bonuses\n• Ongoing technical training',
      Status: 'Open',
      'Created At': new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      'Updated At': new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      'Application Count': 0
    }
  },
  {
    fields: {
      Title: 'Control Room Operator',
      Slug: 'control-room-operator',
      Category: 'Operations',
      Location: 'Midrand',
      'Employment Type': 'Full-time',
      'PSIRA Required': true,
      Description: 'Experienced Control Room Operator needed to monitor security systems and coordinate response teams from our state-of-the-art control centre.',
      Responsibilities: '• Monitor multiple CCTV feeds and alarm systems\n• Dispatch armed response teams to incidents\n• Maintain communication logs\n• Coordinate with SAPS and emergency services\n• Provide real-time updates to clients',
      Requirements: '• Valid PSIRA registration\n• 2+ years control room experience\n• Excellent communication skills\n• Computer literacy (MS Office, security software)\n• Ability to work under pressure\n• Shift work (12-hour shifts)',
      Benefits: '• Salary: R8,000 - R11,000\n• Air-conditioned modern facility\n• Shift allowances\n• Medical aid after probation\n• Training and certification opportunities',
      Status: 'Draft',
      'Created At': new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      'Updated At': new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      'Application Count': 0
    }
  }
]

const gallery = [
  {
    fields: {
      Title: 'Armed Response Patrol',
      Description: 'Our armed response team on patrol in Johannesburg, providing rapid response to security incidents.',
      Category: 'Armed Response',
      'Image URL': 'https://images.unsplash.com/photo-1574077479297-f4b0b493dc2a?w=1920&q=80',
      'Image Public ID': 'placeholder/armed-response-1',
      'Thumbnail URL': 'https://images.unsplash.com/photo-1574077479297-f4b0b493dc2a?w=400&h=300&fit=crop&q=80',
      Status: 'Active',
      'Display Order': 1,
      'Created At': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      'Updated At': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    fields: {
      Title: 'CCTV Installation Project',
      Description: 'Professional CCTV camera installation at a commercial property, featuring IP cameras with night vision.',
      Category: 'CCTV Installation',
      'Image URL': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1920&q=80',
      'Image Public ID': 'placeholder/cctv-installation-1',
      'Thumbnail URL': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&q=80',
      Status: 'Active',
      'Display Order': 2,
      'Created At': new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      'Updated At': new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    fields: {
      Title: 'Access Control System',
      Description: 'Biometric access control terminal providing secure entry management for office buildings.',
      Category: 'Access Control',
      'Image URL': 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1920&q=80',
      'Image Public ID': 'placeholder/access-control-1',
      'Thumbnail URL': 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=300&fit=crop&q=80',
      Status: 'Active',
      'Display Order': 3,
      'Created At': new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      'Updated At': new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    fields: {
      Title: 'Security Team Training',
      Description: 'Our professional security guards undergoing tactical training and procedures review.',
      Category: 'Team',
      'Image URL': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1920&q=80',
      'Image Public ID': 'placeholder/team-training-1',
      'Thumbnail URL': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop&q=80',
      Status: 'Active',
      'Display Order': 4,
      'Created At': new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      'Updated At': new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    fields: {
      Title: 'Event Security Detail',
      Description: 'Professional event security team managing access control at a corporate conference.',
      Category: 'Event Security',
      'Image URL': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=80',
      'Image Public ID': 'placeholder/event-security-1',
      'Thumbnail URL': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop&q=80',
      Status: 'Active',
      'Display Order': 5,
      'Created At': new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      'Updated At': new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    fields: {
      Title: 'Control Room Operations',
      Description: 'Our 24/7 control room monitoring multiple sites with advanced surveillance technology.',
      Category: 'Projects',
      'Image URL': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1920&q=80',
      'Image Public ID': 'placeholder/control-room-1',
      'Thumbnail URL': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop&q=80',
      Status: 'Hidden',
      'Display Order': 6,
      'Created At': new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      'Updated At': new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
]

// Seeding functions
async function seedContacts() {
  console.log('📧 Seeding contact submissions...')

  try {
    const records = await contactsTable.create(contacts)
    console.log(`✅ Created ${records.length} contact submissions`)
    return records
  } catch (error) {
    console.error('❌ Error seeding contacts:', error)
    throw error
  }
}

async function seedJobs() {
  console.log('💼 Seeding job listings...')

  try {
    const records = await jobsTable.create(jobs)
    console.log(`✅ Created ${records.length} job listings`)
    return records
  } catch (error) {
    console.error('❌ Error seeding jobs:', error)
    throw error
  }
}

async function seedApplications(jobRecords) {
  console.log('📄 Seeding job applications...')

  // Create applications linked to the seeded jobs
  const applications = [
    {
      fields: {
        'Job ID': jobRecords[0].id,
        'Job Title': jobRecords[0].fields.Title,
        'Applicant Name': 'Mandla Dlamini',
        'Applicant Email': 'm.dlamini@example.co.za',
        'Applicant Phone': '+27 82 123 4567',
        'CV URL': 'https://res.cloudinary.com/demo/raw/upload/sample.pdf',
        'CV Public ID': 'placeholder/cv-mandla',
        'Cover Letter': 'I have 5 years of experience in armed response and hold Grade A PSIRA registration. I am familiar with the Sandton area and have excellent client service skills.',
        'PSIRA Registered': true,
        'PSIRA Number': 'PSI1234567',
        'Years Experience': 5,
        Status: 'New',
        'Submitted At': new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      fields: {
        'Job ID': jobRecords[0].id,
        'Job Title': jobRecords[0].fields.Title,
        'Applicant Name': 'John van der Merwe',
        'Applicant Email': 'john.vdm@example.com',
        'Applicant Phone': '+27 83 456 7890',
        'CV URL': 'https://res.cloudinary.com/demo/raw/upload/sample.pdf',
        'CV Public ID': 'placeholder/cv-john',
        'Cover Letter': 'Former SAPS officer with 10 years of law enforcement experience. Recently transitioned to private security and eager to join a reputable company.',
        'PSIRA Registered': true,
        'PSIRA Number': 'PSI2345678',
        'Years Experience': 10,
        Status: 'Reviewing',
        'Submitted At': new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      fields: {
        'Job ID': jobRecords[1].id,
        'Job Title': jobRecords[1].fields.Title,
        'Applicant Name': 'Nomsa Zulu',
        'Applicant Email': 'nomsa.z@example.co.za',
        'Applicant Phone': '+27 71 234 5678',
        'CV URL': 'https://res.cloudinary.com/demo/raw/upload/sample.pdf',
        'CV Public ID': 'placeholder/cv-nomsa',
        'Cover Letter': 'I have worked as a security guard at retail centres for 3 years. I am reliable, professional, and available for all shifts including weekends.',
        'PSIRA Registered': true,
        'PSIRA Number': 'PSI3456789',
        'Years Experience': 3,
        Status: 'New',
        'Submitted At': new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      fields: {
        'Job ID': jobRecords[2].id,
        'Job Title': jobRecords[2].fields.Title,
        'Applicant Name': 'Themba Sithole',
        'Applicant Email': 't.sithole@example.co.za',
        'Applicant Phone': '+27 84 567 8901',
        'CV URL': 'https://res.cloudinary.com/demo/raw/upload/sample.pdf',
        'CV Public ID': 'placeholder/cv-themba',
        'Cover Letter': 'Certified IT technician with 4 years specialising in CCTV installations. Experienced with Hikvision, Dahua, and network configuration.',
        'PSIRA Registered': false,
        'PSIRA Number': '',
        'Years Experience': 4,
        Status: 'Interviewed',
        'Submitted At': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      fields: {
        'Job ID': jobRecords[1].id,
        'Job Title': jobRecords[1].fields.Title,
        'Applicant Name': 'Michael Brown',
        'Applicant Email': 'm.brown@example.com',
        'Applicant Phone': '+27 76 789 0123',
        'CV URL': 'https://res.cloudinary.com/demo/raw/upload/sample.pdf',
        'CV Public ID': 'placeholder/cv-michael',
        'Cover Letter': 'Recent PSIRA registration holder looking to start my career in security. I am hardworking, punctual, and eager to learn.',
        'PSIRA Registered': true,
        'PSIRA Number': 'PSI4567890',
        'Years Experience': 0,
        Status: 'Rejected',
        'Submitted At': new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  ]

  try {
    const records = await applicationsTable.create(applications)
    console.log(`✅ Created ${records.length} job applications`)
    return records
  } catch (error) {
    console.error('❌ Error seeding applications:', error)
    throw error
  }
}

async function seedGallery() {
  console.log('🖼️  Seeding gallery images...')

  try {
    const records = await galleryTable.create(gallery)
    console.log(`✅ Created ${records.length} gallery images`)
    return records
  } catch (error) {
    console.error('❌ Error seeding gallery:', error)
    throw error
  }
}

// Main seeding function
async function seed() {
  console.log('🌱 Starting placeholder data seeding...\n')

  try {
    // Seed in order (jobs first, then applications that reference them)
    await seedContacts()
    console.log('')

    const jobRecords = await seedJobs()
    console.log('')

    await seedApplications(jobRecords)
    console.log('')

    await seedGallery()
    console.log('')

    console.log('✨ Placeholder data seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - ${contacts.length} contact submissions`)
    console.log(`   - ${jobs.length} job listings`)
    console.log(`   - 5 job applications`)
    console.log(`   - ${gallery.length} gallery images`)
    console.log('\n🎯 You can now test the admin system at http://localhost:3000/admin/login')
    console.log('   Username: admin')
    console.log('   Password: PEGSecurity2025!')
  } catch (error) {
    console.error('\n💥 Seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
seed()
