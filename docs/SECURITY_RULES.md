# PEG Security - Security Rules & Requirements

**CRITICAL**: These security rules are NON-NEGOTIABLE and MUST be followed in every phase of development.

---

## 🔐 SECURITY PRINCIPLES

### 1. Defense in Depth
Never rely on a single security measure. Layer multiple protections.

### 2. Principle of Least Privilege
Grant minimum necessary permissions. Admin-only features require authentication.

### 3. Fail Securely
If something fails, fail in a way that denies access, not grants it.

### 4. Never Trust User Input
ALL input must be validated and sanitized, regardless of source.

### 5. Security by Design
Security is not optional or an afterthought - it's built-in from the start.

---

## 🚨 CRITICAL SECURITY RULES

### Rule 1: Environment Variables & Secrets
```
✅ DO:
- Store ALL secrets in .env.local
- Use environment variables for API keys
- Add .env.local to .gitignore
- Create .env.example without real values
- Rotate secrets if exposed
- Use different secrets for dev/prod

❌ DON'T:
- Hardcode secrets in code
- Commit .env.local to git
- Share secrets in chat/email
- Use same secrets across projects
- Store secrets in client-side code
```

**Implementation**:
```typescript
// ✅ CORRECT
const apiKey = process.env.AIRTABLE_ACCESS_TOKEN

// ❌ WRONG
const apiKey = "patScbZafXDSAxEDY..."
```

### Rule 2: Input Validation
```
✅ DO:
- Validate ALL input server-side
- Validate client-side for UX (but don't rely on it)
- Use whitelist validation (allow known good)
- Validate data type, length, format, range
- Reject suspicious input

❌ DON'T:
- Trust client-side validation alone
- Use blacklist validation (block known bad)
- Assume frontend prevents bad input
- Skip validation "because it's admin only"
```

**Implementation**:
```typescript
// ✅ CORRECT - Server-side validation
export async function POST(request: Request) {
  const body = await request.json()

  // Validate email
  if (!body.email || !isValidEmail(body.email)) {
    return NextResponse.json(
      { error: 'Invalid email' },
      { status: 400 }
    )
  }

  // Validate length
  if (!body.name || body.name.length < 2 || body.name.length > 100) {
    return NextResponse.json(
      { error: 'Name must be 2-100 characters' },
      { status: 400 }
    )
  }

  // Sanitize input
  const sanitizedName = sanitizeInput(body.name)

  // Proceed with validated data
  // ...
}

// ❌ WRONG - No validation
export async function POST(request: Request) {
  const body = await request.json()
  // Directly use body.email without validation
  await saveToDatabase(body)
}
```

### Rule 3: Authentication & Authorization
```
✅ DO:
- Require auth for ALL admin routes
- Verify session on every admin request
- Use HttpOnly, Secure, SameSite cookies
- Expire sessions after inactivity
- Log all admin actions
- Use middleware to protect routes

❌ DON'T:
- Store sessions in localStorage (XSS risk)
- Use predictable session IDs
- Allow infinite session duration
- Skip auth checks "for convenience"
- Use GET requests for sensitive actions
```

**Implementation**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect all /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin_session')

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify session validity
    if (!isValidSession(session.value)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
```

### Rule 4: SQL Injection Prevention (N/A for Airtable)
```
✅ DO (for Airtable):
- Validate record IDs (alphanumeric only)
- Sanitize all input before queries
- Use Airtable SDK methods (not raw queries)

❌ DON'T:
- Concatenate user input into queries
- Trust record IDs from user
```

**Implementation**:
```typescript
// ✅ CORRECT
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Validate ID format (Airtable IDs are alphanumeric)
  if (!/^rec[a-zA-Z0-9]{14}$/.test(params.id)) {
    return NextResponse.json(
      { error: 'Invalid record ID' },
      { status: 400 }
    )
  }

  const record = await jobsTable.find(params.id)
  // ...
}

// ❌ WRONG - No validation
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Directly use params.id
  const record = await jobsTable.find(params.id)
  // ...
}
```

### Rule 5: XSS (Cross-Site Scripting) Prevention
```
✅ DO:
- Sanitize ALL user-generated content
- Escape HTML in outputs
- Use React's built-in escaping
- Set Content Security Policy headers
- Validate and sanitize before storing

