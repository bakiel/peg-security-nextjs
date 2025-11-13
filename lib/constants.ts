// PEG Security - Site Constants

export const SITE_INFO = {
  name: 'PEG Security',
  tagline: 'Protection Excellence, Elite Service',
  phone: '013 001 2849',
  email: 'info@pegsecurity.co.za',
  address: 'Johannesburg, South Africa',
  hours: '24/7 Emergency Response',
} as const;

export const NAVIGATION = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    dropdown: [
      { label: 'Company Background', href: '/about' },
      { label: 'Vision', href: '/about/vision' },
      { label: 'Mission', href: '/about/mission' },
      { label: 'Values', href: '/about/values' },
      { label: 'Founder', href: '/about/founder' },
      { label: 'Certifications', href: '/about/certifications' },
    ]
  },
  {
    label: 'Services',
    href: '/services',
    dropdown: [
      { label: 'Overview', href: '/services' },
      { label: 'Armed Response', href: '/services/armed-response' },
      { label: 'VIP Protection', href: '/services/vip-protection' },
      { label: 'K9 Unit', href: '/services/k9-unit' },
      { label: 'Technology', href: '/services/technology' },
    ]
  },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
] as const;

export const SERVICES = [
  {
    id: 'armed-response',
    title: 'Armed Response',
    icon: 'Shield',
    description: 'Rapid armed response teams ready 24/7 to protect your property and loved ones.',
    features: ['Sub-5 minute response', '24/7 availability', 'Trained personnel', 'GPS tracking'],
    href: '/services/armed-response',
  },
  {
    id: 'vip-protection',
    title: 'VIP Protection',
    icon: 'Users',
    description: 'Elite close protection services for high-profile individuals and executives.',
    features: ['Discretion guaranteed', 'Threat assessment', 'Route planning', 'Event security'],
    href: '/services/vip-protection',
  },
  {
    id: 'k9-unit',
    title: 'K9 Unit',
    icon: 'Dog',
    description: 'Highly trained security dogs and handlers for patrols and detection.',
    features: ['Patrol services', 'Detection specialists', 'Handler trained', 'Available 24/7'],
    href: '/services/k9-unit',
  },
  {
    id: 'technology',
    title: 'Security Technology',
    icon: 'Camera',
    description: 'Advanced surveillance, access control, and monitoring systems.',
    features: ['CCTV systems', 'Access control', 'GPS tracking', 'Mobile app'],
    href: '/services/technology',
  },
] as const;

export const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/Security_guard_in_uniform_outdoors.jpg',
    alt: 'Professional security guard on patrol outdoors',
  },
  {
    id: 2,
    image: '/images/Armed_security_officer_in_black_gear.jpg',
    alt: 'Elite armed security officer in tactical gear',
  },
  {
    id: 3,
    image: '/images/Armed_security_guards_with_guns.jpg',
    alt: 'Armed response team ready for deployment',
  },
  {
    id: 4,
    image: '/images/Security_personnel_in_a_parking_lot.jpg',
    alt: 'Security personnel protecting commercial premises',
  },
] as const;

export const STATS = [
  { value: '24/7', label: 'Armed Response' },
  { value: '<5min', label: 'Reaction Time' },
] as const;

export const CERTIFICATIONS = [
  {
    id: 'psira',
    name: 'PSIRA Registered',
    description: 'Private Security Industry Regulatory Authority',
    image: '/images/Armed-men-with-weapons-SAIDSA-logo.jpg',
  },
  {
    id: 'saidsa',
    name: 'SAIDSA Member',
    description: 'South African Intruder Detection Services Association',
    image: '/images/Armed-men-with-weapons-SAIDSA-logo.jpg',
  },
  {
    id: 'bbbee',
    name: 'B-BBEE Compliant',
    description: 'Broad-Based Black Economic Empowerment',
    image: '/images/PROTECTION EXCELLENCE, ELITE.jpg',
  },
] as const;

export const SOCIAL_LINKS = [
  { platform: 'facebook', url: '#', icon: 'Facebook' },
  { platform: 'twitter', url: '#', icon: 'Twitter' },
  { platform: 'linkedin', url: '#', icon: 'Linkedin' },
  { platform: 'instagram', url: '#', icon: 'Instagram' },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Vision & Mission', href: '/about/vision' },
    { label: 'Founder', href: '/about/founder' },
    { label: 'Certifications', href: '/about/certifications' },
  ],
  services: [
    { label: 'Armed Response', href: '/services/armed-response' },
    { label: 'VIP Protection', href: '/services/vip-protection' },
    { label: 'K9 Unit', href: '/services/k9-unit' },
    { label: 'Technology', href: '/services/technology' },
  ],
  resources: [
    { label: 'Gallery', href: '/gallery' },
    { label: 'Careers', href: '/careers' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
} as const;
