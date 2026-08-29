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

// Standard user-friendly error mapper for Supabase Auth errors (Citizen)
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
    return 'Too many login attempts. Please wait a moment and try again.';
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

  return 'Invalid email or password.';
}

// Error mapper specifically for Official Portal authentication
export function getOfficialAuthErrorMessage(error: any): string {
  if (!error) return 'Invalid official ID/email or password.';

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
    return 'Too many login attempts. Please wait a moment and try again.';
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

  // Default invalid credentials response for official login
  return 'Invalid official ID/email or password.';
}
