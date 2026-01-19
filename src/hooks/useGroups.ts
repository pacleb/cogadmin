import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Group } from '../types/Group';
import type { GroupRow } from '../types/database';

const rowToGroup = (row: GroupRow): Group => ({
  id: row.id,
  code: row.code,
  name: row.name,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export function useGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('code', { ascending: true });

      if (error) throw error;

      setGroups(data?.map(rowToGroup) || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const addGroup = useCallback(
    async (group: { code: string; name: string }) => {
      if (!user) return;

      try {
        const { error } = await supabase.from('groups').insert({
          code: group.code,
          name: group.name,
        });

        if (error) throw error;
        await fetchGroups();
      } catch (err) {
        console.error('Error adding group:', err);
        setError(err instanceof Error ? err.message : 'Failed to add group');
        throw err;
      }
    },
    [user, fetchGroups]
  );

  const updateGroup = useCallback(
    async (id: string, updates: { code?: string; name?: string }) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('groups')
          .update({
            ...(updates.code && { code: updates.code }),
            ...(updates.name && { name: updates.name }),
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
        await fetchGroups();
      } catch (err) {
        console.error('Error updating group:', err);
        setError(err instanceof Error ? err.message : 'Failed to update group');
        throw err;
      }
    },
    [user, fetchGroups]
  );

  const deleteGroup = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('groups')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchGroups();
      } catch (err) {
        console.error('Error deleting group:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete group');
        throw err;
      }
    },
    [user, fetchGroups]
  );

  return {
    groups,
    loading,
    error,
    addGroup,
    updateGroup,
    deleteGroup,
    refetch: fetchGroups,
  };
}
