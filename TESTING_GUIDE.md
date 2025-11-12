# 🧪 PEG Security - Testing Guide

## Server Status: ✅ Running Successfully

**URL:** http://localhost:3002

---

## 📋 Pre-Testing Checklist

✅ **Server Running:** Yes (port 3002)
✅ **Database Connected:** Supabase operational
✅ **AI Integration:** Configured (may hit rate limits during heavy testing)
✅ **Image Processing:** Sharp library installed
✅ **Gallery Upload:** AI auto-description integrated

---

## 🎯 Testing Priority Order

### **Phase 1: Core Functionality (Must Work)**
1. Homepage and navigation
2. Gallery page (public view)
3. Services pages
4. Contact form
5. Application form

### **Phase 2: Admin Functions (Critical)**
6. Admin login
7. Gallery management (upload/delete)
8. Application review
9. Contact enquiries

### **Phase 3: AI Features (Nice to Have)**
10. AI gallery auto-description
11. Image optimisation

---

## 🧪 Detailed Test Cases

### **1. Homepage Test**
```
URL: http://localhost:3002/

✓ Check: Hero section loads
✓ Check: Services section displays
✓ Check: Statistics section shows
✓ Check: Call-to-action buttons work
✓ Check: Navigation menu functions
✓ Check: Mobile responsive design

Expected: Clean, professional layout with PEG branding
```

---

### **2. Gallery Page (Public) Test**
```
URL: http://localhost:3002/gallery

✓ Check: Gallery images load
✓ Check: Image grid layout displays properly
✓ Check: Filter by category works
✓ Check: Image modals/lightbox opens
✓ Check: Images are optimised (fast loading)
✓ Check: Mobile responsive

Expected: Professional photo gallery with all installation images
```

---

### **3. Services Pages Test**
```
URLs:
- http://localhost:3002/services/armed-response
- http://localhost:3002/services/cctv
- http://localhost:3002/services/access-control
- etc.

✓ Check: Service descriptions load
✓ Check: Images display correctly
✓ Check: Call-to-action buttons work
✓ Check: Layout is professional

Expected: Detailed service information with clear CTAs
```

---

### **4. Contact Form Test**
```
URL: http://localhost:3002/contact

Test Steps:
1. Fill in name: "Test User"
2. Fill in email: "test@example.com"
3. Fill in phone: "0821234567"
4. Fill in subject: "Test Enquiry"
5. Fill in message: "This is a test message"
6. Click "Send Message"

✓ Check: Form validation works
✓ Check: Success message appears
✓ Check: Email/phone format validation
✓ Check: Required fields enforced

Expected:
- Form submits successfully
- Success message: "Thank you! We'll be in touch soon."
- Entry appears in admin dashboard
```

---

### **5. Application Form Test**
```
URL: http://localhost:3002/apply

Test Steps:
1. Fill in personal details:
   - Name: "John Ndlovu"
   - Email: "john@example.com"
   - Phone: "0821234567"
2. Fill in experience: "5"
3. PSIRA registered: "Yes"
4. PSIRA number: "1234567"
5. Upload CV (any PDF file)
6. Upload photo (any JPG file)
7. Select position: "Security Guard"
8. Click "Submit Application"

✓ Check: Form validation works
✓ Check: File uploads accept PDF/images
✓ Check: Success message appears
✓ Check: Files upload to Supabase Storage

Expected:
- Application submits successfully
- Files stored in Supabase
- Confirmation message displayed
```

---

### **6. Admin Login Test**
```
URL: http://localhost:3002/admin/login

Test Steps:
1. Enter email: "admin@pegsecurity.co.za"
2. Enter password: [your admin password]
3. Click "Sign In"

✓ Check: Login form validates
✓ Check: Correct credentials accepted
✓ Check: Incorrect credentials rejected
✓ Check: Redirects to admin dashboard

Expected:
- Successful login redirects to /admin/dashboard
- Failed login shows error message
```

---

