import React, { useState } from 'react';
import {
  Landmark,
  Calculator,
  Shield,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  FileText,
  Info,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IPODetails, LoanProduct } from '../../types';

export const InvestingBorrowingView: React.FC = () => {
  const {
    ipos,
    applyIPO,
    cancelIPO,
    loanProducts,
    loanApplications,
    applyLoan,
    checkAccess,
    setLockedFeatureModal,
    kycData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ipo' | 'loans'>('ipo');

  // IPO Modal State
  const [selectedIpoForBidding, setSelectedIpoForBidding] = useState<IPODetails | null>(null);
  const [upiId, setUpiId] = useState('trader@okhdfcbank');
  const [bid1Lots, setBid1Lots] = useState(1);
  const [bid1CutOff, setBid1CutOff] = useState(true);
  const [bid1Price, setBid1Price] = useState(0);

  const [bid2Active, setBid2Active] = useState(false);
  const [bid2Lots, setBid2Lots] = useState(1);
  const [bid2CutOff, setBid2CutOff] = useState(false);
  const [bid2Price, setBid2Price] = useState(0);

  const [bid3Active, setBid3Active] = useState(false);
  const [bid3Lots, setBid3Lots] = useState(1);
  const [bid3CutOff, setBid3CutOff] = useState(false);
  const [bid3Price, setBid3Price] = useState(0);

  // EMI Calculator State
  const [calcAmount, setCalcAmount] = useState(500000);
  const [calcTenorMonths, setCalcTenorMonths] = useState(24);
  const [calcInterestRate, setCalcInterestRate] = useState(9.75);
  const [selectedProductForKfs, setSelectedProductForKfs] = useState<LoanProduct | null>(null);
  const [selectedProductForApply, setSelectedProductForApply] = useState<LoanProduct | null>(null);

  // EMI calculation formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = calcInterestRate / 12 / 100;
  const calculatedEmi = Math.round(
    (calcAmount * monthlyRate * Math.pow(1 + monthlyRate, calcTenorMonths)) /
      (Math.pow(1 + monthlyRate, calcTenorMonths) - 1)
  );
  const totalRepayment = calculatedEmi * calcTenorMonths;
  const totalInterest = totalRepayment - calcAmount;

  // Handle IPO Bidding Submit
  const handleOpenBiddingModal = (ipo: IPODetails) => {
    setSelectedIpoForBidding(ipo);
    setBid1Price(ipo.maxPrice);
    setBid2Price(ipo.minPrice);
    setBid3Price(Math.round((ipo.minPrice + ipo.maxPrice) / 2));
  };

  const handleBiddingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIpoForBidding) return;

    const bids: { bidNo: number; lots: number; price: number; cutOff: boolean }[] = [
      { bidNo: 1, lots: bid1Lots, price: bid1CutOff ? selectedIpoForBidding.maxPrice : bid1Price, cutOff: bid1CutOff },
    ];
    if (bid2Active) {
      bids.push({ bidNo: 2, lots: bid2Lots, price: bid2CutOff ? selectedIpoForBidding.maxPrice : bid2Price, cutOff: bid2CutOff });
    }
    if (bid3Active) {
      bids.push({ bidNo: 3, lots: bid3Lots, price: bid3CutOff ? selectedIpoForBidding.maxPrice : bid3Price, cutOff: bid3CutOff });
    }

    applyIPO(selectedIpoForBidding.id, upiId, bids);
    setSelectedIpoForBidding(null);
  };

  const handleApplyLoanSubmit = (product: LoanProduct) => {
    if (!checkAccess('loans')) {
      setLockedFeatureModal({
        open: true,
        featureName: 'Partner Lending & Margin Facility Access',
        requiredPlan: 'pro',
      });
      return;
    }
    applyLoan(product.id, calcAmount, calcTenorMonths, calculatedEmi);
    setSelectedProductForApply(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] mx-auto space-y-6">
      {/* Header with Regulatory Demarcation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-500" />
            Capital Growth: IPOs & RBI Partner Loans
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Submit 3-bid UPI applications for mainboard IPOs or access Loan Against Securities (LAS) from RBI-regulated banking partners.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('ipo')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'ipo'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            IPO Bidding & Allotment
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'loans'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Partner Loans & EMI Calculator
          </button>
        </div>
      </div>

      {/* 1. IPO TAB */}
      {activeTab === 'ipo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ipos.map((ipo) => (
              <div
                key={ipo.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
                        {ipo.name}
                      </h3>
                      <div className="text-xs text-neutral-400 font-mono">NSE/BSE: {ipo.symbol}</div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold uppercase ${
                        ipo.status === 'open'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : ipo.status === 'upcoming'
                          ? 'bg-sky-500/10 text-sky-500'
                          : 'bg-neutral-500/10 text-neutral-400'
                      }`}
                    >
                      {ipo.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                    {ipo.companyDescription}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl mb-4 font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-neutral-400 font-sans">Price Band</div>
                      <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">{ipo.issuePriceBand}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 font-sans">Lot Size</div>
                      <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">{ipo.lotSize} shares</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 font-sans">Min Amount</div>
                      <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">₹{ipo.minInvestment.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 font-sans">Est. GMP</div>
                      <div className="font-semibold text-emerald-500 mt-0.5">
                        +₹{ipo.gmp} ({ipo.gmpPercent}%)
                      </div>
                    </div>
                  </div>

                  {/* Existing User Application Status */}
                  {ipo.userApplication && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-emerald-600 dark:text-emerald-400">
                        <span>Application #{ipo.userApplication.applicationNumber}</span>
                        <span className="font-mono">{ipo.userApplication.allotmentStatus}</span>
                      </div>
                      <div className="text-neutral-600 dark:text-neutral-300 font-mono text-[11px] flex justify-between">
                        <span>UPI: {ipo.userApplication.upiId}</span>
                        <span>Total: ₹{ipo.userApplication.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => cancelIPO(ipo.id)}
                          className="text-[11px] text-rose-500 hover:underline font-medium"
                        >
                          Withdraw / Cancel Bids
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  {ipo.status === 'open' && !ipo.userApplication ? (
                    <button
                      onClick={() => handleOpenBiddingModal(ipo)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Apply with up to 3 Bids via UPI</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : ipo.userApplication ? (
                    <button
                      onClick={() => handleOpenBiddingModal(ipo)}
                      className="w-full py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold rounded-xl text-xs transition-colors"
                    >
                      Modify Bids
                    </button>
                  ) : (
                    <div className="text-center text-xs text-neutral-400 py-1 font-mono">
                      Closes {ipo.closeDate} · Allotment {ipo.allotmentDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PARTNER LOANS TAB */}
      {activeTab === 'loans' && (
        <div className="space-y-8">
          {/* Regulatory Transparency Callout */}
          <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-start gap-3 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-900 dark:text-white">Statutory Disclosure & RBI Mandate:</strong>{' '}
              Tickerline connects traders to RBI-regulated partner lenders. The partner institution independently underwrites, approves, and disburses the credit line; Tickerline does not lend money itself.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Interactive EMI Calculator */}
            <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-500" />
                Interactive Loan & Margin Calculator
              </h2>

              <div className="space-y-4 text-xs">
                {/* Amount Slider */}
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-neutral-900 dark:text-white">
                    <span>Requested Amount:</span>
                    <span className="font-mono text-emerald-500">₹{calcAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="10000000"
                    step="50000"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-0.5">
                    <span>₹50K</span>
                    <span>₹1 Crore</span>
                  </div>
                </div>

                {/* Tenor Slider */}
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-neutral-900 dark:text-white">
                    <span>Tenor (Months):</span>
                    <span className="font-mono text-emerald-500">{calcTenorMonths} Months</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="48"
                    step="6"
                    value={calcTenorMonths}
                    onChange={(e) => setCalcTenorMonths(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-0.5">
                    <span>6 Mo</span>
                    <span>48 Mo</span>
                  </div>
                </div>

                {/* Interest Rate Selector */}
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-neutral-900 dark:text-white">
                    <span>Interest Rate (p.a.):</span>
                    <span className="font-mono text-emerald-500">{calcInterestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="9.0"
                    max="15.0"
                    step="0.25"
                    value={calcInterestRate}
                    onChange={(e) => setCalcInterestRate(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Monthly EMI Output Box */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                  <div className="text-center">
                    <div className="text-[11px] text-neutral-500 font-medium">Estimated Monthly EMI</div>
                    <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                      ₹{calculatedEmi.toLocaleString()}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-2 text-[11px] font-mono text-center">
                    <div>
                      <div className="text-neutral-400 text-[10px]">Total Interest</div>
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                        ₹{totalInterest.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-neutral-400 text-[10px]">Total Repayable</div>
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                        ₹{totalRepayment.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Partner Loan Products & Key Fact Statement (KFS) */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                RBI-Regulated Partner Lending Products
              </h2>

              <div className="space-y-4">
                {loanProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-neutral-900 dark:text-white">
                            {prod.partnerName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                            RBI Regulated
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">{prod.productTitle}</div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-sm font-bold text-emerald-500">{prod.interestRateAnnual}% p.a.</div>
                        <div className="text-[10px] text-neutral-400">APR: {prod.apr}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                      <div>
                        <div className="text-[10px] text-neutral-400 font-sans">Max Line</div>
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          ₹{(prod.maxAmount / 100000).toFixed(0)} Lakhs
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-400 font-sans">Processing Fee</div>
                        <div className="font-semibold text-neutral-900 dark:text-white">{prod.processingFeePercent}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-400 font-sans">Pre-Closure</div>
                        <div className="font-semibold text-neutral-900 dark:text-white">{prod.preClosureChargesPercent}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-400 font-sans">Cooling-Off</div>
                        <div className="font-semibold text-neutral-900 dark:text-white">{prod.coolingOffPeriodDays} Days</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => setSelectedProductForKfs(prod)}
                        className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 flex items-center gap-1 font-medium"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect Full Key Fact Statement (KFS)</span>
                      </button>

                      <button
                        onClick={() => setSelectedProductForApply(prod)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
                      >
                        Apply for Credit Line
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submitted Applications History */}
              {loanApplications.length > 0 && (
                <div className="mt-6 p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">
                    Active Loan Applications ({loanApplications.length})
                  </h3>
                  <div className="space-y-2">
                    {loanApplications.map((app) => (
                      <div
                        key={app.id}
                        className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            {app.partnerName} · Ref: {app.referenceNumber}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            Requested: ₹{app.requestedAmount.toLocaleString()} · {app.tenorMonths} Mo · EMI: ₹{app.monthlyEmi.toLocaleString()}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 font-mono font-medium">
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. IPO 3-BID UPI MODAL */}
      {selectedIpoForBidding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
              Apply for {selectedIpoForBidding.name} IPO
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Lot size: {selectedIpoForBidding.lotSize} shares · Price band: {selectedIpoForBidding.issuePriceBand}
            </p>

            <form onSubmit={handleBiddingSubmit} className="space-y-4 text-xs">
              {/* UPI ID */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  UPI ID for Mandate Block *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mobile@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-neutral-400">
                  Funds remain in your bank account and are blocked via ASBA until allotment.
                </span>
              </div>

              {/* Bid 1 */}
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl space-y-2 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between font-semibold text-neutral-900 dark:text-white">
                  <span>Bid #1</span>
                  <label className="flex items-center gap-1.5 cursor-pointer font-normal">
                    <input
                      type="checkbox"
                      checked={bid1CutOff}
                      onChange={(e) => setBid1CutOff(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    <span>Cut-Off Price (₹{selectedIpoForBidding.maxPrice})</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-0.5">Number of Lots</label>
                    <input
                      type="number"
                      min="1"
                      value={bid1Lots}
                      onChange={(e) => setBid1Lots(parseInt(e.target.value) || 1)}
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-0.5">Bid Price (₹)</label>
                    <input
                      type="number"
                      disabled={bid1CutOff}
                      value={bid1CutOff ? selectedIpoForBidding.maxPrice : bid1Price}
                      onChange={(e) => setBid1Price(parseFloat(e.target.value) || selectedIpoForBidding.minPrice)}
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Bid 2 Toggle */}
              {bid2Active ? (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl space-y-2 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between font-semibold text-neutral-900 dark:text-white">
                    <span>Bid #2</span>
                    <button
                      type="button"
                      onClick={() => setBid2Active(false)}
                      className="text-rose-500 text-[11px]"
                    >
                      Remove Bid
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-0.5">Number of Lots</label>
                      <input
                        type="number"
                        min="1"
                        value={bid2Lots}
                        onChange={(e) => setBid2Lots(parseInt(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-0.5">Bid Price (₹)</label>
                      <input
                        type="number"
                        value={bid2Price}
                        onChange={(e) => setBid2Price(parseFloat(e.target.value) || selectedIpoForBidding.minPrice)}
                        className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setBid2Active(true)}
                  className="text-emerald-500 hover:underline text-xs font-semibold"
                >
                  + Add Bid #2
                </button>
              )}

              {/* Bid 3 Toggle */}
              {bid2Active && (
                bid3Active ? (
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl space-y-2 border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between font-semibold text-neutral-900 dark:text-white">
                      <span>Bid #3</span>
                      <button
                        type="button"
                        onClick={() => setBid3Active(false)}
                        className="text-rose-500 text-[11px]"
                      >
                        Remove Bid
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-0.5">Number of Lots</label>
                        <input
                          type="number"
                          min="1"
                          value={bid3Lots}
                          onChange={(e) => setBid3Lots(parseInt(e.target.value) || 1)}
                          className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-0.5">Bid Price (₹)</label>
                        <input
                          type="number"
                          value={bid3Price}
                          onChange={(e) => setBid3Price(parseFloat(e.target.value) || selectedIpoForBidding.minPrice)}
                          className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setBid3Active(true)}
                      className="text-emerald-500 hover:underline text-xs font-semibold"
                    >
                      + Add Bid #3
                    </button>
                  </div>
                )
              )}

              {/* Action row */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedIpoForBidding(null)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Submit UPI Mandate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. KEY FACT STATEMENT (KFS) MODAL */}
      {selectedProductForKfs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Key Fact Statement (KFS)
                </h3>
                <div className="text-xs text-neutral-400">
                  {selectedProductForKfs.partnerName} · RBI Circular Master Direction Compliant
                </div>
              </div>
              <button
                onClick={() => setSelectedProductForKfs(null)}
                className="text-neutral-400 hover:text-neutral-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Facility Type:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{selectedProductForKfs.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Nominal Interest Rate:</span>
                <span className="font-mono font-semibold">{selectedProductForKfs.interestRateAnnual}% p.a.</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Annual Percentage Rate (APR):</span>
                <span className="font-mono font-bold text-emerald-500">{selectedProductForKfs.apr}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Processing Fee:</span>
                <span className="font-mono">{selectedProductForKfs.processingFeePercent}% + GST</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Pre-Payment Charges:</span>
                <span className="font-mono">{selectedProductForKfs.preClosureChargesPercent}% (Zero for Floating LAS)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Penal Interest on Overdue:</span>
                <span className="font-mono text-rose-500">{selectedProductForKfs.penalChargesPerMonth}% per month</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Statutory Cooling-Off Period:</span>
                <span className="font-mono font-semibold">{selectedProductForKfs.coolingOffPeriodDays} Business Days</span>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-[11px] text-neutral-500">
                <strong>Eligibility Notice:</strong> {selectedProductForKfs.eligibility}
              </div>
            </div>

            <button
              onClick={() => setSelectedProductForKfs(null)}
              className="w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-xl text-xs transition-colors"
            >
              Close KFS Disclosures
            </button>
          </div>
        </div>
      )}

      {/* 5. APPLY LOAN CONFIRMATION MODAL */}
      {selectedProductForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Confirm Loan Transmission to {selectedProductForApply.partnerName}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Your verified KYC records (PAN: {kycData.panNumber}, Name: {kycData.nameAsPerPan}) will be securely transmitted to {selectedProductForApply.partnerName} via encrypted protocol for instantaneous credit line underwriting.
            </p>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span>Requested Amount:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">₹{calcAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tenor:</span>
                <span className="font-semibold">{calcTenorMonths} Months</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Monthly EMI:</span>
                <span className="font-semibold text-emerald-500">₹{calculatedEmi.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedProductForApply(null)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplyLoanSubmit(selectedProductForApply)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
              >
                Authorize & Transmit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
