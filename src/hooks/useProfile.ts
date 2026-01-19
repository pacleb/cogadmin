import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../types/Profile';

interface ProfileRow {
  id: string;
  user_id: string;
  email: string;
  name: string;
  nickname: string;
  mobile: string;
  role_id: string | null;
  created_at: string;
  updated_at: string;
  roles?: { name: string } | null;
}

const rowToProfile = (row: ProfileRow): Profile => ({
  id: row.id,
  userId: row.user_id,
  email: row.email || '',
  name: row.name || '',
  nickname: row.nickname || '',
  mobile: row.mobile || '',
  roleId: row.role_id,
  roleName: row.roles?.name || '',
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*, roles(name)')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(rowToProfile(data));
      } else {
        // Create a new profile if one doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            email: user.email || '',
            name: '',
            nickname: '',
            mobile: '',
          })
          .select('*, roles(name)')
          .single();

        if (insertError) throw insertError;
        if (newProfile) {
          setProfile(rowToProfile(newProfile));
        }
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (updates: { name?: string; nickname?: string; mobile?: string }) => {
      if (!user || !profile) return;

      try {
        setSaving(true);
        const { error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (error) throw error;
        await fetchProfile();
      } catch (err) {
        console.error('Error updating profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to update profile');
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [user, profile, fetchProfile]
  );

  return {
    profile,
    loading,
    saving,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}