❌ DON'T:
- Use dangerouslySetInnerHTML with user content
- Trust user input in HTML context
- Disable XSS protections
```

**Implementation**:
```typescript
// ✅ CORRECT - React auto-escapes
export default function Comment({ text }: { text: string }) {
  return <div>{text}</div>  // Automatically escaped
}

// ❌ WRONG - XSS vulnerability
export default function Comment({ text }: { text: string }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />
}

// If you MUST render HTML (e.g., rich text editor):
import DOMPurify from 'isomorphic-dompurify'

export default function SafeComment({ html }: { html: string }) {
  const cleanHTML = DOMPurify.sanitize(html)
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
}
```

### Rule 6: CSRF (Cross-Site Request Forgery) Prevention
```
✅ DO:
- Use CSRF tokens on all state-changing requests
- Use SameSite cookies
- Verify referer header
- Use POST/PUT/DELETE (not GET) for changes

❌ DON'T:
- Use GET for actions that change data
- Skip CSRF protection
- Trust origin header alone
```

**Implementation**:
```typescript
// In form component
<form onSubmit={handleSubmit}>
  <input type="hidden" name="csrf_token" value={csrfToken} />
  {/* Other fields */}
</form>

// In API route
export async function POST(request: Request) {
  const body = await request.json()
  const sessionToken = request.cookies.get('csrf_token')?.value

  if (!sessionToken || body.csrf_token !== sessionToken) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }

  // Proceed with action
  // ...
}
```

### Rule 7: Rate Limiting
```
✅ DO:
- Rate limit ALL public endpoints
- Rate limit admin login attempts
- Rate limit file uploads
- Rate limit email sends
- Use progressive delays

❌ DON'T:
- Allow unlimited requests
- Use same rate limits for all endpoints
- Block legitimate users permanently
```

**Implementation**:
```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache'

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
})

export function checkRateLimit(ip: string, limit: number = 5): boolean {
  const count = (rateLimit.get(ip) as number) || 0

  if (count >= limit) {
    return false // Rate limit exceeded
  }

  rateLimit.set(ip, count + 1)
  return true
}

// In API route
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  if (!checkRateLimit(ip, 5)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  // Proceed
  // ...
}
```

### Rule 8: File Upload Security
```
✅ DO:
- Validate file type (MIME type, not extension)
- Check file size
- Scan for malicious content
- Sanitize filename
- Store in isolated location
- Use Content-Disposition: attachment

❌ DON'T:
- Trust file extension
- Allow unlimited file sizes
- Execute uploaded files
- Store in web-accessible directory
- Use user-provided filenames
```

**Implementation**:
```typescript
// File upload validation
export async function validateFile(file: File): Promise<string | null> {
  // Check size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return 'File size must be less than 5MB'
  }

  // Check MIME type
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ]

  if (!allowedTypes.includes(file.type)) {
    return 'Only PDF and DOCX files are allowed'
  }

  // Check file extension (backup check)
  const allowedExtensions = ['.pdf', '.docx', '.doc']
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))

  if (!allowedExtensions.includes(extension)) {
    return 'Invalid file extension'
  }

  // Sanitize filename
  const safeName = file.name
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_{2,}/g, '_')

  // Additional: Check file content (magic numbers)
  const buffer = await file.arrayBuffer()
  const header = new Uint8Array(buffer.slice(0, 4))

  // PDF starts with %PDF (0x25 0x50 0x44 0x46)
  // DOCX/ZIP starts with PK (0x50 0x4B)
  const isPDF = header[0] === 0x25 && header[1] === 0x50
  const isDOCX = header[0] === 0x50 && header[1] === 0x4B

  if (!isPDF && !isDOCX) {
    return 'File content does not match declared type'
  }

  return null // Valid
}
```

### Rule 9: Logging & Monitoring
```
✅ DO:
- Log all admin actions
- Log failed login attempts
- Log API errors
- Monitor for unusual activity
- Alert on security events
- Retain logs for audit

