import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, TrendingDown, ArrowRight, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandKModal: React.FC = () => {
  const { commandKOpen, setCommandKOpen, symbols, setSelectedSymbol, setActiveView, userRole } = useApp();
  const [query, setQuery] = useState('');
  const [filterMarket, setFilterMarket] = useState<'ALL' | 'NSE' | 'BSE' | 'US' | 'CRYPTO'>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandKOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [commandKOpen]);

  if (!commandKOpen) return null;

  const filteredSymbols = symbols.filter((s) => {
    const matchesQuery =
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.sector.toLowerCase().includes(query.toLowerCase());
    const matchesMarket = filterMarket === 'ALL' || s.market === filterMarket;
    return matchesQuery && matchesMarket;
  });

  const handleSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setCommandKOpen(false);
    if (userRole === 'visitor') {
      setActiveView('landing');
    } else if (userRole === 'trader') {
      setActiveView('chart');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={() => setCommandKOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by symbol, company name or sector (e.g., RELIANCE, NIFTY, BTC, Apple)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
          />
          <kbd className="px-2 py-1 text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded border border-neutral-200 dark:border-neutral-700">
            ESC
          </kbd>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1 px-4 py-2 bg-neutral-50 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800 text-xs">
          {(['ALL', 'NSE', 'US', 'CRYPTO'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setFilterMarket(m)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMarket === m
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {m === 'ALL' ? 'All Markets' : m}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60 p-1">
          {filteredSymbols.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              No matching instruments found for "{query}".
            </div>
          ) : (
            filteredSymbols.map((item) => {
              const isPositive = item.change >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => handleSelect(item.symbol)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/70 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-mono font-semibold text-xs text-neutral-700 dark:text-neutral-300">
                      {item.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-neutral-900 dark:text-white font-mono">
                          {item.symbol}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {item.market} · {item.sector}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-neutral-900 dark:text-white tabular-nums">
                      {item.currency === 'INR' ? '₹' : '$'}
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-mono font-medium flex items-center justify-end gap-0.5 tabular-nums ${
                        isPositive ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950/70 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Navigate with arrows, Enter to load chart</span>
          <span className="font-mono">Live Quotes Feed · 4ms Latency</span>
        </div>
      </div>
    </div>
  );
};
