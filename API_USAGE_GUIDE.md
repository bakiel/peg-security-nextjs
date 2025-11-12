# API Usage Guide - PEG Security

Quick reference guide for using the Team Members, Services, and Upload APIs.

## Authentication

Admin endpoints require JWT authentication. Include the token in requests:

```javascript
const response = await fetch('/api/admin/team', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## Team Members API

### Public - Get All Active Team Members
```javascript
// GET /api/team
const response = await fetch('/api/team')
const { success, data, count } = await response.json()

// Example response:
// {
//   success: true,
//   count: 5,
//   data: [
//     {
//       id: "uuid",
//       name: "John Doe",
//       position: "Security Manager",
//       bio: "15 years experience...",
//       photo_url: "https://...",
//       email: "john@pegsecurity.co.za",
//       phone: "+27 11 234 5678",
//       linkedin_url: "https://linkedin.com/in/johndoe",
//       display_order: 1
//     }
//   ]
// }
```

### Admin - Get All Team Members
```javascript
// GET /api/admin/team
// Optional: ?status=Active or ?status=Inactive
const response = await fetch('/api/admin/team?status=Active', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### Admin - Create Team Member
```javascript
// POST /api/admin/team
const response = await fetch('/api/admin/team', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Jane Smith",
    position: "Operations Director",
    bio: "Experienced security professional with...",
    photo_url: "https://...",
    photo_public_id: "team/jane-smith-123",
    email: "jane@pegsecurity.co.za", // optional
    phone: "+27 11 234 5679", // optional
    linkedin_url: "https://...", // optional
    display_order: 2, // optional
    status: "Active" // optional, defaults to Active
  })
})
```

### Admin - Update Team Member
```javascript
// PUT /api/admin/team/[id]
const response = await fetch(`/api/admin/team/${teamMemberId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    position: "Senior Operations Director", // Only include fields to update
    bio: "Updated bio text..."
  })
})
```

### Admin - Delete Team Member
```javascript
// DELETE /api/admin/team/[id]
const response = await fetch(`/api/admin/team/${teamMemberId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
})
```

## Services API

### Public - Get All Active Services
```javascript
// GET /api/services
// Optional: ?category=Physical Security
const response = await fetch('/api/services')
const { success, data, count } = await response.json()

// Example response:
// {
//   success: true,
//   count: 8,
//   data: [
//     {
//       id: "uuid",
//       title: "Armed Response Services",
//       slug: "armed-response-services",
//       short_description: "24/7 rapid response...",
//       full_description: "Our elite armed response team...",
//       icon_name: "shield-alt",
//       category: "Physical Security",
//       features: ["24/7 availability", "3-minute response", "..."],
//       pricing_model: "Monthly Retainer",
//       pricing_details: "From R1,500 per month",
//       image_url: "https://...",
//       display_order: 1
//     }
//   ]
// }
```

### Public - Get Service by Slug
```javascript
// GET /api/services/[slug]
const response = await fetch('/api/services/armed-response-services')
const { success, data } = await response.json()
```

### Admin - Get All Services
```javascript
// GET /api/admin/services
// Optional: ?status=Active&category=Physical Security
const response = await fetch('/api/admin/services?status=Draft', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### Admin - Create Service
```javascript
// POST /api/admin/services
const response = await fetch('/api/admin/services', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "CCTV Installation",
    short_description: "Professional CCTV installation services...",
    full_description: "Our expert technicians provide...",
    icon_name: "video",
    category: "Electronic Security",
    features: [
      "HD cameras",
      "Night vision",
      "Remote monitoring",
      "Mobile app access"
    ],
    pricing_model: "Custom Quote",
    pricing_details: "Contact us for a free quote", // optional
    image_url: "https://...", // optional
    image_public_id: "services/cctv-123", // optional
    display_order: 3, // optional
    status: "Draft" // optional, defaults to Draft
  })
})

