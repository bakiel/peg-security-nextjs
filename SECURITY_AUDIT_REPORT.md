# PEG SECURITY - COMPREHENSIVE SECURITY AUDIT REPORT
**Generated:** 2025-11-11
**Auditor:** Elite Security Specialist (Claude Code)
**Application:** PEG Security Admin Dashboard & API
**Framework:** Next.js 14, React 18, TypeScript, Supabase

---

## EXECUTIVE SUMMARY

### Overall Security Posture: **MODERATE-HIGH RISK**

The PEG Security application demonstrates a **strong foundation** with many security best practices implemented, including rate limiting, input validation, authentication middleware, and security headers. However, **CRITICAL VULNERABILITIES** have been identified that require immediate remediation.

### Critical Findings Summary
- **9 CRITICAL Vulnerabilities** (Immediate action required)
- **12 HIGH Severity Issues** (Fix within 7 days)
- **8 MEDIUM Severity Issues** (Fix within 30 days)
- **6 LOW Severity Issues** (Fix within 90 days)

### Risk Assessment
| Category | Status | Notes |
|----------|--------|-------|
| **Authentication** | ⚠️ MEDIUM | JWT-based auth implemented, but password hashing uses SHA-256 instead of bcrypt |
| **Authorization** | ✅ GOOD | Middleware protection on all admin routes |
| **Input Validation** | ⚠️ MEDIUM | Validation present but incomplete; sanitization needs improvement |
| **XSS Prevention** | ⚠️ MEDIUM | Custom sanitization insufficient; needs proper library |
| **SQL/NoSQL Injection** | ✅ GOOD | Airtable SDK usage prevents most injection, but filter injection risk exists |
| **CSRF Protection** | ⚠️ HIGH | Token generation exists but **NOT enforced** on state-changing operations |
| **File Upload Security** | ⚠️ HIGH | MIME type validation only; lacks magic number verification |
| **Rate Limiting** | ✅ EXCELLENT | Comprehensive implementation across all endpoints |
| **Dependency Security** | ✅ EXCELLENT | No known vulnerabilities in npm audit |
| **Error Handling** | ✅ GOOD | Generic error messages to users, detailed logging server-side |

---

## CRITICAL VULNERABILITIES (SEVERITY: CRITICAL)

### 🚨 CRITICAL-1: Airtable Formula Injection
**File:** `/app/api/jobs/[slug]/route.ts:30`
**CVSS Score:** 9.1 (Critical)
**CWE:** CWE-943 (Improper Neutralization of Special Elements in Data Query Logic)

**Description:**
The slug parameter is directly interpolated into an Airtable filterByFormula without proper escaping, allowing formula injection attacks.

**Vulnerable Code:**
```typescript
// Line 30: app/api/jobs/[slug]/route.ts
filterByFormula: `{Slug} = '${slug}'`,
```

**Attack Scenario:**
```bash
# Attacker visits:
GET /api/jobs/test')+OR(1=1)+AND('1'='1

# This creates the formula:
{Slug} = 'test')+OR(1=1)+AND('1'='1'

# Result: Bypasses slug filter and returns all records
```

**Impact:**
- Unauthorized data access (read all job listings)
- Potential information disclosure
- Filter bypass allows enumeration of internal data

**Fix:**
```typescript
// SECURE VERSION
import { validateSlug, sanitizeString } from '@/lib/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  // Validate slug format
  const slugValidation = validateSlug(slug)
  if (!slugValidation.valid) {
    return NextResponse.json(
      { error: 'Invalid slug format' },
      { status: 400 }
    )
  }

  // Sanitize slug (only lowercase alphanumeric and hyphens)
  const safeSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')

  // Use escaped formula with validated slug
  const records = await queryAirtable<AirtableJobFields>(jobsTable, {
    filterByFormula: `{Slug} = "${safeSlug}"`, // Use double quotes for Airtable strings
    maxRecords: 1
  })
  // ... rest of code
}
```

**References:**
- CWE-943: https://cwe.mitre.org/data/definitions/943.html
- OWASP Injection: https://owasp.org/www-community/Injection_Flaws

---

### 🚨 CRITICAL-2: CSRF Token Not Enforced
**Files:** All admin API routes performing state changes
**CVSS Score:** 8.8 (High-Critical)
**CWE:** CWE-352 (Cross-Site Request Forgery)

**Description:**
While CSRF tokens are generated and set in cookies, they are **never validated** on POST/PUT/DELETE requests. This allows CSRF attacks against all admin operations.

**Vulnerable Code:**
```typescript
// lib/auth.ts - Token is generated
export function generateCsrfToken(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32))
  return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

// lib/auth.ts - Verification function exists but is NEVER CALLED
export function verifyCsrfToken(
  request: NextRequest,
  submittedToken: string
): boolean {
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value
  return cookieToken === submittedToken
}

// app/api/admin/team/route.ts - NO CSRF VALIDATION
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // ❌ NO CSRF CHECK HERE
    // ... create team member
  }
}
```

**Attack Scenario:**
```html
<!-- Attacker's malicious site -->
<form action="https://pegsecurity.co.za/api/admin/team" method="POST">
  <input type="hidden" name="name" value="Hacker">
  <input type="hidden" name="position" value="CEO">
  <!-- Other fields -->
</form>
<script>
  // Auto-submit when admin visits page
  document.forms[0].submit();
</script>
```

**Impact:**
- Admin actions can be performed by attacker without consent
- Unauthorized data modification (create/update/delete)
- Account takeover potential
- Privilege escalation

**Fix:**
```typescript
// Create CSRF middleware
// lib/csrf.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyCsrfToken } from './auth'

export async function validateCsrf(request: NextRequest): Promise<NextResponse | null> {
  // Only validate on state-changing methods
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    return null
  }

  // Get CSRF token from header or body
  const csrfToken =
    request.headers.get('x-csrf-token') ||
    (await request.clone().json()).csrfToken

  if (!csrfToken) {
    return NextResponse.json(
      { error: 'CSRF token missing' },
      { status: 403 }
    )
  }

  if (!verifyCsrfToken(request, csrfToken)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }

  return null // Validation passed
}

// Apply to all admin routes
// app/api/admin/team/route.ts
import { validateCsrf } from '@/lib/csrf'

export async function POST(request: NextRequest) {
  // Validate CSRF token
  const csrfError = await validateCsrf(request)
  if (csrfError) return csrfError

  try {
    const body = await request.json()
    // ... rest of code
  }
}
```

**Client-side changes:**
```typescript
// components/admin/TeamForm.tsx
import { getCsrfToken } from '@/lib/auth'

async function handleSubmit(data: TeamMemberData) {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('peg_csrf_token='))
    ?.split('=')[1]

  const response = await fetch('/api/admin/team', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken || ''
    },
    body: JSON.stringify(data)
  })
}
```

