/**
 * Resend Email Service Configuration
 *
 * This module provides email sending functionality using Resend API
 * Includes templates for:
 * - Contact form submissions
 * - Job application notifications
 * - Admin notifications
 *
 * Security: API key loaded from environment variables
 */

import { Resend } from 'resend'

// Validate required environment variables
if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing required environment variable: RESEND_API_KEY')
}

if (!process.env.RESEND_FROM_EMAIL) {
  throw new Error('Missing required environment variable: RESEND_FROM_EMAIL')
}

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL,
  replyTo: {
    trudie: 'trudie@pegsecurity.co.za',
    vusi: 'vusi@asginc.co.za'
  },
  adminEmails: ['trudie@pegsecurity.co.za', 'vusi@asginc.co.za']
}

/**
 * Send contact form confirmation to user
 */
export async function sendContactConfirmation({
  to,
  name,
  serviceType
}: {
  to: string
  name: string
  serviceType: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      replyTo: EMAIL_CONFIG.replyTo.trudie,
      subject: 'Thank you for contacting PEG Security',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; colour: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-colour: #d0b96d; colour: #fff; padding: 20px; text-align: centre; }
              .content { padding: 20px; background-colour: #f8f9fa; }
              .footer { padding: 20px; text-align: centre; colour: #666; font-size: 12px; }
              .button { display: inline-block; padding: 12px 24px; background-colour: #d0b96d; colour: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>PEG Security</h1>
              </div>
              <div class="content">
                <h2>Thank you for contacting us, ${name}!</h2>
                <p>We have received your enquiry regarding <strong>${serviceType}</strong>.</p>
                <p>Our team will review your message and get back to you within 24-48 hours.</p>
                <p>In the meantime, feel free to browse our services or call us directly:</p>
                <p>
                  <strong>Phone:</strong> +27 79 413 9180<br>
                  <strong>Email:</strong> trudie@pegsecurity.co.za
                </p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/services" class="button">View Our Services</a>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} PEG Security. All rights reserved.</p>
                <p>Mpumalanga, South Africa</p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('[EMAIL ERROR] Contact confirmation:', error)
    throw new Error('Failed to send confirmation email')
  }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification({
  name,
  email,
  phone,
  serviceType,
  message,
  preferredContact
}: {
  name: string
  email: string
  phone: string
  serviceType: string
  message: string
  preferredContact: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.adminEmails,
      subject: `New Contact Form Submission - ${serviceType}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; colour: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-colour: #292b2b; colour: #fff; padding: 20px; }
              .content { padding: 20px; background-colour: #fff; border: 1px solid #ddd; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; colour: #666; }
              .value { margin-top: 5px; }
              .urgent { background-colour: #fff3cd; padding: 10px; border-left: 4px solid #d0b96d; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>🔔 New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="urgent">
                  <strong>Action Required:</strong> New enquiry received
                </div>

                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${name}</div>
                </div>

                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>

                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value"><a href="tel:${phone}">${phone}</a></div>
                </div>

                <div class="field">
                  <div class="label">Service Type:</div>
                  <div class="value">${serviceType}</div>
                </div>

                <div class="field">
                  <div class="label">Preferred Contact:</div>
                  <div class="value">${preferredContact}</div>
                </div>

                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${message}</div>
                </div>

                <p style="margin-top: 20px; colour: #666; font-size: 12px;">
                  Submitted: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
                </p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('[EMAIL ERROR] Contact notification:', error)
    throw new Error('Failed to send admin notification')
  }
}

/**
 * Send job application confirmation to applicant
 */
export async function sendApplicationConfirmation({
  to,
  name,
  jobTitle
}: {
  to: string
  name: string
  jobTitle: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      replyTo: EMAIL_CONFIG.replyTo.trudie,
      subject: `Application Received - ${jobTitle} at PEG Security`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; colour: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-colour: #d0b96d; colour: #fff; padding: 20px; text-align: centre; }
              .content { padding: 20px; background-colour: #f8f9fa; }
              .footer { padding: 20px; text-align: centre; colour: #666; font-size: 12px; }
              .highlight { background-colour: #fff; padding: 15px; border-left: 4px solid #d0b96d; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>PEG Security Careers</h1>
              </div>
              <div class="content">
                <h2>Application Received</h2>
                <p>Dear ${name},</p>
                <p>Thank you for applying for the <strong>${jobTitle}</strong> position at PEG Security.</p>

                <div class="highlight">
                  <p><strong>Next Steps:</strong></p>
                  <ul>
                    <li>Our HR team will review your application</li>
                    <li>Shortlisted candidates will be contacted within 2 weeks</li>
                    <li>Please ensure your phone is reachable</li>
                  </ul>
                </div>

                <p>We appreciate your interest in joining our team. If you have any questions, please don't hesitate to contact us:</p>
                <p>
                  <strong>Email:</strong> trudie@pegsecurity.co.za<br>
                  <strong>Phone:</strong> +27 79 413 9180
                </p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} PEG Security. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('[EMAIL ERROR] Application confirmation:', error)
    throw new Error('Failed to send application confirmation')
  }
}

/**
 * Send job application notification to admin
 */
export async function sendApplicationNotification({
  applicantName,
  applicantEmail,
  applicantPhone,
  jobTitle,
  cvUrl,
  coverLetter
}: {
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  jobTitle: string
  cvUrl?: string
  coverLetter?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.adminEmails,
      subject: `New Application - ${jobTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; colour: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-colour: #292b2b; colour: #fff; padding: 20px; }
              .content { padding: 20px; background-colour: #fff; border: 1px solid #ddd; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; colour: #666; }
              .value { margin-top: 5px; }
              .urgent { background-colour: #d4edda; padding: 10px; border-left: 4px solid #28a745; margin: 20px 0; }
              .button { display: inline-block; padding: 12px 24px; background-colour: #d0b96d; colour: #fff; text-decoration: none; border-radius: 4px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>📋 New Job Application</h2>
              </div>
              <div class="content">
                <div class="urgent">
                  <strong>New Application:</strong> ${jobTitle}
                </div>

                <div class="field">
                  <div class="label">Applicant Name:</div>
                  <div class="value">${applicantName}</div>
                </div>

                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${applicantEmail}">${applicantEmail}</a></div>
                </div>

                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value"><a href="tel:${applicantPhone}">${applicantPhone}</a></div>
                </div>

                <div class="field">
                  <div class="label">Position:</div>
                  <div class="value">${jobTitle}</div>
                </div>

                ${coverLetter ? `
                <div class="field">
                  <div class="label">Cover Letter:</div>
                  <div class="value">${coverLetter}</div>
                </div>
                ` : ''}

                ${cvUrl ? `
                <div class="field">
                  <div class="label">CV/Resume:</div>
                  <div class="value">
                    <a href="${cvUrl}" class="button">Download CV</a>
                  </div>
                </div>
                ` : ''}

                <p style="margin-top: 20px; colour: #666; font-size: 12px;">
                  Submitted: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
                </p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('[EMAIL ERROR] Application notification:', error)
    throw new Error('Failed to send application notification')
  }
}

/**
 * Generic error notification email (for internal use)
 */
export async function sendErrorNotification({
  errorType,
  errorMessage,
  context
}: {
  errorType: string
  errorMessage: string
  context?: Record<string, any>
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.adminEmails,
      subject: `⚠️ System Error - ${errorType}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: monospace; line-height: 1.6; colour: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-colour: #dc3545; colour: #fff; padding: 20px; }
              .content { padding: 20px; background-colour: #fff; border: 1px solid #ddd; }
              pre { background-colour: #f8f9fa; padding: 10px; overflow-x: auto; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>⚠️ System Error Alert</h2>
              </div>
              <div class="content">
                <p><strong>Error Type:</strong> ${errorType}</p>
                <p><strong>Message:</strong></p>
                <pre>${errorMessage}</pre>
                ${context ? `
                <p><strong>Context:</strong></p>
                <pre>${JSON.stringify(context, null, 2)}</pre>
                ` : ''}
                <p><strong>Time:</strong> ${new Date().toISOString()}</p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('[EMAIL ERROR] Error notification:', error)
    // Don't throw here to avoid infinite error loops
    return { success: false, error }
  }
}

export default resend