// Note: Slug is auto-generated from title
```

### Admin - Update Service
```javascript
// PUT /api/admin/services/[id]
const response = await fetch(`/api/admin/services/${serviceId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: "Active", // Publish the draft service
    pricing_details: "From R5,000" // Update pricing
  })
})
```

### Admin - Delete Service
```javascript
// DELETE /api/admin/services/[id]
const response = await fetch(`/api/admin/services/${serviceId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
})
```

## File Upload API

### Upload File
```javascript
// POST /api/admin/upload
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('bucket', 'team') // cvs, gallery, team, or services

const response = await fetch('/api/admin/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
    // Don't set Content-Type - browser sets it with boundary
  },
  body: formData
})

const { success, data } = await response.json()
// data: { url, path, bucket }
```

### Delete File
```javascript
// DELETE /api/admin/upload
const response = await fetch('/api/admin/upload', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    bucket: 'team',
    path: 'team/photo-123.jpg'
  })
})
```

## Service Categories

Valid values for `category` field:
- `Physical Security`
- `Electronic Security`
- `Specialised Services`
- `Consulting`
- `Other`

## Pricing Models

Valid values for `pricing_model` field:
- `Fixed Price`
- `Hourly Rate`
- `Monthly Retainer`
- `Custom Quote`
- `Contact Us`

## File Upload Specifications

### Supported Buckets
1. **cvs** (private)
   - Allowed: PDF, DOC, DOCX
   - Max size: 10MB

2. **gallery** (public)
   - Allowed: JPEG, PNG, WEBP
   - Max size: 5MB

3. **team** (public)
   - Allowed: JPEG, PNG, WEBP
   - Max size: 5MB

4. **services** (public)
   - Allowed: JPEG, PNG, WEBP
   - Max size: 5MB

## Error Handling

All endpoints return consistent error responses:

```javascript
// Validation Error (400)
{
  error: "Validation failed",
  details: [
    "name: Name must be at least 2 characters",
    "email: Invalid email address"
  ]
}

// Not Found (404)
{
  error: "Team member not found"
}

// Server Error (500)
{
  error: "Failed to fetch team members",
  details: "Database connection failed"
}
```

## React Example - Team Member Form

```tsx
import { useState } from 'react'

export default function CreateTeamMemberForm() {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    email: '',
    phone: ''
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Upload photo first
      const uploadFormData = new FormData()
      uploadFormData.append('file', photo!)
      uploadFormData.append('bucket', 'team')

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData
      })

      const { data: uploadData } = await uploadRes.json()

      // 2. Create team member with photo URL
      const createRes = await fetch('/api/admin/team', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          photo_url: uploadData.url,
          photo_public_id: uploadData.path
        })
      })

      const result = await createRes.json()
      
      if (result.success) {
        alert('Team member created!')
        // Reset form or redirect
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

## TypeScript Types

```typescript
interface TeamMember {
  id: string
  name: string
  position: string
  bio: string
  photo_url: string
  photo_public_id: string
  email?: string | null
  phone?: string | null
  linkedin_url?: string | null
  display_order: number
  status: 'Active' | 'Inactive'
  created_at: string
  updated_at: string
}

interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  icon_name: string
  category: 'Physical Security' | 'Electronic Security' | 'Specialised Services' | 'Consulting' | 'Other'
  features: string[]
  pricing_model: 'Fixed Price' | 'Hourly Rate' | 'Monthly Retainer' | 'Custom Quote' | 'Contact Us'
  pricing_details?: string | null
  image_url?: string | null
  image_public_id?: string | null
  display_order: number
  status: 'Active' | 'Draft' | 'Archived'
  created_at: string
  updated_at: string
}
```

## Notes

- All admin endpoints require authentication via middleware
- Public endpoints are cached for 5 minutes (ISR)
- UUIDs are validated with regex pattern
- Slugs are auto-generated from titles (lowercase, hyphenated)
- File uploads return public URLs immediately
- RLS policies ensure data security at database level
