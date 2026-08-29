// Helper to normalize citizen role enum
export type CitizenRole = 'GENERAL_CITIZEN' | 'FARMER' | 'TRANSPORTER';
export type OfficialRole = 'ADMIN' | 'DEPOT_MANAGER' | 'TRAFFIC_SAFETY_OFFICIAL' | 'TRANSPORT_OFFICIAL';

export function parseCitizenRole(roleStr?: string | null): CitizenRole {
  if (!roleStr) return 'GENERAL_CITIZEN';
  const norm = roleStr.trim().toLowerCase();
  if (norm.includes('farmer')) return 'FARMER';
  if (norm.includes('transporter')) return 'TRANSPORTER';
  return 'GENERAL_CITIZEN';
}

// Helper to normalize official role enum
export function parseOfficialRole(roleStr?: string | null): OfficialRole {
  if (!roleStr) return 'ADMIN';
  const norm = roleStr.trim().toLowerCase();
  if (norm.includes('depot')) return 'DEPOT_MANAGER';
  if (norm.includes('traffic') || norm.includes('safety')) return 'TRAFFIC_SAFETY_OFFICIAL';
  if (norm.includes('transport')) return 'TRANSPORT_OFFICIAL';
  return 'ADMIN';
}

// Predefined Demo Accounts for Quick Login
export const CITIZEN_DEMO_ACCOUNTS = [
  {
    id: 'farmer',
    label: 'Farmer',
    role: 'FARMER' as CitizenRole,
    email: 'demo.farmer@kopargaonconnect.demo',
    password: 'DemoPass@123',
    icon: 'agriculture'
  },
  {
    id: 'transporter',
    label: 'Transporter',
    role: 'TRANSPORTER' as CitizenRole,
    email: 'demo.transporter@kopargaonconnect.demo',
    password: 'DemoPass@123',
    icon: 'local_shipping'
  },
  {
    id: 'citizen',
    label: 'General Citizen',
    role: 'GENERAL_CITIZEN' as CitizenRole,
    email: 'demo.citizen@kopargaonconnect.demo',
    password: 'DemoPass@123',
    icon: 'person'
  }
];

export const OFFICIAL_DEMO_ACCOUNTS = [
  {
    id: 'admin',
    label: 'Municipal Admin',
    role: 'ADMIN' as OfficialRole,
    email: 'demo.admin@kopargaonconnect.demo',
    password: 'DemoPass@123',
    icon: 'admin_panel_settings'
  },
  {
    id: 'depot',
    label: 'Depot Manager',
    role: 'DEPOT_MANAGER' as OfficialRole,
    email: 'demo.depot@kopargaonconnect.demo',
    password: 'DemoPass@123',
    icon: 'directions_bus'
  },
  {
    id: 'traffic',
    label: 'Traffic & Safety',
    role: 'TRAFFIC_SAFETY_OFFICIAL' as OfficialRole,
    email: 'demo.traffic@kopargaonconnect.demo',
    password: 'DemoPass@123',
    icon: 'traffic'
  }
];

// Standard user-friendly error mapper for Supabase Auth errors
export function getAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const message = (error.message || error.error_description || String(error)).toLowerCase();
  const status = error.status || (error as any).statusCode;
  const code = (error.code || '').toLowerCase();

  // Rate Limiting (429 / over rate limit)
  if (
    status === 429 ||
    code.includes('rate_limit') ||
    code.includes('over_email_send_rate_limit') ||
    code.includes('over_request_rate_limit') ||
    message.includes('rate limit') ||
    message.includes('too many requests')
  ) {
    return 'Too many authentication attempts. Please wait a moment before trying again.';
  }

  // Invalid Credentials
  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid_credentials') ||
    message.includes('invalid_grant') ||
    message.includes('user not found') ||
    message.includes('wrong password')
  ) {
    return 'Invalid email or password.';
  }

  // Already Registered
  if (
    code.includes('user_already_exists') ||
    message.includes('already registered') ||
    message.includes('unique constraint') ||
    message.includes('user already exists')
  ) {
    return 'This email is already registered. Please sign in instead.';
  }

  // Weak Password
  if (
    code.includes('weak_password') ||
    message.includes('password should be at least') ||
    message.includes('weak password')
  ) {
    return 'Password does not meet the required requirements.';
  }

  // Email Confirmation Required
  if (
    message.includes('email not confirmed') ||
    code.includes('email_not_confirmed')
  ) {
    return 'Email not confirmed yet. Please check your inbox or contact support.';
  }

  // Network or Connection failure
  if (
    message.includes('fetch failed') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('failed to fetch') ||
    message.includes('offline')
  ) {
    return 'Unable to connect to the authentication service. Please try again.';
  }

  return 'Authentication failed. Please check your details and try again.';
}
