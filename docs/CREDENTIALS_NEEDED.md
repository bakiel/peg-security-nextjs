# Credentials Needed to Start Build

## 🔑 Required Before Build Starts

Please provide these credentials so I can begin autonomous development:

### 1. Airtable
Go to: https://airtable.com/create/tokens

**I need:**
```
AIRTABLE_ACCESS_TOKEN=patXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_JOBS_TABLE_ID=tblXXXXXXXXXXXXXX
AIRTABLE_APPLICATIONS_TABLE_ID=tblXXXXXXXXXXXXXX
AIRTABLE_GALLERY_TABLE_ID=tblXXXXXXXXXXXXXX
```

**How to get:**
1. Create Airtable account (if needed)
2. Create new base: "PEG Security"
3. Create 3 tables: Jobs, Applications, Gallery
4. Go to https://airtable.com/create/tokens
5. Create token with scopes: `data.records:read`, `data.records:write`
6. Copy Base ID from URL: `airtable.com/appXXXXXXX/...`
7. Get Table IDs from each table settings

### 2. Resend (Email Service)
Go to: https://resend.com

**I need:**
```
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXX
RESEND_FROM_EMAIL=noreply@pegsecurity.co.za
```

**How to get:**
1. Sign up at resend.com (free tier: 100 emails/day)
2. Verify your sending domain (pegsecurity.co.za)
   - OR use resend's test email (@onboarding.resend.dev)
3. Generate API key
4. Copy API key

**Alternative if no custom domain:**
```
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### 3. Admin Password
**I need:**
```
ADMIN_PASSWORD=YourSecurePasswordHere123!
```

Choose a strong password for admin backend access.

---

## 📋 Quick Setup Checklist

- [ ] **Airtable token** created
- [ ] **Airtable base** created ("PEG Security")
- [ ] **Airtable tables** created:
  - [ ] Jobs table
  - [ ] Applications table
  - [ ] Gallery table
- [ ] **Airtable IDs** collected (base ID + 3 table IDs)
- [ ] **Resend account** created
- [ ] **Resend domain** verified (or use test email)
- [ ] **Resend API key** generated
- [ ] **Admin password** chosen

---

## 🚀 Once I Have These...

I will:
1. ✅ Set up all environment variables
2. ✅ Install required packages
3. ✅ Build complete backend (autonomously using agents)
4. ✅ Build admin interface
5. ✅ Build careers pages
6. ✅ Build gallery system
7. ✅ Set up email/WhatsApp communication
8. ✅ Test everything
9. ✅ Security audit
10. ✅ Performance optimization

**Estimated Time**: 8-12 hours of autonomous development

---

## 📝 Provide Credentials in This Format:

```bash
# Copy this and fill in your values:

AIRTABLE_ACCESS_TOKEN=
AIRTABLE_BASE_ID=
AIRTABLE_JOBS_TABLE_ID=
AIRTABLE_APPLICATIONS_TABLE_ID=
AIRTABLE_GALLERY_TABLE_ID=

RESEND_API_KEY=
RESEND_FROM_EMAIL=

ADMIN_PASSWORD=
```

---

## ❓ Need Help Getting Credentials?

### Airtable Setup Help
1. Go to airtable.com
2. Click "Sign up" (free account)
3. Click "Create a base"
4. Name it "PEG Security"
5. Create 3 tables (I'll guide you on structure)
6. Get credentials (I'll walk you through)

### Resend Setup Help
1. Go to resend.com
2. Click "Get started"
3. For now, use test email: `onboarding@resend.dev`
4. Generate API key
5. Done! (Can set up custom domain later)

---

## 🎯 Ready to Build

Once you paste the credentials, I'll:
- Create `.env.local` file
- Start autonomous build with agents
- Progress through all 17 phases
- Deliver complete working backend

**Just need those credentials to unlock the build!**
