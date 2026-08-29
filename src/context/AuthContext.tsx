import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export type CitizenRole = 'GENERAL_CITIZEN' | 'FARMER' | 'TRANSPORTER';
export type OfficialRole = 'ADMIN' | 'DEPOT_MANAGER' | 'TRAFFIC_SAFETY_OFFICIAL' | 'TRANSPORT_OFFICIAL';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roleType: 'CITIZEN' | 'OFFICIAL';
  citizenRole?: CitizenRole;
  officialRole?: OfficialRole;
  officialId?: string;
  department?: string;
  location?: string;
  dob?: string;
  vehicleDetails?: {
    vehicleType: string;
    vehicleNumber: string;
    capacityKg: number;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOfficial: boolean;
  authLoading: boolean;
  loginCitizen: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerCitizen: (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    dob?: string;
    location?: string;
    phone?: string;
    role?: CitizenRole;
  }) => Promise<{ success: boolean; error?: string }>;
  setCitizenRole: (role: CitizenRole) => Promise<void>;
  loginOfficial: (officialIdOrEmail: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to normalize citizen role enum
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // In-flight request locks to strictly prevent duplicate simultaneous auth calls
  const isRegisteringRef = useRef<boolean>(false);
  const isLoggingInRef = useRef<boolean>(false);
  const isLoggingInOfficialRef = useRef<boolean>(false);

  // Fetch or create profile corresponding to Supabase Auth user
  const fetchUserProfile = useCallback(async (authUserId: string, authEmail: string, metadata?: any): Promise<UserProfile | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .maybeSingle();

      if (error) {
        console.warn('Profile fetch notification:', error.message);
      }

      if (profile) {
        const isOff = profile.user_type === 'official';
        const citRole = isOff ? undefined : parseCitizenRole(profile.citizen_role);
        const offRole = isOff ? parseOfficialRole(profile.official_role) : undefined;

        return {
          id: profile.id,
          name: profile.full_name || metadata?.full_name || authEmail.split('@')[0] || 'User',
          email: profile.email || authEmail,
          phone: profile.phone || metadata?.phone,
          roleType: isOff ? 'OFFICIAL' : 'CITIZEN',
          citizenRole: citRole,
          officialRole: offRole,
          officialId: profile.official_id || metadata?.official_id,
          department: profile.department || metadata?.department,
          location: profile.location || 'Kopargaon',
          dob: profile.dob,
          vehicleDetails: citRole === 'TRANSPORTER' ? {
            vehicleType: 'Mahindra Bolero Maxi Truck',
            vehicleNumber: 'MH-17-AG-8821',
            capacityKg: 1200
          } : undefined
        };
      }

      // If no profile row yet, return profile constructed from metadata
      const defaultName = metadata?.full_name || authEmail.split('@')[0] || 'Citizen';
      const defaultUserType = metadata?.user_type === 'official' ? 'official' : 'citizen';
      const defaultCitizenRole = metadata?.citizen_role || 'general_citizen';
      const isOff = defaultUserType === 'official';

      // Attempt upsert only when authenticated session is active
      supabase
        .from('profiles')
        .upsert({
          id: authUserId,
          full_name: defaultName,
          email: authEmail,
          user_type: defaultUserType,
          citizen_role: defaultCitizenRole,
          location: metadata?.location || 'Kopargaon',
          dob: metadata?.dob || null,
          phone: metadata?.phone || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .then(() => {}, (err) => console.warn('Profile sync:', err));

      return {
        id: authUserId,
        name: defaultName,
        email: authEmail,
        phone: metadata?.phone,
        roleType: isOff ? 'OFFICIAL' : 'CITIZEN',
        citizenRole: isOff ? undefined : parseCitizenRole(defaultCitizenRole),
        officialRole: isOff ? parseOfficialRole(metadata?.official_role) : undefined,
        location: metadata?.location || 'Kopargaon',
        dob: metadata?.dob
      };
    } catch (e) {
      console.error('Exception fetching user profile:', e);
      return null;
    }
  }, []);

  // Initial Supabase Session Check and Auth State Listener (READ-ONLY, NEVER CALLS SIGNUP OR SIGNIN)
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase getSession notification:', error.message);
        }

        if (session?.user && isMounted) {
          const loadedUser = await fetchUserProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata
          );
          if (isMounted) {
            setUser(loadedUser);
          }
        }
      } catch (err) {
        console.error('Supabase Auth init error:', err);
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    initAuth();

    // Subscribe to auth state changes (READ-ONLY listener)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user && isMounted) {
          const loadedUser = await fetchUserProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata
          );
          if (isMounted) {
            setUser(loadedUser);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUser(null);
        }
      }
      if (isMounted) {
        setAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Refresh profile data from Supabase
  const refreshProfile = async () => {
    if (!user?.id) return;
    const refreshed = await fetchUserProfile(user.id, user.email);
    if (refreshed) {
      setUser(refreshed);
    }
  };

  // Citizen Registration via Supabase Auth (EXACTLY ONE signUp REQUEST, NO DUPLICATE CALLS)
  const registerCitizen = async (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    dob?: string;
    location?: string;
    phone?: string;
    role?: CitizenRole;
  }): Promise<{ success: boolean; error?: string }> => {
    if (isRegisteringRef.current) {
      return { success: false, error: 'Registration request is currently in progress. Please wait.' };
    }

    const cleanEmail = data.email.trim().toLowerCase();

    if (!data.fullName.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (data.password !== data.confirmPassword) {
      return { success: false, error: 'Passwords do not match. Please re-enter.' };
    }

    const initialCitizenRole = data.role ? data.role.toLowerCase() : 'general_citizen';
    isRegisteringRef.current = true;

    try {
      // Exactly ONE signUp call
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName.trim(),
            location: data.location?.trim() || 'Kopargaon',
            dob: data.dob || null,
            phone: data.phone?.trim() || null,
            user_type: 'citizen',
            citizen_role: initialCitizenRole
          }
        }
      });

      if (authError) {
        return { success: false, error: getAuthErrorMessage(authError) };
      }

      if (authData?.user) {
        // Construct user profile
        const u: UserProfile = {
          id: authData.user.id,
          name: data.fullName.trim(),
          email: cleanEmail,
          phone: data.phone?.trim(),
          roleType: 'CITIZEN',
          citizenRole: parseCitizenRole(initialCitizenRole),
          location: data.location?.trim() || 'Kopargaon',
          dob: data.dob
        };
        setUser(u);

        // Async sync profile row to DB if session exists
        if (authData.session) {
          supabase.from('profiles').upsert({
            id: authData.user.id,
            full_name: data.fullName.trim(),
            email: cleanEmail,
            phone: data.phone?.trim() || null,
            user_type: 'citizen',
            citizen_role: initialCitizenRole,
            location: data.location?.trim() || 'Kopargaon',
            dob: data.dob || null,
            created_at: new Date().toISOString(),
          }).then(() => {}, (err) => console.warn('Profile sync:', err));
        }

        return { success: true };
      }

      return { success: false, error: 'Failed to create account. Please try again.' };
    } catch (err: any) {
      console.error('Registration exception:', err);
      return { success: false, error: getAuthErrorMessage(err) };
    } finally {
      isRegisteringRef.current = false;
    }
  };

  // Citizen Login (EXACTLY ONE signInWithPassword REQUEST, NO DUPLICATE CALLS)
  const loginCitizen = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isLoggingInRef.current) {
      return { success: false, error: 'Login is already processing. Please wait.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !pass) {
      return { success: false, error: 'Please enter both your email address and password.' };
    }

    isLoggingInRef.current = true;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass
      });

      if (error) {
        return { success: false, error: getAuthErrorMessage(error) };
      }

      if (data?.user && data.session) {
        const loadedUser = await fetchUserProfile(
          data.user.id,
          data.user.email || cleanEmail,
          data.user.user_metadata
        );

        if (loadedUser) {
          setUser(loadedUser);
          return { success: true };
        }
      }

      return { success: false, error: 'Unable to establish secure session. Please try again.' };
    } catch (err: any) {
      console.error('Citizen login exception:', err);
      return { success: false, error: getAuthErrorMessage(err) };
    } finally {
      isLoggingInRef.current = false;
    }
  };

  // Official Login (EXACTLY ONE signInWithPassword REQUEST)
  const loginOfficial = async (officialIdOrEmail: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isLoggingInOfficialRef.current) {
      return { success: false, error: 'Official authentication in progress. Please wait.' };
    }

    const cleanInput = officialIdOrEmail.trim().toLowerCase();

    if (!cleanInput || !pass) {
      return { success: false, error: 'Please enter your Official Email / ID and password.' };
    }

    isLoggingInOfficialRef.current = true;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanInput,
        password: pass
      });

      if (error) {
        return { success: false, error: getAuthErrorMessage(error) };
      }

      if (data?.user && data.session) {
        // Fetch official profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        // Verify this account is authorized as an official
        if (!profile || profile.user_type !== 'official') {
          await supabase.auth.signOut();
          setUser(null);
          return {
            success: false,
            error: 'Access Denied: This account is not registered as an authorized Municipal Official.'
          };
        }

        const officialUser: UserProfile = {
          id: profile.id,
          officialId: profile.official_id || 'ADM-01',
          name: profile.full_name || 'Official Staff',
          email: profile.email || cleanInput,
          roleType: 'OFFICIAL',
          officialRole: parseOfficialRole(profile.official_role),
          department: profile.department || 'Municipal HQ',
          location: profile.location || 'Kopargaon'
        };

        setUser(officialUser);
        return { success: true };
      }

      return { success: false, error: 'Official authentication failed.' };
    } catch (err: any) {
      console.error('Official login exception:', err);
      return { success: false, error: getAuthErrorMessage(err) };
    } finally {
      isLoggingInOfficialRef.current = false;
    }
  };

  // Switch Active Citizen Role (Farmer / Transporter / General Citizen)
  const setCitizenRole = async (role: CitizenRole) => {
    if (!user || user.roleType === 'OFFICIAL') return;

    const dbRoleValue = role.toLowerCase();
    const updated: UserProfile = {
      ...user,
      citizenRole: role
    };

    if (role === 'TRANSPORTER' && !updated.vehicleDetails) {
      updated.vehicleDetails = {
        vehicleType: 'Mahindra Bolero Maxi Truck',
        vehicleNumber: 'MH-17-AG-8821',
        capacityKg: 1200
      };
    }

    setUser(updated);

    try {
      await supabase
        .from('profiles')
        .update({
          citizen_role: dbRoleValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    } catch (err) {
      console.warn('Failed to update citizen role in database:', err);
    }
  };

  // Real Password Reset via Supabase Auth (EXACTLY ONE resetPasswordForEmail REQUEST)
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid registered email address.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/citizen/login`
      });

      if (error) {
        return { success: false, error: getAuthErrorMessage(error) };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: getAuthErrorMessage(err) };
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('SignOut notification:', err);
    } finally {
      setUser(null);
    }
  };

  // Update profile details
  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const newName = updates.name !== undefined ? updates.name : user.name;
    const newPhone = updates.phone !== undefined ? updates.phone : user.phone;
    const newLocation = updates.location !== undefined ? updates.location : user.location;
    const newDob = updates.dob !== undefined ? updates.dob : user.dob;

    setUser(prev => prev ? {
      ...prev,
      name: newName,
      phone: newPhone,
      location: newLocation,
      dob: newDob
    } : null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: newName,
          phone: newPhone,
          location: newLocation,
          dob: newDob,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update profile in database.' };
    }
  };

  const isAuthenticated = user !== null;
  const isOfficial = user?.roleType === 'OFFICIAL';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isOfficial,
        authLoading,
        loginCitizen,
        registerCitizen,
        setCitizenRole,
        loginOfficial,
        resetPassword,
        logout,
        updateProfile,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
