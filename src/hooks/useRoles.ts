import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../types/Role';

const rowToRole = (row: { id: string; code: string; name: string; created_at: string; updated_at: string }): Role => ({
  id: row.id,
  code: row.code,
  name: row.name,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export function useRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('code', { ascending: true });

      if (error) throw error;

      setRoles(data?.map(rowToRole) || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const addRole = useCallback(
    async (role: { code: string; name: string }) => {
      if (!user) return;

      try {
        const { error } = await supabase.from('roles').insert({
          code: role.code,
          name: role.name,
        });

        if (error) throw error;
        await fetchRoles();
      } catch (err) {
        console.error('Error adding role:', err);
        setError(err instanceof Error ? err.message : 'Failed to add role');
        throw err;
      }
    },
    [user, fetchRoles]
  );

  const updateRole = useCallback(
    async (id: string, updates: { code?: string; name?: string }) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('roles')
          .update({
            ...(updates.code && { code: updates.code }),
            ...(updates.name && { name: updates.name }),
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
        await fetchRoles();
      } catch (err) {
        console.error('Error updating role:', err);
        setError(err instanceof Error ? err.message : 'Failed to update role');
        throw err;
      }
    },
    [user, fetchRoles]
  );

  const deleteRole = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('roles')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchRoles();
      } catch (err) {
        console.error('Error deleting role:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete role');
        throw err;
      }
    },
    [user, fetchRoles]
  );

  return {
    roles,
    loading,
    error,
    addRole,
    updateRole,
    deleteRole,
    refetch: fetchRoles,
  };
}
