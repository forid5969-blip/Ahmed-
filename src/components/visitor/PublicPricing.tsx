import React, { useState } from 'react';
import { Check, X, Shield, ArrowRight, Sparkles, CreditCard, Receipt, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlanTier } from '../../types';

export const PublicPricing: React.FC = () => {
  const {
    currentPlan,
    setCurrentPlan,
    setUserRole,
    setActiveView,
    applyDiscountCode,
    completePayment,
    freeTrialActive,
    activateFreeTrial,
    addToast,
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [couponCode, setCouponCode] = useState('FESTIVE25');
  const [appliedDiscount, setAppliedDiscount] = useState<{ valid: boolean; discountPercent: number; message: string } | null>({
    valid: true,
    discountPercent: 25,
    message: '25% festive discount active!',
  });
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanTier | null>(null);
  const [checkoutGateway, setCheckoutGateway] = useState<'Razorpay' | 'Stripe'>('Razorpay');
  const [gstinInput, setGstinInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyDiscountCode(couponCode);
    setAppliedDiscount(res);
    if (res.valid) {
      addToast({ title: 'Coupon Applied', description: res.message, type: 'success' });
    } else {
      addToast({ title: 'Invalid Coupon', description: res.message, type: 'warning' });
    }
  };

  const getPlanPrice = (plan: PlanTier): number => {
    if (plan === 'free') return 0;
    const monthlyRate = plan === 'basic' ? 499 : plan === 'pro' ? 1499 : 4999;
    if (billingCycle === 'Monthly') {
      return monthlyRate;
    } else {
      // 10 months billing for 12 months access (approx 17-20% annual discount)
      return monthlyRate * 10;
    }
  };

  const calculateFinalCheckoutPrice = (plan: PlanTier) => {
    const base = getPlanPrice(plan);
    if (!appliedDiscount || !appliedDiscount.valid) {
      return { base, discount: 0, final: base, gst: Math.round(base * 0.18) };
    }
    const discount = Math.round((base * appliedDiscount.discountPercent) / 100);
    const afterDiscount = base - discount;
    const gst = Math.round(afterDiscount * 0.18);
    return { base, discount, final: afterDiscount, gst };
  };

  const handleExecuteCheckout = () => {
    if (!selectedPlanForCheckout) return;
    completePayment(
      selectedPlanForCheckout,
      billingCycle,
      checkoutGateway,
      appliedDiscount?.valid ? couponCode : undefined
    );
    setUserRole('trader');
    setSelectedPlanForCheckout(null);
    setActiveView('chart');
  };

  const plansConfig: {
    tier: PlanTier;
    name: string;
    description: string;
    popular?: boolean;
    features: { label: string; included: boolean; detail?: string }[];
  }[] = [
    {
      tier: 'free',
      name: 'Free',
      description: 'Essential viewing and simulated trading for new market students.',
      features: [
        { label: 'Charts & Watchlists', included: true, detail: 'Basic, 1 list' },
        { label: 'Buy/Sell Signals', included: true, detail: 'Standard' },
        { label: 'Patterns & Trendlines', included: false },
        { label: 'Price Alerts', included: false },
        { label: 'Backtests per Day', included: false },
        { label: 'Paper Trading', included: true },
        { label: 'AI Market Regime Analysis', included: false },
        { label: 'Live Broker Execution', included: false },
        { label: 'Auto-Trading Bots', included: false },
        { label: 'IPO Access', included: true, detail: 'View Details' },
        { label: 'Partner Lending', included: false },
        { label: 'Community & Chat', included: true },
      ],
    },
    {
      tier: 'basic',
      name: 'Basic',
      description: 'Pattern recognition and daily backtesting for active retail traders.',
      features: [
        { label: 'Charts & Watchlists', included: true, detail: 'Advanced, 5 lists' },
        { label: 'Buy/Sell Signals', included: true, detail: 'Standard' },
        { label: 'Patterns & Trendlines', included: true, detail: 'Automated Overlays' },
        { label: 'Price Alerts', included: true, detail: '25 Active' },
        { label: 'Backtests per Day', included: true, detail: '10 tests/day' },
        { label: 'Paper Trading', included: true },
        { label: 'AI Market Regime Analysis', included: false },
        { label: 'Live Broker Execution', included: false },
        { label: 'Auto-Trading Bots', included: false },
        { label: 'IPO Access', included: true, detail: '3-Bid UPI Portal' },
        { label: 'Partner Lending', included: false },
        { label: 'Community & Chat', included: true },
      ],
    },
    {
      tier: 'pro',
      name: 'Pro',
      description: 'Institutional-grade quantitative intelligence, AI insights and live bots.',
      popular: true,
      features: [
        { label: 'Charts & Watchlists', included: true, detail: 'Advanced, 20 lists' },
        { label: 'Buy/Sell Signals', included: true, detail: 'Premium Confidence & Targets' },
        { label: 'Patterns & Trendlines', included: true, detail: 'Automated Overlays' },
        { label: 'Price Alerts', included: true, detail: '200 Active' },
        { label: 'Backtests per Day', included: true, detail: '100 + Overfitting Check' },
        { label: 'Paper Trading', included: true },
        { label: 'AI Market Regime Analysis', included: true, detail: 'Powered by Gemini' },
        { label: 'Live Broker Execution', included: true, detail: 'Zerodha / Alpaca / Binance' },
        { label: 'Auto-Trading Bots', included: true, detail: '5 Active Bots' },
        { label: 'IPO Access', included: true, detail: '3-Bid UPI Portal' },
        { label: 'Partner Lending', included: true, detail: 'Full KFS Access' },
        { label: 'Community & Chat', included: true },
      ],
    },
    {
      tier: 'enterprise',
      name: 'Enterprise',
      description: 'Dedicated algorithmic capacity, 50 running bots, and priority support desk.',
      features: [
        { label: 'Charts & Watchlists', included: true, detail: 'Advanced, 100 lists' },
        { label: 'Buy/Sell Signals', included: true, detail: 'Institutional Grade' },
        { label: 'Patterns & Trendlines', included: true, detail: 'Multi-Timeframe' },
        { label: 'Price Alerts', included: true, detail: '2,000 Active' },
        { label: 'Backtests per Day', included: true, detail: '1,000 + Optimisation' },
        { label: 'Paper Trading', included: true },
        { label: 'AI Market Regime Analysis', included: true, detail: 'Unlimited Deep Scans' },
        { label: 'Live Broker Execution', included: true, detail: 'Low Latency DMA' },
        { label: 'Auto-Trading Bots', included: true, detail: '50 Running Bots' },
        { label: 'IPO Access', included: true, detail: 'Syndicate Allocation' },
        { label: 'Partner Lending', included: true, detail: 'Dedicated Relationship Mgr' },
        { label: 'Community & Chat', included: true },
      ],
    },
  ];

  return (
    <div className="py-12 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Pricing & Zero Hidden Brokerage</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Predictable plans for individual and professional traders.
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-3">
          Switch between monthly flexibility or annual savings. Every tier features paper trading and strict zero-knowledge API credential isolation.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setBillingCycle('Monthly')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              billingCycle === 'Monthly'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Monthly Cadence
          </button>
          <button
            onClick={() => setBillingCycle('Yearly')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              billingCycle === 'Yearly'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>Annual (2 Months Free)</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono">
              Save ~20%
            </span>
          </button>
        </div>

        {/* Discount Code Input Bar */}
        <form onSubmit={handleApplyCoupon} className="mt-4 flex items-center justify-center gap-2 max-w-sm mx-auto">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Promo code (e.g. FESTIVE25)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg text-xs font-medium transition-colors"
          >
            Apply
          </button>
        </form>

        {appliedDiscount && (
          <div className={`mt-2 text-xs font-medium ${appliedDiscount.valid ? 'text-emerald-500' : 'text-rose-500'}`}>
            {appliedDiscount.message}
          </div>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {plansConfig.map((plan) => {
          const rawPrice = getPlanPrice(plan.tier);
          const isCurrent = currentPlan === plan.tier;
          const hasDiscount = appliedDiscount?.valid && rawPrice > 0;
          const discountedPrice = hasDiscount
            ? Math.round(rawPrice * (1 - appliedDiscount.discountPercent / 100))
            : rawPrice;

          return (
            <div
              key={plan.tier}
              className={`relative rounded-2xl p-6 flex flex-col justify-between border transition-all ${
                plan.popular
                  ? 'border-emerald-500/60 dark:border-emerald-500/60 bg-neutral-50/50 dark:bg-neutral-900 shadow-xl ring-1 ring-emerald-500/30'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-semibold tracking-wide uppercase">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{plan.name}</h3>
                  {plan.tier === 'pro' && !freeTrialActive && (
                    <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                      7-Day Trial Available
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 min-h-[32px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-5 pb-5 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
                      {plan.tier === 'free' ? '₹0' : `₹${discountedPrice.toLocaleString()}`}
                    </span>
                    {plan.tier !== 'free' && (
                      <span className="text-xs text-neutral-400 font-sans">
                        /{billingCycle === 'Monthly' ? 'mo' : 'yr'}
                      </span>
                    )}
                  </div>

                  {hasDiscount && (
                    <div className="text-[11px] text-neutral-400 line-through font-mono mt-0.5">
                      ₹{rawPrice.toLocaleString()} (Before {appliedDiscount.discountPercent}% promo)
                    </div>
                  )}

                  <div className="text-[10px] text-neutral-400 mt-1">
                    {plan.tier === 'free' ? 'Lifetime free access' : '+ 18% GST with input credit invoice'}
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-5 space-y-2.5 text-xs">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      {feat.included ? (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-neutral-300 dark:text-neutral-700 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feat.included
                            ? 'text-neutral-800 dark:text-neutral-200'
                            : 'text-neutral-400 dark:text-neutral-600'
                        }
                      >
                        <strong>{feat.label}:</strong> {feat.detail || (feat.included ? 'Included' : '—')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                {plan.tier === 'free' ? (
                  <button
                    onClick={() => {
                      setCurrentPlan('free');
                      setUserRole('trader');
                      setActiveView('chart');
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-default'
                        : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : 'Select Free Plan'}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedPlanForCheckout(plan.tier)}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        plan.popular
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                          : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950'
                      }`}
                    >
                      <span>{isCurrent ? 'Extend Subscription' : `Upgrade to ${plan.name}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {plan.tier === 'pro' && !freeTrialActive && (
                      <button
                        onClick={() => {
                          activateFreeTrial();
                          setUserRole('trader');
                          setActiveView('chart');
                        }}
                        className="w-full py-1.5 text-[11px] font-medium text-emerald-500 hover:text-emerald-400 transition-colors text-center"
                      >
                        or start 7-day Pro free trial
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal (Razorpay / Stripe Simulation) */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Checkout & Tax Invoice
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlanForCheckout(null)}
                className="text-neutral-400 hover:text-neutral-200 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Order Summary */}
            <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Plan:</span>
                <span className="font-semibold text-neutral-900 dark:text-white uppercase font-mono">
                  {selectedPlanForCheckout} ({billingCycle})
                </span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Base Subtotal:</span>
                <span className="font-mono">
                  ₹{calculateFinalCheckoutPrice(selectedPlanForCheckout).base.toLocaleString()}
                </span>
              </div>
              {calculateFinalCheckoutPrice(selectedPlanForCheckout).discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Promotional Discount:</span>
                  <span className="font-mono">
                    -₹{calculateFinalCheckoutPrice(selectedPlanForCheckout).discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>GST (18% Integrated Goods & Services Tax):</span>
                <span className="font-mono">
                  +₹{calculateFinalCheckoutPrice(selectedPlanForCheckout).gst.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between font-bold text-sm text-neutral-900 dark:text-white">
                <span>Total Payable:</span>
                <span className="font-mono text-emerald-500">
                  ₹
                  {(
                    calculateFinalCheckoutPrice(selectedPlanForCheckout).final +
                    calculateFinalCheckoutPrice(selectedPlanForCheckout).gst
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Optional GSTIN for Business Expense Input */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                GSTIN / Corporate Tax ID (Optional for B2B Credit)
              </label>
              <input
                type="text"
                placeholder="e.g. 27AAAAA0000A1Z5"
                value={gstinInput}
                onChange={(e) => setGstinInput(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Gateway Selection */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Select Verified Payment Gateway
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCheckoutGateway('Razorpay')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    checkoutGateway === 'Razorpay'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <span className="font-bold text-xs">Razorpay</span>
                  <span className="text-[10px] text-neutral-400">UPI, Netbanking, Rupay, Visa</span>
                </button>
                <button
                  onClick={() => setCheckoutGateway('Stripe')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    checkoutGateway === 'Stripe'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <span className="font-bold text-xs">Stripe</span>
                  <span className="text-[10px] text-neutral-400">Global Cards & Cross-border</span>
                </button>
              </div>
            </div>

            {/* Security Guarantee Notice */}
            <div className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl flex items-center gap-2 text-[11px] text-neutral-500">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Payment status is verified directly via gateway server webhook callbacks, never by the client browser.</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleExecuteCheckout}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                Confirm & Pay via {checkoutGateway} (₹
                {(
                  calculateFinalCheckoutPrice(selectedPlanForCheckout).final +
                  calculateFinalCheckoutPrice(selectedPlanForCheckout).gst
                ).toLocaleString()}
                )
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