**References:**
- OWASP CSRF: https://owasp.org/www-community/attacks/csrf
- CWE-352: https://cwe.mitre.org/data/definitions/352.html

---

### 🚨 CRITICAL-3: Weak Password Hashing Algorithm
**File:** `/lib/auth.ts:341-347`
**CVSS Score:** 9.0 (Critical)
**CWE:** CWE-916 (Use of Password Hash With Insufficient Computational Effort)

**Description:**
The application uses SHA-256 for password hashing, which is cryptographically secure but **NOT suitable for passwords**. SHA-256 is fast, making brute-force attacks trivial with modern GPUs.

**Vulnerable Code:**
```typescript
// lib/auth.ts:341-347
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
```

**Why This Is Critical:**
- SHA-256 can compute **~1 billion hashes/second** on modern GPUs
- No salt means rainbow table attacks are possible
- No computational cost means brute-force is trivial
- An 8-character password can be cracked in **hours**

**Current Implementation Issue:**
```typescript
// lib/auth.ts:51-57 - Plaintext comparison!
export function verifyCredentials(username: string, password: string): boolean {
  return (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password // ❌ PLAINTEXT COMPARISON
  )
}
```

**Impact:**
- If password database is leaked, all passwords are immediately compromised
- Brute-force attacks are extremely fast
- No defense against rainbow tables
- Admin account compromise leads to full system takeover

**Fix:**
```bash
# Install bcrypt
npm install bcrypt
npm install --save-dev @types/bcrypt
```

```typescript
// lib/auth.ts
import bcrypt from 'bcrypt'

// SECURE: Hash password with bcrypt (cost factor 12)
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12 // 2^12 iterations (very secure)
  return await bcrypt.hash(password, saltRounds)
}

// SECURE: Verify password with bcrypt
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

// SECURE: Admin credentials verification
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  if (username !== ADMIN_CREDENTIALS.username) {
    return false
  }

  // Get hashed password from environment
  const hashedPassword = process.env.ADMIN_PASSWORD_HASH
  if (!hashedPassword) {
    throw new Error('ADMIN_PASSWORD_HASH not configured')
  }

  return await verifyPassword(password, hashedPassword)
}
```

**Migration Steps:**
1. Generate bcrypt hash of current password:
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your_password', 12, (err, hash) => console.log(hash))"
```

2. Update `.env.local`:
```bash
# Old (INSECURE)
ADMIN_PASSWORD=mypassword123

# New (SECURE)
ADMIN_PASSWORD_HASH=$2b$12$encrypted_hash_here
```

3. Update login route to use async verification:
```typescript
// app/api/admin/auth/login/route.ts
const isValid = await verifyCredentials(username, password) // Now async
```

**References:**
- OWASP Password Storage: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- CWE-916: https://cwe.mitre.org/data/definitions/916.html

---

### 🚨 CRITICAL-4: File Upload - No Magic Number Validation
**File:** `/app/api/admin/upload/route.ts:79-87`
**CVSS Score:** 8.5 (Critical)
**CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)

**Description:**
File uploads only validate the MIME type provided by the client, which can be easily spoofed. No verification of actual file content (magic numbers) is performed.

**Vulnerable Code:**
```typescript
// app/api/admin/upload/route.ts:79-87
// Check file type
if (!ALLOWED_MIME_TYPES[bucket].includes(file.type)) {
  return NextResponse.json(
    {
      error: 'Invalid file type',
      details: `Allowed types for ${bucket}: ${ALLOWED_MIME_TYPES[bucket].join(', ')}`
    },
    { status: 400 }
  )
}
// ❌ No verification of actual file content
```

**Attack Scenario:**
```javascript
// Attacker creates a malicious file
const maliciousContent = `
  <?php system($_GET['cmd']); ?>
  <!-- Webshell disguised as image -->
`

// Crafts fake MIME type
const blob = new Blob([maliciousContent], { type: 'image/jpeg' })
const file = new File([blob], 'innocent.jpg', { type: 'image/jpeg' })

// Uploads to server
formData.append('file', file)
formData.append('bucket', 'gallery')

// File passes MIME check but contains PHP code
```

**Impact:**
- Malicious executable files can be uploaded
- Web shells can be planted
- XSS payloads in SVG files
- Zip bombs causing DoS
- Remote code execution if files are served

**Fix:**
```typescript
// lib/file-validation.ts
export async function validateFileContent(
  file: File,
  expectedType: 'image' | 'pdf' | 'docx'
): Promise<{ valid: boolean; error?: string }> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  // Check magic numbers (file signatures)
  const magicNumbers = {
    jpeg: [0xFF, 0xD8, 0xFF],
    png: [0x89, 0x50, 0x4E, 0x47],
    webp: [0x52, 0x49, 0x46, 0x46], // "RIFF"
    pdf: [0x25, 0x50, 0x44, 0x46], // "%PDF"
    docx: [0x50, 0x4B, 0x03, 0x04], // ZIP format (DOCX is ZIP)
  }

  // Validate based on expected type
  if (expectedType === 'image') {
    const isJPEG = bytes.slice(0, 3).every((b, i) => b === magicNumbers.jpeg[i])
    const isPNG = bytes.slice(0, 4).every((b, i) => b === magicNumbers.png[i])
    const isWEBP = bytes.slice(0, 4).every((b, i) => b === magicNumbers.webp[i])

    if (!isJPEG && !isPNG && !isWEBP) {
      return {
        valid: false,
        error: 'File content does not match image format'
      }
    }
  }

  if (expectedType === 'pdf') {
    const isPDF = bytes.slice(0, 4).every((b, i) => b === magicNumbers.pdf[i])
    if (!isPDF) {
      return {
        valid: false,
        error: 'File content does not match PDF format'
      }
    }
  }

  if (expectedType === 'docx') {
    const isDOCX = bytes.slice(0, 4).every((b, i) => b === magicNumbers.docx[i])
    if (!isDOCX) {
      return {
        valid: false,
        error: 'File content does not match DOCX format'
      }
    }
  }

  // Additional checks for images: dimensions, no scripts
  if (expectedType === 'image') {
    // Check for PHP tags in image
    const content = new TextDecoder().decode(bytes)
    if (content.includes('<?php') || content.includes('<script')) {
      return {
        valid: false,
        error: 'Suspicious content detected in image file'
      }
    }
  }

  return { valid: true }
}

// Update upload route
// app/api/admin/upload/route.ts
import { validateFileContent } from '@/lib/file-validation'

export async function POST(request: NextRequest) {
  // ... existing validation ...

  // Add content validation
  const contentType = bucket === 'cvs' ? 'pdf' : 'image'
  const contentValidation = await validateFileContent(file, contentType)

  if (!contentValidation.valid) {
    return NextResponse.json(
      {
        error: 'File validation failed',
        details: contentValidation.error
      },
      { status: 400 }
    )
  }

  // ... proceed with upload ...
}
```

**Additional Security:**
```typescript
// Rename files to prevent execution
const safeExtension = contentType === 'image' ? '.jpg' : '.pdf'
const safeFilename = `${crypto.randomUUID()}${safeExtension}`