❌ DON'T:
- Log sensitive data (passwords, tokens)
- Log complete credit card numbers
- Expose logs publicly
- Ignore log entries
```

**Implementation**:
```typescript
// lib/logger.ts
export function logAdminAction(
  adminId: string,
  action: string,
  details: object
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    adminId,
    action,
    details,
    ip: request.headers.get('x-forwarded-for'),
    userAgent: request.headers.get('user-agent')
  }

  // Store in Airtable audit log or external service
  // ...

  console.log('[ADMIN ACTION]', JSON.stringify(logEntry))
}

// Usage in API route
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = getSession(request)

  await jobsTable.destroy(params.id)

  logAdminAction(session.adminId, 'DELETE_JOB', {
    jobId: params.id
  })

  return NextResponse.json({ success: true })
}
```

### Rule 10: Error Handling
```
✅ DO:
- Return generic error messages to users
- Log detailed errors server-side
- Use consistent error formats
- Handle all errors gracefully
- Don't expose stack traces

❌ DON'T:
- Return detailed errors to users
- Expose internal paths
- Show stack traces in production
- Ignore errors
```

**Implementation**:
```typescript
// ✅ CORRECT
export async function POST(request: Request) {
  try {
    // ... operation ...
  } catch (error) {
    // Log detailed error server-side
    console.error('[API ERROR]', error)

    // Return generic error to user
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

// ❌ WRONG
export async function POST(request: Request) {
  try {
    // ... operation ...
  } catch (error) {
    // Exposes internal details
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}
```

---

## 📋 SECURITY CHECKLIST

### Before Each Deployment
- [ ] All secrets in environment variables
- [ ] No secrets in code or git
- [ ] Input validation on all endpoints
- [ ] Authentication required for admin routes
- [ ] Rate limiting configured
- [ ] CSRF protection active
- [ ] XSS prevention measures in place
- [ ] File uploads validated
- [ ] Error handling doesn't leak info
- [ ] Logging captures security events
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] Dependencies up to date (no known vulnerabilities)

### Monthly Security Audit
- [ ] Review admin action logs
- [ ] Check for unusual activity
- [ ] Update dependencies
- [ ] Rotate API keys
- [ ] Review access permissions
- [ ] Test rate limiting
- [ ] Verify backups work

---

## 🔒 SECURITY HEADERS

Configure these headers in `next.config.js`:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; font-src 'self' data:; connect-src 'self' https://api.airtable.com https://api.resend.com https://api.cloudinary.com;"
          }
        ]
      }
    ]
  }
}
```

---

## 🚨 INCIDENT RESPONSE

### If Security Breach Detected:
1. **Immediate**: Disable affected functionality
2. **Immediate**: Rotate all API keys and passwords
3. **Within 1 hour**: Assess scope of breach
4. **Within 2 hours**: Notify affected users if data exposed
5. **Within 24 hours**: Patch vulnerability
6. **Within 48 hours**: Review logs for additional compromises
7. **Within 1 week**: Implement additional safeguards
8. **Ongoing**: Monitor for repeat attacks

### If Credentials Exposed:
1. **Immediate**: Rotate exposed credentials
2. **Immediate**: Check logs for unauthorized access
3. **Within 1 hour**: Update .env.local with new credentials
4. **Within 2 hours**: Deploy with new credentials
5. **Within 24 hours**: Review all recent actions
6. **Ongoing**: Monitor for suspicious activity

---

## 🎓 SECURITY TRAINING

### For Developers:
- Read OWASP Top 10
- Understand each security rule
- Review code for security issues
- Test security before deploying
- Keep dependencies updated

### For Admins:
- Use strong passwords
- Don't share credentials
- Log out after use
- Report suspicious activity
- Follow data handling policies

---

## 📞 SECURITY CONTACTS

**Security Issues**: Report immediately
**Email**: bakiel@pegsecurity.co.za
**Emergency**: +27 79 413 9180

---

## ✅ SECURITY APPROVAL

These security rules are NON-NEGOTIABLE.

Every feature, every endpoint, every form MUST follow these rules.

No exceptions. No shortcuts. Security first.

**Status**: 🔒 APPROVED - MUST BE FOLLOWED
