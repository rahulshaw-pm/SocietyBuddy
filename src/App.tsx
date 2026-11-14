import { useEffect, useState } from 'react';
import {
  BatteryFull,
  DoorOpen,
  Home,
  Info,
  Megaphone,
  Receipt,
  Shield,
  Wifi,
} from 'lucide-react';
import {
  GateRequestKind,
  HouseholdMemberId,
  HouseholdMemberProfile,
  NoticeItem,
  PrototypeState,
  PrototypeTab,
  ToastMessage,
  VehicleEntry,
} from './types/society';
import {
  loadPrototypeState,
  resetPrototypeState,
  savePrototypeState,
} from './data/seedData';
import { formatTimeNow, generateId } from './utils/formatters';
import { SimulationControlBar } from './components/SimulationControlBar';
import { GateAccessTab } from './components/GateAccessTab';
import { NoticesTab } from './components/NoticesTab';
import { DuesTab } from './components/DuesTab';
import { HouseholdTab } from './components/HouseholdTab';
import { ToastContainer } from './components/ToastContainer';

const TAB_HEADER_META: Record<
  PrototypeTab,
  { title: string; subtitle: string }
> = {
  gate: {
    title: 'Gate Entry Requests',
    subtitle: 'Live Household Channel',
  },
  notices: {
    title: 'Society Notices',
    subtitle: 'Official Resident Circulars',
  },
  dues: {
    title: 'Maintenance Dues',
    subtitle: 'Shared Household Billing',
  },
  household: {
    title: 'Household Profile',
    subtitle: 'Unit Registry & Staff',
  },
};

