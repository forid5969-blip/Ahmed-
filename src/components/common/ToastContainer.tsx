import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
          info: <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />,
        };

        const borders = {
          success: 'border-emerald-500/30 bg-white dark:bg-neutral-900',
          error: 'border-rose-500/30 bg-white dark:bg-neutral-900',
          warning: 'border-amber-500/30 bg-white dark:bg-neutral-900',
          info: 'border-sky-500/30 bg-white dark:bg-neutral-900',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-2 ${borders[toast.type]}`}
          >
            <div className="flex items-start gap-2.5">
              {icons[toast.type]}
              <div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                  {toast.title}
                </div>
                {toast.description && (
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-snug">
                    {toast.description}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