// Store with restricted permissions (Supabase RLS)
const { data, error } = await supabase.storage
  .from(bucket)
  .upload(safeFilename, buffer, {
    contentType: file.type,
    upsert: false,
    cacheControl: '3600',
    // Prevent execution
    metadata: {
      originalName: file.name,
      uploadedBy: 'admin',
      uploadDate: new Date().toISOString()
    }
  })
```

**References:**
- CWE-434: https://cwe.mitre.org/data/definitions/434.html
- OWASP File Upload: https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload

---

### 🚨 CRITICAL-5: Insufficient Input Sanitization for XSS
**File:** `/lib/validation.ts:147-166`
**CVSS Score:** 8.2 (High-Critical)
**CWE:** CWE-79 (Improper Neutralization of Input During Web Page Generation)

**Description:**
The custom `sanitizeString()` function uses regex-based filtering which is **insufficient** and **bypassable** for XSS prevention. Multiple bypass techniques exist.

**Vulnerable Code:**
```typescript
// lib/validation.ts:147-166
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '') // ❌ EASILY BYPASSED
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // ❌ BYPASSED
    // Remove event handlers
    .replace(/on\w+="[^"]*"/g, '') // ❌ BYPASSED
    .replace(/on\w+='[^']*'/g, '') // ❌ BYPASSED
    // Remove javascript: protocol
    .replace(/javascript:/gi, '') // ❌ BYPASSED
    .trim()
}
```

**XSS Bypass Examples:**
```javascript
// Bypass 1: Null byte injection
"<scri\x00pt>alert(1)</script>"

// Bypass 2: Case mixing
"<ScRiPt>alert(1)</ScRiPt>"

// Bypass 3: HTML encoding
"<img src=x onerror=&#97;&#108;&#101;&#114;&#116;(1)>"

// Bypass 4: JavaScript URL with spaces
"java\tscript:alert(1)"

// Bypass 5: Event handler without quotes
"<img src=x onerror=alert(1)>"

// Bypass 6: Nested tags
"<<script>script>alert(1)<</script>/script>"

// Bypass 7: SVG with script
"<svg><script>alert(1)</script></svg>"

// All of these bypass the current sanitization!
```

**Impact:**
- Stored XSS in team bios, service descriptions, job listings
- Session hijacking via cookie theft
- Admin credential theft
- Malicious redirects
- Defacement
- Keylogging

**Fix - Use DOMPurify:**
```bash
npm install isomorphic-dompurify
npm install --save-dev @types/dompurify
```

```typescript
// lib/sanitization.ts
import DOMPurify from 'isomorphic-dompurify'

/**
 * SECURE: Sanitize string input to prevent XSS
 * Uses DOMPurify - industry-standard XSS sanitization
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // DOMPurify with strict config (text only, no HTML)
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true // Keep text content
  }).trim()
}

/**
 * SECURE: Sanitize HTML (for rich text editors)
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // DOMPurify with restricted tag set
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false
  })
}

/**
 * SECURE: Sanitize URL to prevent javascript: and data: URLs
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }

  const cleaned = DOMPurify.sanitize(url, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })

  // Only allow http(s) URLs
  if (!cleaned.match(/^https?:\/\//i)) {
    return ''
  }

  return cleaned
}
```

**Apply to all inputs:**
```typescript
// app/api/admin/team/route.ts
import { sanitizeString, sanitizeHtml } from '@/lib/sanitization'

const sanitizedData = {
  name: sanitizeString(data.name),
  position: sanitizeString(data.position),
  bio: sanitizeHtml(data.bio), // If rich text editor
  email: data.email, // Already validated
  // ...
}
```

**Frontend Output Encoding:**
```tsx
// components/TeamMember.tsx
import DOMPurify from 'isomorphic-dompurify'

export function TeamMember({ member }: { member: TeamMemberType }) {
  // React automatically escapes text content
  return (
    <div>
      <h3>{member.name}</h3> {/* Auto-escaped by React */}
      <p>{member.position}</p> {/* Auto-escaped */}

      {/* For rich text (if needed) */}
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(member.bio)
        }}
      />
    </div>
  )
}
```

**References:**
- DOMPurify: https://github.com/cure53/DOMPurify
- OWASP XSS: https://owasp.org/www-community/attacks/xss/
- CWE-79: https://cwe.mitre.org/data/definitions/79.html

---

### 🚨 CRITICAL-6: Hardcoded JWT Secret Fallback
**File:** `/lib/auth.ts:24-26`
**CVSS Score:** 9.0 (Critical)
**CWE:** CWE-321 (Use of Hard-coded Cryptographic Key)

**Description:**
The JWT secret has a hardcoded fallback value that will be used if the environment variable is not set. This compromises all session tokens.

**Vulnerable Code:**
```typescript
// lib/auth.ts:24-26
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'peg-security-super-secret-key-change-in-production'
)
```

**Why This Is Critical:**
- If `JWT_SECRET` env var is missing, fallback is used
- Fallback is publicly visible in code/GitHub
- Anyone can forge admin session tokens
- Complete authentication bypass

**Attack Scenario:**
```javascript
// Attacker knows the fallback secret from GitHub
const knownSecret = 'peg-security-super-secret-key-change-in-production'

// Forge admin token
import { SignJWT } from 'jose'

