import type { Metadata } from 'next'
import { Poppins, Montserrat } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PEG Security - Elite Protection Services | Johannesburg, South Africa',
  description: 'Professional security services in Johannesburg. Armed response, VIP protection, event security, and CCTV surveillance. 24/7 emergency response. PSIRA registered.',
  keywords: 'security services, armed response, VIP protection, event security, CCTV, Johannesburg, South Africa, PSIRA',
  authors: [{ name: 'PEG Security' }],
  openGraph: {
    title: 'PEG Security - Elite Protection Services',
    description: 'Professional security services in Johannesburg, South Africa. 24/7 emergency response.',
    type: 'website',
    locale: 'en_ZA',
    siteName: 'PEG Security',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEG Security - Elite Protection Services',
    description: 'Professional security services in Johannesburg, South Africa.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#D0B96D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-ZA" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className="font-body antialiased bg-onyx text-white">
        {children}
      </body>
    </html>
  )
}
