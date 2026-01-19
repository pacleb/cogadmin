import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  name: string;
  nickname: string;
  mobile: string;
  roleId: string | null;
  roleName: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export function useUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!user) {
      setUsers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch profiles with roles (email is now in profiles table)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*, roles(name)')
        .order('name', { ascending: true });

      if (profilesError) throw profilesError;

      const userList: UserProfile[] = (profiles || []).map((row: ProfileRow) => ({
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
      }));

      setUsers(userList);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = useCallback(
    async (id: string, updates: { name?: string; nickname?: string; mobile?: string; role_id?: string | null }) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
        await fetchUsers();
      } catch (err) {
        console.error('Error updating user:', err);
        setError(err instanceof Error ? err.message : 'Failed to update user');
        throw err;
      }
    },
    [user, fetchUsers]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete user');
        throw err;
      }
    },
    [user, fetchUsers]
  );

  const createUser = useCallback(
    async (userData: {
      email: string;
      password: string;
      name: string;
      nickname: string;
      mobile: string;
      role_id: string | null;
    }) => {
      if (!user) return;

      try {
        // Store the current session before creating a new user
        const { data: currentSession } = await supabase.auth.getSession();
        
        // Create auth user via signUp
        // Note: This will sign in as the new user temporarily
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              nickname: userData.nickname,
            },
          },
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create user');

        const newUserId = authData.user.id;

        // Restore the admin session immediately
        if (currentSession?.session) {
          await supabase.auth.setSession({
            access_token: currentSession.session.access_token,
            refresh_token: currentSession.session.refresh_token,
          });
        }

        // Wait for trigger to potentially create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', newUserId)
          .single();

        if (existingProfile) {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              email: userData.email,
              name: userData.name,
              nickname: userData.nickname,
              mobile: userData.mobile,
              role_id: userData.role_id,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', newUserId);

          if (updateError) {
            console.error('Error updating profile:', updateError);
          }
        } else {
          // Create new profile (trigger didn't run)
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: newUserId,
              email: userData.email,
              name: userData.name,
              nickname: userData.nickname,
              mobile: userData.mobile,
              role_id: userData.role_id,
            });

          if (insertError) {
            console.error('Error inserting profile:', insertError);
            throw insertError;
          }
        }

        // Refresh the users list
        await fetchUsers();
        return authData.user;
      } catch (err) {
        console.error('Error creating user:', err);
        setError(err instanceof Error ? err.message : 'Failed to create user');
        throw err;
      }
    },
    [user, fetchUsers]
  );

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
}
