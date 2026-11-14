import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { ToastMessage } from '../types/society';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] pointer-events-none"
    >
      {toasts.map((toast) => {
        const tone = toast.tone ?? 'neutral';
        const Icon =
          tone === 'success'
            ? CheckCircle2
            : tone === 'warning'
              ? AlertTriangle
              : tone === 'error'
                ? XCircle
                : Info;

        const toneClasses =
          tone === 'success'
            ? 'text-emerald-700 dark:text-emerald-400'
            : tone === 'warning'
              ? 'text-amber-700 dark:text-amber-400'
              : tone === 'error'
                ? 'text-red-700 dark:text-red-400'
                : 'text-teal-700 dark:text-teal-400';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-lg shadow-slate-900/5"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${toneClasses}`} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                {toast.title}
              </p>
              {toast.detail && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {toast.detail}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