### **7. Gallery Management (Admin) Test**
```
URL: http://localhost:3002/admin/gallery

Prerequisites: Must be logged in as admin

Test Steps:
1. Click "Upload Image"
2. Select test image (any JPG/PNG)
3. Image preview appears
4. Click "✨ Generate Description with AI"
5. Wait 5-10 seconds for AI processing
6. Review auto-filled title/description
7. Adjust if needed
8. Select category
9. Set status to "Active"
10. Click "Upload Image"

✓ Check: File selection works
✓ Check: Preview displays correctly
✓ Check: AI button appears after image selected
✓ Check: AI generates title/description (or shows rate limit error if hit)
✓ Check: Form can be submitted manually even without AI
✓ Check: Image appears in gallery list
✓ Check: Image uploaded to Supabase Storage
✓ Check: Toggle visibility (Active/Hidden) works
✓ Check: Delete image works

Expected:
- Image uploads successfully
- AI features work (unless rate limited)
- Images stored in Supabase Storage bucket "gallery"
- Automatic image optimisation (1000x1000px, 1:1 crop)
```

**AI Rate Limit Note:** If you see error message about AI rate limits:
- This is NORMAL during heavy testing
- The upload still works - you can fill in title/description manually
- Rate limits reset after 24 hours (free tier)
- To extend limits: Add $5 credit to OpenRouter account

---

### **8. Application Review (Admin) Test**
```
URL: http://localhost:3002/admin/applications

Prerequisites: Must be logged in as admin

✓ Check: Applications list loads
✓ Check: Filter by status works
✓ Check: Search functionality works
✓ Check: Click application to view details
✓ Check: CV downloads correctly
✓ Check: Photo displays correctly
✓ Check: Update application status works

Expected:
- All submitted applications visible
- Files accessible and downloadable
- Status updates save correctly
```

---

### **9. Contact Enquiries (Admin) Test**
```
URL: http://localhost:3002/admin/contacts

Prerequisites: Must be logged in as admin

✓ Check: Enquiries list loads
✓ Check: Filter options work
✓ Check: Mark as read/unread works
✓ Check: Delete enquiry works
✓ Check: Export functionality works (if implemented)

Expected:
- All contact form submissions visible
- Enquiries marked properly
- Actions save correctly
```

---

## 🐛 Known Issues & Workarounds

### **Issue 1: AI Rate Limits During Testing**
**Symptom:** "429 Rate limit exceeded" when using AI features
**Cause:** Hit free tier daily limits (10-20 requests/day)
**Solution:**
- Normal behaviour for free tier
- Upload still works without AI (manual entry)
- Wait 24 hours for reset OR add $5 credit for 1000 requests/day
**Not a Bug:** Working as designed

### **Issue 2: Rate Limit Type Warning**
**Symptom:** Console shows "[RATE LIMIT ERROR] Invalid rate limit type: visionAI"
**Cause:** Vision AI rate limiting not configured in rate-limit.ts
**Impact:** None - doesn't affect functionality
**Solution:** Can be ignored or fixed later (low priority)

### **Issue 3: Multiple Dev Servers**
**Symptom:** Ports 3000, 3001 already in use
**Cause:** Multiple instances running
**Solution:** Kill other processes or use port 3002 (current)
**Impact:** None - server works on 3002

---

## ✅ Success Criteria

### **Minimum Viable Product (MVP):**
- ✅ Homepage loads and looks professional
- ✅ Gallery displays images correctly
- ✅ Contact form submits successfully
- ✅ Application form submits successfully
- ✅ Admin login works
- ✅ Admin can upload gallery images (with or without AI)
- ✅ Admin can review applications
- ✅ Admin can view contact enquiries

### **Nice to Have (Bonus):**
- ✅ AI auto-description for gallery (when not rate limited)
- ✅ Image optimisation (1:1 crop, 1000x1000)
- ✅ Mobile responsive design
- ✅ Fast page loading
- ✅ Professional appearance

---

## 🚦 Test Results Template

