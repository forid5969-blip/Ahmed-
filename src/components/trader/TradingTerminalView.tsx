import React, { useState } from 'react';
import {
  Wallet,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Lock,
  CheckCircle2,
  RefreshCw,
  Key,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  PauseCircle,
  PlayCircle,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TradingTerminalView: React.FC = () => {
  const {
    symbols,
    selectedQuote,
    setSelectedSymbol,
    balanceINR,
    balanceUSD,
    positions,
    orders,
    riskSettings,
    updateRiskSettings,
    placeOrder,
    closePosition,
    brokerConnections,
    connectBroker,
    disconnectBroker,
    checkAccess,
    setLockedFeatureModal,
    emergencyKillSwitch,
  } = useApp();

  // Order Entry State
  const [selectedBroker, setSelectedBroker] = useState<'Paper' | 'Zerodha' | 'Alpaca' | 'Binance'>('Paper');
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState(25);
  const [limitPrice, setLimitPrice] = useState(selectedQuote.price.toString());
  const [stopPrice, setStopPrice] = useState((selectedQuote.price * 0.98).toFixed(2));
  const [leverage, setLeverage] = useState(1);

  // Broker Credentials Modal
  const [brokerModal, setBrokerModal] = useState<{ open: boolean; broker: 'zerodha' | 'alpaca' | 'binance' }>({
    open: false,
    broker: 'zerodha',
  });
  const [inputApiKey, setInputApiKey] = useState('');
  const [inputApiSecret, setInputApiSecret] = useState('');

  // Personal Risk settings editor
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [editMaxLoss, setEditMaxLoss] = useState(riskSettings.maxDailyLoss.toString());
  const [editMaxPos, setEditMaxPos] = useState(riskSettings.maxPositionSize.toString());
  const [editTolerance, setEditTolerance] = useState(riskSettings.fatFingerTolerancePercent.toString());

  const currentPrice = selectedQuote.price;
  const executionPrice = orderType === 'LIMIT' ? parseFloat(limitPrice) || currentPrice : currentPrice;
  const estimatedOrderValue = executionPrice * quantity;
  const isINR = selectedQuote.currency === 'INR';
  const availableBalance = isINR ? balanceINR : balanceUSD;

  const handleExecuteOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedBroker !== 'Paper' && !checkAccess('live_trading')) {
      setLockedFeatureModal({
        open: true,
        featureName: 'Live Broker Execution (Zerodha, Alpaca, Binance)',
        requiredPlan: 'pro',
      });
      return;
    }

    placeOrder({
      symbol: selectedQuote.symbol,
      side: orderSide,
      type: orderType,
      quantity,
      price: orderType === 'LIMIT' ? parseFloat(limitPrice) : undefined,
      stopPrice: orderType === 'STOP' || orderType === 'STOP_LIMIT' ? parseFloat(stopPrice) : undefined,
      broker: selectedBroker,
      leverage,
    });
  };

  const handleSaveRiskLimits = (e: React.FormEvent) => {
    e.preventDefault();
    updateRiskSettings({
      maxDailyLoss: parseFloat(editMaxLoss) || 50000,
      maxPositionSize: parseFloat(editMaxPos) || 250000,
      fatFingerTolerancePercent: parseFloat(editTolerance) || 5.0,
    });
    setRiskModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] mx-auto space-y-6">
      {/* Top Trading Account Status & Risk Safeguard Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Paper Balance */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono mb-1">
            <span>VIRTUAL CASH (INR)</span>
            <span className="text-emerald-500 font-semibold">Paper Engine</span>
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
            ₹{balanceINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">₹10 Lakh starting capital allocated</div>
        </div>

        {/* Global Currency Balance */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono mb-1">
            <span>VIRTUAL CASH (USD)</span>
            <span className="text-sky-500 font-semibold">US & Crypto</span>
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
            ${balanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Multi-currency balance support</div>
        </div>

        {/* Open Positions Value & Total Unrealized P&L */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono mb-1">
            <span>UNREALIZED P&L</span>
            <span className="text-neutral-400">{positions.length} Open Positions</span>
          </div>
          {(() => {
            const totalPnl = positions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
            const isPos = totalPnl >= 0;
            return (
              <div
                className={`text-2xl font-bold font-mono tabular-nums ${
                  isPos ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {isPos ? '+' : ''}₹{totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            );
          })()}
          <div className="text-[11px] text-neutral-400 mt-1">Mark-to-market live valuation</div>
        </div>

        {/* Personal Risk & Self-Pause Switch */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-500 font-semibold">SELF-CONTROL SWITCH</span>
            <button
              onClick={() => setRiskModalOpen(true)}
              className="text-[11px] text-emerald-500 hover:text-emerald-400 font-semibold flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" /> Limits
            </button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                {riskSettings.selfPauseActive ? 'Trading Self-Paused' : 'Execution Armed'}
              </div>
              <div className="text-[11px] text-neutral-400">
                Max Daily Loss: ₹{riskSettings.maxDailyLoss.toLocaleString()}
              </div>
            </div>

            <button
              onClick={() =>
                updateRiskSettings({ selfPauseActive: !riskSettings.selfPauseActive })
              }
              className={`p-2 rounded-xl transition-colors ${
                riskSettings.selfPauseActive
                  ? 'bg-amber-500/20 text-amber-500'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
              title={riskSettings.selfPauseActive ? 'Deactivate Self-Pause' : 'Activate Self-Pause'}
            >
              {riskSettings.selfPauseActive ? (
                <PauseCircle className="w-6 h-6 animate-pulse" />
              ) : (
                <PlayCircle className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Trading Floor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Comprehensive Order Entry Widget */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-500" />
              Order Entry Desk
            </h2>
            <div className="text-xs font-mono font-semibold text-neutral-900 dark:text-white">
              {selectedQuote.symbol} · {selectedQuote.currency === 'INR' ? '₹' : '$'}
              {selectedQuote.price.toFixed(2)}
            </div>
          </div>

          <form onSubmit={handleExecuteOrder} className="space-y-4 text-xs">
            {/* Account Selector (Paper vs Live Brokers) */}
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1.5">
                Execution Routing
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'Paper', label: 'Paper Simulator' },
                  { id: 'Zerodha', label: 'Zerodha (Kite)' },
                  { id: 'Alpaca', label: 'Alpaca (US)' },
                  { id: 'Binance', label: 'Binance' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      if (b.id !== 'Paper' && !checkAccess('live_trading')) {
                        setLockedFeatureModal({
                          open: true,
                          featureName: 'Live Broker Execution',
                          requiredPlan: 'pro',
                        });
                        return;
                      }
                      setSelectedBroker(b.id as any);
                    }}
                    className={`py-2 px-1 text-center rounded-lg border text-[11px] font-medium transition-all ${
                      selectedBroker === b.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              <button
                type="button"
                onClick={() => setOrderSide('BUY')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  orderSide === 'BUY'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                BUY / LONG
              </button>
              <button
                type="button"
                onClick={() => setOrderSide('SELL')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  orderSide === 'SELL'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                SELL / SHORT
              </button>
            </div>

            {/* Order Type Selector */}
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                Order Type
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setOrderType(t)}
                    className={`py-1.5 text-[11px] rounded-md border font-mono transition-colors ${
                      orderType === t
                        ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Leverage / Margin
                </label>
                <select
                  value={leverage}
                  onChange={(e) => setLeverage(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option value={1}>1x (Delivery / Cash)</option>
                  <option value={2}>2x (MIS Margin)</option>
                  <option value={5}>5x (Intraday Bracket)</option>
                </select>
              </div>
            </div>

            {/* Limit Price Input */}
            {orderType === 'LIMIT' && (
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Limit Price ({selectedQuote.currency === 'INR' ? '₹' : '$'})
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Stop Price Input */}
            {(orderType === 'STOP' || orderType === 'STOP_LIMIT') && (
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Trigger Stop Price ({selectedQuote.currency === 'INR' ? '₹' : '$'})
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>
            )}

            {/* Financial Estimates & Safety Summary */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl space-y-1.5 border border-neutral-200 dark:border-neutral-800 font-mono text-[11px]">
              <div className="flex justify-between text-neutral-500">
                <span>Order Notional Value:</span>
                <span className="text-neutral-900 dark:text-white font-semibold">
                  {selectedQuote.currency === 'INR' ? '₹' : '$'}
                  {estimatedOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Margin Required ({leverage}x):</span>
                <span className="text-neutral-900 dark:text-white font-semibold">
                  {selectedQuote.currency === 'INR' ? '₹' : '$'}
                  {(estimatedOrderValue / leverage).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Fat-Finger Guard:</span>
                <span className="text-emerald-500 flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3 h-3" /> ±{riskSettings.fatFingerTolerancePercent}% Threshold Active
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={emergencyKillSwitch || riskSettings.selfPauseActive}
              className={`w-full py-3 rounded-xl text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                orderSide === 'BUY'
                  ? 'bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-600'
                  : 'bg-rose-600 hover:bg-rose-500 disabled:bg-neutral-600'
              }`}
            >
              <span>
                Place {orderSide} Order on {selectedBroker}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Connected Brokers Bar & Zero-Knowledge Security Notice */}
          <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-neutral-400" />
                Live Broker Integrations
              </span>
              <span className="text-[10px] text-neutral-400">Zero-Knowledge Key Vault</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              {(['zerodha', 'alpaca', 'binance'] as const).map((b) => (
                <div
                  key={b}
                  className="p-2 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold capitalize">{b}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        brokerConnections[b] ? 'bg-emerald-500' : 'bg-neutral-400'
                      }`}
                    />
                  </div>
                  <div className="mt-1 text-[10px] text-neutral-400">
                    {brokerConnections[b] ? 'Encrypted & Linked' : 'Not Connected'}
                  </div>
                  <button
                    onClick={() => {
                      if (!brokerConnections[b]) {
                        setBrokerModal({ open: true, broker: b });
                      } else {
                        disconnectBroker(b);
                      }
                    }}
                    className="mt-2 text-[10px] text-emerald-500 hover:underline text-left font-medium"
                  >
                    {brokerConnections[b] ? 'Disconnect' : 'Connect API'}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-3 leading-tight">
              Security Guarantee: Broker API keys are stored with hardware-level envelope encryption. Nobody—including Tickerline staff, support, or Super Admins—can ever read back or decrypt your API secrets.
            </p>
          </div>
        </div>

        {/* Right: Open Positions & Order History Ledgers */}
        <div className="lg:col-span-7 space-y-6">
          {/* Open Positions Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Open Positions ({positions.length})</span>
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono">Live Mark-to-Market</span>
            </div>

            {positions.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400">
                No active open positions. Place an order on the left to initialize a simulated or live position.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 font-sans">
                      <th className="pb-2">Symbol</th>
                      <th className="pb-2">Side</th>
                      <th className="pb-2">Qty</th>
                      <th className="pb-2">Avg Entry</th>
                      <th className="pb-2">LTP</th>
                      <th className="pb-2">P&L</th>
                      <th className="pb-2">Broker</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                    {positions.map((pos) => {
                      const isProfit = pos.unrealizedPnl >= 0;
                      return (
                        <tr key={pos.symbol} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                          <td className="py-2.5 font-bold text-neutral-900 dark:text-white">{pos.symbol}</td>
                          <td className="py-2.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                pos.side === 'LONG'
                                  ? 'bg-emerald-500/20 text-emerald-500'
                                  : 'bg-rose-500/20 text-rose-500'
                              }`}
                            >
                              {pos.side}
                            </span>
                          </td>
                          <td className="py-2.5 tabular-nums">{pos.quantity}</td>
                          <td className="py-2.5 tabular-nums">{pos.avgEntryPrice.toFixed(2)}</td>
                          <td className="py-2.5 tabular-nums font-semibold text-neutral-900 dark:text-white">
                            {pos.currentPrice.toFixed(2)}
                          </td>
                          <td className={`py-2.5 tabular-nums font-bold ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isProfit ? '+' : ''}
                            {pos.unrealizedPnl.toFixed(2)} ({pos.unrealizedPnlPercent.toFixed(2)}%)
                          </td>
                          <td className="py-2.5 text-[11px] text-neutral-400">{pos.broker}</td>
                          <td className="py-2.5 text-right font-sans">
                            <button
                              onClick={() => closePosition(pos.symbol)}
                              className="px-2.5 py-1 bg-neutral-200 dark:bg-neutral-800 hover:bg-rose-500/20 hover:text-rose-400 text-neutral-700 dark:text-neutral-300 rounded text-[11px] transition-colors"
                            >
                              Close
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Working Orders & History Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Order Execution History</h3>
              <span className="text-[11px] text-neutral-400 font-mono">Risk Checks Verified</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 font-sans">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Symbol</th>
                    <th className="pb-2">Side</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Risk Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                      <td className="py-2.5 text-neutral-400">{ord.id}</td>
                      <td className="py-2.5 font-bold text-neutral-900 dark:text-white">{ord.symbol}</td>
                      <td className="py-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            ord.side === 'BUY'
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : 'bg-rose-500/20 text-rose-500'
                          }`}
                        >
                          {ord.side}
                        </span>
                      </td>
                      <td className="py-2.5 text-neutral-400">{ord.type}</td>
                      <td className="py-2.5 tabular-nums">{ord.quantity}</td>
                      <td className="py-2.5 tabular-nums font-semibold">{ord.price.toFixed(2)}</td>
                      <td className="py-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-medium">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-neutral-400 text-[10px]">
                        <span className="text-emerald-500 flex items-center gap-1 font-sans">
                          <CheckCircle2 className="w-3 h-3" /> Passed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Broker Key Connection Modal */}
      {brokerModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1 capitalize flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-500" /> Connect {brokerModal.broker} Account
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Enter your developer API credentials. Keys are encrypted client-side before transmission and cannot be viewed by platform staff.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  API Key / App Key
                </label>
                <input
                  type="text"
                  placeholder="e.g. zerd_live_apikey_9941"
                  value={inputApiKey}
                  onChange={(e) => setInputApiKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  API Secret
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••"
                  value={inputApiSecret}
                  onChange={(e) => setInputApiSecret(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[11px] text-neutral-500 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-neutral-900 dark:text-white">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" /> Tamper-Proof Cryptography
                </div>
                <div>Your key never leaves the encrypted enclave. You can revoke it anytime.</div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setBrokerModal({ open: false, broker: 'zerodha' })}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    connectBroker(brokerModal.broker, inputApiKey, inputApiSecret);
                    setBrokerModal({ open: false, broker: 'zerodha' });
                    setInputApiKey('');
                    setInputApiSecret('');
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Encrypt & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Risk Settings Modal */}
      {riskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-500" /> Personal Risk Management Limits
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Hard constraints to safeguard your capital against catastrophic drawdowns and accidental execution mistakes.
            </p>

            <form onSubmit={handleSaveRiskLimits} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Max Daily Loss Cap (₹)
                </label>
                <input
                  type="number"
                  value={editMaxLoss}
                  onChange={(e) => setEditMaxLoss(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
                <span className="text-[10px] text-neutral-400">Order routing halts if daily loss breaches this value.</span>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Max Single Position Size (₹)
                </label>
                <input
                  type="number"
                  value={editMaxPos}
                  onChange={(e) => setEditMaxPos(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Fat-Finger Price Deviation Threshold (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={editTolerance}
                  onChange={(e) => setEditTolerance(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
                <span className="text-[10px] text-neutral-400">Rejects limit orders placed too far from prevailing market.</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRiskModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Save Safety Rules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
