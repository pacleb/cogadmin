import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Concern, ConcernStatus } from '../types/Concern';
import type { ConcernRow } from '../types/database';

// Convert database row to Concern type
const rowToConcern = (row: ConcernRow): Concern => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  status: row.status,
  priority: row.priority,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export function useConcerns() {
  const { user } = useAuth();
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch concerns from Supabase
  const fetchConcerns = useCallback(async () => {
    if (!user) {
      setConcerns([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('concerns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setConcerns(data?.map(rowToConcern) || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch concerns');
      console.error('Error fetching concerns:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load concerns on mount and when user changes
  useEffect(() => {
    fetchConcerns();
  }, [fetchConcerns]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('concerns-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'concerns',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch on any change
          fetchConcerns();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConcerns]);

  const addConcern = useCallback(
    async (concern: Omit<Concern, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) return;

      try {
        const { error } = await supabase.from('concerns').insert({
          user_id: user.id,
          title: concern.title,
          description: concern.description || null,
          status: concern.status,
          priority: concern.priority,
        });

        if (error) throw error;
        await fetchConcerns();
      } catch (err) {
        console.error('Error adding concern:', err);
        setError(err instanceof Error ? err.message : 'Failed to add concern');
      }
    },
    [user, fetchConcerns]
  );

  const updateConcern = useCallback(
    async (id: string, updates: Partial<Omit<Concern, 'id' | 'createdAt'>>) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('concerns')
          .update({
            ...(updates.title && { title: updates.title }),
            ...(updates.description !== undefined && { description: updates.description }),
            ...(updates.status && { status: updates.status }),
            ...(updates.priority && { priority: updates.priority }),
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        await fetchConcerns();
      } catch (err) {
        console.error('Error updating concern:', err);
        setError(err instanceof Error ? err.message : 'Failed to update concern');
      }
    },
    [user, fetchConcerns]
  );

  const deleteConcern = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('concerns')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        await fetchConcerns();
      } catch (err) {
        console.error('Error deleting concern:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete concern');
      }
    },
    [user, fetchConcerns]
  );

  const updateConcernStatus = useCallback(
    async (id: string, status: ConcernStatus) => {
      await updateConcern(id, { status });
    },
    [updateConcern]
  );

  return {
    concerns,
    loading,
    error,
    addConcern,
    updateConcern,
    deleteConcern,
    updateConcernStatus,
    refetch: fetchConcerns,
  };
}
