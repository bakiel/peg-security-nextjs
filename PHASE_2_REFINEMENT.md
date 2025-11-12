# Phase 2: Website Refinement & Content Enhancement

**Date**: November 11, 2025
**Status**: In Progress
**Objective**: Enhance Next.js website by integrating best elements from original HTML site whilst maintaining modern, clean structure

---

## 🎯 Project Context

### What's Working
✅ **Structure**: Tab navigation, routing, and page architecture are excellent
✅ **Design System**: Clean, modern, professional aesthetic
✅ **Technical Foundation**: Next.js 14, TypeScript, Framer Motion animations
✅ **Authentic Information**: Real contact details, Mpumalanga regional focus, PSIRA registration
✅ **Gallery**: 12 properly sized 1:1 images
✅ **Careers Page**: Regional focus with authentic job locations
✅ **Contact Page**: Interactive map, correct address, phone, email

### What Needs Enhancement
❌ **Homepage**: Currently too minimal - only hero section, needs more content
❌ **Services Page**: Lacks visual elements (security guard cutouts from original)
❌ **About Page**: Only showing SAIDSA certification - need all certifications displayed
❌ **Visual Balance**: Original HTML was very graphic, new site is very clean - need hybrid approach
❌ **VAT Registration**: Need to verify and add or remove

---

## 📋 Phase 2 Task Breakdown

### 1. Homepage Redesign (PRIORITY)
**Status**: Pending
**Goal**: Compact but informative homepage combining original HTML content with modern design

**Original HTML Homepage Review Needed:**
- [ ] Identify key content sections from `/PEG Security Sample Site/index.html`
- [ ] Extract compelling copy and value propositions
- [ ] Note visual elements (security guard images, icons, graphics)
- [ ] Identify services overview section
- [ ] Review call-to-action placement

**New Homepage Sections to Add:**
- [ ] Hero carousel (already exists - keep)
- [ ] Company introduction (2-3 sentences)
- [ ] Core services overview (4-6 cards with icons)
- [ ] Why Choose PEG Security (3-4 key differentiators)
- [ ] Service area map/visual (Mpumalanga focus)
- [ ] Quick stats (if authentic data available)
- [ ] Certifications badges (PSIRA, BBBEE, etc)
- [ ] Final CTA section