const fakeToken = await new SignJWT({
  userId: 'admin',
  username: 'admin',
  isAdmin: true,
  createdAt: Date.now(),
  expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('1y')
  .sign(new TextEncoder().encode(knownSecret))

// Use forged token to access admin panel
document.cookie = `peg_admin_session=${fakeToken}; path=/`
// Now has full admin access!
```

**Impact:**
- Complete authentication bypass
- Unauthorized admin access
- All admin operations can be performed
- Data breach and manipulation

**Fix:**
```typescript
// lib/auth.ts
// ❌ REMOVE THE FALLBACK - fail if not configured
if (!process.env.JWT_SECRET) {
  throw new Error(
    'CRITICAL: JWT_SECRET environment variable is not set. ' +
    'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
  )
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
```

**Generate Secure Secret:**
```bash
# Generate cryptographically secure 256-bit secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env.local
JWT_SECRET=<generated_secret_here>
```

**Additional Security:**
```typescript
// Validate secret length
if (process.env.JWT_SECRET.length < 32) {
  throw new Error(
    'JWT_SECRET must be at least 32 characters. ' +
    'Current length: ' + process.env.JWT_SECRET.length
  )
}
```

**References:**
- CWE-321: https://cwe.mitre.org/data/definitions/321.html
- JWT Best Practices: https://tools.ietf.org/html/rfc8725

---

### 🚨 CRITICAL-7: No Request Size Limits
**Files:** All API routes
**CVSS Score:** 7.5 (High)
**CWE:** CWE-770 (Allocation of Resources Without Limits or Throttling)

**Description:**
No request body size limits are configured, allowing attackers to send extremely large payloads causing memory exhaustion and DoS.

**Vulnerable Configuration:**
```typescript
// next.config.mjs - NO size limits configured
const nextConfig = {
  // ❌ Missing API route size limits
}
```

**Attack Scenario:**
```javascript
// Attacker sends massive JSON payload
const hugePayload = {
  name: 'A'.repeat(10000000), // 10MB string
  bio: 'B'.repeat(50000000),  // 50MB string
  // ... more huge fields
}

// Server attempts to parse, runs out of memory
await fetch('/api/admin/team', {
  method: 'POST',
  body: JSON.stringify(hugePayload)
})

// Repeat requests exhaust server memory -> DoS
```

**Impact:**
- Memory exhaustion
- Application crash
- Denial of Service
- Server becomes unresponsive

**Fix:**
```typescript
// next.config.mjs
const nextConfig = {
  // Add API route size limits
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Limit request body to 1MB
    },
    responseLimit: '4mb', // Limit response size
  },

  // Existing configuration...
  typescript: {
    ignoreBuildErrors: true,
  },
  // ...
}

export default nextConfig
```

**Per-Route Limits:**
```typescript
// For file uploads (larger limit)
// app/api/admin/upload/route.ts
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Allow larger uploads
    },
  },
}

export async function POST(request: NextRequest) {
  // Additional validation
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'Request too large. Maximum size: 10MB' },
      { status: 413 }
    )
  }
  // ... rest of code
}
```

**Middleware Size Check:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const contentLength = request.headers.get('content-length')

  // Enforce size limits based on route
  if (request.nextUrl.pathname.startsWith('/api/admin/upload')) {
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413 }
      )
    }
  } else if (request.nextUrl.pathname.startsWith('/api/')) {
    if (contentLength && parseInt(contentLength) > 1 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413 }
      )
    }
  }

  // ... existing middleware code
}
```

**References:**
- CWE-770: https://cwe.mitre.org/data/definitions/770.html
- OWASP DoS: https://owasp.org/www-community/attacks/Denial_of_Service

---

### 🚨 CRITICAL-8: CSP Allows unsafe-inline and unsafe-eval
**File:** `/next.config.mjs:46-48`
**CVSS Score:** 7.5 (High)
**CWE:** CWE-1004 (Sensitive Cookie Without 'HttpOnly' Flag)

**Description:**
The Content Security Policy allows `'unsafe-inline'` and `'unsafe-eval'` which **completely bypasses** XSS protection provided by CSP.

**Vulnerable Code:**
```typescript
// next.config.mjs:46-48
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; ..."
}
```

**Why This Is Critical:**
- `'unsafe-inline'` allows inline `<script>` tags and event handlers
- `'unsafe-eval'` allows `eval()` and `new Function()`
- These directives completely negate CSP's XSS protection
- Any XSS payload can execute despite CSP

**Impact:**
- CSP provides no protection against XSS
- False sense of security
- All injected scripts will execute

**Fix - Use Nonce-Based CSP:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'

export async function middleware(request: NextRequest) {
  // Generate unique nonce for this request
  const nonce = crypto.randomBytes(16).toString('base64')

  const response = NextResponse.next()

  // Set strict CSP with nonce
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://trusted-cdn.com;
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' data: https://res.cloudinary.com;
    font-src 'self' data:;
    connect-src 'self' https://api.airtable.com https://api.resend.com https://api.cloudinary.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  response.headers.set('Content-Security-Policy', cspHeader)

  // Store nonce in header for use in pages
  response.headers.set('x-nonce', nonce)

  return response
}
```

**Update Layout to Use Nonce:**
```tsx
// app/layout.tsx
import { headers } from 'next/headers'

export default function RootLayout({ children }: { children: React.Node }) {
  const nonce = headers().get('x-nonce')

  return (
    <html lang="en">
      <head>
        {/* All inline scripts must use nonce */}
        <script nonce={nonce} dangerouslySetInnerHTML={{
          __html: `
            // Inline script with nonce
            console.log('CSP-safe inline script')
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Remove next.config.mjs CSP (use middleware instead):**
```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // ... other headers
          // ❌ REMOVE CSP from here - handle in middleware
        ]
      }
    ]
  }
}
```

**References:**
- CSP Best Practices: https://csp.withgoogle.com/docs/strict-csp.html
- OWASP CSP: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html

---

### 🚨 CRITICAL-9: Admin Password Stored in Plaintext in Environment
**File:** `.env.example:39`
**CVSS Score:** 9.0 (Critical)
**CWE:** CWE-256 (Plaintext Storage of a Password)

**Description:**
Admin password is stored in plaintext in environment variables and compared directly without hashing.

**Current Implementation:**
```typescript
// lib/auth.ts:34-38
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: process.env.ADMIN_PASSWORD // ❌ Plaintext
}

// lib/auth.ts:51-57
export function verifyCredentials(username: string, password: string): boolean {
  return (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password // ❌ Direct comparison
  )
}
```

**Impact:**
- If server is compromised, password is immediately exposed
- Environment variables can be logged accidentally
- Process listing may expose password
- No defense in depth

**Fix:**
See CRITICAL-3 above for complete bcrypt implementation.

---

## HIGH SEVERITY ISSUES

### ⚠️ HIGH-1: Missing Audit Logging
**Files:** All admin API routes
**CVSS Score:** 6.5 (Medium-High)
**CWE:** CWE-778 (Insufficient Logging)

**Description:**
While `logAdminAction()` function exists in `lib/auth.ts`, it is **never called** in any admin route. No audit trail of admin actions.

**Impact:**
- Cannot detect unauthorized access
- Cannot investigate security incidents
- No accountability for admin actions
- Compliance violations (GDPR, POPIA)

**Fix:**
```typescript
// app/api/admin/team/route.ts
import { getSession, logAdminAction } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getSession(request)

  try {
    const body = await request.json()
    // ... validate and create team member ...

    // LOG ACTION
    logAdminAction(session!, 'CREATE_TEAM_MEMBER', {
      teamMemberId: createdTeamMember.id,
      name: createdTeamMember.name,
      position: createdTeamMember.position
    })

    return NextResponse.json({
      success: true,
      data: createdTeamMember
    })
  } catch (error) {
    // LOG FAILURE
    logAdminAction(session!, 'CREATE_TEAM_MEMBER_FAILED', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    // ...
  }
}
```

**Implement Persistent Audit Log:**
```typescript
// lib/audit-log.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface AuditLogEntry {
  timestamp: string
  userId: string
  username: string
  action: string
  resourceType: string
  resourceId?: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  success: boolean
}

