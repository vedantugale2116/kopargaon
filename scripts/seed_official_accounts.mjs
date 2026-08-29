// =========================================================================
// Kopargaon Connect — Official Accounts Provisioning Script
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" node scripts/seed_official_accounts.mjs
// =========================================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://fcevysxmtmydscvworfu.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.log(`
[INFO] SUPABASE_SERVICE_ROLE_KEY environment variable not provided.
To seed official accounts via SQL directly without a service key, run the SQL script
in supabase_schema.sql (Section 8) inside your Supabase Dashboard SQL Editor:
  https://supabase.com/dashboard/project/fcevysxmtmydscvworfu/sql/new
`);
  process.exit(0);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const OFFICIAL_ACCOUNTS = [
  {
    email: 'admin@gmail.com',
    password: 'pass@123',
    fullName: 'Municipal Administrator',
    officialRole: 'municipal_admin',
    officialId: 'ADM-01',
    department: 'Municipal Administration',
    location: 'Kopargaon',
    phone: '+91 99220 11223'
  },
  {
    email: 'depot@kopargaonconnect.demo',
    password: 'OfficialPass@123',
    fullName: 'Depot Operations Manager',
    officialRole: 'depot_manager',
    officialId: 'DPT-04',
    department: 'MSRTC Kopargaon Depot Operations',
    location: 'Kopargaon Central Depot',
    phone: '+91 98230 55667'
  },
  {
    email: 'traffic@kopargaonconnect.demo',
    password: 'OfficialPass@123',
    fullName: 'Traffic & Safety Inspector',
    officialRole: 'traffic_safety',
    officialId: 'TRF-09',
    department: 'Kopargaon Traffic & Highway Safety Division',
    location: 'Shivaji Chowk Police Post',
    phone: '+91 97650 33221'
  }
];

async function seed() {
  console.log('Provisioning Official Accounts in Supabase...\n');

  for (const acc of OFFICIAL_ACCOUNTS) {
    console.log(`Setting up: ${acc.email} (${acc.officialRole})...`);

    // 1. Create or retrieve auth user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: acc.email,
      password: acc.password,
      email_confirm: true,
      user_metadata: {
        full_name: acc.fullName,
        user_type: 'official',
        official_role: acc.officialRole
      }
    });

    let userId = userData?.user?.id;

    if (userError) {
      if (userError.message.includes('already registered') || userError.message.includes('exists')) {
        console.log(`  User already registered in Auth. Fetching user ID...`);
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const found = listData?.users?.find(u => u.email === acc.email);
        userId = found?.id;

        if (userId) {
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: acc.password,
            email_confirm: true,
            user_metadata: {
              full_name: acc.fullName,
              user_type: 'official',
              official_role: acc.officialRole
            }
          });
          console.log(`  Updated password and metadata for ${acc.email}`);
        }
      } else {
        console.error(`  Auth creation error: ${userError.message}`);
        continue;
      }
    }

    if (userId) {
      // 2. Upsert profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          full_name: acc.fullName,
          email: acc.email,
          phone: acc.phone,
          user_type: 'official',
          official_role: acc.officialRole,
          official_id: acc.officialId,
          department: acc.department,
          location: acc.location,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error(`  Profile error: ${profileError.message}`);
      } else {
        console.log(`  ✓ Successfully configured ${acc.email}`);
      }
    }
  }

  console.log('\nFinished provisioning official accounts.');
}

seed();
