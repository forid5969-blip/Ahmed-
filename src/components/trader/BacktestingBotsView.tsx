import React, { useState } from 'react';
import {
  Bot,
  Play,
  Pause,
  Trash2,
  Plus,
  TrendingUp,
  BarChart2,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BacktestResult, AutoTradingBot } from '../../types';

export const BacktestingBotsView: React.FC = () => {
  const {
    bots,
    createBot,
    toggleBotStatus,
    deleteBot,
    selectedQuote,
    checkAccess,
    setLockedFeatureModal,
    currentPlan,
    emergencyKillSwitch,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'backtest' | 'bots'>('backtest');

  // Backtest Config State
  const [strategyType, setStrategyType] = useState<'ema_cross' | 'rsi_reversal' | 'breakout' | 'custom'>('ema_cross');
  const [backtestSymbol, setBacktestSymbol] = useState(selectedQuote.symbol);
  const [backtestTimeframe, setBacktestTimeframe] = useState('15m');
  const [initialCapital, setInitialCapital] = useState(500000);
  const [customIndicatorA, setCustomIndicatorA] = useState('RSI (14)');
  const [customOperator, setCustomOperator] = useState('CROSSES_ABOVE');
  const [customValue, setCustomValue] = useState('30');
  const [isRunningBacktest, setIsRunningBacktest] = useState(false);

  // Mock Result State
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>({
    strategyName: 'EMA 9 / 21 Trend Continuation',
    symbol: 'NIFTY 50',
    timeframe: '15m',
    totalReturnPercent: 44.8,
    buyAndHoldPercent: 18.2,
    maxDrawdownPercent: 6.4,
    winRatePercent: 68.2,
    profitFactor: 2.34,
    totalTrades: 42,
    winningTrades: 29,
    losingTrades: 13,
    overfittingScore: 22, // Low is healthy (0-100)
    equityCurve: [
      { date: 'Sep 01', equity: 500000, benchmark: 500000 },
      { date: 'Sep 08', equity: 524000, benchmark: 508000 },
      { date: 'Sep 15', equity: 519000, benchmark: 498000 },
      { date: 'Sep 22', equity: 558000, benchmark: 512000 },
      { date: 'Sep 29', equity: 592000, benchmark: 535000 },
      { date: 'Oct 05', equity: 724000, benchmark: 591000 },
    ],
    trades: [
      { id: 'T-1', type: 'BUY', entryDate: '2026-10-04 09:30', exitDate: '2026-10-04 14:15', entryPrice: 25010, exitPrice: 25140, pnl: 6500, pnlPercent: 0.52 },
      { id: 'T-2', type: 'BUY', entryDate: '2026-10-03 10:15', exitDate: '2026-10-03 13:45', entryPrice: 24920, exitPrice: 25060, pnl: 7000, pnlPercent: 0.56 },
      { id: 'T-3', type: 'SELL', entryDate: '2026-10-02 11:30', exitDate: '2026-10-02 12:45', entryPrice: 24980, exitPrice: 25010, pnl: -1500, pnlPercent: -0.12 },
    ],
  });

  // Create Bot Modal State
  const [newBotModalOpen, setNewBotModalOpen] = useState(false);
  const [botName, setBotName] = useState('');
  const [botSymbol, setBotSymbol] = useState(selectedQuote.symbol);
  const [botStrategy, setBotStrategy] = useState('EMA 9/21 Crossover + Volume Squeeze');
  const [botMode, setBotMode] = useState<'paper' | 'live'>('paper');
  const [botCapital, setBotCapital] = useState(150000);
  const [botStopLoss, setBotStopLoss] = useState(0.8);
  const [botTakeProfit, setBotTakeProfit] = useState(1.8);
  const [botDailyLoss, setBotDailyLoss] = useState(6000);
  const [botMaxTrades, setBotMaxTrades] = useState(6);

  const handleRunBacktest = () => {
    setIsRunningBacktest(true);
    setTimeout(() => {
      setIsRunningBacktest(false);
      setBacktestResult({
        strategyName: strategyType === 'custom' ? `Custom: ${customIndicatorA} ${customOperator} ${customValue}` : 'EMA 9 / 21 Crossover',
        symbol: backtestSymbol,
        timeframe: backtestTimeframe,
        totalReturnPercent: Math.round((28 + Math.random() * 32) * 10) / 10,
        buyAndHoldPercent: 14.5,
        maxDrawdownPercent: Math.round((4 + Math.random() * 5) * 10) / 10,
        winRatePercent: Math.round((58 + Math.random() * 16) * 10) / 10,
        profitFactor: 2.15,
        totalTrades: 38,
        winningTrades: 25,
        losingTrades: 13,
        overfittingScore: 24,
        equityCurve: [
          { date: 'Sep 01', equity: initialCapital, benchmark: initialCapital },
          { date: 'Sep 08', equity: Math.round(initialCapital * 1.04), benchmark: Math.round(initialCapital * 1.01) },
          { date: 'Sep 15', equity: Math.round(initialCapital * 1.08), benchmark: Math.round(initialCapital * 0.99) },
          { date: 'Sep 22', equity: Math.round(initialCapital * 1.15), benchmark: Math.round(initialCapital * 1.02) },
          { date: 'Oct 05', equity: Math.round(initialCapital * 1.35), benchmark: Math.round(initialCapital * 1.12) },
        ],
        trades: [
          { id: 'T-10', type: 'BUY', entryDate: '2026-10-04', exitDate: '2026-10-04', entryPrice: 25050, exitPrice: 25180, pnl: 6500, pnlPercent: 0.52 },
          { id: 'T-11', type: 'BUY', entryDate: '2026-10-03', exitDate: '2026-10-03', entryPrice: 24950, exitPrice: 25080, pnl: 6500, pnlPercent: 0.52 },
        ],
      });
    }, 900);
  };

  const handleCreateBotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!botName) return;
    createBot({
      name: botName,
      symbol: botSymbol,
      strategy: botStrategy,
      mode: botMode,
      status: 'running',
      allocatedCapital: botCapital,
      maxTradesPerDay: botMaxTrades,
      stopLossPercent: botStopLoss,
      takeProfitPercent: botTakeProfit,
      dailyLossLimit: botDailyLoss,
    });
    setNewBotModalOpen(false);
    setBotName('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] mx-auto space-y-6">
      {/* View Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-500" />
            Systematic Backtesting & Automated Bots
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Test quantitative hypotheses with walk-forward overfitting checks or deploy automated execution bots with risk stops.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('backtest')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'backtest'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Strategy Backtest Engine
          </button>
          <button
            onClick={() => setActiveTab('bots')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'bots'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>Live & Paper Bots</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>
      </div>

      {/* 1. BACKTEST TAB */}
      {activeTab === 'backtest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Configuration & Rule Builder */}
          <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white pb-3 border-b border-neutral-100 dark:border-neutral-800">
              Strategy Setup
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Strategy Template
                </label>
                <select
                  value={strategyType}
                  onChange={(e) => setStrategyType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option value="ema_cross">EMA 9 / 21 Trend Crossover</option>
                  <option value="rsi_reversal">RSI (14) Mean Reversion (30/70)</option>
                  <option value="breakout">Momentum Volume Breakout</option>
                  <option value="custom">No-Code Rule Builder</option>
                </select>
              </div>

              {/* No-Code Rule Builder fields */}
              {strategyType === 'custom' && (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl space-y-2 border border-neutral-200 dark:border-neutral-700">
                  <div className="font-semibold text-neutral-900 dark:text-white">Rule Condition:</div>
                  <div className="grid grid-cols-1 gap-2">
                    <select
                      value={customIndicatorA}
                      onChange={(e) => setCustomIndicatorA(e.target.value)}
                      className="px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs"
                    >
                      <option>RSI (14)</option>
                      <option>SMA (20)</option>
                      <option>Close Price</option>
                      <option>Volume</option>
                    </select>
                    <select
                      value={customOperator}
                      onChange={(e) => setCustomOperator(e.target.value)}
                      className="px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono"
                    >
                      <option value="CROSSES_ABOVE">CROSSES ABOVE</option>
                      <option value="CROSSES_BELOW">CROSSES BELOW</option>
                      <option value="GREATER_THAN">GREATER THAN</option>
                      <option value="LESS_THAN">LESS THAN</option>
                    </select>
                    <input
                      type="text"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      className="px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={backtestSymbol}
                    onChange={(e) => setBacktestSymbol(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Timeframe
                  </label>
                  <select
                    value={backtestTimeframe}
                    onChange={(e) => setBacktestTimeframe(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option>5m</option>
                    <option>15m</option>
                    <option>1H</option>
                    <option>1D</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Starting Test Capital (₹)
                </label>
                <input
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(parseInt(e.target.value) || 100000)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                onClick={handleRunBacktest}
                disabled={isRunningBacktest}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-600 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <BarChart2 className="w-4 h-4" />
                <span>{isRunningBacktest ? 'Simulating Historical Ticks...' : 'Execute Backtest'}</span>
              </button>
            </div>
          </div>

          {/* Right: Results, Metrics & Equity Curve */}
          <div className="lg:col-span-8 space-y-6">
            {backtestResult && (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white font-mono">
                      {backtestResult.strategyName}
                    </h3>
                    <div className="text-xs text-neutral-400 font-mono">
                      {backtestResult.symbol} · {backtestResult.timeframe} · 42 Historical Trades
                    </div>
                  </div>
                  {/* Overfitting Safeguard Badge */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-500 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Overfitting Risk: Low ({backtestResult.overfittingScore}/100)</span>
                  </div>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-400 font-sans">Total Return</div>
                    <div className="text-xl font-bold text-emerald-500 mt-0.5 tabular-nums">
                      +{backtestResult.totalReturnPercent}%
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">vs Buy & Hold +{backtestResult.buyAndHoldPercent}%</div>
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-400 font-sans">Max Drawdown</div>
                    <div className="text-xl font-bold text-rose-500 mt-0.5 tabular-nums">
                      -{backtestResult.maxDrawdownPercent}%
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">Peak-to-trough drop</div>
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-400 font-sans">Win Rate</div>
                    <div className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5 tabular-nums">
                      {backtestResult.winRatePercent}%
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">
                      {backtestResult.winningTrades}W / {backtestResult.losingTrades}L
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-400 font-sans">Profit Factor</div>
                    <div className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5 tabular-nums">
                      {backtestResult.profitFactor}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">Gross Win / Gross Loss</div>
                  </div>
                </div>

                {/* Equity Curve SVG Chart */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-2">
                    <span>PORTFOLIO EQUITY CURVE (₹)</span>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                        <span className="w-2.5 h-0.5 bg-emerald-500 inline-block" /> Strategy Equity
                      </span>
                      <span className="flex items-center gap-1.5 text-neutral-400">
                        <span className="w-2.5 h-0.5 bg-neutral-400 inline-block" /> Benchmark
                      </span>
                    </div>
                  </div>

                  <div className="h-44 w-full bg-neutral-50 dark:bg-neutral-950/60 rounded-xl p-3 border border-neutral-200 dark:border-neutral-800 relative">
                    <svg viewBox="0 0 600 140" className="w-full h-full">
                      {/* Grid */}
                      <line x1="0" y1="35" x2="600" y2="35" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeDasharray="3 3" />
                      <line x1="0" y1="70" x2="600" y2="70" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeDasharray="3 3" />
                      <line x1="0" y1="105" x2="600" y2="105" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeDasharray="3 3" />

                      {/* Benchmark Line */}
                      <path
                        d="M 20 120 L 140 115 L 260 125 L 380 110 L 500 95 L 580 80"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />

                      {/* Strategy Line */}
                      <path
                        d="M 20 120 L 140 100 L 260 105 L 380 75 L 500 50 L 580 15"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Trade Execution Ledger */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-2">
                    Sample Trade Log
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 font-sans">
                          <th className="pb-1.5">Trade ID</th>
                          <th className="pb-1.5">Type</th>
                          <th className="pb-1.5">Entry Date</th>
                          <th className="pb-1.5">Entry</th>
                          <th className="pb-1.5">Exit</th>
                          <th className="pb-1.5 text-right">P&L</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                        {backtestResult.trades.map((tr) => (
                          <tr key={tr.id}>
                            <td className="py-2 text-neutral-400">{tr.id}</td>
                            <td className="py-2 font-bold text-emerald-500">{tr.type}</td>
                            <td className="py-2 text-neutral-500">{tr.entryDate}</td>
                            <td className="py-2">{tr.entryPrice}</td>
                            <td className="py-2">{tr.exitPrice}</td>
                            <td className="py-2 text-right font-bold text-emerald-500">
                              +₹{tr.pnl.toLocaleString()} (+{tr.pnlPercent}%)
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. AUTO-TRADING BOTS TAB */}
      {activeTab === 'bots' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">Active Auto-Trading Bots</h2>
              <p className="text-xs text-neutral-500">
                Independent trading algorithms executing according to strict risk parameters.
              </p>
            </div>
            <button
              onClick={() => {
                if (!checkAccess('bots')) {
                  setLockedFeatureModal({
                    open: true,
                    featureName: 'Automated Trading Bots (5 on Pro, 50 on Enterprise)',
                    requiredPlan: 'pro',
                  });
                  return;
                }
                setNewBotModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Bot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bots.map((bot) => (
              <div
                key={bot.id}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-mono">
                        {bot.name}
                      </h3>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          bot.status === 'running'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {bot.status}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono mt-0.5">
                      {bot.symbol} · {bot.strategy}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleBotStatus(bot.id)}
                      className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                      title={bot.status === 'running' ? 'Pause Bot' : 'Resume Bot'}
                    >
                      {bot.status === 'running' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => deleteBot(bot.id)}
                      className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-500 transition-colors"
                      title="Decommission Bot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Risk Parameters Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                    <div className="text-[10px] text-neutral-400 font-sans">Allocated</div>
                    <div className="font-semibold text-neutral-900 dark:text-white">₹{bot.allocatedCapital.toLocaleString()}</div>
                  </div>
                  <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                    <div className="text-[10px] text-neutral-400 font-sans">Today's P&L</div>
                    <div className={`font-bold ${bot.currentPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {bot.currentPnl >= 0 ? '+' : ''}₹{bot.currentPnl.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                    <div className="text-[10px] text-neutral-400 font-sans">SL / TP</div>
                    <div className="text-neutral-900 dark:text-white">
                      -{bot.stopLossPercent}% / +{bot.takeProfitPercent}%
                    </div>
                  </div>
                  <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                    <div className="text-[10px] text-neutral-400 font-sans">Trades Today</div>
                    <div className="text-neutral-900 dark:text-white">
                      {bot.tradesToday} / {bot.maxTradesPerDay}
                    </div>
                  </div>
                </div>

                {/* Bot Decision Logs */}
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Decision Audit Log
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs font-mono">
                    {bot.decisionLogs.map((log, idx) => (
                      <div key={idx} className="pt-1.5 flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-neutral-400 mr-2">{log.timestamp}</span>
                          <span className="font-bold text-emerald-500 mr-2">[{log.action}]</span>
                          <span className="text-[11px] text-neutral-700 dark:text-neutral-300 font-sans">
                            {log.reason}
                          </span>
                        </div>
                        <span className="text-neutral-400 shrink-0">@{log.price.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Bot Modal */}
      {newBotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-500" /> Create Auto-Trading Bot
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Configure rule logic, allocation capital, and automated daily loss limits.
            </p>

            <form onSubmit={handleCreateBotSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Bot Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIFTY 15m Momentum Engine"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Instrument Symbol
                  </label>
                  <input
                    type="text"
                    value={botSymbol}
                    onChange={(e) => setBotSymbol(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Trading Mode
                  </label>
                  <select
                    value={botMode}
                    onChange={(e) => setBotMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="paper">Paper Simulation</option>
                    <option value="live">Live Broker Route</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Strategy Template
                </label>
                <select
                  value={botStrategy}
                  onChange={(e) => setBotStrategy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option>EMA 9/21 Crossover + Volume Squeeze</option>
                  <option>RSI Oversold Scalper</option>
                  <option>Supertrend Breakout Following</option>
                  <option>Bollinger Band Mean Reverter</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Stop-Loss Cap (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={botStopLoss}
                    onChange={(e) => setBotStopLoss(parseFloat(e.target.value) || 0.5)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Take-Profit Target (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={botTakeProfit}
                    onChange={(e) => setBotTakeProfit(parseFloat(e.target.value) || 1.5)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Max Daily Loss Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={botDailyLoss}
                    onChange={(e) => setBotDailyLoss(parseInt(e.target.value) || 5000)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Max Trades / Day
                  </label>
                  <input
                    type="number"
                    value={botMaxTrades}
                    onChange={(e) => setBotMaxTrades(parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setNewBotModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Deploy Bot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
