export interface Concern {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export type ConcernStatus = Concern['status'];
export type ConcernPriority = Concern['priority'];
