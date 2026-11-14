import { Clock, RotateCcw, Smartphone, User, Users } from 'lucide-react';
import { HouseholdMemberId } from '../types/society';

interface SimulationControlBarProps {
  activeMember: HouseholdMemberId;
  elapsedSeconds: number;
  onSwitchMember: (member: HouseholdMemberId) => void;
  onJumpTime: (seconds: number) => void;
  onResetFlow: () => void;
}

export function SimulationControlBar({
  activeMember,
  elapsedSeconds,
  onSwitchMember,
  onJumpTime,
  onResetFlow,
}: SimulationControlBarProps) {
  return (
    <section
      aria-label="Shared Household Simulation Controls"
      className="w-full max-w-[460px] rounded-2xl bg-[#131C2E] border border-slate-700/70 p-4 text-slate-100 shadow-xl"
    >
      {/* Top Row: Concept Tag + Title + Version + Reset Flow */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-md border border-emerald-500/60 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">
            CONCEPT A
          </span>
          <span className="font-display text-sm font-semibold text-white truncate">
            Society Buddy
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[10px]">
            v0.1
          </span>
        </div>

        <button
          type="button"
          onClick={onResetFlow}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Flow</span>
        </button>
      </div>

      {/* Simulated Viewport Label */}
      <div className="flex items-center justify-between gap-2 mt-3 text-[11px]">
        <span className="inline-flex items-center gap-1.5 text-slate-300">
          <Smartphone className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>Simulated Viewport:</span>
        </span>
        <span className="text-amber-400 font-medium">
          Single-device shared simulation
        </span>
      </div>

      {/* Member A / Member B Device Switcher */}
      <div className="mt-2 p-1 rounded-xl bg-[#0B1220] border border-slate-700/70 grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => onSwitchMember('A')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap ${
            activeMember === 'A'
              ? 'bg-[#0E836D] text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-800/60'
          }`}
        >
          <User className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Member A (You)</span>
          {activeMember !== 'A' && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
              aria-hidden="true"
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSwitchMember('B')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap ${
            activeMember === 'B'
              ? 'bg-[#0E836D] text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Member B (Partner)</span>
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              activeMember === 'B' ? 'bg-emerald-200' : 'bg-emerald-400'
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Elapsed Timer & Time-Jump Controls */}
      <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
          <span className="text-slate-300">Elapsed:</span>
          <span className="font-mono font-bold tabular-nums text-amber-400">
            {elapsedSeconds}s
          </span>
          <span className="text-slate-500 text-[11px]">(Nudge at 60s)</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onJumpTime(0)}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 font-mono text-[11px] tabular-nums text-slate-200 transition-colors"
          >
            0s
          </button>
          <button
            type="button"
            onClick={() => onJumpTime(45)}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 font-mono text-[11px] tabular-nums text-slate-200 transition-colors"
          >
            45s
          </button>
          <button
            type="button"
            onClick={() => onJumpTime(62)}
            className="px-2.5 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/50 font-mono text-[11px] font-semibold tabular-nums text-amber-300 transition-colors"
          >
            +62s (Nudge)
          </button>
        </div>
      </div>
    </section>
  );
}
