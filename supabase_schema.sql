-- =========================================================================
-- KOPARGAON CONNECT — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Project: https://fcevysxmtmydscvworfu.supabase.co
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =========================================================================

-- Enable pgcrypto extension for secure password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  user_type TEXT DEFAULT 'citizen' CHECK (user_type IN ('citizen', 'official')),
  citizen_role TEXT DEFAULT 'general_citizen' CHECK (citizen_role IN ('general_citizen', 'farmer', 'transporter')),
  official_role TEXT,
  official_id TEXT,
  department TEXT,
  location TEXT DEFAULT 'Kopargaon',
  dob DATE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Traffic & Mobility Reports Table with Verification Lifecycle
CREATE TABLE IF NOT EXISTS public.traffic_reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_name TEXT NOT NULL,
  reporter_role TEXT DEFAULT 'CITIZEN',
  reporter_phone TEXT,
  location_name TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  congestion_level TEXT NOT NULL CHECK (congestion_level IN ('YELLOW', 'ORANGE', 'RED')),
  description TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'REPORTED' CHECK (status IN ('REPORTED', 'ACKNOWLEDGED', 'ALERT_ISSUED', 'RESOLVED', 'CLEARED')),
  verification_status TEXT DEFAULT 'UNDER_REVIEW' CHECK (verification_status IN ('VERIFIED', 'UNDER_REVIEW', 'UNVERIFIED', 'REJECTED', 'OUTDATED')),
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  verification_notes TEXT,
  duplicate_count INT DEFAULT 1,
  related_report_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Schema Migration support for existing traffic_reports instances
ALTER TABLE public.traffic_reports ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'UNDER_REVIEW';
ALTER TABLE public.traffic_reports ADD COLUMN IF NOT EXISTS verified_by TEXT;
ALTER TABLE public.traffic_reports ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE public.traffic_reports ADD COLUMN IF NOT EXISTS verification_notes TEXT;
ALTER TABLE public.traffic_reports ADD COLUMN IF NOT EXISTS duplicate_count INT DEFAULT 1;
ALTER TABLE public.traffic_reports ADD COLUMN IF NOT EXISTS related_report_id BIGINT;

ALTER TABLE public.traffic_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Traffic reports viewable by everyone" ON public.traffic_reports;
CREATE POLICY "Traffic reports viewable by everyone" ON public.traffic_reports FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can submit a traffic report" ON public.traffic_reports;
CREATE POLICY "Anyone can submit a traffic report" ON public.traffic_reports FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Officials can update traffic reports" ON public.traffic_reports;
CREATE POLICY "Officials can update traffic reports" ON public.traffic_reports FOR UPDATE USING (true);