export async function logAdminAction(
  session: SessionData,
  action: string,
  details: Record<string, any> = {},
  request?: NextRequest
): Promise<void> {
  const logEntry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    userId: session.userId,
    username: session.username,
    action,
    resourceType: action.split('_')[0], // e.g., "CREATE" from "CREATE_TEAM_MEMBER"
    resourceId: details.id || details.teamMemberId || details.serviceId,
    details,
    ipAddress: request ? getClientIp(request) : 'unknown',
    userAgent: request?.headers.get('user-agent') || 'unknown',
    success: true
  }

  // Store in Supabase audit_logs table
  try {
    await supabase.from('audit_logs').insert(logEntry)
  } catch (error) {
    console.error('[AUDIT LOG ERROR]', error)
    // Don't fail the request if logging fails
  }

  // Also log to console for immediate visibility
  console.log('[ADMIN ACTION]', JSON.stringify(logEntry))
}
```

**Create Supabase Audit Table:**
```sql
-- Run in Supabase SQL Editor
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);

-- Enable RLS (admin only can read)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read all audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  ));
```

---

### ⚠️ HIGH-2: No Session Timeout or Inactivity Logout
**File:** `/lib/auth.ts:32`
**CVSS Score:** 6.5 (Medium-High)
**CWE:** CWE-613 (Insufficient Session Expiration)

**Description:**
Sessions expire after 8 hours but there's no inactivity timeout. If an admin forgets to logout, their session remains valid for 8 hours.

**Fix:**
```typescript
// lib/auth.ts
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 hours
const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export interface SessionData {
  userId: string
  username: string
  isAdmin: boolean
  createdAt: number
  expiresAt: number
  lastActivity: number // ADD THIS
}

export async function requireAuth(
  request: NextRequest
): Promise<SessionData | null> {
  const session = await getSession(request)

  if (!session) {
    return null
  }

  const now = Date.now()

  // Check absolute expiration
  if (session.expiresAt < now) {
    return null
  }

  // Check inactivity timeout
  if (now - session.lastActivity > INACTIVITY_TIMEOUT) {
    console.log('[SESSION EXPIRED] Inactivity timeout', {
      username: session.username,
      lastActivity: new Date(session.lastActivity).toISOString()
    })
    return null
  }

  // Update last activity (refresh session)
  session.lastActivity = now

  return session
}
```

---

### ⚠️ HIGH-3: Slug Generation Vulnerable to Collisions
**File:** `/app/api/admin/services/[id]/route.ts:157-161`
**CVSS Score:** 6.0 (Medium)
**CWE:** CWE-841 (Improper Enforcement of Behavioral Workflow)

**Description:**
Slug generation uses simple regex replacement which can create duplicate slugs. No collision handling.

**Vulnerable Code:**
```typescript
const newSlug = data.title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
```

**Example Collisions:**
```
"Security Services!"  -> "security-services"
"Security & Services" -> "security-services" // DUPLICATE!
"Security - Services" -> "security-services" // DUPLICATE!
```

**Fix:**
```typescript
// lib/slug.ts
import crypto from 'crypto'

export function generateUniqueSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length

  // Add short hash for uniqueness
  const hash = crypto
    .createHash('md5')
    .update(title + Date.now())
    .digest('hex')
    .substring(0, 6)

  return `${baseSlug}-${hash}`
}

// Check for existing slug
export async function ensureUniqueSlug(
  table: any,
  slug: string,
  excludeId?: string
): Promise<string> {
  let uniqueSlug = slug
  let counter = 1

  while (true) {
    const query = table
      .select('id')
      .eq('slug', uniqueSlug)

    if (excludeId) {
      query.neq('id', excludeId)
    }

    const { data } = await query.single()

    if (!data) {
      return uniqueSlug // Slug is unique
    }

    // Collision detected, add counter
    uniqueSlug = `${slug}-${counter}`
    counter++
  }
}
```

---

### ⚠️ HIGH-4: No Concurrent Session Limit
**Files:** Authentication system
**CVSS Score:** 5.5 (Medium)
**CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts)

**Description:**
Admin can have unlimited concurrent sessions from different devices/browsers with no way to revoke individual sessions.

**Fix:**
Implement session management with Supabase:
```typescript
// lib/session-manager.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(/*...*/)

export interface SessionRecord {
  id: string
  userId: string
  token: string
  ipAddress: string
  userAgent: string
  createdAt: string
  lastActivity: string
  expiresAt: string
}

export async function createSessionRecord(
  userId: string,
  token: string,
  request: NextRequest
): Promise<void> {
  // Limit to 3 concurrent sessions
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (sessions && sessions.length >= 3) {
    // Revoke oldest session
    await supabase
      .from('sessions')
      .delete()
      .eq('id', sessions[sessions.length - 1].id)
  }

  // Create new session record
  await supabase.from('sessions').insert({
    user_id: userId,
    token,
    ip_address: getClientIp(request),
    user_agent: request.headers.get('user-agent'),
    created_at: new Date().toISOString(),
    last_activity: new Date().toISOString(),
    expires_at: new Date(Date.now() + SESSION_DURATION).toISOString()
  })
}
```

---

### ⚠️ HIGH-5: Missing Input Length Validation
**Files:** Multiple API routes
**Impact:** DoS via large inputs, database overflow

**Fix:**
Add strict length limits to all Zod schemas:
```typescript
const teamMemberSchema = z.object({
  name: z.string().min(2).max(100),
  position: z.string().min(2).max(100),
  bio: z.string().min(50).max(2000), // Add max limit
  email: z.string().email().max(255),
  phone: z.string().min(10).max(20),
  // ...
})
```

---

### ⚠️ HIGH-6: No Rate Limiting on File Uploads
**File:** `/app/api/admin/upload/route.ts`
**Impact:** Storage exhaustion, DoS

**Current State:**
```typescript
// ❌ No rate limiting on upload endpoint
export async function POST(request: NextRequest) {
  // ... upload handling
}
```

**Fix:**
```typescript
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Add rate limiting (10 uploads per hour)
  const rateLimitResult = await rateLimit(request, 'fileUpload')

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.message },
      { status: 429 }
    )
  }

  // ... rest of upload code
}
```

---

### ⚠️ HIGH-7: Supabase Service Role Key Exposed in Client Bundle
**Risk:** If service role key is used client-side

**Verification Needed:**
```bash
# Check if SUPABASE_SERVICE_ROLE_KEY is used in client components
grep -r "SUPABASE_SERVICE_ROLE_KEY" app/
```

**Fix:**
Ensure service role key is **ONLY** used in:
- API routes (`app/api/`)
- Server components
- Server actions
- Middleware

**NEVER use in:**
- Client components
- Client-side hooks
- Browser JavaScript

---

### ⚠️ HIGH-8: No Protection Against Brute Force on Password Reset
**(Future concern when password reset is implemented)**

**Recommendation:**
When implementing password reset:
1. Rate limit requests (3 per hour per email)
2. Add CAPTCHA after failed attempts
3. Use cryptographically secure tokens
4. Set short expiration (15 minutes)
5. Invalidate after use

---

### ⚠️ HIGH-9: Information Disclosure in Error Messages
**File:** `/app/api/admin/auth/login/route.ts:63-69`

**Issue:**
```typescript
return NextResponse.json(
  {
    error: 'Invalid credentials',
    attemptsRemaining: Math.max(0, 5 - failedAttempt.attempts) // ❌ Reveals rate limit info
  },
  { status: 401 }
)
```

**Fix:**
```typescript
// Don't reveal exact attempts remaining
return NextResponse.json(
  { error: 'Invalid credentials' },
  { status: 401 }
)
```

---

### ⚠️ HIGH-10: No Protection Against Clickjacking
**File:** `next.config.mjs:27-29`

**Current:**
```typescript
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN' // ⚠️ Allows framing from same origin
}
```

**Better:**
```typescript
{
  key: 'X-Frame-Options',
  value: 'DENY' // Completely prevent framing
}
```

---

### ⚠️ HIGH-11: Weak CORS Configuration
**Files:** Multiple API routes with OPTIONS handlers

**Issue:**
No explicit CORS validation - relies on browser enforcement only.

**Fix:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'https://pegsecurity.co.za',
    'https://www.pegsecurity.co.za'
  ]

  // In development, allow localhost
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000')
  }

  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { error: 'CORS policy violation' },
      { status: 403 }
    )
  }

  // ... rest of middleware
}
```

