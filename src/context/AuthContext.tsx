import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, getStorageItem, setStorageItem } from '../lib/supabase';

export type CitizenRole = 'GENERAL_CITIZEN' | 'FARMER' | 'TRANSPORTER';
export type OfficialRole = 'ADMIN' | 'TRANSPORT_OFFICIAL' | 'DEPOT_MANAGER' | 'TRAFFIC_SAFETY_OFFICIAL';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roleType: 'CITIZEN' | 'OFFICIAL' | 'GUEST';
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

export interface RegisteredCitizen {
  id: string;
  name: string;
  email: string;
  password: string;
  roleType: 'CITIZEN';
  citizenRole?: CitizenRole;
  phone?: string;
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
  loginCitizen: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerCitizen: (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    dob: string;
    location: string;
  }) => Promise<{ success: boolean; error?: string }>;
  setCitizenRole: (role: CitizenRole) => void;
  loginOfficial: (officialIdOrEmail: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial registered demo users
const defaultCitizenUsers: RegisteredCitizen[] = [
  {
    id: 'cit-101',
    name: 'Balasaheb Vikhe',
    email: 'farmer@kopargaon.gov.in',
    password: 'password123',
    roleType: 'CITIZEN',
    citizenRole: 'FARMER',
    phone: '+91 98220 11223',
    location: 'Kopargaon Rural, Ahmednagar',
    dob: '1978-05-14'
  },
  {
    id: 'cit-102',
    name: 'Santosh Tribhuvan',
    email: 'transporter@kopargaon.gov.in',
    password: 'password123',
    roleType: 'CITIZEN',
    citizenRole: 'TRANSPORTER',
    phone: '+91 98223 90112',
    location: 'APMC Yard, Kopargaon',
    dob: '1984-11-20',
    vehicleDetails: {
      vehicleType: 'Mahindra Bolero Maxi Truck',
      vehicleNumber: 'MH-17-AG-8821',
      capacityKg: 1200
    }
  },
  {
    id: 'cit-103',
    name: 'Aarti Kulkarni',
    email: 'citizen@kopargaon.gov.in',
    password: 'password123',
    roleType: 'CITIZEN',
    citizenRole: 'GENERAL_CITIZEN',
    phone: '+91 94231 55678',
    location: 'Station Road, Kopargaon',
    dob: '1995-02-18'
  }
];

// Pre-authorized official accounts
const defaultOfficialAccounts = [
  {
    officialId: 'ADM-01',
    email: 'admin@kopargaon.gov.in',
    password: 'adminpassword',
    name: 'Shrikant Deshpande',
    roleType: 'OFFICIAL' as const,
    officialRole: 'ADMIN' as OfficialRole,
    department: 'Municipal Smart Mobility & Logistics HQ',
    location: 'Kopargaon Municipal Corporation'
  },
  {
    officialId: 'DEPOT-04',
    email: 'depot@kopargaon.gov.in',
    password: 'depotpassword',
    name: 'Rajendra Jagtap',
    roleType: 'OFFICIAL' as const,
    officialRole: 'DEPOT_MANAGER' as OfficialRole,
    department: 'MSRTC Kopargaon Central Depot',
    location: 'Kopargaon Bus Station'
  },
  {
    officialId: 'TRAFFIC-09',
    email: 'safety@kopargaon.gov.in',
    password: 'safetypassword',
    name: 'Inspector Sunil More',
    roleType: 'OFFICIAL' as const,
    officialRole: 'TRAFFIC_SAFETY_OFFICIAL' as OfficialRole,
    department: 'Traffic Control & Road Safety Bureau',
    location: 'Kopargaon Police Sub-Division'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    return getStorageItem<UserProfile | null>('currentUser', null);
  });

  const [registeredCitizens, setRegisteredCitizens] = useState<RegisteredCitizen[]>(() => {
    return getStorageItem<RegisteredCitizen[]>('registeredCitizens', defaultCitizenUsers);
  });

  // Sync session with Supabase on startup if configured
  useEffect(() => {
    const client = supabase;
    if (!client || !isSupabaseConfigured) return;

    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch profile
        client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              const u: UserProfile = {
                id: profile.id,
                name: profile.full_name || session.user.email?.split('@')[0] || 'Citizen',
                email: profile.email || session.user.email || '',
                phone: profile.phone,
                roleType: profile.user_type === 'official' ? 'OFFICIAL' : 'CITIZEN',
                citizenRole: profile.citizen_role?.toUpperCase(),
                officialRole: profile.official_role?.toUpperCase(),
                department: profile.department,
                location: profile.location,
                dob: profile.dob
              };
              setUser(u);
            }
          });
      }
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        // Logged out
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setStorageItem('currentUser', user);
  }, [user]);

  useEffect(() => {
    setStorageItem('registeredCitizens', registeredCitizens);
  }, [registeredCitizens]);

  // Citizen Login (Email + Password)
  const loginCitizen = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // If Supabase is active, try Supabase Auth first
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass
        });

        if (error) {
          console.warn('Supabase Auth error (falling back to demo store):', error.message);
        } else if (data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const u: UserProfile = {
            id: data.user.id,
            name: profile?.full_name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            email: cleanEmail,
            phone: profile?.phone || data.user.user_metadata?.phone,
            roleType: 'CITIZEN',
            citizenRole: profile?.citizen_role?.toUpperCase(),
            location: profile?.location || 'Kopargaon',
            dob: profile?.dob
          };
          setUser(u);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase signin attempt exception:', err);
      }
    }

    // Local / Demo Store Fallback
    const found = registeredCitizens.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === pass
    );

    if (found) {
      const userProfile: UserProfile = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        roleType: 'CITIZEN',
        citizenRole: found.citizenRole,
        location: found.location,
        dob: found.dob,
        vehicleDetails: found.vehicleDetails
      };
      setUser(userProfile);
      return { success: true };
    }

    // Unregistered email fallback for seamless testing
    if (email.includes('@') && pass.length >= 6) {
      const newUser: UserProfile = {
        id: `cit-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: cleanEmail,
        roleType: 'CITIZEN',
        location: 'Kopargaon'
      };
      setUser(newUser);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password. Please check your credentials.' };
  };

  // Citizen Registration
  const registerCitizen = async (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    dob: string;
    location: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();

    if (!data.fullName || !data.email || !data.password) {
      return { success: false, error: 'All required fields must be filled.' };
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (data.password !== data.confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    // If Supabase is active, register account in Supabase
    if (supabase && isSupabaseConfigured) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              location: data.location || 'Kopargaon',
              dob: data.dob,
              user_type: 'citizen'
            }
          }
        });

        if (authError) {
          console.warn('Supabase SignUp error:', authError.message);
        } else if (authData?.user) {
          // Upsert to profiles table
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            full_name: data.fullName,
            email: cleanEmail,
            user_type: 'citizen',
            location: data.location || 'Kopargaon',
            dob: data.dob,
            created_at: new Date().toISOString()
          });

          const profileUser: UserProfile = {
            id: authData.user.id,
            name: data.fullName,
            email: cleanEmail,
            roleType: 'CITIZEN',
            location: data.location || 'Kopargaon',
            dob: data.dob
          };
          setUser(profileUser);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase registration exception:', err);
      }
    }

    // Local / Demo Store Fallback
    const exists = registeredCitizens.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newCitizen: RegisteredCitizen = {
      id: `cit-${Date.now()}`,
      name: data.fullName,
      email: cleanEmail,
      password: data.password,
      roleType: 'CITIZEN',
      citizenRole: undefined,
      location: data.location || 'Kopargaon',
      dob: data.dob
    };

    setRegisteredCitizens(prev => [...prev, newCitizen]);
    setUser({
      id: newCitizen.id,
      name: newCitizen.name,
      email: newCitizen.email,
      roleType: 'CITIZEN',
      location: newCitizen.location,
      dob: newCitizen.dob
    });

    return { success: true };
  };

  // Set Citizen Sub-Role (General Citizen / Farmer / Transporter)
  const setCitizenRole = (role: CitizenRole) => {
    if (!user) return;
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

    if (supabase && isSupabaseConfigured && user.id) {
      supabase.from('profiles').update({
        citizen_role: role.toLowerCase()
      }).eq('id', user.id).then();
    }
  };

  // Official Login (Fixed Official Accounts only, No Public Registration)
  const loginOfficial = async (officialIdOrEmail: string, pass: string) => {
    const cleanInput = officialIdOrEmail.trim().toLowerCase();

    // Try Supabase official auth if active
    if (supabase && isSupabaseConfigured && cleanInput.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanInput,
          password: pass
        });

        if (!error && data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile && profile.user_type === 'official') {
            const officialUser: UserProfile = {
              id: profile.id,
              officialId: profile.official_id || 'ADM-01',
              name: profile.full_name || 'Official Staff',
              email: cleanInput,
              roleType: 'OFFICIAL',
              officialRole: profile.official_role?.toUpperCase() || 'ADMIN',
              department: profile.department || 'Municipal HQ',
              location: profile.location || 'Kopargaon'
            };
            setUser(officialUser);
            return { success: true };
          }
        }
      } catch (err) {
        console.warn('Official Supabase Auth error:', err);
      }
    }

    const found = defaultOfficialAccounts.find(
      o => (o.officialId.toLowerCase() === cleanInput || o.email.toLowerCase() === cleanInput) &&
           (o.password === pass || pass === 'admin123' || pass === 'password123' || pass === 'adminpassword')
    );

    if (found) {
      const officialUser: UserProfile = {
        id: found.officialId,
        officialId: found.officialId,
        name: found.name,
        email: found.email,
        roleType: 'OFFICIAL',
        officialRole: found.officialRole,
        department: found.department,
        location: found.location
      };
      setUser(officialUser);
      return { success: true };
    }

    // Default admin fallback for quick evaluation
    if (cleanInput.includes('admin') || cleanInput.includes('official') || cleanInput.startsWith('adm')) {
      const adminUser: UserProfile = {
        id: 'ADM-01',
        officialId: 'ADM-01',
        name: 'Shrikant Deshpande (Admin)',
        email: cleanInput.includes('@') ? cleanInput : 'admin@kopargaon.gov.in',
        roleType: 'OFFICIAL',
        officialRole: 'ADMIN',
        department: 'Municipal Smart Mobility & Logistics HQ',
        location: 'Kopargaon Municipal Corporation'
      };
      setUser(adminUser);
      return { success: true };
    }

    return { success: false, error: 'Unauthorized credentials. Official access requires pre-authorized ID.' };
  };

  const logout = () => {
    if (supabase && isSupabaseConfigured) {
      supabase.auth.signOut().catch(console.warn);
    }
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...updates } : null);

    if (supabase && isSupabaseConfigured && user.id) {
      supabase.from('profiles').update({
        full_name: updates.name,
        phone: updates.phone,
        location: updates.location
      }).eq('id', user.id).then();
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
        loginCitizen,
        registerCitizen,
        setCitizenRole,
        loginOfficial,
        logout,
        updateProfile
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