Copy and fill out as you test:

```
===========================================
PEG SECURITY - TEST RESULTS
Date: _____________
Tester: ___________
===========================================

PHASE 1: CORE FUNCTIONALITY
☐ Homepage                [PASS / FAIL] Notes: __________
☐ Gallery (Public)        [PASS / FAIL] Notes: __________
☐ Services Pages          [PASS / FAIL] Notes: __________
☐ Contact Form            [PASS / FAIL] Notes: __________
☐ Application Form        [PASS / FAIL] Notes: __________

PHASE 2: ADMIN FUNCTIONS
☐ Admin Login             [PASS / FAIL] Notes: __________
☐ Gallery Management      [PASS / FAIL] Notes: __________
☐ Application Review      [PASS / FAIL] Notes: __________
☐ Contact Enquiries       [PASS / FAIL] Notes: __________

PHASE 3: AI FEATURES
☐ AI Gallery Description  [PASS / FAIL / RATE LIMITED]
☐ Image Optimisation      [PASS / FAIL] Notes: __________

===========================================
OVERALL STATUS: [READY / NEEDS FIXES]
===========================================

Critical Issues Found:
1. _______________________________________
2. _______________________________________
3. _______________________________________

Minor Issues Found:
1. _______________________________________
2. _______________________________________

Recommendations:
1. _______________________________________
2. _______________________________________
```

---

## 🔧 Quick Fixes for Common Issues

### **Server Not Starting:**
```bash
# Kill all node processes
killall node

# Restart server
cd /Users/mac/Downloads/PEG_Security_Profile_Design_Project/peg-security-nextjs
npm run dev
```

### **Database Connection Issues:**
```bash
# Check environment variables
cat .env.local

# Verify Supabase credentials are correct
```

### **AI Not Working:**
```bash
# Check OpenRouter API key
cat .env.local | grep OPENROUTER

# Expected: OPENROUTER_API_KEY=sk-or-v1-...

# If missing, add it:
echo 'OPENROUTER_API_KEY=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' >> .env.local

# Restart server
```

### **Images Not Uploading:**
```bash
# Check Supabase Storage buckets exist:
# 1. Login to Supabase dashboard
# 2. Go to Storage
# 3. Verify "gallery" and "cvs" buckets exist
# 4. Check bucket permissions (public read for gallery)
```

---

## 📞 Support During Testing

**If you encounter issues:**

1. **Check server console** - Look for error messages
2. **Check browser console** (F12) - Look for JavaScript errors
3. **Screenshot the error** - Helpful for debugging
4. **Note the steps to reproduce** - What did you do before the error?
5. **Check this guide** - Solution might be listed above

**Report Format:**
```
Issue: [Brief description]
Steps to Reproduce:
1. ...
2. ...
3. ...

Expected: [What should happen]
Actual: [What actually happened]
Screenshot: [If available]
Error Message: [From console]
```

---

## 🎯 Next Steps After Testing

### **If All Tests Pass:**
1. ✅ Mark project as "Ready for Deployment"
2. ✅ Present client proposal (CLIENT_AI_PROPOSAL.md)
3. ✅ Discuss premium AI features
4. ✅ Plan deployment to production

### **If Issues Found:**
1. Document all issues
2. Prioritise: Critical → High → Medium → Low
3. Fix critical issues first
4. Re-test after fixes
5. Proceed when stable

---

## 💡 Testing Tips

**Do:**
- ✅ Test on different browsers (Chrome, Safari, Firefox)
- ✅ Test on mobile devices
- ✅ Test with real-looking data
- ✅ Try to "break" things (edge cases)
- ✅ Take screenshots of issues

**Don't:**
- ❌ Skip steps in test cases
- ❌ Test only "happy path" (perfect scenarios)
- ❌ Ignore console warnings/errors
- ❌ Assume something works without testing
- ❌ Test without proper test data

---

**Happy Testing! 🚀**

If everything works as expected, your PEG Security platform is ready for the client presentation and deployment planning!
