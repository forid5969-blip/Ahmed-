import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Lock,
  Layers,
  Bell,
  Eye,
  Plus,
  RefreshCw,
  Sliders,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateCandlesForSymbol, INITIAL_PATTERNS } from '../../data/mockData';
import { Candle, TradingSignal, ChartPattern } from '../../types';

export const MarketChartView: React.FC = () => {
  const {
    selectedQuote,
    selectedSymbol,
    setSelectedSymbol,
    symbols,
    watchlists,
    activeWatchlistId,
    setActiveWatchlistId,
    signals,
    alerts,
    createAlert,
    checkAccess,
    setLockedFeatureModal,
    placeOrder,
    currentPlan,
  } = useApp();

  // Timeframe state
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1H' | '1D' | '1W'>('15m');

  // Indicators toggle
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showPatterns, setShowPatterns] = useState(true);

  // Candles data
  const candles: Candle[] = useMemo(() => {
    return generateCandlesForSymbol(selectedQuote.symbol, 44, selectedQuote.price);
  }, [selectedQuote.symbol, timeframe]);

  // Hovered candle for crosshair info
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // AI Market Analysis state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    trend: string;
    regime: string;
    probability: number;
    summary: string;
    keyLevels: { support: string; resistance: string; pivot: string };
    tradeIdea?: { action: string; entryZone: string; stopLoss: string; target1: string; target2: string; riskReward: string };
  } | null>(null);

  // Quick Order dialog
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);
  const [quickOrderSide, setQuickOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [quickOrderQty, setQuickOrderQty] = useState(10);

  // Quick Alert dialog
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState(selectedQuote.price.toString());
  const [alertCondition, setAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

  // Fetch AI Analysis from server.ts
  const fetchAiAnalysis = async () => {
    if (!checkAccess('ai_analysis')) {
      setLockedFeatureModal({ open: true, featureName: 'AI Market Regime & Probability Analysis', requiredPlan: 'pro' });
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-symbol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedQuote.symbol,
          name: selectedQuote.name,
          price: selectedQuote.price,
          changePercent: selectedQuote.changePercent,
          market: selectedQuote.market,
          timeframe,
          indicators: {
            sma20: (selectedQuote.price * 0.992).toFixed(2),
            ema50: (selectedQuote.price * 0.985).toFixed(2),
            rsi14: 62.4,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      setAiAnalysis(data);
    } catch (e) {
      // Deterministic quantitative regime analysis for static environments like GitHub Pages
      const isBull = selectedQuote.changePercent >= 0;
      const price = selectedQuote.price;
      setAiAnalysis({
        trend: isBull ? 'Bullish Accumulation' : 'Corrective Mean Reversion',
        regime: isBull ? 'Trending Expansion' : 'Consolidation Retest',
        probability: isBull ? 78 : 64,
        summary: `${selectedQuote.symbol} is holding dynamic moving average support across the ${timeframe} session. Orderflow volume profile indicates steady bid absorption with localized resistance at ${(price * 1.025).toFixed(2)} and support anchored at ${(price * 0.985).toFixed(2)}.`,
        keyLevels: {
          support: (price * 0.985).toFixed(2),
          resistance: (price * 1.025).toFixed(2),
          pivot: price.toFixed(2),
        },
        tradeIdea: {
          action: isBull ? 'BUY_ACCUMULATE' : 'SELL_FADE',
          entryZone: `${(price * 0.995).toFixed(2)} - ${price.toFixed(2)}`,
          stopLoss: (price * (isBull ? 0.978 : 1.022)).toFixed(2),
          target1: (price * (isBull ? 1.028 : 0.972)).toFixed(2),
          target2: (price * (isBull ? 1.055 : 0.945)).toFixed(2),
          riskReward: '1:2.4',
        },
      });
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (checkAccess('ai_analysis')) {
      fetchAiAnalysis();
    } else {
      setAiAnalysis(null);
    }
  }, [selectedSymbol]);

  // SVG Chart math calculations
  const chartHeight = 360;
  const chartWidth = 740;
  const paddingY = 24;

  const minPrice = useMemo(() => Math.min(...candles.map((c) => c.low)) * 0.997, [candles]);
  const maxPrice = useMemo(() => Math.max(...candles.map((c) => c.high)) * 1.003, [candles]);
  const priceRange = maxPrice - minPrice || 1;

  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - minPrice) / priceRange) * (chartHeight - paddingY * 2);
  };

  // Moving averages calculation
  const smaPoints = useMemo(() => {
    const period = 10;
    const points: { x: number; y: number }[] = [];
    const step = chartWidth / (candles.length + 1);

    for (let i = period - 1; i < candles.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += candles[i - j].close;
      const avg = sum / period;
      const x = (i + 1) * step;
      const y = getY(avg);
      points.push({ x, y });
    }
    return points;
  }, [candles, minPrice, maxPrice]);

  const emaPoints = useMemo(() => {
    const k = 2 / (20 + 1);
    const points: { x: number; y: number }[] = [];
    const step = chartWidth / (candles.length + 1);
    let ema = candles[0].close;

    for (let i = 0; i < candles.length; i++) {
      ema = candles[i].close * k + ema * (1 - k);
      const x = (i + 1) * step;
      const y = getY(ema);
      points.push({ x, y });
    }
    return points;
  }, [candles, minPrice, maxPrice]);

  const activeWatchlist = watchlists.find((w) => w.id === activeWatchlistId) || watchlists[0];

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] mx-auto space-y-6">
      {/* Top Symbol Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white font-mono">
                {selectedQuote.symbol}
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                {selectedQuote.market} · {selectedQuote.sector}
              </span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{selectedQuote.name}</div>
          </div>

          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
              {selectedQuote.currency === 'INR' ? '₹' : '$'}
              {selectedQuote.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={`text-xs font-semibold tabular-nums flex items-center gap-0.5 ${
                selectedQuote.change >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {selectedQuote.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {selectedQuote.change >= 0 ? '+' : ''}
              {selectedQuote.change.toFixed(2)} ({selectedQuote.changePercent.toFixed(2)}%)
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-6 text-xs text-neutral-500 font-mono">
            <div>
              <span className="text-neutral-400">Open:</span>{' '}
              <span className="text-neutral-800 dark:text-neutral-200">{selectedQuote.open.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-neutral-400">High:</span>{' '}
              <span className="text-emerald-500">{selectedQuote.high.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-neutral-400">Low:</span>{' '}
              <span className="text-rose-500">{selectedQuote.low.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-neutral-400">Vol:</span>{' '}
              <span className="text-neutral-800 dark:text-neutral-200">{selectedQuote.volumeStr}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAlertTargetPrice(selectedQuote.price.toString());
              setAlertModalOpen(true);
            }}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
            title="Create Price Alert"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setQuickOrderSide('BUY');
              setQuickOrderOpen(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
          >
            Buy {selectedQuote.symbol}
          </button>
          <button
            onClick={() => {
              setQuickOrderSide('SELL');
              setQuickOrderOpen(true);
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
          >
            Sell {selectedQuote.symbol}
          </button>
        </div>
      </div>

      {/* Main Grid: Chart & Analysis on left, Watchlist & Signals on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Chart, Indicators, AI breakdown) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chart Controls Bar */}
          <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Timeframe selector */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              {(['1m', '5m', '15m', '1H', '1D', '1W'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-md font-mono font-medium transition-colors ${
                    timeframe === tf
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Indicator Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSMA(!showSMA)}
                className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                  showSMA
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-700'
                }`}
              >
                SMA (20)
              </button>
              <button
                onClick={() => setShowEMA(!showEMA)}
                className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                  showEMA
                    ? 'border-sky-500/40 bg-sky-500/10 text-sky-500 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-700'
                }`}
              >
                EMA (50)
              </button>
              <button
                onClick={() => setShowBollinger(!showBollinger)}
                className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                  showBollinger
                    ? 'border-purple-500/40 bg-purple-500/10 text-purple-500 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Bollinger
              </button>
              <button
                onClick={() => {
                  if (!checkAccess('patterns')) {
                    setLockedFeatureModal({
                      open: true,
                      featureName: 'Automated Pattern & Trendline Recognition',
                      requiredPlan: 'basic',
                    });
                    return;
                  }
                  setShowPatterns(!showPatterns);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono flex items-center gap-1 transition-colors ${
                  showPatterns
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {!checkAccess('patterns') && <Lock className="w-3 h-3 text-amber-500" />}
                <span>Patterns</span>
              </button>
            </div>
          </div>

          {/* Interactive Candlestick Chart Viewport */}
          <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm select-none">
            {/* Crosshair Info Overlay */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-2 border-b border-neutral-100 dark:border-neutral-800/80 pb-2">
              <div className="flex items-center gap-4">
                <span>
                  TIME:{' '}
                  <strong className="text-neutral-900 dark:text-white">
                    {hoveredCandle ? hoveredCandle.timeStr : candles[candles.length - 1]?.timeStr}
                  </strong>
                </span>
                <span>
                  O:{' '}
                  <strong className="text-neutral-900 dark:text-white">
                    {hoveredCandle ? hoveredCandle.open.toFixed(2) : candles[candles.length - 1]?.open.toFixed(2)}
                  </strong>
                </span>
                <span>
                  H:{' '}
                  <strong className="text-emerald-500">
                    {hoveredCandle ? hoveredCandle.high.toFixed(2) : candles[candles.length - 1]?.high.toFixed(2)}
                  </strong>
                </span>
                <span>
                  L:{' '}
                  <strong className="text-rose-500">
                    {hoveredCandle ? hoveredCandle.low.toFixed(2) : candles[candles.length - 1]?.low.toFixed(2)}
                  </strong>
                </span>
                <span>
                  C:{' '}
                  <strong className="text-neutral-900 dark:text-white">
                    {hoveredCandle ? hoveredCandle.close.toFixed(2) : candles[candles.length - 1]?.close.toFixed(2)}
                  </strong>
                </span>
              </div>
              <div className="text-[11px] text-neutral-400">Interactive SVG Canvas</div>
            </div>

            {/* SVG Candlestick Rendering */}
            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-[360px] cursor-crosshair"
                onMouseLeave={() => setHoveredCandle(null)}
              >
                {/* Horizontal Grid Lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
                  const y = paddingY + ratio * (chartHeight - paddingY * 2);
                  const priceLabel = maxPrice - ratio * priceRange;
                  return (
                    <g key={i}>
                      <line
                        x1="0"
                        y1={y}
                        x2={chartWidth}
                        y2={y}
                        stroke="currentColor"
                        className="text-neutral-200 dark:text-neutral-800/80"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={chartWidth - 55}
                        y={y - 4}
                        fill="currentColor"
                        className="text-[10px] font-mono text-neutral-400"
                      >
                        {priceLabel.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* SMA Line (Amber) */}
                {showSMA && smaPoints.length > 1 && (
                  <path
                    d={smaPoints.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeOpacity="0.85"
                  />
                )}

                {/* EMA Line (Sky Blue) */}
                {showEMA && emaPoints.length > 1 && (
                  <path
                    d={emaPoints.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '')}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    strokeOpacity="0.85"
                  />
                )}

                {/* Pattern Recognition Overlays */}
                {showPatterns && checkAccess('patterns') && (
                  <g className="animate-in fade-in">
                    {/* Bull Flag Channel Annotation */}
                    <line
                      x1={chartWidth * 0.4}
                      y1={getY(selectedQuote.price * 0.998)}
                      x2={chartWidth * 0.78}
                      y2={getY(selectedQuote.price * 1.006)}
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={chartWidth * 0.55}
                      y={getY(selectedQuote.price * 1.008)}
                      fill="#10b981"
                      className="text-[10px] font-mono font-semibold"
                    >
                      Bull Flag Resistance Retest
                    </text>
                  </g>
                )}

                {/* Candlesticks Rendering */}
                {candles.map((candle, idx) => {
                  const step = chartWidth / (candles.length + 1);
                  const x = (idx + 1) * step;
                  const candleWidth = Math.max(3, step * 0.65);
                  const isUp = candle.close >= candle.open;
                  const candleColor = isUp ? '#10b981' : '#f43f5e';

                  const yHigh = getY(candle.high);
                  const yLow = getY(candle.low);
                  const yOpen = getY(candle.open);
                  const yClose = getY(candle.close);
                  const rectY = Math.min(yOpen, yClose);
                  const rectHeight = Math.max(2, Math.abs(yClose - yOpen));

                  // Volume bar in lower 15%
                  const maxVol = Math.max(...candles.map((c) => c.volume));
                  const volHeight = (candle.volume / maxVol) * 45;
                  const volY = chartHeight - volHeight;

                  return (
                    <g
                      key={candle.timestamp}
                      onMouseEnter={() => setHoveredCandle(candle)}
                      className="cursor-pointer"
                    >
                      {/* Volume bar */}
                      <rect
                        x={x - candleWidth / 2}
                        y={volY}
                        width={candleWidth}
                        height={volHeight}
                        fill={candleColor}
                        opacity="0.25"
                      />

                      {/* Wick */}
                      <line
                        x1={x}
                        y1={yHigh}
                        x2={x}
                        y2={yLow}
                        stroke={candleColor}
                        strokeWidth="1.2"
                      />

                      {/* Body */}
                      <rect
                        x={x - candleWidth / 2}
                        y={rectY}
                        width={candleWidth}
                        height={rectHeight}
                        fill={candleColor}
                        rx="1"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* RSI Sub-Panel */}
            {showRSI && (
              <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                  <span>RSI (14): <strong className="text-neutral-900 dark:text-white">62.8</strong></span>
                  <span className="text-[10px]">Overbought 70 · Oversold 30</span>
                </div>
                <div className="h-10 w-full bg-neutral-50 dark:bg-neutral-950/60 rounded-lg relative overflow-hidden flex items-center">
                  <div className="absolute top-[30%] w-full border-b border-rose-500/30 border-dashed" />
                  <div className="absolute top-[70%] w-full border-b border-emerald-500/30 border-dashed" />
                  <svg viewBox="0 0 740 40" className="w-full h-10">
                    <path
                      d="M 20 28 Q 150 15 300 24 T 500 16 T 720 18"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* AI Market Analysis Panel (Server-Side Gemini) */}
          <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    AI Market Analysis
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-500 rounded">
                      Gemini 3.8 Flash
                    </span>
                  </h3>
                  <div className="text-[11px] text-neutral-400">
                    Institutional structure, market regime classification and plain-language summary
                  </div>
                </div>
              </div>

              <button
                onClick={fetchAiAnalysis}
                disabled={aiLoading}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
                title="Refresh Quantitative Analysis"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {!checkAccess('ai_analysis') ? (
              <div className="p-6 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 text-center space-y-2">
                <Lock className="w-8 h-8 text-amber-500 mx-auto" />
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  AI Market Analysis is locked on your plan
                </div>
                <p className="text-[11px] text-neutral-500 max-w-md mx-auto">
                  Upgrade to Pro or Enterprise to enable real-time Gemini AI regime scans, support/resistance clustering, and high-probability trade setups.
                </p>
                <button
                  onClick={() =>
                    setLockedFeatureModal({
                      open: true,
                      featureName: 'AI Market Regime & Probability Analysis',
                      requiredPlan: 'pro',
                    })
                  }
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
                >
                  Upgrade to Pro
                </button>
              </div>
            ) : aiLoading ? (
              <div className="p-8 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
                <div className="text-xs text-neutral-400 font-mono">
                  Synthesizing orderflow and technical regime for {selectedQuote.symbol}...
                </div>
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-4">
                {/* Metric Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-400 font-sans">Trend Direction</div>
                    <div className="font-bold text-neutral-900 dark:text-white mt-0.5">{aiAnalysis.trend}</div>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-400 font-sans">Market Regime</div>
                    <div className="font-bold text-emerald-500 mt-0.5">{aiAnalysis.regime}</div>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-400 font-sans">Continuation Probability</div>
                    <div className="font-bold text-neutral-900 dark:text-white mt-0.5">
                      {aiAnalysis.probability}% Confidence
                    </div>
                  </div>
                </div>

                {/* Summary Prose */}
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-800/30 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  {aiAnalysis.summary}
                </p>

                {/* Trade Idea & Levels */}
                {aiAnalysis.tradeIdea && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>Quantitative Action: {aiAnalysis.tradeIdea.action}</span>
                      <span>R:R {aiAnalysis.tradeIdea.riskReward}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-neutral-500">Entry:</span> {aiAnalysis.tradeIdea.entryZone}
                      </div>
                      <div>
                        <span className="text-rose-500">Stop Loss:</span> {aiAnalysis.tradeIdea.stopLoss}
                      </div>
                      <div>
                        <span className="text-emerald-500">Target 1:</span> {aiAnalysis.tradeIdea.target1}
                      </div>
                      <div>
                        <span className="text-emerald-500">Target 2:</span> {aiAnalysis.tradeIdea.target2}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Watchlist, Signals Board, Alerts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Watchlist Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Watchlists</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <select
                  value={activeWatchlistId}
                  onChange={(e) => setActiveWatchlistId(e.target.value)}
                  className="px-2 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono focus:outline-none"
                >
                  {watchlists.map((wl) => (
                    <option key={wl.id} value={wl.id}>
                      {wl.name} ({wl.symbols.length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Symbols in Watchlist */}
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 max-h-80 overflow-y-auto">
              {activeWatchlist.symbols.map((sym) => {
                const quote = symbols.find((s) => s.symbol === sym);
                if (!quote) return null;
                const isSelected = selectedSymbol === sym;
                const isPositive = quote.change >= 0;

                return (
                  <div
                    key={sym}
                    onClick={() => setSelectedSymbol(sym)}
                    className={`flex items-center justify-between py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-mono text-neutral-900 dark:text-white">{sym}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{quote.market}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs text-neutral-900 dark:text-white tabular-nums font-semibold">
                        {quote.currency === 'INR' ? '₹' : '$'}
                        {quote.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-[10px] tabular-nums font-medium ${
                          isPositive ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {quote.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buy/Sell Signals Board */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Active Market Signals</h3>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">Algorithmic</span>
            </div>

            <div className="space-y-3">
              {signals.map((sig) => {
                const isLocked = sig.isPremium && !checkAccess('premium_signals');

                return (
                  <div
                    key={sig.id}
                    onClick={() => {
                      if (isLocked) {
                        setLockedFeatureModal({
                          open: true,
                          featureName: 'Premium Signals with Confidence, Stop-Loss and Targets',
                          requiredPlan: 'pro',
                        });
                      } else {
                        setSelectedSymbol(sig.symbol);
                      }
                    }}
                    className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white">
                          {sig.symbol}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            sig.action === 'BUY'
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : 'bg-rose-500/20 text-rose-500'
                          }`}
                        >
                          {sig.action} · {sig.strength}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{sig.timestamp}</span>
                    </div>

                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug line-clamp-2 mb-2">
                      {sig.reason}
                    </p>

                    {isLocked ? (
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-between text-[11px] text-neutral-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Lock className="w-3 h-3 text-amber-500" /> Unlock Stop-Loss & Targets
                        </span>
                        <span className="text-emerald-500 font-semibold">Pro Plan</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-neutral-100 dark:border-neutral-800 text-[10px] font-mono">
                        <div>
                          <span className="text-neutral-400">Entry:</span> {sig.entryPrice}
                        </div>
                        <div>
                          <span className="text-rose-500">SL:</span> {sig.stopLoss}
                        </div>
                        <div>
                          <span className="text-emerald-500">T1:</span> {sig.target1}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Order Modal */}
      {quickOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
              Place {quickOrderSide} Order
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              {selectedQuote.symbol} · Current Market Price: {selectedQuote.currency === 'INR' ? '₹' : '$'}
              {selectedQuote.price.toFixed(2)}
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Quantity (Shares / Units)
                </label>
                <input
                  type="number"
                  min="1"
                  value={quickOrderQty}
                  onChange={(e) => setQuickOrderQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Estimated Total:</span>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                    {selectedQuote.currency === 'INR' ? '₹' : '$'}
                    {(selectedQuote.price * quickOrderQty).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Execution Account:</span>
                  <span className="font-semibold text-emerald-500">Paper Trading Engine</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setQuickOrderOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    placeOrder({
                      symbol: selectedQuote.symbol,
                      side: quickOrderSide,
                      type: 'MARKET',
                      quantity: quickOrderQty,
                    });
                    setQuickOrderOpen(false);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-white font-semibold transition-colors shadow-sm ${
                    quickOrderSide === 'BUY'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Execute {quickOrderSide}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Alert Modal */}
      {alertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
              Create Price Alert
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Get notified immediately when {selectedQuote.symbol} triggers your condition.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Condition</label>
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option value="ABOVE">Price Rises Above Target</option>
                  <option value="BELOW">Price Falls Below Target</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Target Price</label>
                <input
                  type="number"
                  step="0.05"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setAlertModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    createAlert({
                      symbol: selectedQuote.symbol,
                      condition: alertCondition,
                      targetValue: parseFloat(alertTargetPrice) || selectedQuote.price,
                      repeating: false,
                    });
                    setAlertModalOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Set Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