-- 2.1 Unified Mobility Reports Table
CREATE TABLE IF NOT EXISTS public.mobility_reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('TRAFFIC', 'ROAD_INCIDENT', 'BUS_DISRUPTION', 'EV_STATION', 'LOGISTICS')),
  title TEXT NOT NULL,
  description TEXT,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_url TEXT,
  status TEXT DEFAULT 'UNDER_REVIEW' CHECK (status IN ('VERIFIED', 'UNDER_REVIEW', 'UNVERIFIED', 'REJECTED', 'OUTDATED')),
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  duplicate_count INT DEFAULT 1,
  related_report_id BIGINT REFERENCES public.mobility_reports(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mobility_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Mobility reports viewable by everyone" ON public.mobility_reports;
CREATE POLICY "Mobility reports viewable by everyone" ON public.mobility_reports FOR SELECT USING (true);
DROP POLICY IF EXISTS "Citizens can create reports" ON public.mobility_reports;
CREATE POLICY "Citizens can create reports" ON public.mobility_reports FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Officials can update mobility reports" ON public.mobility_reports;
CREATE POLICY "Officials can update mobility reports" ON public.mobility_reports FOR UPDATE USING (true);

-- 3. Shipments Table (Farmer & Rural Logistics)
CREATE TABLE IF NOT EXISTS public.shipments (
  id BIGSERIAL PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  farmer_id TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  goods_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  weight_kg NUMERIC NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  assigned_type TEXT DEFAULT 'PENDING' CHECK (assigned_type IN ('PENDING', 'PUBLIC_BUS', 'PRIVATE_TRANSPORTER')),
  transporter_name TEXT,
  transporter_vehicle TEXT,
  estimated_cost NUMERIC NOT NULL,
  current_status TEXT DEFAULT 'PENDING' CHECK (current_status IN ('PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED')),
  estimated_delivery TEXT,
  bus_schedule_id TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shipments viewable by all" ON public.shipments FOR SELECT USING (true);
CREATE POLICY "Anyone can create shipment" ON public.shipments FOR INSERT WITH CHECK (true);
CREATE POLICY "Transporters/Officials can update shipment" ON public.shipments FOR UPDATE USING (true);

-- 4. Passenger Bookings Table
CREATE TABLE IF NOT EXISTS public.passenger_bookings (
  id BIGSERIAL PRIMARY KEY,
  booking_id TEXT UNIQUE NOT NULL,
  bus_number TEXT NOT NULL,
  route_id TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  stops JSONB DEFAULT '[]'::jsonb,
  date TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  passenger_count INT NOT NULL,
  fare_per_passenger NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_id TEXT,
  booking_status TEXT DEFAULT 'CONFIRMED',
  booked_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.passenger_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bookings viewable by all" ON public.passenger_bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can create booking" ON public.passenger_bookings FOR INSERT WITH CHECK (true);

-- 5. Published Transporter Trips Table
CREATE TABLE IF NOT EXISTS public.published_trips (
  id BIGSERIAL PRIMARY KEY,
  transporter_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  date TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  available_weight_kg NUMERIC NOT NULL,
  max_weight_kg NUMERIC NOT NULL,
  base_rate_per_kg NUMERIC NOT NULL,
  status TEXT DEFAULT 'AVAILABLE',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.published_trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trips viewable by all" ON public.published_trips FOR SELECT USING (true);
CREATE POLICY "Transporters can publish trips" ON public.published_trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Transporters can update their trips" ON public.published_trips FOR UPDATE USING (true);

-- 6. Safety Alerts Table
CREATE TABLE IF NOT EXISTS public.safety_alerts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'WARNING', 'INFO')),
  category TEXT NOT NULL,
  affected_area TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  issued_by TEXT DEFAULT 'Kopargaon Municipal Police & Transit Command',
  timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Safety alerts viewable by all" ON public.safety_alerts FOR SELECT USING (true);
CREATE POLICY "Officials can manage safety alerts" ON public.safety_alerts FOR ALL USING (true);

-- 7. Enable Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.traffic_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shipments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.passenger_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.safety_alerts;

-- =========================================================================
-- 8. DEFAULT OFFICIAL ADMIN ACCOUNT SEED SCRIPT (REAL SUPABASE AUTH)
-- Account:
--   Email: admin@gmail.com
--   Password: pass@123
--   Role: municipal_admin
-- Run this block in Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- =========================================================================

-- 8.1 Update or Create admin@gmail.com in auth.users
UPDATE auth.users
SET 
  encrypted_password = extensions.crypt('pass@123', extensions.gen_salt('bf', 10)),
  email_confirmed_at = now(),
  confirmation_token = '',
  recovery_token = '',
  aud = 'authenticated',
  role = 'authenticated',
  raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
  raw_user_meta_data = '{"full_name":"Municipal Administrator","user_type":"official","official_role":"municipal_admin","department":"Municipal Administration"}'::jsonb
WHERE email = 'admin@gmail.com';

-- 8.2 Update or Create admin@gmail.com in public.profiles
INSERT INTO public.profiles (id, full_name, email, phone, user_type, official_role, official_id, department, location)
SELECT id, 'Municipal Administrator', 'admin@gmail.com', '+91 99220 11223', 'official', 'municipal_admin', 'ADM-01', 'Municipal Administration', 'Kopargaon'
FROM auth.users
WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
  full_name = 'Municipal Administrator',
  user_type = 'official', 
  official_role = 'municipal_admin', 
  official_id = 'ADM-01',
  email = 'admin@gmail.com', 
  department = 'Municipal Administration', 
  location = 'Kopargaon',
  updated_at = now();

-- 8.3 Update or Create depot@kopargaonconnect.demo (depot_manager)
UPDATE auth.users
SET 
  encrypted_password = extensions.crypt('OfficialPass@123', extensions.gen_salt('bf', 10)),
  email_confirmed_at = now(),
  confirmation_token = '',
  recovery_token = '',
  aud = 'authenticated',
  role = 'authenticated',
  raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
  raw_user_meta_data = '{"full_name":"Depot Operations Manager","user_type":"official","official_role":"depot_manager","department":"Kopargaon Central Bus Depot"}'::jsonb
WHERE email = 'depot@kopargaonconnect.demo';

INSERT INTO public.profiles (id, full_name, email, phone, user_type, official_role, official_id, department, location)
SELECT id, 'Depot Operations Manager', 'depot@kopargaonconnect.demo', '+91 98230 55667', 'official', 'depot_manager', 'DPT-04', 'MSRTC Kopargaon Depot Operations', 'Kopargaon Central Depot'
FROM auth.users
WHERE email = 'depot@kopargaonconnect.demo'
ON CONFLICT (id) DO UPDATE SET 
  user_type = 'official', 
  official_role = 'depot_manager', 
  email = 'depot@kopargaonconnect.demo',
  updated_at = now();

-- 8.4 Update or Create traffic@kopargaonconnect.demo (traffic_safety)
UPDATE auth.users
SET 
  encrypted_password = extensions.crypt('OfficialPass@123', extensions.gen_salt('bf', 10)),
  email_confirmed_at = now(),
  confirmation_token = '',
  recovery_token = '',
  aud = 'authenticated',
  role = 'authenticated',
  raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
  raw_user_meta_data = '{"full_name":"Traffic & Safety Inspector","user_type":"official","official_role":"traffic_safety","department":"Traffic & Transit Police"}'::jsonb
WHERE email = 'traffic@kopargaonconnect.demo';

INSERT INTO public.profiles (id, full_name, email, phone, user_type, official_role, official_id, department, location)
SELECT id, 'Traffic & Safety Inspector', 'traffic@kopargaonconnect.demo', '+91 97650 33221', 'official', 'traffic_safety', 'TRF-09', 'Kopargaon Traffic & Highway Safety Division', 'Shivaji Chowk Police Post'
FROM auth.users
WHERE email = 'traffic@kopargaonconnect.demo'
ON CONFLICT (id) DO UPDATE SET 
  user_type = 'official', 
  official_role = 'traffic_safety', 
  email = 'traffic@kopargaonconnect.demo',
  updated_at = now();

-- =========================================================================
-- 9. OFFICIAL DATA RESILIENCE & DISASTER RECOVERY SCHEMA
-- =========================================================================

-- 9.1 Immutable Operation Journal (Cryptographic Hash Chained)
CREATE TABLE IF NOT EXISTS public.recovery_operation_journal (
  operation_id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  actor_user_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  payload JSONB NOT NULL,
  sequence_number BIGINT NOT NULL,
  previous_hash TEXT NOT NULL,
  checksum TEXT NOT NULL,
  status TEXT DEFAULT 'PROCESSED',
  recovery_status TEXT DEFAULT 'COMMITTED',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_journal_entity ON public.recovery_operation_journal(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_journal_seq ON public.recovery_operation_journal(sequence_number);

ALTER TABLE public.recovery_operation_journal ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Journal viewable by authenticated officials" ON public.recovery_operation_journal;
CREATE POLICY "Journal viewable by authenticated officials" ON public.recovery_operation_journal FOR SELECT USING (true);
DROP POLICY IF EXISTS "System can insert journal operations" ON public.recovery_operation_journal;
CREATE POLICY "System can insert journal operations" ON public.recovery_operation_journal FOR INSERT WITH CHECK (true);

-- 9.2 Versioned Recovery Snapshots
CREATE TABLE IF NOT EXISTS public.recovery_snapshots (
  snapshot_id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  snapshot_data JSONB NOT NULL,
  version INT DEFAULT 1,
  integrity_status TEXT DEFAULT 'VALID',
  checksum TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_snapshots_entity ON public.recovery_snapshots(entity_type, entity_id);

ALTER TABLE public.recovery_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Snapshots viewable by officials" ON public.recovery_snapshots;
CREATE POLICY "Snapshots viewable by officials" ON public.recovery_snapshots FOR SELECT USING (true);
DROP POLICY IF EXISTS "Snapshots can be upserted" ON public.recovery_snapshots;
CREATE POLICY "Snapshots can be upserted" ON public.recovery_snapshots FOR ALL USING (true);

-- 9.3 Recovery Incidents & Queue
CREATE TABLE IF NOT EXISTS public.recovery_incidents (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  classification TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_state JSONB,
  recovered_state JSONB,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.recovery_incidents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Incidents viewable by officials" ON public.recovery_incidents;
CREATE POLICY "Incidents viewable by officials" ON public.recovery_incidents FOR ALL USING (true);

-- 9.4 Official Recovery Audit Trail
CREATE TABLE IF NOT EXISTS public.recovery_audit (
  id TEXT PRIMARY KEY,
  official_id TEXT NOT NULL,
  official_name TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  previous_state JSONB,
  recovered_state JSONB,
  confidence NUMERIC NOT NULL,
  evidence_summary TEXT,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.recovery_audit ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Recovery audit viewable by officials" ON public.recovery_audit;
CREATE POLICY "Recovery audit viewable by officials" ON public.recovery_audit FOR SELECT USING (true);
DROP POLICY IF EXISTS "Recovery audit insertable by officials" ON public.recovery_audit;
CREATE POLICY "Recovery audit insertable by officials" ON public.recovery_audit FOR INSERT WITH CHECK (true);

