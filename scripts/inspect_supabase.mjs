import { createClient } from '@supabase/supabase-js';

const url = 'https://fcevysxmtmydscvworfu.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZXZ5c3htdG15ZHNjdndvcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMjI2ODIsImV4cCI6MjEwMzU5ODY4Mn0.bKZE5MCP-9jvTp8xJU1glwA-EX7VTvMtbVR6dtrdIws';

const supabase = createClient(url, key);

async function check() {
  console.log('=== INSPECTING EXISTING SUPABASE SCHEMA ===');
  const tables = [
    'profiles',
    'traffic_reports',
    'mobility_reports',
    'shipments',
    'passenger_bookings',
    'published_trips',
    'safety_alerts',
    'resilience_events',
    'recovery_snapshots',
    'resilience_incidents',
    'recovery_queue',
    'recovery_audit',
    'pending_transactions'
  ];

  for (const t of tables) {
    try {
      const res = await fetch(`${url}/rest/v1/${t}?select=count`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Range-Unit': 'items',
          'Range': '0-0',
          'Prefer': 'count=exact'
        }
      });
      const range = res.headers.get('content-range');
      console.log(`${t}: HTTP ${res.status} (${range || (res.status === 404 ? 'TABLE NOT FOUND' : 'OK')})`);
    } catch (err) {
      console.log(`${t}: ERROR`, err.message);
    }
  }
}
check();
