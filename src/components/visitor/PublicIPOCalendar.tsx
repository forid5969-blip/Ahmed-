import React, { useState } from 'react';
import { Landmark, Calendar, TrendingUp, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicIPOCalendar: React.FC = () => {
  const { ipos, setUserRole, setActiveView } = useApp();
  const [filter, setFilter] = useState<'all' | 'open' | 'upcoming' | 'closed' | 'listed'>('all');

  const filteredIPOs = ipos.filter((i) => (filter === 'all' ? true : i.status === filter));

  return (
    <div className="py-12 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-500 uppercase tracking-wider font-mono mb-2">
            <Landmark className="w-4 h-4" /> Indian Mainboard & SME Public Offerings
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            IPO Calendar & Grey Market Tracking
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            Live monitoring of ongoing issues, subscription multipliers, allotment dates, and expected listing premiums.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
          {[
            { id: 'all', label: 'All Issues' },
            { id: 'open', label: 'Open Now' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'closed', label: 'Closed' },
            { id: 'listed', label: 'Listed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* IPO Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIPOs.map((ipo) => {
          const statusColors = {
            open: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
            upcoming: 'text-sky-500 bg-sky-500/10 border-sky-500/30',
            closed: 'text-neutral-500 bg-neutral-500/10 border-neutral-500/30',
            listed: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
          };

          return (
            <div
              key={ipo.id}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
                      {ipo.name}
                    </h3>
                    <div className="text-xs text-neutral-400 font-mono mt-0.5">NSE/BSE: {ipo.symbol}</div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-mono uppercase font-semibold border ${
                      statusColors[ipo.status]
                    }`}
                  >
                    {ipo.status}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2 mb-5">
                  {ipo.companyDescription}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800 mb-5 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-neutral-400 font-sans">Price Band</div>
                    <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">{ipo.issuePriceBand}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400 font-sans">Lot Size</div>
                    <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">{ipo.lotSize} shares</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400 font-sans">Min Investment</div>
                    <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">₹{ipo.minInvestment.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400 font-sans">Est. GMP</div>
                    <div className="font-semibold text-emerald-500 mt-0.5">
                      +₹{ipo.gmp} ({ipo.gmpPercent}%)
                    </div>
                  </div>
                </div>

                {/* Subscription Multipliers (if open or closed) */}
                {ipo.subscription.total > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-neutral-500">Subscription Status:</span>
                      <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                        {ipo.subscription.total}x Total
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center">
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <div className="text-neutral-400 text-[10px]">QIB</div>
                        <div className="font-bold text-neutral-800 dark:text-neutral-200">{ipo.subscription.qib}x</div>
                      </div>
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <div className="text-neutral-400 text-[10px]">NII (HNI)</div>
                        <div className="font-bold text-neutral-800 dark:text-neutral-200">{ipo.subscription.nii}x</div>
                      </div>
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <div className="text-neutral-400 text-[10px]">Retail</div>
                        <div className="font-bold text-neutral-800 dark:text-neutral-200">{ipo.subscription.retail}x</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dates Timeline */}
                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" /> Closes: {ipo.closeDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" /> Allotment: {ipo.allotmentDate}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3">
                {ipo.status === 'open' ? (
                  <button
                    onClick={() => {
                      setUserRole('trader');
                      setActiveView('investing');
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Apply via UPI Mandate (Up to 3 Bids)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setUserRole('trader');
                      setActiveView('investing');
                    }}
                    className="w-full py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-xl text-xs transition-colors"
                  >
                    View Allotment & Financial Details
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
