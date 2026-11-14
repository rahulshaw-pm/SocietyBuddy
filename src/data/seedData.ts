import { PrototypeState } from '../types/society';

export const PROTOTYPE_STORAGE_KEY = 'societybuddy_prototype_v1';

export function createInitialPrototypeState(): PrototypeState {
  return {
    version: 1,
    unitNumber: 'B-204',
    societyName: 'Verdant Terraces',
    activeMember: 'A',
    elapsedSeconds: 14,
    activeRequest: {
      id: 'req_fixture_1',
      kind: 'Courier',
      title: 'Courier Delivery',
      gateLabel: 'GATE 2',
      subtitle: 'Parcel for B-204',
      serviceLabel: 'Delivery Service:',
      serviceValue: 'Express Logistics',
      arrivedAt: '11:41 AM (Guard verified)',
      waitingAt: 'Main Gate Security Barrier',
      status: 'Pending',
      settledBy: null,
      settledAtSeconds: null,
      nudgeAcknowledged: false,
    },
    requestHistory: [
      {
        id: 'req_past_1',
        kind: 'Service',
        title: 'Water Purifier Service',
        gateLabel: 'GATE 1',
        subtitle: 'Technician for B-204',
        serviceLabel: 'Service Provider:',
        serviceValue: 'PureFlow Care',
        arrivedAt: 'Yesterday, 04:15 PM (Guard verified)',
        waitingAt: 'Gate 1 Visitor Desk',
        status: 'Approved',
        settledBy: 'B',
        settledAtSeconds: 22,
        nudgeAcknowledged: false,
      },
      {
        id: 'req_past_2',
        kind: 'Guest',
        title: 'Unscheduled Sales Agent',
        gateLabel: 'GATE 1',
        subtitle: 'Walk-in for B-204',
        serviceLabel: 'Visitor Type:',
        serviceValue: 'Door-to-Door Promotion',
        arrivedAt: '12 Nov, 01:08 PM (Guard verified)',
        waitingAt: 'Main Gate Security Barrier',
        status: 'Declined',
        settledBy: 'A',
        settledAtSeconds: 18,
        nudgeAcknowledged: false,
      },
    ],
    notices: [
      {
        id: 'not_1',
        title: 'Tower B Overhead Tank Cleaning & Pressure Check',
        category: 'Maintenance',
        date: '14 Nov 2026',
        author: 'Estate Management Office',
        body: 'Water supply to Tower B (Units B-101 to B-1204) will remain paused on Sunday, 16 Nov from 10:00 AM to 01:00 PM for quarterly tank disinfection.',
        pinned: true,
        acknowledgedBy: [],
      },
      {
        id: 'not_2',
        title: 'Gate 2 Parcel Barrier RFID & Guard Verification Update',
        category: 'Security',
        date: '13 Nov 2026',
        author: 'Chief Security Officer',
        body: 'All courier riders at Gate 2 now require live household approval inside Society Buddy. First member response immediately settles the entry instruction.',
        pinned: true,
        acknowledgedBy: ['A'],
      },
      {
        id: 'not_3',
        title: 'Q4 Annual General Body Meeting (AGM)',
        category: 'AGM',
        date: '11 Nov 2026',
        author: 'Managing Committee',
        body: 'AGM scheduled for Saturday, 22 Nov at 11:00 AM in Clubhouse Hall. Agenda includes EV charger expansion in Basement B1 and FY 2027 CAM budget.',
        pinned: false,
        acknowledgedBy: ['A', 'B'],
      },
      {
        id: 'not_4',
        title: 'Central Courtyard Winter Acoustic Evening',
        category: 'Event',
        date: '09 Nov 2026',
        author: 'Cultural Committee',
        body: 'Residents are invited to the Central Lawn on Saturday, 29 Nov from 06:30 PM onwards for acoustic music and community dinner.',
        pinned: false,
        acknowledgedBy: [],
      },
    ],
    dues: [
      {
        id: 'due_nov26',
        invoiceNo: 'INV-2026-11-B204',
        month: 'November 2026',
        dueDate: '20 Nov 2026',
        amount: 4850,
        status: 'Pending',
        paidBy: null,
        paidAt: null,
        paymentMethod: null,
        transactionId: null,
        lineItems: [
          { label: 'Common Area Maintenance (CAM)', amount: 2950 },
          { label: 'Water & STP Charges', amount: 650 },
          { label: 'Sinking Fund Reserve', amount: 750 },
          { label: 'Lift & DG Power Backup AMC', amount: 500 },
        ],
      },
      {
        id: 'due_oct26',
        invoiceNo: 'INV-2026-10-B204',
        month: 'October 2026',
        dueDate: '20 Oct 2026',
        amount: 4850,
        status: 'Paid',
        paidBy: 'B',
        paidAt: '14 Oct 2026 · 07:18 PM',
        paymentMethod: 'UPI',
        transactionId: 'UPI8492017482',
        lineItems: [
          { label: 'Common Area Maintenance (CAM)', amount: 2950 },
          { label: 'Water & STP Charges', amount: 650 },
          { label: 'Sinking Fund Reserve', amount: 750 },
          { label: 'Lift & DG Power Backup AMC', amount: 500 },
        ],
      },
      {
        id: 'due_sep26',
        invoiceNo: 'INV-2026-09-B204',
        month: 'September 2026',
        dueDate: '20 Sep 2026',
        amount: 4600,
        status: 'Paid',
        paidBy: 'A',
        paidAt: '12 Sep 2026 · 10:42 AM',
        paymentMethod: 'NetBanking',
        transactionId: 'NB3019482710',
        lineItems: [
          { label: 'Common Area Maintenance (CAM)', amount: 2950 },
          { label: 'Water & STP Charges', amount: 650 },
          { label: 'Sinking Fund Reserve', amount: 750 },
          { label: 'Lift & DG Power Backup AMC', amount: 250 },
        ],
      },
    ],
    members: {
      A: {
        id: 'A',
        name: 'Member A',
        role: 'Primary Resident',
        phone: '+91 98104 52319',
        statusLabel: 'Active on App',
      },
      B: {
        id: 'B',
        name: 'Member B',
        role: 'Partner Resident',
        phone: '+91 98104 88120',
        statusLabel: 'Connected (Partner)',
      },
    },
    vehicles: [
      { id: 'veh_1', plate: 'HR 26 EQ 4821', type: 'EV', slot: 'B1-024' },
      { id: 'veh_2', plate: 'HR 26 DK 1109', type: 'Two-Wheeler', slot: 'B1-118' },
    ],
    dailyStaff: [
      {
        id: 'st_1',
        name: 'Sunita Devi',
        role: 'Housekeeping',
        passCode: 'DH-104',
        status: 'Inside',
        lastSeen: 'Entered Gate 1 at 08:15 AM',
      },
      {
        id: 'st_2',
        name: 'Mohan Verma',
        role: 'Cook',
        passCode: 'DH-219',
        status: 'Outside',
        lastSeen: 'Exited Gate 1 at 10:05 AM',
      },
    ],
  };
}

export function loadPrototypeState(): PrototypeState {
  try {
    const raw = window.localStorage.getItem(PROTOTYPE_STORAGE_KEY);
    if (!raw) {
      const initial = createInitialPrototypeState();
      window.localStorage.setItem(PROTOTYPE_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as Partial<PrototypeState>;
    const fallback = createInitialPrototypeState();
    return {
      ...fallback,
      ...parsed,
      activeRequest: {
        ...fallback.activeRequest,
        ...(parsed.activeRequest ?? {}),
      },
      members: {
        A: { ...fallback.members.A, ...(parsed.members?.A ?? {}) },
        B: { ...fallback.members.B, ...(parsed.members?.B ?? {}) },
      },
    };
  } catch {
    return createInitialPrototypeState();
  }
}

export function savePrototypeState(state: PrototypeState): void {
  try {
    window.localStorage.setItem(PROTOTYPE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function resetPrototypeState(): PrototypeState {
  const initial = createInitialPrototypeState();
  savePrototypeState(initial);
  return initial;
}
