import React from 'react';
import { Lock, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlanTier } from '../../types';

export const FeatureLockModal: React.FC = () => {
  const { lockedFeatureModal, setLockedFeatureModal, setCurrentPlan, setActiveView, activateFreeTrial } = useApp();

  if (!lockedFeatureModal || !lockedFeatureModal.open) return null;

  const { featureName, requiredPlan } = lockedFeatureModal;

  const planPrices: Record<PlanTier, string> = {
    free: 'Free',
    basic: '₹499/mo',
    pro: '₹1,499/mo',
    enterprise: '₹4,999/mo',
  };

  const handleUpgrade = (tier: PlanTier) => {
    setCurrentPlan(tier);
    setLockedFeatureModal(null);
    setActiveView('chart');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={() => setLockedFeatureModal(null)}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
          Upgrade to unlock {featureName}
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
          This institutional-grade capability requires the{' '}
          <strong className="text-neutral-900 dark:text-white font-mono uppercase">{requiredPlan}</strong> plan or higher. Upgrade now or start your 7-day Pro free trial with full algorithmic access.
        </p>

        {/* Feature comparison highlights */}
        <div className="mt-4 p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl space-y-2 border border-neutral-200 dark:border-neutral-800/80 text-xs">
          <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            What is included with {requiredPlan.toUpperCase()}:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Full AI Market Regime Analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Auto-trading bots & decision logs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Premium Stop-Loss & Target Signals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Live Zerodha/Alpaca API execution</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => handleUpgrade(requiredPlan)}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Upgrade to {requiredPlan.toUpperCase()} ({planPrices[requiredPlan]})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              activateFreeTrial();
              setLockedFeatureModal(null);
            }}
            className="py-2.5 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Start 7-Day Free Trial
          </button>
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={() => {
              setLockedFeatureModal(null);
              setActiveView('pricing');
            }}
            className="text-[11px] text-neutral-400 hover:text-neutral-200 underline"
          >
            View all plan comparisons & pricing matrix
          </button>
        </div>
      </div>
    </div>
  );
};
