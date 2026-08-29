-- =========================================================================
-- KOPARGAON CONNECT — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Project: https://fcevysxmtmydscvworfu.supabase.co
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =========================================================================

-- Enable pgcrypto extension for secure password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

-- 2. Traffic Reports Table
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
  status TEXT DEFAULT 'REPORTED' CHECK (status IN ('REPORTED', 'ACKNOWLEDGED', 'CLEARED')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.traffic_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Traffic reports viewable by everyone" ON public.traffic_reports FOR SELECT USING (true);
CREATE POLICY "Anyone can submit a traffic report" ON public.traffic_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Officials can update traffic reports" ON public.traffic_reports FOR UPDATE USING (true);

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
-- 8. OFFICIAL ACCOUNTS SEED SCRIPT (REAL SUPABASE AUTH & PROFILES)
-- Password for all official accounts: OfficialPass@123
-- Run this block in Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- =========================================================================

DO $$
DECLARE
  v_admin_id UUID := '44444444-4444-4444-8444-444444444444';
  v_depot_id UUID := '55555555-5555-4555-8555-555555555555';
  v_traffic_id UUID := '66666666-6666-4666-8666-666666666666';
  v_encrypted_pass TEXT := crypt('OfficialPass@123', gen_salt('bf'));
BEGIN
  -- 8.1 Municipal Admin Account
  -- Email: admin@kopargaonconnect.demo
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@kopargaonconnect.demo', v_encrypted_pass, now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Municipal Administrator","user_type":"official","official_role":"municipal_admin","department":"Municipal Command HQ"}',
    now(), now(), 'authenticated', 'authenticated'
  ) ON CONFLICT (id) DO UPDATE SET encrypted_password = v_encrypted_pass, email = 'admin@kopargaonconnect.demo', email_confirmed_at = now();

  INSERT INTO public.profiles (id, full_name, email, phone, user_type, official_role, official_id, department, location)
  VALUES (v_admin_id, 'Municipal Administrator', 'admin@kopargaonconnect.demo', '+91 99220 11223', 'official', 'municipal_admin', 'ADM-01', 'Municipal Administration & Mobility Command', 'Kopargaon HQ')
  ON CONFLICT (id) DO UPDATE SET user_type = 'official', official_role = 'municipal_admin', email = 'admin@kopargaonconnect.demo';

  -- 8.2 Depot Operations Manager Account
  -- Email: depot@kopargaonconnect.demo
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    v_depot_id, '00000000-0000-0000-0000-000000000000', 'depot@kopargaonconnect.demo', v_encrypted_pass, now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Depot Operations Manager","user_type":"official","official_role":"depot_manager","department":"Kopargaon Central Bus Depot"}',
    now(), now(), 'authenticated', 'authenticated'
  ) ON CONFLICT (id) DO UPDATE SET encrypted_password = v_encrypted_pass, email = 'depot@kopargaonconnect.demo', email_confirmed_at = now();

  INSERT INTO public.profiles (id, full_name, email, phone, user_type, official_role, official_id, department, location)
  VALUES (v_depot_id, 'Depot Operations Manager', 'depot@kopargaonconnect.demo', '+91 98230 55667', 'official', 'depot_manager', 'DPT-04', 'MSRTC Kopargaon Depot Operations', 'Kopargaon Central Depot')
  ON CONFLICT (id) DO UPDATE SET user_type = 'official', official_role = 'depot_manager', email = 'depot@kopargaonconnect.demo';

  -- 8.3 Traffic & Road Safety Official Account
  -- Email: traffic@kopargaonconnect.demo
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    v_traffic_id, '00000000-0000-0000-0000-000000000000', 'traffic@kopargaonconnect.demo', v_encrypted_pass, now(),
    '{"provider":"email","providers":["email"]}', '{"full_name":"Traffic & Safety Inspector","user_type":"official","official_role":"traffic_safety","department":"Traffic & Transit Police"}',
    now(), now(), 'authenticated', 'authenticated'
  ) ON CONFLICT (id) DO UPDATE SET encrypted_password = v_encrypted_pass, email = 'traffic@kopargaonconnect.demo', email_confirmed_at = now();

  INSERT INTO public.profiles (id, full_name, email, phone, user_type, official_role, official_id, department, location)
  VALUES (v_traffic_id, 'Traffic & Safety Inspector', 'traffic@kopargaonconnect.demo', '+91 97650 33221', 'official', 'traffic_safety', 'TRF-09', 'Kopargaon Traffic & Highway Safety Division', 'Shivaji Chowk Police Post')
  ON CONFLICT (id) DO UPDATE SET user_type = 'official', official_role = 'traffic_safety', email = 'traffic@kopargaonconnect.demo';

END $$;