**Design Approach:**
- Keep modern clean aesthetic
- Add visual interest with security guard cutouts
- Use animation sparingly but effectively
- Maintain brand colours (Gold #D0B96D, Onyx #292B2B)

---

### 2. Services Page Visual Enhancement
**Status**: Pending
**Goal**: Add security guard cutout images and graphic elements effectively

**Tasks:**
- [ ] Review original HTML services page graphics
- [ ] Extract security guard PNG cutouts from original site
- [ ] Identify which services benefit from visual representation
- [ ] Design layout integrating images with service descriptions
- [ ] Ensure images don't overwhelm text content
- [ ] Maintain responsive design across devices

**Image Integration Strategy:**
```
Armed Response → Armed officer cutout
VIP Protection → Professional guard cutout
K9 Unit → Handler with K9 image
Manned Guarding → Uniformed officer cutout
```

**Design Balance:**
- Text-heavy sections alternate with image-heavy sections
- Images enhance understanding, don't distract
- Consistent image sizing and positioning
- Proper image optimisation

---

### 3. About Page Certification Enhancement
**Status**: Pending
**Goal**: Display all company certifications with actual provided images

**Current State:**
- Only SAIDSA certification image shown
- Have 6 certification images provided by client

**Certification Images to Add:**
```
/public/images/
├── Armed_men_with_SAIDSA_logo_1-1.jpg ✅ (already added)
├── Security_personnel_with_weapons_1-1.jpg (PSiRA logo)
├── Three_armed_security_personnel_posing_1-1.jpg (TSASA logo)
├── Armed_individuals_with_masks_SAIDSA_logo.jpg
├── Security_personnel_with_weapons_and_masks.jpg
└── Armed_security_personnel_with_guns_16-9.jpg
```

**Implementation:**
- [ ] Create certification grid section on About page
- [ ] Add all 6 certification images with proper labels
- [ ] Include certification descriptions
- [ ] Link to relevant regulatory body websites if applicable
- [ ] Ensure responsive grid layout

**Certifications to Display:**
1. **PSIRA Registration**: 2019/447310/07
2. **SAIDSA Membership**: South African Intruder Detection Services Association
3. **TSASA**: Tracking South Africa Security Association (if applicable)
4. **BBBEE Certification**: Transformation compliance
5. **COIDA Compliance**: Compensation for Occupational Injuries and Diseases
6. **Fully Insured**: Professional indemnity and public liability

---

### Certification Images Reference

**Available 1:1 Certification Images (Primary Set)**

These three certification images have been verified and are currently integrated into the site:

#### 1. Armed_men_with_SAIDSA_logo_1-1.jpg
- **Organization**: SAIDSA (South African Intruder Detection Services Association)
- **Represents**: Industry association membership for intruder detection and security services
- **Image Content**: Professional security personnel in tactical gear with SAIDSA chain logo
- **Current Usage**:
  - Homepage certification section (prominently featured)
  - Gallery item #1
- **Display Context**: White background, 1:1 aspect ratio (1200×1200px)
- **File Size**: 62K

#### 2. Security_personnel_with_weapons_1-1.jpg
- **Organization**: PSiRA (Private Security Industry Regulatory Authority)
- **Registration Number**: 2019/447310/07
- **Represents**: Mandatory security industry registration and compliance
- **Image Content**: Armed security specialists displaying PSiRA branding and credentials
- **Current Usage**: Gallery item #9
- **Display Context**: Professional presentation with PSiRA logo visible
- **File Size**: 68K

#### 3. Three_armed_security_personnel_posing_1-1.jpg
- **Organization**: TSASA (Tracking South Africa Security Association)
- **Represents**: Tracking and security association membership
- **Image Content**: Three-person security detail with TSASA logo and accreditation badge
- **Current Usage**: Gallery item #10
- **Display Context**: White background showing team coordination
- **File Size**: 67K

**Implementation Status:**
✅ All three images optimised to 1:1 aspect ratio
✅ Featured on homepage (SAIDSA image)
✅ Included in gallery
❌ Not yet comprehensively displayed on About page certification section

**Recommended Next Steps:**
- Create a dedicated certification showcase grid on About page
- Display all three images with organization descriptions
- Link to regulatory body websites (psira.co.za, saidsa.org)
- Include registration numbers and compliance dates where applicable

---

### 4. Contact Page Verification
**Status**: Mostly Complete - Needs VAT Check

**Current Information:**
✅ Phone: 013 001 2849 (Office) + 079 413 9180 (Mobile)
✅ Email: vusiz@pegholdings.co.za
✅ Address: 2 Blesbok Street, Uitbreiding 3, Bethal, Mpumalanga, 2310
✅ Company Reg: 2019/447310/07
✅ Interactive Google Maps embed
✅ PSIRA Registration displayed
✅ BBBEE Certification mentioned

**To Verify:**
- [ ] VAT Registration Number - check if available
- [ ] If no VAT number, remove VAT section entirely
- [ ] Confirm "Fully Insured" can be stated (likely yes for security company)
- [ ] Verify all phone numbers work
- [ ] Test email address is active

---

### 5. Visual Design Integration
**Status**: Pending
**Goal**: Bring graphic elements from original HTML into modern design

**Original HTML Site Analysis:**
- [ ] Review `/PEG Security Sample Site/` HTML files
- [ ] Extract CSS for background patterns, gradients
- [ ] Identify icon usage and graphic elements
- [ ] Note image placement and sizing strategies
- [ ] Document colour usage and contrasts

**Elements to Consider Integrating:**
- Background patterns/textures
- Security guard cutout positioning
- Icon styles and placement
- Section dividers and visual breaks
- Hover effects and transitions
- Image overlay techniques

**Integration Strategy:**
- Don't replicate old site exactly
- Cherry-pick best visual elements
- Modernise while maintaining visual impact
- Test across devices for responsive behaviour

---

### 6. Backend Preparation (Future Phase)
**Status**: Planning
**Goal**: Prepare for Vercel deployment with backend functionality

**Components Needing Backend:**

#### Gallery Management
- CMS for client to upload images
- Image categories and tagging
- Image metadata (title, description, category)
- Image optimisation pipeline

#### Careers Portal
- Job posting management
- Application form submissions
- Applicant database
- Email notifications
- Application status tracking

#### Contact Form
- Form submission handling
- Email routing to vusiz@pegholdings.co.za
- Spam protection (reCAPTCHA)
- Submission database

**Technology Stack Considerations:**
- **Database**: Vercel Postgres / Supabase
- **CMS**: Sanity.io / Payload CMS
- **Forms**: React Hook Form + API Routes
- **File Storage**: Vercel Blob / Cloudinary
- **Authentication**: NextAuth.js (for admin)

---

## 🎨 Design Principles for This Phase

### 1. Balance Clean & Graphic
- **Original HTML**: Very graphic, visual heavy
- **Current Next.js**: Very clean, minimal
- **Goal**: Hybrid approach - clean structure with strategic visual impact

### 2. Information Hierarchy
- Homepage: Overview, not overwhelming
- Service pages: Detailed but scannable
- About: Professional and credible
- Contact: Clear and accessible

### 3. Visual Consistency
- Maintain brand colours throughout
- Consistent typography (Montserrat headers, Poppins body)
- Unified icon style (Lucide icons)
- Cohesive image treatment

### 4. Performance Priority
- Optimise all images (Next.js Image component)
- Lazy load below-fold content
- Minimise animation overhead
- Fast page transitions

---

## 📁 File Structure Reference

```
peg-security-nextjs/
├── app/
│   ├── page.tsx                    # Homepage - NEEDS ENHANCEMENT
│   ├── about/page.tsx              # About - ADD CERTIFICATIONS
│   ├── services/page.tsx           # Services - ADD IMAGES
│   ├── gallery/page.tsx            # Gallery - BACKEND READY
│   ├── careers/page.tsx            # Careers - BACKEND READY
│   └── contact/page.tsx            # Contact - VERIFY VAT
├── components/
│   ├── hero/HeroCarousel.tsx       # Working well
│   ├── layout/Navigation.tsx       # Working well
│   └── ui/                         # Component library
├── public/
│   └── images/                     # ADD MORE CUTOUTS
└── lib/
    └── constants.ts                # Configuration
```

---

## ✅ Quality Checklist

Before marking this phase complete:

### Content
- [ ] Homepage has meaningful content without overwhelming
- [ ] All certification images properly displayed
- [ ] Service page images enhance understanding
- [ ] All information factually accurate (no hallucinations)
- [ ] South African English spelling throughout

### Visual Design
- [ ] Balance between clean and graphic achieved
- [ ] Security guard cutouts integrated effectively
- [ ] Consistent visual language across pages
- [ ] Responsive on mobile, tablet, desktop
- [ ] Animations smooth and purposeful

### Technical
- [ ] All images optimised
- [ ] No console errors
- [ ] Fast page load times
- [ ] SEO metadata complete
- [ ] Accessibility standards met (WCAG AA)

### Information Accuracy
- [ ] Contact details verified and working
- [ ] Company registration correct
- [ ] Certifications authentic
- [ ] Service descriptions accurate
- [ ] Geographic focus correct (Mpumalanga)

---

## 🚀 Next Steps After Phase 2

1. **User Acceptance Testing**: Client reviews refined site
2. **Backend Development**: Implement CMS for gallery and careers
3. **Form Functionality**: Connect contact and careers forms
4. **Vercel Deployment**: Production deployment setup
5. **Analytics Integration**: Google Analytics / Vercel Analytics
6. **Performance Audit**: Lighthouse score optimisation
7. **SEO Implementation**: Meta tags, sitemap, schema markup
8. **Documentation**: Admin guide for content management

---

## 📞 Stakeholder Notes

**Client Feedback Summary:**
> "The structure is excellent. Homepage needs content. Services need images. About needs all certifications. Original HTML was very graphic - bring that visual impact into the clean modern design."

**Key Priorities:**
1. Homepage content (URGENT)
2. Services page visuals (HIGH)
3. Certification display (HIGH)
4. VAT verification (MEDIUM)

**Approved Elements:**
- Overall structure and navigation
- Careers page approach
- Gallery implementation
- Contact page information
- Regional Mpumalanga focus

---

**Status**: 🟡 In Progress
**Last Updated**: 2025-11-11
**Next Review**: After homepage redesign completion
