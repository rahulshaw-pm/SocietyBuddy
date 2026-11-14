export type PrototypeTab = 'gate' | 'notices' | 'dues' | 'household';

export type HouseholdMemberId = 'A' | 'B';

export type GateRequestStatus = 'Pending' | 'Approved' | 'Declined';

export type GateRequestKind = 'Courier' | 'Guest' | 'Service' | 'Cab';

export interface GateRequest {
  id: string;
  kind: GateRequestKind;
  title: string;
  gateLabel: string;
  subtitle: string;
  serviceLabel: string;
  serviceValue: string;
  arrivedAt: string;
  waitingAt: string;
  status: GateRequestStatus;
  settledBy: HouseholdMemberId | null;
  settledAtSeconds: number | null;
  nudgeAcknowledged: boolean;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: 'Maintenance' | 'Security' | 'Event' | 'AGM';
  date: string;
  author: string;
  body: string;
  pinned: boolean;
  acknowledgedBy: HouseholdMemberId[];
}

export interface DueLineItem {
  label: string;
  amount: number;
}

export interface MaintenanceDue {
  id: string;
  invoiceNo: string;
  month: string;
  dueDate: string;
  amount: number;
  status: 'Pending' | 'Paid';
  paidBy: HouseholdMemberId | null;
  paidAt: string | null;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | null;
  transactionId: string | null;
  lineItems: DueLineItem[];
}

export interface HouseholdMemberProfile {
  id: HouseholdMemberId;
  name: string;
  role: string;
  phone: string;
  statusLabel: string;
}

export interface VehicleEntry {
  id: string;
  plate: string;
  type: 'Car' | 'EV' | 'Two-Wheeler';
  slot: string;
}

export interface DailyStaffEntry {
  id: string;
  name: string;
  role: string;
  passCode: string;
  status: 'Inside' | 'Outside';
  lastSeen: string;
}

export interface PrototypeState {
  version: number;
  unitNumber: string;
  societyName: string;
  activeMember: HouseholdMemberId;
  elapsedSeconds: number;
  activeRequest: GateRequest;
  requestHistory: GateRequest[];
  notices: NoticeItem[];
  dues: MaintenanceDue[];
  members: Record<HouseholdMemberId, HouseholdMemberProfile>;
  vehicles: VehicleEntry[];
  dailyStaff: DailyStaffEntry[];
}

export interface ToastMessage {
  id: string;
  title: string;
  detail?: string;
  tone?: 'neutral' | 'success' | 'warning' | 'error';
}