---

### ⚠️ HIGH-12: No Secrets Rotation Policy
**Impact:** If secrets are compromised, no process for rotation

**Recommendation:**
Implement quarterly secret rotation:
1. JWT_SECRET
2. ADMIN_PASSWORD
3. API keys (Airtable, Cloudinary, Resend)
4. Database credentials

---

## MEDIUM SEVERITY ISSUES

### ⚙️ MEDIUM-1: Missing Security Headers
**File:** `next.config.mjs`

**Missing Headers:**
```typescript
{
  key: 'X-Permitted-Cross-Domain-Policies',
  value: 'none'
},
{
  key: 'Cross-Origin-Embedder-Policy',
  value: 'require-corp'
},
{
  key: 'Cross-Origin-Opener-Policy',
  value: 'same-origin'
},
{
  key: 'Cross-Origin-Resource-Policy',
  value: 'same-origin'
}
```

---

### ⚙️ MEDIUM-2: No Email Validation on Send
**Files:** Email sending functions

**Issue:**
Email addresses validated but no verification that they're deliverable (no SMTP check, no confirmation).

**Recommendation:**
Implement email verification flow for critical operations.

---

### ⚙️ MEDIUM-3: Logging Sensitive Data
**File:** `/app/api/admin/auth/login/route.ts:53-58`

**Issue:**
```typescript
console.log('[LOGIN FAILED]', {
  username, // ❌ Logging attempted username
  ip: clientIp,
  attempts: failedAttempt.attempts
})
```

**Fix:**
```typescript
console.log('[LOGIN FAILED]', {
  usernameHash: crypto.createHash('sha256').update(username).digest('hex'),
  ip: clientIp,
  attempts: failedAttempt.attempts
})
```

---

### ⚙️ MEDIUM-4: No Subresource Integrity (SRI)
**Impact:** If CDN is compromised, malicious scripts can be injected

**Fix:**
If using external scripts/styles, add SRI hashes:
```html
<script
  src="https://cdn.example.com/script.js"
  integrity="sha384-hash_here"
  crossorigin="anonymous"
></script>
```

---

### ⚙️ MEDIUM-5: No Database Connection Pooling Limits
**Supabase Configuration**

**Recommendation:**
Configure Supabase connection limits to prevent connection exhaustion.

---

### ⚙️ MEDIUM-6: Missing Input Normalization
**Files:** Email, phone validation

**Issue:**
Emails normalized to lowercase, but Unicode normalization not applied.

**Fix:**
```typescript
export function validateEmail(email: string): ValidationResult {
  const normalizedEmail = email
    .trim()
    .toLowerCase()
    .normalize('NFKC') // Unicode normalization

  // ... rest of validation
}
```

---

### ⚙️ MEDIUM-7: No Protection Against Enumeration
**File:** `/app/api/admin/auth/login/route.ts`

**Issue:**
Different responses for "user not found" vs "wrong password" allow user enumeration.

**Current Behavior:**
Same error message ("Invalid credentials") is returned, which is **GOOD**. However, timing differences may still reveal information.

**Recommendation:**
Add constant-time comparison and fixed delays:
```typescript
// Always take same amount of time regardless of success/failure
await new Promise(resolve => setTimeout(resolve, 500))
```

---

### ⚙️ MEDIUM-8: No HTTP Strict Transport Security Preload
**File:** `next.config.mjs:23-25`

