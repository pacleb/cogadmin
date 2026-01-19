import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Concern, ConcernStatus } from '../types/Concern';
import type { ConcernRow } from '../types/database';

// Convert database row to Concern type
const rowToConcern = (row: ConcernRow): Concern => ({
  id: row.id,
  groupCode: row.group_code,
  urgency: row.urgency,
  task: row.task,
  startDate: new Date(row.start_date),
  remarks: row.remarks || '',
  status: row.status,
  detailedStatus: row.detailed_status || '',
  pic: row.pic || '',
  endDate: row.end_date ? new Date(row.end_date) : null,
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
    async (concern: Omit<Concern, 'id' | 'createdAt' | 'updatedAt' | 'endDate'>) => {
      if (!user) return;

      try {
        const { error } = await supabase.from('concerns').insert({
          user_id: user.id,
          group_code: concern.groupCode,
          urgency: concern.urgency,
          task: concern.task,
          start_date: concern.startDate.toISOString(),
          remarks: concern.remarks || null,
          status: concern.status,
          detailed_status: concern.detailedStatus || null,
          pic: concern.pic || null,
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
        const updateData: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };
        
        if (updates.groupCode !== undefined) updateData.group_code = updates.groupCode;
        if (updates.urgency !== undefined) updateData.urgency = updates.urgency;
        if (updates.task !== undefined) updateData.task = updates.task;
        if (updates.startDate !== undefined) updateData.start_date = updates.startDate.toISOString();
        if (updates.remarks !== undefined) updateData.remarks = updates.remarks;
        if (updates.status !== undefined) updateData.status = updates.status;
        if (updates.detailedStatus !== undefined) updateData.detailed_status = updates.detailedStatus;
        if (updates.pic !== undefined) updateData.pic = updates.pic;
        
        // Auto-reassign PIC to Admin Head for specific statuses
        if (updates.status && ['New', 'For Delegating', 'For Download', 'For Update', 'For Report', 'For Approval'].includes(updates.status)) {
          const roleResult = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'Admin Head')
            .single();
          
          if (roleResult.data?.id) {
            const { data: adminHead } = await supabase
              .from('profiles')
              .select('nickname')
              .eq('role_id', roleResult.data.id)
              .single();
            
            if (adminHead?.nickname) {
              updateData.pic = adminHead.nickname;
            }
          }
        }
        
        // Auto-set Detailed Status to Pending when Status is Preparing or Ongoing
        if (updates.status && ['Preparing', 'Ongoing'].includes(updates.status)) {
          updateData.detailed_status = 'Pending';
        }
        
        // Note: end_date is handled by database trigger

        const { error } = await supabase
          .from('concerns')
          .update(updateData)
          .eq('id', id);

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
