-- PEG Security Database Schema for Supabase
-- Run this SQL in Supabase SQL Editor to create all tables

-- =====================================================
-- 1. CONTACTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN (
    'Armed Response',
    'CCTV Installation',
    'Access Control',
    'Security Guard',
    'Event Security',
    'VIP Protection',
    'Consulting',
    'Support',
    'Sales',
    'Implementation',
    'Other'
  )),
  message TEXT NOT NULL,
  preferred_contact TEXT NOT NULL CHECK (preferred_contact IN ('Email', 'Phone')),
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Responded')),
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for status filtering
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_submitted_at ON contacts(submitted_at DESC);

-- =====================================================
-- 2. JOBS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN (
    'Armed Response',
    'Security Guard',
    'CCTV',
    'Access Control',
    'Operations',
    'Technical',
    'Management',
    'Other'
  )),
  location TEXT NOT NULL,
  employment_type TEXT NOT NULL CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Temporary')),
  psira_required BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL,
  responsibilities TEXT NOT NULL,
  requirements TEXT NOT NULL,
  benefits TEXT,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Open', 'Closed')),
  application_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- =====================================================
-- 3. APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  cv_url TEXT NOT NULL,
  cv_public_id TEXT NOT NULL,
  cover_letter TEXT NOT NULL,
  psira_registered BOOLEAN NOT NULL DEFAULT false,
  psira_number TEXT,
  years_experience INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Reviewing', 'Interviewed', 'Hired', 'Rejected')),
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON applications(submitted_at DESC);

-- =====================================================
-- 4. GALLERY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Armed Response',
    'CCTV Installation',
    'Access Control',
    'Security Guard',
    'Event Security',
    'VIP Protection',
    'Projects',
    'Team',
    'Other'
  )),
  image_url TEXT NOT NULL,
  image_public_id TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Hidden')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_gallery_status ON gallery(status);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery(display_order, created_at DESC);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all tables
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER: Update job application count
-- =====================================================
CREATE OR REPLACE FUNCTION update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs SET application_count = application_count + 1 WHERE id = NEW.job_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs SET application_count = application_count - 1 WHERE id = OLD.job_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_count_on_application AFTER INSERT OR DELETE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_job_application_count();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Public read access for jobs (only Open status)
CREATE POLICY "Public can view open jobs"
  ON jobs FOR SELECT
  USING (status = 'Open');

-- Public read access for gallery (only Active status)
CREATE POLICY "Public can view active gallery"
  ON gallery FOR SELECT
  USING (status = 'Active');

-- Public insert for contacts (allow submissions)
CREATE POLICY "Anyone can submit contact form"
  ON contacts FOR INSERT
  WITH CHECK (true);

-- Public insert for applications (allow job applications)
CREATE POLICY "Anyone can submit job application"
  ON applications FOR INSERT
  WITH CHECK (true);

-- Service role has full access to everything
CREATE POLICY "Service role has full access to contacts"
  ON contacts FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role has full access to jobs"
  ON jobs FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role has full access to applications"
  ON applications FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role has full access to gallery"
  ON gallery FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================
-- Note: Run these separately in Supabase Dashboard > Storage
-- Or use the Supabase CLI

-- Bucket for CVs
-- insert into storage.buckets (id, name, public) values ('cvs', 'cvs', false);

-- Bucket for Gallery Images
-- insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample Contact
INSERT INTO contacts (name, email, phone, service_type, message, preferred_contact, status, submitted_at) VALUES
('Thabo Mbeki', 'thabo.mbeki@example.co.za', '+27 11 234 5678', 'Armed Response', 'I need 24/7 armed response services for my business in Sandton.', 'Email', 'New', NOW() - INTERVAL '2 hours');

-- Sample Job
INSERT INTO jobs (title, slug, category, location, employment_type, psira_required, description, responsibilities, requirements, benefits, status) VALUES
('Armed Response Officer - Sandton', 'armed-response-officer-sandton', 'Armed Response', 'Sandton, Johannesburg', 'Full-time', true,
'We are seeking experienced Armed Response Officers to join our elite team.',
'• Respond to alarm activations
• Patrol assigned zones
• Liaise with SAPS when required',
'• Valid PSIRA registration (Grade A)
• Firearm competency
• 2+ years experience',
'• Competitive salary
• Company vehicle
• Medical aid',
'Open');

-- Sample Gallery Image
INSERT INTO gallery (title, description, category, image_url, image_public_id, thumbnail_url, status, display_order) VALUES
('Armed Response Team', 'Our professional armed response team on patrol', 'Armed Response',
'https://images.unsplash.com/photo-1574077479297-f4b0b493dc2a?w=1920&q=80',
'placeholder/armed-response-1',
'https://images.unsplash.com/photo-1574077479297-f4b0b493dc2a?w=400&h=300&fit=crop&q=80',
'Active', 1);

-- =====================================================
-- 5. TEAM MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  photo_public_id TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order, created_at DESC);

-- =====================================================
-- 6. SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Physical Security',
    'Electronic Security',
    'Specialised Services',
    'Consulting',
    'Other'
  )),
  features JSONB NOT NULL DEFAULT '[]',
  pricing_model TEXT NOT NULL CHECK (pricing_model IN (
    'Fixed Price',
    'Hourly Rate',
    'Monthly Retainer',
    'Custom Quote',
    'Contact Us'
  )),
  pricing_details TEXT,
  image_url TEXT,
  image_public_id TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order, created_at DESC);

-- =====================================================
-- TRIGGERS FOR NEW TABLES
-- =====================================================

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS POLICIES FOR NEW TABLES
-- =====================================================

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read access for team members (only Active)
CREATE POLICY "Public can view active team members"
  ON team_members FOR SELECT
  USING (status = 'Active');

-- Public read access for services (only Active)
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (status = 'Active');

-- Service role has full access
CREATE POLICY "Service role has full access to team_members"
  ON team_members FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role has full access to services"
  ON services FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- SAMPLE DATA FOR NEW TABLES
-- =====================================================

-- Sample Team Member
INSERT INTO team_members (name, position, bio, photo_url, photo_public_id, email, display_order, status) VALUES
('Vusi Nxumalo', 'Managing Director', 'Experienced security professional with over 15 years in the industry. Specialises in corporate security solutions and risk management.',
'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
'placeholder/team-member-1',
'vusi@pegsecurity.co.za',
1, 'Active');

-- Sample Service
INSERT INTO services (
  title, slug, short_description, full_description, icon_name, category,
  features, pricing_model, pricing_details, display_order, status
) VALUES (
  'Armed Response Services',
  'armed-response-services',
  '24/7 rapid response team ready to protect your property and assets',
  'Our elite armed response team provides immediate assistance when your alarm is triggered. With average response times under 3 minutes, our highly trained officers are equipped to handle any security situation professionally and efficiently.',
  'shield-alt',
  'Physical Security',
  '["24/7 availability", "Average 3-minute response time", "PSIRA registered officers", "GPS tracking", "Mobile app integration", "Dedicated control room"]'::jsonb,
  'Monthly Retainer',
  'From R1,500 per month',
  1,
  'Active'
);