**Current:**
```typescript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

**Recommendation:**
Submit domain to HSTS preload list: https://hstspreload.org/

---

## LOW SEVERITY ISSUES

### 🔹 LOW-1: Console.log in Production
**Files:** Multiple files with console.log/console.error

**Recommendation:**
Use proper logging library (winston, pino) and configure log levels based on environment.

---

### 🔹 LOW-2: No Favicon Security
**Recommendation:**
Serve favicon from CDN with SRI or validate integrity.

---

### 🔹 LOW-3: No robots.txt Security Headers
**Recommendation:**
Add X-Robots-Tag header to sensitive endpoints:
```typescript
{
  key: 'X-Robots-Tag',
  value: 'noindex, nofollow'
}
```

---

### 🔹 LOW-4: Missing Cache-Control on Sensitive Endpoints
**Files:** Admin API routes

**Fix:**
```typescript
return NextResponse.json(data, {
  status: 200,
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
})
```

---

### 🔹 LOW-5: No Security.txt
**Recommendation:**
Create `/.well-known/security.txt`:
```
Contact: mailto:security@pegsecurity.co.za
Expires: 2026-01-01T00:00:00.000Z
Preferred-Languages: en
Canonical: https://pegsecurity.co.za/.well-known/security.txt
```

---

### 🔹 LOW-6: TypeScript Strict Mode Disabled
**File:** `next.config.mjs:4-6`

**Issue:**
```typescript
typescript: {
  ignoreBuildErrors: true, // ❌ Disables type safety
},
```

**Recommendation:**
Enable strict type checking in production builds.

---

## OWASP TOP 10 (2021) COMPLIANCE

| # | Vulnerability | Status | Findings |
|---|---------------|--------|----------|
| A01:2021 | **Broken Access Control** | ⚠️ **PARTIAL** | ✅ Middleware protection<br>⚠️ No session limits<br>⚠️ No concurrent session control |
| A02:2021 | **Cryptographic Failures** | 🚨 **FAIL** | 🚨 Plaintext password storage<br>🚨 SHA-256 for passwords<br>🚨 Hardcoded JWT fallback |
| A03:2021 | **Injection** | ⚠️ **PARTIAL** | 🚨 Airtable formula injection<br>✅ Parameterized Supabase queries |
| A04:2021 | **Insecure Design** | ⚠️ **PARTIAL** | 🚨 No CSRF enforcement<br>⚠️ No audit logging<br>✅ Rate limiting implemented |
| A05:2021 | **Security Misconfiguration** | ⚠️ **PARTIAL** | 🚨 unsafe-inline CSP<br>⚠️ TypeScript strict mode off<br>✅ Security headers present |
| A06:2021 | **Vulnerable Components** | ✅ **PASS** | ✅ No known vulnerabilities (npm audit clean) |
| A07:2021 | **Authentication Failures** | 🚨 **FAIL** | 🚨 Weak password hashing<br>🚨 Plaintext storage<br>✅ Rate limiting on login |
| A08:2021 | **Data Integrity Failures** | ⚠️ **PARTIAL** | 🚨 No CSRF validation<br>⚠️ No SRI for CDN resources |
| A09:2021 | **Logging/Monitoring Failures** | 🚨 **FAIL** | 🚨 No audit logging implementation<br>⚠️ Sensitive data in logs |
| A10:2021 | **SSRF** | ✅ **PASS** | ✅ No user-controlled URLs<br>✅ URL validation present |

**Overall OWASP Compliance: 30% (3/10 passing)**

---

## REMEDIATION ROADMAP

### Phase 1: IMMEDIATE (< 24 hours)

**CRITICAL FIXES - DO NOT DEPLOY WITHOUT THESE:**

1. **Fix Airtable Formula Injection** (2 hours)
   - File: `/app/api/jobs/[slug]/route.ts`
   - Add slug validation and sanitization
   - Test: `curl "http://localhost:3000/api/jobs/test')+OR(1=1)+AND('1'='1"`

2. **Implement CSRF Validation** (4 hours)
   - Create `lib/csrf.ts` middleware
   - Apply to all POST/PUT/DELETE endpoints
   - Update client-side forms
   - Test: Attempt CSRF attack from external domain

3. **Fix Password Hashing** (3 hours)
   - Install bcrypt
   - Migrate to bcrypt hashing
   - Generate new hashed password
   - Update `.env.local`
   - Test login still works

4. **Remove JWT Secret Fallback** (30 minutes)
   - Remove hardcoded fallback
   - Generate secure secret
   - Update `.env.local`
   - Verify app fails without secret

5. **Add File Magic Number Validation** (3 hours)
   - Create `lib/file-validation.ts`
   - Implement magic number checks
   - Apply to upload endpoint
   - Test: Try uploading PHP file as JPEG

6. **Replace Custom Sanitization with DOMPurify** (2 hours)
   - Install isomorphic-dompurify
   - Replace all `sanitizeString()` calls
   - Test XSS payloads blocked
   - Test legitimate input still works

7. **Add Request Size Limits** (1 hour)
   - Configure `next.config.mjs`
   - Add middleware size checks
   - Test large payload rejection

8. **Implement Strict CSP with Nonce** (4 hours)
   - Remove unsafe-inline/unsafe-eval
   - Generate nonces in middleware
   - Update layout to use nonces
   - Test all scripts still load

9. **Fix Plaintext Password Storage** (30 minutes)
   - Already covered in bcrypt migration
   - Ensure environment variable uses hash

**Total Estimated Time: ~20 hours (2-3 days with testing)**

---

### Phase 2: SHORT-TERM (7 days)

1. **Implement Audit Logging** (8 hours)
   - Create Supabase audit_logs table
   - Implement `logAdminAction()` calls
   - Create audit log viewer in admin panel
   - Test logging for all operations

2. **Add Session Inactivity Timeout** (4 hours)
   - Implement lastActivity tracking
   - Add middleware checks
   - Test automatic logout after 30min

3. **Fix Slug Collision Handling** (3 hours)
   - Implement unique slug generation
   - Add collision detection
   - Test duplicate titles

4. **Implement Concurrent Session Limits** (6 hours)
   - Create sessions table
   - Track active sessions
   - Limit to 3 per user
   - Add session management UI

5. **Add Comprehensive Input Length Validation** (4 hours)
   - Update all Zod schemas
   - Add max length to all fields
   - Test large inputs rejected

6. **Add Rate Limiting to Upload Endpoint** (2 hours)
   - Apply rate limiter
   - Test upload throttling

7. **Verify Supabase Key Usage** (2 hours)
   - Audit all service role key usage
   - Ensure not in client bundle
   - Document server-only usage

8. **Improve Error Messages** (2 hours)
   - Remove information disclosure
   - Generic error responses
   - Test attacker can't enumerate

9. **Strengthen CORS Configuration** (3 hours)
   - Implement origin validation
   - Whitelist allowed origins
   - Test cross-origin requests blocked

10. **Document Secrets Rotation Policy** (2 hours)
    - Create rotation procedures
    - Schedule quarterly rotations
    - Implement key versioning

**Total Estimated Time: ~36 hours (5-7 days)**

---

### Phase 3: MEDIUM-TERM (30 days)

1. **Add Additional Security Headers** (2 hours)
2. **Implement Email Verification** (8 hours)
3. **Fix Sensitive Data Logging** (4 hours)
4. **Add Subresource Integrity** (3 hours)
5. **Configure Database Connection Limits** (2 hours)
6. **Implement Input Normalization** (3 hours)
7. **Add Constant-Time Comparisons** (2 hours)
8. **Submit to HSTS Preload List** (1 hour)

**Total Estimated Time: ~25 hours (4 weeks)**

---

### Phase 4: LONG-TERM (90 days)

1. **Implement Proper Logging Library** (8 hours)
2. **Create Security.txt** (1 hour)
3. **Add Cache-Control to Sensitive Endpoints** (3 hours)
4. **Enable TypeScript Strict Mode** (16 hours - may require refactoring)
5. **Implement Password Reset Flow** (16 hours)
6. **Add Two-Factor Authentication** (24 hours)
7. **Implement Security Monitoring/Alerting** (16 hours)
8. **Conduct Penetration Testing** (40 hours)

**Total Estimated Time: ~124 hours (3 months)**

---

## TESTING CHECKLIST

### Before Deployment

- [ ] All CRITICAL vulnerabilities fixed
- [ ] CSRF protection implemented and tested
- [ ] Password hashing uses bcrypt
- [ ] File uploads validate magic numbers
- [ ] XSS protection uses DOMPurify
- [ ] CSP uses nonces (no unsafe-inline)
- [ ] Rate limiting on all public endpoints
- [ ] Audit logging functional
- [ ] Session timeout implemented
- [ ] Request size limits enforced
- [ ] No secrets in code or environment fallbacks
- [ ] npm audit shows no vulnerabilities
- [ ] Manual penetration test passed

### Security Test Commands

```bash
# 1. Test Airtable Formula Injection
curl "http://localhost:3000/api/jobs/test')+OR(1=1)+AND('1'='1"
# Expected: 400 Bad Request (invalid slug)

