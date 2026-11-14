import { useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Download,
  Lock,
  Receipt,
  X,
} from 'lucide-react';
import { HouseholdMemberId, MaintenanceDue } from '../types/society';
import { formatCurrency } from '../utils/formatters';

interface DuesTabProps {
  unitNumber: string;
  dues: MaintenanceDue[];
  activeMember: HouseholdMemberId;
  onPayDue: (
    dueId: string,
    method: 'UPI' | 'Card' | 'NetBanking'
  ) => void;
}

export function DuesTab({
  unitNumber,
  dues,
  activeMember,
  onPayDue,
}: DuesTabProps) {
  const [payingDue, setPayingDue] = useState<MaintenanceDue | null>(null);
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [expandedDueId, setExpandedDueId] = useState<string | null>(
    dues[0]?.id ?? null
  );

  const pendingTotal = dues
    .filter((d) => d.status === 'Pending')
    .reduce((sum, d) => sum + d.amount, 0);

  const handleDownloadReceipt = (due: MaintenanceDue) => {
    const content = [
      `SOCIETY BUDDY — UNIT ${unitNumber} RECEIPT`,
      `========================================`,
      `Invoice:        ${due.invoiceNo}`,
      `Month:          ${due.month}`,
      `Status:         ${due.status}`,
      `Settled By:     Member ${due.paidBy ?? '-'}`,
      `Paid At:        ${due.paidAt ?? '-'}`,
      `Method:         ${due.paymentMethod ?? '-'}`,
      `Transaction ID: ${due.transactionId ?? '-'}`,
      `----------------------------------------`,
      ...due.lineItems.map(
        (li) => `${li.label.padEnd(30, ' ')} ${formatCurrency(li.amount)}`
      ),
      `----------------------------------------`,
      `TOTAL PAID:                    ${formatCurrency(due.amount)}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${due.invoiceNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3.5">
      {/* Unit Balance Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
            UNIT {unitNumber} OUTSTANDING
          </p>
          <p className="font-mono text-2xl font-bold tabular-nums text-slate-900 mt-1">
            {formatCurrency(pendingTotal)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {pendingTotal > 0
              ? 'Shared household billing · First payment settles'
              : 'All maintenance dues settled'}
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0E836D] flex items-center justify-center shrink-0">
          <Receipt className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {dues.map((due) => {
          const isPaid = due.status === 'Paid';
          const paidBySelf = due.paidBy === activeMember;
          const isExpanded = expandedDueId === due.id;

          return (
            <div
              key={due.id}
              className={`bg-white rounded-2xl border p-4 shadow-2xs ${
                isPaid ? 'border-emerald-300' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] text-slate-500">
                    {due.invoiceNo} · Due {due.dueDate}
                  </p>
                  <h3 className="font-display text-sm font-bold text-slate-900 mt-0.5">
                    {due.month} Maintenance
                  </h3>
                </div>
                <div className="text-right">
                  <p className="font-mono text-base font-bold tabular-nums text-slate-900">
                    {formatCurrency(due.amount)}
                  </p>
                  <span
                    className={`inline-block text-[11px] font-semibold mt-0.5 ${
                      isPaid ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {due.status}
                  </span>
                </div>
              </div>

              {/* Expandable Line Items */}
              <button
                type="button"
                onClick={() =>
                  setExpandedDueId(isExpanded ? null : due.id)
                }
                className="mt-2.5 text-[11px] font-semibold text-[#0E836D] hover:underline"
              >
                {isExpanded ? 'Hide breakdown' : 'View itemized breakdown'}
              </button>

              {isExpanded && (
                <div className="mt-2.5 rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1.5 text-xs">
                  {due.lineItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-mono font-medium tabular-nums text-slate-900">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action or Household Lockout Banner */}
              {!isPaid ? (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500">
                    Open for household payment
                  </span>
                  <button
                    type="button"
                    onClick={() => setPayingDue(due)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E836D] hover:bg-[#0B6D5B] text-white text-xs font-bold"
                  >
                    <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Pay {formatCurrency(due.amount)}</span>
                  </button>
                </div>
              ) : (
                <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                      <span>
                        Paid by {paidBySelf ? 'You' : `Member ${due.paidBy}`} (
                        {due.paymentMethod})
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800">
                      <Lock className="w-3 h-3" aria-hidden="true" />
                      Locked
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-emerald-800">
                    <span className="font-mono">{due.transactionId}</span>
                    <button
                      type="button"
                      onClick={() => handleDownloadReceipt(due)}
                      className="inline-flex items-center gap-1 font-semibold underline"
                    >
                      <Download className="w-3 h-3" aria-hidden="true" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {payingDue && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-sm font-bold text-slate-900">
                Settle {payingDue.month} Bill
              </h3>
              <button
                type="button"
                onClick={() => setPayingDue(null)}
                aria-label="Close payment modal"
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Unit {unitNumber}
                </p>
                <p className="font-mono text-[11px] text-slate-500">
                  {payingDue.invoiceNo}
                </p>
              </div>
              <p className="font-mono text-lg font-bold tabular-nums text-slate-900">
                {formatCurrency(payingDue.amount)}
              </p>
            </div>

            <p className="text-[11px] font-semibold text-slate-600 mt-4 mb-2">
              Payment Method (Paying as Member {activeMember})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['UPI', 'Card', 'NetBanking'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`py-2 px-2 rounded-lg border text-xs font-semibold ${
                    method === m
                      ? 'border-[#0E836D] bg-emerald-50 text-[#0E836D]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPayingDue(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onPayDue(payingDue.id, method);
                  setPayingDue(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#0E836D] hover:bg-[#0B6D5B] text-white text-xs font-bold"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