export default function App() {
  const [state, setState] = useState<PrototypeState>(() =>
    loadPrototypeState()
  );
  const [activeTab, setActiveTab] = useState<PrototypeTab>('gate');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist every change to localStorage immediately
  useEffect(() => {
    savePrototypeState(state);
  }, [state]);

  // Live ticking elapsed seconds while active request is Pending
  useEffect(() => {
    if (state.activeRequest.status !== 'Pending') return;
    const interval = window.setInterval(() => {
      setState((prev) => {
        if (prev.activeRequest.status !== 'Pending') return prev;
        return {
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        };
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [state.activeRequest.status]);

  const notify = (
    title: string,
    detail?: string,
    tone: ToastMessage['tone'] = 'success'
  ) => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, title, detail, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSwitchMember = (member: HouseholdMemberId) => {
    setState((prev) => ({ ...prev, activeMember: member }));
  };

  const handleJumpTime = (seconds: number) => {
    setState((prev) => ({
      ...prev,
      elapsedSeconds: seconds,
      activeRequest: {
        ...prev.activeRequest,
        nudgeAcknowledged: seconds < 60 ? false : prev.activeRequest.nudgeAcknowledged,
      },
    }));
    if (seconds >= 60 && state.activeRequest.status === 'Pending') {
      notify(
        '60s Nudge triggered',
        'Household alerted that gate request is still waiting.',
        'warning'
      );
    }
  };

  const handleResetFlow = () => {
    const fresh = resetPrototypeState();
    setState((prev) => ({
      ...fresh,
      notices: prev.notices,
      dues: prev.dues,
      vehicles: prev.vehicles,
      dailyStaff: prev.dailyStaff,
      members: prev.members,
    }));
    notify('Flow reset', 'Active request restored to Pending (14s).', 'neutral');
  };

  const handleResetAllData = () => {
    const fresh = resetPrototypeState();
    setState(fresh);
    notify('All browser data reset', 'Restored initial prototype fixture.', 'neutral');
  };

  const handleDecideRequest = (decision: 'Approved' | 'Declined') => {
    if (state.activeRequest.status !== 'Pending') return;
    setState((prev) => ({
      ...prev,
      activeRequest: {
        ...prev.activeRequest,
        status: decision,
        settledBy: prev.activeMember,
        settledAtSeconds: prev.elapsedSeconds,
      },
    }));
    notify(
      `Entry ${decision} by Member ${state.activeMember}`,
      'Synced across both household devices & controls locked.',
      decision === 'Approved' ? 'success' : 'warning'
    );
  };

  const handleAcknowledgeNudge = () => {
    setState((prev) => ({
      ...prev,
      activeRequest: {
        ...prev.activeRequest,
        nudgeAcknowledged: true,
      },
    }));
  };

  const handleCreateNewRequest = (input: {
    kind: GateRequestKind;
    title: string;
    gateLabel: string;
    serviceValue: string;
    waitingAt: string;
  }) => {
    setState((prev) => {
      const archived =
        prev.activeRequest.status !== 'Pending'
          ? [prev.activeRequest, ...prev.requestHistory]
          : prev.requestHistory;

      return {
        ...prev,
        elapsedSeconds: 0,
        requestHistory: archived,
        activeRequest: {
          id: generateId('req'),
          kind: input.kind,
          title: input.title,
          gateLabel: input.gateLabel,
          subtitle: `${input.kind === 'Courier' ? 'Parcel' : input.kind} for ${prev.unitNumber}`,
          serviceLabel:
            input.kind === 'Courier'
              ? 'Delivery Service:'
              : input.kind === 'Service'
                ? 'Service Provider:'
                : 'Visitor Details:',
          serviceValue: input.serviceValue,
          arrivedAt: `${formatTimeNow()} (Guard verified)`,
          waitingAt: input.waitingAt,
          status: 'Pending',
          settledBy: null,
          settledAtSeconds: null,
          nudgeAcknowledged: false,
        },
      };
    });
    notify('New gate request arrived', `${input.title} at ${input.gateLabel}`);
  };

  const handleAcknowledgeNotice = (noticeId: string) => {
    setState((prev) => ({
      ...prev,
      notices: prev.notices.map((n) =>
        n.id === noticeId && !n.acknowledgedBy.includes(prev.activeMember)
          ? { ...n, acknowledgedBy: [...n.acknowledgedBy, prev.activeMember] }
          : n
      ),
    }));
    notify(`Notice marked read by Member ${state.activeMember}`);
  };

  const handleAddNotice = (input: {
    title: string;
    category: NoticeItem['category'];
    body: string;
    pinned: boolean;
  }) => {
    setState((prev) => ({
      ...prev,
      notices: [
        {
          id: generateId('not'),
          title: input.title,
          category: input.category,
          date: '14 Nov 2026',
          author: `Member ${prev.activeMember} (Resident Post)`,
          body: input.body,
          pinned: input.pinned,
          acknowledgedBy: [prev.activeMember],
        },
        ...prev.notices,
      ],
    }));
    notify('Notice published');
  };

  const handlePayDue = (
    dueId: string,
    method: 'UPI' | 'Card' | 'NetBanking'
  ) => {
    const txn = `${method.toUpperCase().slice(0, 3)}${Math.floor(100000000 + Math.random() * 900000000)}`;
    setState((prev) => ({
      ...prev,
      dues: prev.dues.map((d) =>
        d.id === dueId
          ? {
              ...d,
              status: 'Paid',
              paidBy: prev.activeMember,
              paidAt: `14 Nov 2026 · ${formatTimeNow()}`,
              paymentMethod: method,
              transactionId: txn,
            }
          : d
      ),
    }));
    notify(
      `Maintenance paid by Member ${state.activeMember}`,
      `Receipt ${txn} synced across household.`
    );
  };

  const handleUpdateMember = (profile: HouseholdMemberProfile) => {
    setState((prev) => ({
      ...prev,
      members: {
        ...prev.members,
        [profile.id]: profile,
      },
    }));
    notify(`Updated ${profile.name}`);
  };

  const handleAddVehicle = (
    plate: string,
    type: VehicleEntry['type'],
    slot: string
  ) => {
    setState((prev) => ({
      ...prev,
      vehicles: [
        ...prev.vehicles,
        { id: generateId('veh'), plate, type, slot },
      ],
    }));
    notify('Vehicle added', plate);
  };

  const handleRemoveVehicle = (id: string) => {
    setState((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((v) => v.id !== id),
    }));
    notify('Vehicle removed', undefined, 'neutral');
  };

  const handleToggleStaffStatus = (id: string) => {
    const now = formatTimeNow();
    setState((prev) => ({
      ...prev,
      dailyStaff: prev.dailyStaff.map((s) => {
        if (s.id !== id) return s;
        const nextStatus = s.status === 'Inside' ? 'Outside' : 'Inside';
        return {
          ...s,
          status: nextStatus,
          lastSeen: `${nextStatus === 'Inside' ? 'Entered' : 'Exited'} Gate 1 at ${now}`,
        };
      }),
    }));
    notify('Staff entry log updated');
  };

  const otherMember: HouseholdMemberId = state.activeMember === 'A' ? 'B' : 'A';
  const headerMeta = TAB_HEADER_META[activeTab];
  const unreadNoticesCount = state.notices.filter(
    (n) => !n.acknowledgedBy.includes(state.activeMember)
  ).length;
  const pendingDuesCount = state.dues.filter(
    (d) => d.status === 'Pending'
  ).length;

  return (
    <div className="min-h-screen bg-[#0B1220] py-4 sm:py-6 px-3 sm:px-4 flex flex-col items-center gap-4">
      {/* Top Prototype Simulation Control Bar */}
      <SimulationControlBar
        activeMember={state.activeMember}
        elapsedSeconds={state.elapsedSeconds}
        onSwitchMember={handleSwitchMember}
        onJumpTime={handleJumpTime}
        onResetFlow={handleResetFlow}
      />

      {/* Mobile Prototype Viewport Frame */}
      <div className="w-full max-w-[460px] rounded-[36px] border-[6px] border-[#1E293B] bg-[#F4F7F9] shadow-2xl overflow-hidden flex flex-col">
        {/* Phone Status Bar + Emerald Header */}
        <header className="bg-[#0E836D] text-white px-4 pt-3 pb-4">
          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs font-semibold mb-3">
            <span className="font-mono tabular-nums">11:42</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-black/20 text-[11px] font-medium">
                Unit {state.unitNumber}
              </span>
              <Wifi className="w-3.5 h-3.5" aria-hidden="true" />
              <BatteryFull className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          {/* App Title Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-base font-bold leading-tight truncate">
                  {headerMeta.title}
                </h1>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1.5 mt-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-300"
                    aria-hidden="true"
                  />
                  <span>{headerMeta.subtitle}</span>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#0E836D] text-xs font-bold shadow-2xs">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#0E836D]"
                  aria-hidden="true"
                />
                <span>Member {state.activeMember}</span>
              </span>
              <p className="text-[10px] text-emerald-100 mt-1">
                Household Resident
              </p>
            </div>
          </div>
        </header>

        {/* Viewing-as Sub-bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 min-w-0">
            <Info
              className="w-3.5 h-3.5 text-[#0E836D] shrink-0"
              aria-hidden="true"
            />
            <span className="truncate">
              Viewing as{' '}
              <strong className="font-semibold text-slate-900">
                Household Member {state.activeMember}
              </strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleSwitchMember(otherMember)}
            className="text-xs font-semibold text-[#0E836D] underline underline-offset-2 whitespace-nowrap shrink-0"
          >
            Switch to Member {otherMember}
          </button>
        </div>

        {/* Scrollable Screen Body */}
        <main className="p-4 flex-1">
          {activeTab === 'gate' && (
            <GateAccessTab
              unitNumber={state.unitNumber}
              activeMember={state.activeMember}
              elapsedSeconds={state.elapsedSeconds}
              activeRequest={state.activeRequest}
              requestHistory={state.requestHistory}
              onSwitchMember={handleSwitchMember}
              onDecideRequest={handleDecideRequest}
              onAcknowledgeNudge={handleAcknowledgeNudge}
              onCreateNewRequest={handleCreateNewRequest}
            />
          )}

          {activeTab === 'notices' && (
            <NoticesTab
              notices={state.notices}
              activeMember={state.activeMember}
              onAcknowledgeNotice={handleAcknowledgeNotice}
              onAddNotice={handleAddNotice}
            />
          )}

          {activeTab === 'dues' && (
            <DuesTab
              unitNumber={state.unitNumber}
              dues={state.dues}
              activeMember={state.activeMember}
              onPayDue={handlePayDue}
            />
          )}

          {activeTab === 'household' && (
            <HouseholdTab
              unitNumber={state.unitNumber}
              societyName={state.societyName}
              activeMember={state.activeMember}
              members={state.members}
              vehicles={state.vehicles}
              dailyStaff={state.dailyStaff}
              onSwitchMember={handleSwitchMember}
              onUpdateMember={handleUpdateMember}
              onAddVehicle={handleAddVehicle}
              onRemoveVehicle={handleRemoveVehicle}
              onToggleStaffStatus={handleToggleStaffStatus}
              onResetAllData={handleResetAllData}
            />
          )}
        </main>

        {/* Bottom 4-Tab Bar (Exact Match to Prototype) */}
        <nav
          aria-label="Society Buddy Navigation"
          className="bg-white border-t border-slate-200 grid grid-cols-4 h-16 shrink-0"
        >
          {(
            [
              {
                id: 'gate',
                label: 'Gate Access',
                icon: DoorOpen,
                badge: state.activeRequest.status === 'Pending' ? 1 : 0,
              },
              {
                id: 'notices',
                label: 'Notices',
                icon: Megaphone,
                badge: unreadNoticesCount,
              },
              {
                id: 'dues',
                label: 'Dues',
                icon: Receipt,
                badge: pendingDuesCount,
              },
              {
                id: 'household',
                label: 'Household',
                icon: Home,
                badge: 0,
              },
            ] as {
              id: PrototypeTab;
              label: string;
              icon: typeof DoorOpen;
              badge: number;
            }[]
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? 'text-[#0E836D] font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {tab.badge > 0 && !isActive && (
                    <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center font-mono tabular-nums">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] leading-none">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