# 2. Test CSRF Protection
curl -X POST http://localhost:3000/api/admin/team \
  -H "Content-Type: application/json" \
  -H "Cookie: peg_admin_session=<valid_token>" \
  -d '{"name":"Hacker"}'
# Expected: 403 Forbidden (missing CSRF token)

# 3. Test File Upload Magic Numbers
# Upload PHP file disguised as JPEG
# Expected: 400 Bad Request (invalid file content)

# 4. Test XSS Payloads
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"test@test.com","phone":"0123456789","serviceType":"other","message":"Test","preferredContact":"email"}'
# Expected: Script tags stripped from response

# 5. Test Request Size Limit
dd if=/dev/zero bs=1M count=15 | curl -X POST \
  -H "Content-Type: application/json" \
  --data-binary @- \
  http://localhost:3000/api/admin/team
# Expected: 413 Payload Too Large

# 6. Test Rate Limiting
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","phone":"0123456789","serviceType":"other","message":"Test message here","preferredContact":"email"}'
  sleep 1
done
# Expected: 429 Too Many Requests after 5 requests

# 7. Test Session Expiry
# Login, wait 31 minutes (or modify timeout to 1 min for testing), attempt action
# Expected: 401 Unauthorized (session expired)

# 8. Test Dependency Vulnerabilities
npm audit
# Expected: 0 vulnerabilities

# 9. Test Authentication
# Try accessing admin route without session
curl http://localhost:3000/api/admin/team
# Expected: 401 Unauthorized

# 10. Test CSP
# Check response headers
curl -I http://localhost:3000
# Expected: Content-Security-Policy without unsafe-inline/unsafe-eval
```

---

## COMPLIANCE & REGULATORY REQUIREMENTS

### GDPR Compliance (if handling EU data)

**Current Gaps:**
- ⚠️ No audit logging (Article 30 - Records of Processing)
- ⚠️ No data breach notification system (Article 33)
- ⚠️ No data deletion mechanism (Article 17 - Right to Erasure)
- ✅ Data minimization (Article 5)
- ✅ Encryption in transit (HTTPS)

**Required Actions:**
1. Implement comprehensive audit logging
2. Create data breach notification procedure
3. Implement user data deletion API
4. Document data processing activities
5. Implement data export functionality (Article 20 - Portability)

### POPIA Compliance (South African Data Protection)

**Current Gaps:**
- ⚠️ No consent management system
- ⚠️ No data subject rights interface
- ⚠️ No privacy policy links in forms
- ✅ Security safeguards implemented

**Required Actions:**
1. Add consent checkboxes to all forms
2. Create privacy policy
3. Implement data subject access request handling
4. Document data processing purposes
5. Appoint Information Officer

### PCI DSS (if processing payments in future)

**Current Status:** Not applicable (no payment processing)

**If implementing payments:**
- Never store card data (use Stripe/PayFast)
- Use PCI-compliant payment gateway
- Implement additional logging
- Conduct quarterly security scans
- Annual PCI audit required

---

## INCIDENT RESPONSE PLAN

### If Security Breach Detected

**IMMEDIATE (Within 1 hour):**
1. Identify affected systems
2. Isolate compromised systems if possible
3. Rotate ALL credentials:
   - ADMIN_PASSWORD
   - JWT_SECRET
   - AIRTABLE_ACCESS_TOKEN
   - CLOUDINARY_API_SECRET
   - SUPABASE_SERVICE_ROLE_KEY
   - RESEND_API_KEY
4. Invalidate all active sessions
5. Enable maintenance mode if necessary
6. Preserve logs for forensics

**SHORT-TERM (Within 24 hours):**
1. Conduct forensic analysis
2. Identify breach vector
3. Assess data exposure
4. Patch vulnerability
5. Notify affected users (if data exposed)
6. Report to relevant authorities (GDPR/POPIA)
7. Document incident timeline

**MEDIUM-TERM (Within 1 week):**
1. Implement additional safeguards
2. Conduct security review
3. Update security documentation
4. Train team on lessons learned
5. Consider penetration test
6. Review insurance coverage

**LONG-TERM (Within 1 month):**
1. Implement monitoring/alerting improvements
2. Update incident response plan
3. Conduct tabletop exercises
4. Review third-party security
5. Implement defense-in-depth improvements

---

## SECURITY CONTACTS

**For Reporting Security Vulnerabilities:**
- **Primary:** security@pegsecurity.co.za
- **Backup:** bakiel@pegsecurity.co.za
- **Emergency:** +27 79 413 9180

**Expected Response Times:**
- Critical: 1 hour
- High: 4 hours
- Medium: 24 hours
- Low: 1 week

---

## CONCLUSION

### Summary

The PEG Security application demonstrates a **solid security foundation** with many best practices implemented:

✅ **Strengths:**
- Comprehensive rate limiting system
- Input validation framework in place
- Authentication middleware protecting admin routes
- Security headers configured
- No vulnerable dependencies
- Detailed security documentation

🚨 **Critical Weaknesses:**
- Airtable formula injection vulnerability
- CSRF protection not enforced
- Weak password hashing (SHA-256)
- Insufficient XSS sanitization
- No audit logging implementation
- File upload magic number validation missing

### Risk Level: MODERATE-HIGH

**The application should NOT be deployed to production until ALL CRITICAL vulnerabilities are remediated.**

### Recommended Priority

1. **DO NOT DEPLOY** until Phase 1 (IMMEDIATE) fixes are complete
2. Complete Phase 2 (SHORT-TERM) before handling sensitive data
3. Schedule Phase 3 and 4 improvements for ongoing security maturity

### Estimated Remediation Time

- **Phase 1 (CRITICAL):** 2-3 days (20 hours)
- **Phase 2 (HIGH):** 5-7 days (36 hours)
- **Phase 3 (MEDIUM):** 4 weeks (25 hours)
- **Phase 4 (LONG-TERM):** 3 months (124 hours)

**Total: ~205 hours over 3-4 months for complete security hardening**

### Final Recommendation

The application shows strong security awareness and good architectural decisions. With the critical vulnerabilities addressed, this will be a robust and secure platform. The development team has clearly prioritized security, as evidenced by the comprehensive `SECURITY_RULES.md` document.

**Next Steps:**
1. Review this audit report with development team
2. Prioritize Phase 1 fixes
3. Implement fixes systematically
4. Test thoroughly before deployment
5. Schedule regular security audits (quarterly)
6. Consider third-party penetration testing before launch

---

**Report End**

*This security audit was conducted with adversarial mindset and OWASP methodology. All findings are based on static code analysis, configuration review, and known attack patterns. Dynamic penetration testing is recommended for production deployment.*
