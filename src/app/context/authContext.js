"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Profile Management
  const handleProfileCreation = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        role: 'patient',
        patient_type: 'external',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // 2. User Data Fetching
  const fetchUserData = async (session) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return error ? await handleProfileCreation(session.user.id) : profile;
    } catch (error) {
      console.error('Profile error:', error);
      return null;
    }
  };

  // 3. Auth Initialization
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          const profile = await fetchUserData(session);
          setUser({ ...session.user, ...profile });
        }
      } catch (error) {
        console.error('Auth init error:', error);
        await supabase.auth.signOut();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 4. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchUserData(session);
          setUser({ ...session.user, ...profile });
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // 5. Context Value
  const value = {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    isPatient: user?.role === 'patient',
    isExternal: user?.patient_type === 'external',
    isBooked: user?.patient_type === 'booked',
    isPremium: user?.patient_type === 'paid'
  };

 // Add these status checks to the context value
    return (
    <AuthContext.Provider value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        isPatient: user?.role === 'patient',
        isExternal: user?.patient_type === 'external',
        isBooked: user?.patient_type === 'booked',
        isPremium: user?.patient_type === 'paid'
    }}>
        {!loading && children}
    </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);