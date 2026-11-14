import { useState, FormEvent } from 'react';
import { Check, CheckCircle2, Megaphone, Pin, Plus, X } from 'lucide-react';
import { HouseholdMemberId, NoticeItem } from '../types/society';

interface NoticesTabProps {
  notices: NoticeItem[];
  activeMember: HouseholdMemberId;
  onAcknowledgeNotice: (noticeId: string) => void;
  onAddNotice: (input: {
    title: string;
    category: NoticeItem['category'];
    body: string;
    pinned: boolean;
  }) => void;
}

export function NoticesTab({
  notices,
  activeMember,
  onAcknowledgeNotice,
  onAddNotice,
}: NoticesTabProps) {
  const [filter, setFilter] = useState<'All' | NoticeItem['category']>('All');
  const [showNewModal, setShowNewModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeItem['category']>('Maintenance');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);

  const visibleNotices = [...notices]
    .filter((n) => filter === 'All' || n.category === filter)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onAddNotice({
      title: title.trim(),
      category,
      body: body.trim(),
      pinned,
    });
    setTitle('');
    setBody('');
    setPinned(false);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-3.5">
      {/* Header Strip */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-600">
          <Megaphone className="w-3.5 h-3.5 text-[#0E836D]" aria-hidden="true" />
          <span>SOCIETY CIRCULARS ({visibleNotices.length})</span>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0E836D] hover:bg-[#0B6D5B] text-white text-[11px] font-semibold"
        >
          <Plus className="w-3 h-3" aria-hidden="true" />
          <span>Post Notice</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {(['All', 'Maintenance', 'Security', 'AGM', 'Event'] as const).map(
          (cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors whitespace-nowrap ${
                filter === cat
                  ? 'bg-[#0E836D] border-[#0E836D] text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {visibleNotices.map((notice) => {
          const ackBySelf = notice.acknowledgedBy.includes(activeMember);
          const otherId: HouseholdMemberId = activeMember === 'A' ? 'B' : 'A';
          const ackByPartner = notice.acknowledgedBy.includes(otherId);

          return (
            <article
              key={notice.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 font-semibold text-[#0E836D]">
                  {notice.pinned && (
                    <Pin className="w-3 h-3" aria-hidden="true" />
                  )}
                  {notice.category}
                </span>
                <span className="text-slate-400 font-mono tabular-nums">
                  {notice.date}
                </span>
              </div>

              <h3 className="font-display text-sm font-bold text-slate-900 mt-1.5">
                {notice.title}
              </h3>

              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {notice.body}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500">
                  <span>{notice.author}</span>
                  {ackByPartner && (
                    <span className="block text-[10px] text-emerald-700 font-medium mt-0.5">
                      Read by Member {otherId}
                    </span>
                  )}
                </div>

                {ackBySelf ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Read by You</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAcknowledgeNotice(notice.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-800"
                  >
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Acknowledge</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* New Notice Modal */}
      {showNewModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-sm font-bold text-slate-900">
                Publish Society Notice
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                aria-label="Close dialog"
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-3.5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as NoticeItem['category'])
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Security">Security</option>
                  <option value="AGM">AGM</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                />
                <span>Pin notice to top</span>
              </label>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0E836D] hover:bg-[#0B6D5B] text-white text-xs font-semibold"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
