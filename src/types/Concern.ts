export type ConcernUrgency = 
  | 'EMERGENCY'
  | 'Major Urgent'
  | 'Urgent'
  | 'Major'
  | 'Normal';

export type ConcernStatus = 
  | 'New'
  | 'For Delegating'
  | 'Preparing'
  | 'For Update'
  | 'For Report'
  | 'For Approval'
  | 'For Download'
  | 'Ongoing'
  | 'Accomplished';

export interface Concern {
  id: string;
  groupCode: string;           // Connected to Group.Code
  urgency: ConcernUrgency;
  task: string;                // 100 characters max
  startDate: Date;             // Default is when concern is created
  remarks: string;             // Textarea
  status: ConcernStatus;
  detailedStatus: string;
  pic: string;                 // Person in Charge - Profiles.Nickname
  to: string;                  // Delegated/Download to - Profiles.Nickname (required for "For Delegating" or "For Download")
  endDate: Date | null;        // Auto-filled when status = 'Accomplished', cleared otherwise
  createdAt: Date;
  updatedAt: Date;
}

export const URGENCY_OPTIONS: ConcernUrgency[] = [
  'EMERGENCY',
  'Major Urgent',
  'Urgent',
  'Major',
  'Normal',
];

export const URGENCY_LABELS: Record<ConcernUrgency, string> = {
  'EMERGENCY': '⚠️ EMERGENCY ⚠️',
  'Major Urgent': 'Major Urgent',
  'Urgent': 'Urgent',
  'Major': 'Major',
  'Normal': 'Normal',
};

export const STATUS_OPTIONS: ConcernStatus[] = [
  'New',
  'For Delegating',
  'Preparing',
  'For Update',
  'For Report',
  'For Approval',
  'For Download',
  'Ongoing',
  'Accomplished',
];
