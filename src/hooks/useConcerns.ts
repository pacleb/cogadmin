import { useState, useEffect, useCallback } from 'react';
import type { Concern, ConcernStatus } from '../types/Concern';

const STORAGE_KEY = 'admin-concerns';

const sampleConcerns: Concern[] = [
  {
    id: crypto.randomUUID(),
    title: 'Server performance degradation',
    description: 'Database queries are running slower than usual during peak hours. Need to investigate indexing and query optimization.',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: crypto.randomUUID(),
    title: 'User authentication timeout issues',
    description: 'Several users reported being logged out unexpectedly. JWT token expiration might need adjustment.',
    status: 'todo',
    priority: 'high',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: crypto.randomUUID(),
    title: 'Update privacy policy documentation',
    description: 'New GDPR compliance requirements need to be reflected in our privacy policy page.',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: crypto.randomUUID(),
    title: 'Mobile app crash on iOS 17',
    description: 'App crashes when users try to upload images on iOS 17 devices. Affecting approximately 15% of mobile users.',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: crypto.randomUUID(),
    title: 'Implement dark mode toggle',
    description: 'Users have requested the ability to manually switch between light and dark themes.',
    status: 'todo',
    priority: 'low',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: crypto.randomUUID(),
    title: 'Email notification delivery delays',
    description: 'Some transactional emails are being delayed by up to 30 minutes. Need to check SMTP provider status.',
    status: 'done',
    priority: 'medium',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: crypto.randomUUID(),
    title: 'Upgrade React to version 19',
    description: 'Plan and execute migration to React 19 to take advantage of new concurrent features.',
    status: 'todo',
    priority: 'low',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: crypto.randomUUID(),
    title: 'API rate limiting for external integrations',
    description: 'Implemented rate limiting on public API endpoints to prevent abuse. Monitoring for any issues.',
    status: 'done',
    priority: 'medium',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

const loadConcerns = (): Concern[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const concerns = JSON.parse(stored);
      return concerns.map((c: Concern) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }));
    }
  } catch (e) {
    console.error('Failed to load concerns:', e);
  }
  // Return sample data if nothing in storage
  return sampleConcerns;
};

const saveConcerns = (concerns: Concern[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(concerns));
};

export function useConcerns() {
  const [concerns, setConcerns] = useState<Concern[]>(loadConcerns);

  useEffect(() => {
    saveConcerns(concerns);
  }, [concerns]);

  const addConcern = useCallback((concern: Omit<Concern, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newConcern: Concern = {
      ...concern,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConcerns((prev) => [...prev, newConcern]);
  }, []);

  const updateConcern = useCallback((id: string, updates: Partial<Omit<Concern, 'id' | 'createdAt'>>) => {
    setConcerns((prev) =>
      prev.map((concern) =>
        concern.id === id
          ? { ...concern, ...updates, updatedAt: new Date() }
          : concern
      )
    );
  }, []);

  const deleteConcern = useCallback((id: string) => {
    setConcerns((prev) => prev.filter((concern) => concern.id !== id));
  }, []);

  const updateConcernStatus = useCallback((id: string, status: ConcernStatus) => {
    updateConcern(id, { status });
  }, [updateConcern]);

  return {
    concerns,
    addConcern,
    updateConcern,
    deleteConcern,
    updateConcernStatus,
  };
}
