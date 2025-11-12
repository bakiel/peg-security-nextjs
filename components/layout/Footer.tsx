import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { SITE_INFO, FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const socialIcons = {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
  }

  return (
    <footer className="bg-[#1a1a1a] border-t border-gold/10">
      <div className="container max-w-container mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <Image
                src="/images/PEG_Profile_Design_Logo.png"
                alt="PEG Security Logo"
                width={45}
                height={45}
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(208, 185, 109, 0.5))'
                }}
              />
              <span className="font-display font-black text-xl text-gold">
                {SITE_INFO.name}
              </span>
            </Link>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              {SITE_INFO.tagline}. Professional security services across Johannesburg, South Africa.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = socialIcons[social.icon as keyof typeof socialIcons]
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-onyx transition-all duration-300"
                    aria-label={social.platform}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${SITE_INFO.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors text-sm"
                >
                  <Phone size={16} className="text-gold" />
                  {SITE_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_INFO.email}`}
                  className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors text-sm"
                >
                  <Mail size={16} className="text-gold" />
                  {SITE_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin size={16} className="text-gold mt-0.5" />
                <span>{SITE_INFO.address}</span>
              </li>
              <li className="pt-2">
                <span className="inline-block px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-full text-gold text-xs font-semibold">
                  {SITE_INFO.hours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gold/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {currentYear} {SITE_INFO.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-white/50 hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/50 hover:text-gold transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
