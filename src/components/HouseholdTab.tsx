import { useState, FormEvent } from 'react';
import {
  Car,
  LogIn,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  DailyStaffEntry,
  HouseholdMemberId,
  HouseholdMemberProfile,
  VehicleEntry,
} from '../types/society';

interface HouseholdTabProps {
  unitNumber: string;
  societyName: string;
  activeMember: HouseholdMemberId;
  members: Record<HouseholdMemberId, HouseholdMemberProfile>;
  vehicles: VehicleEntry[];
  dailyStaff: DailyStaffEntry[];
  onSwitchMember: (member: HouseholdMemberId) => void;
  onUpdateMember: (profile: HouseholdMemberProfile) => void;
  onAddVehicle: (plate: string, type: VehicleEntry['type'], slot: string) => void;
  onRemoveVehicle: (id: string) => void;
  onToggleStaffStatus: (id: string) => void;
  onResetAllData: () => void;
}

export function HouseholdTab({
  unitNumber,
  societyName,
  activeMember,
  members,
  vehicles,
  dailyStaff,
  onSwitchMember,
  onUpdateMember,
  onAddVehicle,
  onRemoveVehicle,
  onToggleStaffStatus,
  onResetAllData,
}: HouseholdTabProps) {
  const currentProfile = members[activeMember];
  const [editName, setEditName] = useState(currentProfile.name);
  const [editPhone, setEditPhone] = useState(currentProfile.phone);

  const [vehPlate, setVehPlate] = useState('');
  const [vehType, setVehType] = useState<VehicleEntry['type']>('Car');
  const [vehSlot, setVehSlot] = useState('');

  // Keep local edit inputs synced when switching Member A <-> Member B
  const [lastSyncedMember, setLastSyncedMember] = useState(activeMember);
  if (lastSyncedMember !== activeMember) {
    setLastSyncedMember(activeMember);
    setEditName(members[activeMember].name);
    setEditPhone(members[activeMember].phone);
  }

  const handleSaveMember = (e: FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onUpdateMember({
      ...currentProfile,
      name: editName.trim(),
      phone: editPhone.trim(),
    });
  };

  const handleVehicleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!vehPlate.trim()) return;
    onAddVehicle(
      vehPlate.trim().toUpperCase(),
      vehType,
      vehSlot.trim().toUpperCase() || 'B1-Guest'
    );
    setVehPlate('');
    setVehSlot('');
  };

  return (
    <div className="space-y-4">
      {/* Registered Household Members */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-500">
            <Users className="w-3.5 h-3.5 text-[#0E836D]" aria-hidden="true" />
            <span>UNIT {unitNumber} · {societyName}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
            2 members
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-stretch gap-2.5">
          {(['A', 'B'] as HouseholdMemberId[]).map((id) => {
            const m = members[id];
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
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${
                        isSelf ? 'bg-[#0E836D]' : 'bg-slate-400'
                      }`}
                    >
                      {id}
                    </span>
                    <span className="text-xs font-bold text-slate-900 leading-none truncate">
                      {m.name}
                    </span>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isSelf ? 'bg-[#0E836D]' : 'bg-slate-300'
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <p className="w-full text-[11px] text-slate-500 leading-4 truncate">
                  {m.role}
                </p>
              </button>
            );
          })}
        </div>

        <form
          onSubmit={handleSaveMember}
          className="pt-3 border-t border-slate-100 space-y-2.5"
        >
          <p className="text-[11px] font-semibold text-slate-600">
            Edit Member {activeMember} Contact
          </p>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Display Name"
              className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="Mobile"
              className="px-2.5 py-2 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-[#0E836D] hover:bg-[#0B6D5B] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Save Member {activeMember} Details</span>
          </button>
        </form>
      </div>

      {/* Vehicles & Parking Slots */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-500">
          <Car className="w-3.5 h-3.5 text-[#0E836D]" aria-hidden="true" />
          <span>REGISTERED VEHICLES</span>
        </div>

        <div className="divide-y divide-slate-100">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="py-2 flex items-center justify-between gap-2"
            >
              <div>
                <p className="font-mono text-xs font-bold text-slate-900">
                  {v.plate}
                </p>
                <p className="text-[11px] text-slate-500">
                  {v.type} · Slot <span className="font-mono">{v.slot}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveVehicle(v.id)}
                aria-label={`Remove vehicle ${v.plate}`}
                className="p-1.5 text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleVehicleSubmit} className="grid grid-cols-7 gap-1.5">
          <input
            type="text"
            value={vehPlate}
            onChange={(e) => setVehPlate(e.target.value.toUpperCase())}
            placeholder="HR 26 AB 1234"
            className="col-span-3 px-2 py-1.5 font-mono text-[11px] bg-slate-50 border border-slate-200 rounded-lg"
          />
          <select
            value={vehType}
            onChange={(e) => setVehType(e.target.value as VehicleEntry['type'])}
            className="col-span-2 px-1.5 py-1.5 text-[11px] bg-slate-50 border border-slate-200 rounded-lg"
          >
            <option value="Car">Car</option>
            <option value="EV">EV</option>
            <option value="Two-Wheeler">2W</option>
          </select>
          <input
            type="text"
            value={vehSlot}
            onChange={(e) => setVehSlot(e.target.value.toUpperCase())}
            placeholder="Slot"
            className="col-span-1 px-1.5 py-1.5 font-mono text-[11px] bg-slate-50 border border-slate-200 rounded-lg"
          />
          <button
            type="submit"
            aria-label="Add vehicle"
            className="col-span-1 rounded-lg bg-[#0E836D] hover:bg-[#0B6D5B] text-white flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Daily Help Staff */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-500">
          <UserCheck className="w-3.5 h-3.5 text-[#0E836D]" aria-hidden="true" />
          <span>DAILY HELP ATTENDANCE</span>
        </div>

        <div className="divide-y divide-slate-100">
          {dailyStaff.map((staff) => (
            <div
              key={staff.id}
              className="py-2.5 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900">
                  {staff.name} ·{' '}
                  <span className="font-normal text-slate-500">{staff.role}</span>
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {staff.passCode} · {staff.lastSeen}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onToggleStaffStatus(staff.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border shrink-0 ${
                  staff.status === 'Inside'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {staff.status === 'Inside' ? (
                  <>
                    <LogOut className="w-3 h-3" aria-hidden="true" />
                    <span>Inside</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3 h-3" aria-hidden="true" />
                    <span>Outside</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Browser Persistence Reset */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-900">
            Browser LocalStorage Sync
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            All household state persists locally in this browser.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetAllData}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-[11px] font-semibold shrink-0"
        >
          <RotateCcw className="w-3 h-3" aria-hidden="true" />
          <span>Reset All</span>
        </button>
      </div>
    </div>
  );
}
