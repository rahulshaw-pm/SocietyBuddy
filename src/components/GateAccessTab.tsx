import { useState, FormEvent } from 'react';
import {
  BellRing,
  Car,
  Check,
  CheckCircle2,
  FlaskConical,
  Lock,
  Package,
  Plus,
  UserCheck,
  Users,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';
import {
  GateRequest,
  GateRequestKind,
  HouseholdMemberId,
} from '../types/society';

interface GateAccessTabProps {
  unitNumber: string;
  activeMember: HouseholdMemberId;
  elapsedSeconds: number;
  activeRequest: GateRequest;
  requestHistory: GateRequest[];
  onSwitchMember: (member: HouseholdMemberId) => void;
  onDecideRequest: (decision: 'Approved' | 'Declined') => void;
  onAcknowledgeNudge: () => void;
  onCreateNewRequest: (input: {
    kind: GateRequestKind;
    title: string;
    gateLabel: string;
    serviceValue: string;
    waitingAt: string;
  }) => void;
}

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function GateAccessTab({
  unitNumber,
  activeMember,
  elapsedSeconds,
  activeRequest,
  requestHistory,
  onSwitchMember,
  onDecideRequest,
  onAcknowledgeNudge,
  onCreateNewRequest,
}: GateAccessTabProps) {
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newKind, setNewKind] = useState<GateRequestKind>('Courier');
  const [newTitle, setNewTitle] = useState('');
  const [newGate, setNewGate] = useState('GATE 2');
  const [newService, setNewService] = useState('');

  const isPending = activeRequest.status === 'Pending';
  const isApproved = activeRequest.status === 'Approved';
  const isDeclined = activeRequest.status === 'Declined';
  const isNudgeActive = isPending && elapsedSeconds >= 60;
  const settledBySelf = activeRequest.settledBy === activeMember;
  const otherMember: HouseholdMemberId = activeMember === 'A' ? 'B' : 'A';

  const RequestIcon =
    activeRequest.kind === 'Courier'
      ? Package
      : activeRequest.kind === 'Cab'
        ? Car
        : activeRequest.kind === 'Service'
          ? Wrench
          : UserCheck;

  const handleSimulateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newService.trim()) return;
    onCreateNewRequest({
      kind: newKind,
      title: newTitle.trim(),
      gateLabel: newGate,
      serviceValue: newService.trim(),
      waitingAt:
        newGate === 'GATE 2'
          ? 'Main Gate Security Barrier'
          : 'Gate 1 Visitor Desk',
    });
    setNewTitle('');
    setNewService('');
    setShowSimulateModal(false);
  };

  return (
    <div className="space-y-4">
      {/* HOUSEHOLD VIEWERS CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-500">
            <Users className="w-3.5 h-3.5 text-[#0E836D]" aria-hidden="true" />
            <span>HOUSEHOLD VIEWERS</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600 tabular-nums">
            2 registered
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-stretch gap-2.5">
          {(['A', 'B'] as HouseholdMemberId[]).map((id) => {
            const isSelf = activeMember === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSwitchMember(id)}
                className={`w-full h-full text-left px-3 py-2.5 rounded-xl border transition-colors flex flex-col justify-between gap-1.5 min-w-0 ${
                  isSelf
                    ? 'border-[#0E836D] bg-emerald-50/40'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="w-full flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        isSelf
                          ? 'bg-[#0E836D] text-white'
                          : 'bg-slate-400 text-white'
                      }`}
                    >
                      {id}
                    </span>
                    <span className="text-xs font-bold text-slate-900 leading-none truncate">
                      Member {id}
                    </span>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isSelf ? 'bg-[#0E836D]' : 'bg-slate-300'
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <p
                  className={`w-full text-[11px] leading-4 truncate ${
                    isSelf
                      ? 'text-[#0E836D] font-medium'
                      : 'text-slate-500 font-normal'
                  }`}
                >
                  {isSelf ? 'Viewing app (You)' : 'Connected (Partner)'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 60s NUDGE ALERT BANNER (Appears at >= 60s when Pending) */}
      {isNudgeActive && (
        <div
          role="alert"
          className="rounded-2xl bg-amber-50 border border-amber-300 p-3.5 flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-2.5">
            <BellRing
              className="w-4 h-4 text-amber-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-bold text-amber-900">
                60s Nudge: Decision Still Needed
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                {activeRequest.title} has been waiting at {activeRequest.gateLabel} for{' '}
                <span className="font-mono font-semibold tabular-nums">
                  {formatTimer(elapsedSeconds)}
                </span>
                . Neither Member A nor Member B has responded yet.
              </p>
            </div>
          </div>
          {!activeRequest.nudgeAcknowledged && (
            <button
              type="button"
              onClick={onAcknowledgeNudge}
              className="px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300/80 text-[11px] font-semibold text-amber-950 whitespace-nowrap shrink-0"
            >
              Got it
            </button>
          )}
        </div>
      )}

      {/* ACTIVE REQUEST SECTION HEADER */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isPending
                ? 'bg-amber-500'
                : isApproved
                  ? 'bg-emerald-600'
                  : 'bg-red-600'
            }`}
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-600">
            ACTIVE REQUEST (FIXTURE)
          </span>
        </div>

        {isPending ? (
          <span
            className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold font-mono tabular-nums ${
              isNudgeActive
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            Pending • {formatTimer(elapsedSeconds)}
          </span>
        ) : isApproved ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
            <span>Approved</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-300 text-[11px] font-semibold text-red-700">
            <XCircle className="w-3 h-3" aria-hidden="true" />
            <span>Declined</span>
          </span>
        )}
      </div>

      {/* ACTIVE REQUEST CARD */}
      <div
        className={`bg-white rounded-2xl border p-4 shadow-2xs transition-colors ${
          isApproved
            ? 'border-emerald-400'
            : isDeclined
              ? 'border-red-300'
              : isNudgeActive
                ? 'border-amber-400'
                : 'border-slate-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0">
            <RequestIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-base font-bold text-slate-900">
                {activeRequest.title}
              </h2>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] font-semibold text-slate-600">
                {activeRequest.gateLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeRequest.subtitle}
            </p>
          </div>
        </div>

        {/* Metadata Key-Value Inset Box */}
        <div className="mt-3.5 rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-500">{activeRequest.serviceLabel}</span>
            <span className="font-medium text-slate-900 text-right">
              {activeRequest.serviceValue}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-500">Arrived at Gate:</span>
            <span className="font-mono text-[11px] text-slate-800 text-right tabular-nums">
              {activeRequest.arrivedAt}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-500">Waiting at:</span>
            <span className="font-medium text-slate-900 text-right">
              {activeRequest.waitingAt}
            </span>
          </div>
        </div>

        {/* PENDING CONTROLS OR SETTLED LOCKOUT */}
        {isPending ? (
          <>
            <div className="mt-3.5 flex items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-500">
                Authority rule:{' '}
                <strong className="font-semibold text-slate-800">
                  First response decides
                </strong>
              </span>
              <span className="text-[#0E836D] font-semibold">
                Open for household decision
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onDecideRequest('Declined')}
                className="py-3 px-4 rounded-xl bg-red-50/70 hover:bg-red-100/80 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                <span>Decline</span>
              </button>

              <button
                type="button"
                onClick={() => onDecideRequest('Approved')}
                className="py-3 px-4 rounded-xl bg-[#0E836D] hover:bg-[#0B6D5B] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Approve Entry</span>
              </button>
            </div>
          </>
        ) : (
          <div className="mt-3.5 space-y-3">
            {/* Decision Result Banner */}
            <div
              className={`rounded-xl border p-3.5 ${
                isApproved
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isApproved ? (
                  <CheckCircle2
                    className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                ) : (
                  <XCircle
                    className="w-5 h-5 text-red-700 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-xs font-bold ${
                        isApproved ? 'text-emerald-900' : 'text-red-900'
                      }`}
                    >
                      Entry {activeRequest.status} by{' '}
                      {settledBySelf
                        ? 'You'
                        : `Member ${activeRequest.settledBy}`}
                    </p>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        isApproved ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      at {formatTimer(activeRequest.settledAtSeconds ?? 0)}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] mt-1 leading-relaxed ${
                      isApproved ? 'text-emerald-800' : 'text-red-800'
                    }`}
                  >
                    {settledBySelf
                      ? `Your decision was transmitted to the security gate immediately. Your household member (Member ${otherMember}) now sees this result as settled.`
                      : `Member ${activeRequest.settledBy} already finalized this entry request. Your view is synchronized to prevent conflicting gate instructions.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-500">
                Authority rule:{' '}
                <strong className="font-semibold text-slate-800">
                  First response decides
                </strong>
              </span>
              <span className="text-slate-600 font-medium">
                Settled by Member {activeRequest.settledBy} ({activeRequest.status})
              </span>
            </div>

            {/* Controls Locked Box */}
            <div className="rounded-xl bg-slate-100 border border-slate-200 p-3.5 text-center">
              <p className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Controls Locked</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                This request has already been finalized. To avoid conflicting gate instructions, no further changes can be submitted.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* PROTOTYPE SPECIFICATIONS CARD (Matches Screenshots) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <FlaskConical className="w-4 h-4 text-[#0E836D]" aria-hidden="true" />
            <span>Prototype Specifications</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-mono text-[10px] font-semibold text-[#0E836D]">
            v0.1
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
              Functional
            </p>
            <p className="text-[10px] text-slate-600 mt-1 leading-snug">
              60s nudge timer, live read-only lockout, instant sync across views.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" aria-hidden="true" />
              Simulated
            </p>
            <p className="text-[10px] text-slate-600 mt-1 leading-snug">
              Member A / Member B toggle (mimics 2 real devices in 1 tab).
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <span aria-hidden="true">×</span> Out of Scope
            </p>
            <p className="text-[10px] text-slate-600 mt-1 leading-snug">
              Guard screen, push notifications, override of past decision.
            </p>
          </div>
        </div>

        <p className="text-[10px] italic text-slate-500 mt-3 leading-relaxed">
          *Riskiest assumption under test: whether live status visibility + 60s nudge overcomes diffusion-of-responsibility without changing existing first-responder authority.
        </p>
      </div>

      {/* Subtle Bottom Utility Row for Additional Gate Testing & History */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2"
        >
          {showHistory
            ? 'Hide Gate History'
            : `View Gate History (${requestHistory.length})`}
        </button>

        <button
          type="button"
          onClick={() => setShowSimulateModal(true)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E836D] hover:underline"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Simulate New Arrival</span>
        </button>
      </div>

      {/* Collapsible Gate History */}
      {showHistory && (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {requestHistory.map((item) => (
            <div
              key={item.id}
              className="p-3.5 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {item.title} · {item.gateLabel}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {item.serviceValue} · {item.arrivedAt}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`text-[11px] font-semibold ${
                    item.status === 'Approved'
                      ? 'text-emerald-700'
                      : 'text-red-700'
                  }`}
                >
                  {item.status}
                </span>
                <p className="text-[10px] text-slate-500">
                  by Member {item.settledBy}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simulate New Gate Arrival Modal */}
      {showSimulateModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-sm font-bold text-slate-900">
                Simulate Gate Arrival ({unitNumber})
              </h3>
              <button
                type="button"
                onClick={() => setShowSimulateModal(false)}
                aria-label="Close dialog"
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Request Type
                  </label>
                  <select
                    value={newKind}
                    onChange={(e) =>
                      setNewKind(e.target.value as GateRequestKind)
                    }
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Courier">Courier</option>
                    <option value="Guest">Guest</option>
                    <option value="Service">Service</option>
                    <option value="Cab">Cab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Gate
                  </label>
                  <select
                    value={newGate}
                    onChange={(e) => setNewGate(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="GATE 1">GATE 1</option>
                    <option value="GATE 2">GATE 2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Amazon Fresh Delivery"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Provider / Visitor Name
                </label>
                <input
                  type="text"
                  required
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="e.g. BlueDart Express"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0E836D] hover:bg-[#0B6D5B] text-white text-xs font-semibold"
                >
                  Trigger Gate Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
