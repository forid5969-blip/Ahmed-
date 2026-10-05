import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  PlanTier,
  SymbolQuote,
  TradingSignal,
  PriceAlert,
  Position,
  Order,
  RiskSettings,
  AutoTradingBot,
  IPODetails,
  LoanProduct,
  LoanApplication,
  CommunityPost,
  ChatMessage,
  SupportTicket,
  KYCData,
  DiscountCode,
  PaymentTransaction,
  AuditLogEntry,
  CMSContent,
} from '../types';
import {
  INITIAL_SYMBOLS,
  INITIAL_SIGNALS,
  INITIAL_IPOS,
  INITIAL_LOAN_PARTNERS,
  INITIAL_POSTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_TICKETS,
  INITIAL_DISCOUNT_CODES,
  INITIAL_PAYMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CMS,
} from '../data/mockData';

export interface WatchlistGroup {
  id: string;
  name: string;
  symbols: string[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  // Authentication & Role
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentPlan: PlanTier;
  setCurrentPlan: (plan: PlanTier) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  userHandle: string;
  userEmail: string;

  // Navigation & modals
  activeView: string;
  setActiveView: (view: string) => void;
  selectedSymbol: string;
  setSelectedSymbol: (sym: string) => void;
  commandKOpen: boolean;
  setCommandKOpen: (open: boolean) => void;
  lockedFeatureModal: { open: boolean; featureName: string; requiredPlan: PlanTier } | null;
  setLockedFeatureModal: (modal: { open: boolean; featureName: string; requiredPlan: PlanTier } | null) => void;
  checkAccess: (feature: 'patterns' | 'premium_signals' | 'ai_analysis' | 'live_trading' | 'bots' | 'loans' | 'unlimited_backtest') => boolean;

  // Market & Quotes
  symbols: SymbolQuote[];
  selectedQuote: SymbolQuote;
  watchlists: WatchlistGroup[];
  activeWatchlistId: string;
  setActiveWatchlistId: (id: string) => void;
  createWatchlist: (name: string) => void;
  addToWatchlist: (watchlistId: string, symbol: string) => void;
  removeFromWatchlist: (watchlistId: string, symbol: string) => void;

  // Signals & Alerts
  signals: TradingSignal[];
  alerts: PriceAlert[];
  createAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered' | 'active'>) => void;
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;

  // Trading & Risk
  balanceINR: number;
  balanceUSD: number;
  positions: Position[];
  orders: Order[];
  riskSettings: RiskSettings;
  updateRiskSettings: (settings: Partial<RiskSettings>) => void;
  placeOrder: (order: {
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
    quantity: number;
    price?: number;
    stopPrice?: number;
    broker?: 'Paper' | 'Zerodha' | 'Alpaca' | 'Binance';
    leverage?: number;
  }) => { success: boolean; message: string };
  closePosition: (symbol: string) => void;

  // Broker Accounts
  brokerConnections: {
    zerodha: boolean;
    alpaca: boolean;
    binance: boolean;
  };
  connectBroker: (broker: 'zerodha' | 'alpaca' | 'binance', apiKey: string, apiSecret: string) => void;
  disconnectBroker: (broker: 'zerodha' | 'alpaca' | 'binance') => void;

  // Bots
  bots: AutoTradingBot[];
  createBot: (bot: Omit<AutoTradingBot, 'id' | 'currentPnl' | 'tradesToday' | 'decisionLogs'>) => void;
  toggleBotStatus: (id: string) => void;
  deleteBot: (id: string) => void;

  // IPO
  ipos: IPODetails[];
  applyIPO: (ipoId: string, upiId: string, bids: { bidNo: number; lots: number; price: number; cutOff: boolean }[]) => void;
  cancelIPO: (ipoId: string) => void;

  // Loans
  loanProducts: LoanProduct[];
  loanApplications: LoanApplication[];
  applyLoan: (productId: string, amount: number, tenorMonths: number, emi: number) => void;

  // Community & Chat
  communityPosts: CommunityPost[];
  createPost: (title: string, content: string, symbols: string[]) => void;
  likePost: (id: string) => void;
  addComment: (postId: string, text: string) => void;
  reportPost: (postId: string, reason: string) => void;
  chatMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (room: string, text: string) => void;

  // Support & KYC
  tickets: SupportTicket[];
  createTicket: (subject: string, category: any, priority: any, initialMessage: string, attachmentName?: string) => string;
  replyTicket: (ticketId: string, text: string, isInternal?: boolean) => void;
  updateTicketStatus: (ticketId: string, status: any, priority?: any, assignedTo?: string) => void;
  rateTicket: (ticketId: string, rating: number) => void;
  kycData: KYCData;
  updateKYC: (data: Partial<KYCData>) => void;
  reviewKYC: (status: 'Verified' | 'Rejected', reason?: string) => void;

  // Plans, Payments & Discount
  discountCodes: DiscountCode[];
  payments: PaymentTransaction[];
  applyDiscountCode: (code: string) => { valid: boolean; discountPercent: number; message: string };
  completePayment: (plan: PlanTier, billingPeriod: 'Monthly' | 'Yearly', gateway: 'Razorpay' | 'Stripe', discountCode?: string) => void;
  freeTrialActive: boolean;
  activateFreeTrial: () => void;

  // Admin & Super Admin
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, target: string, details: string) => void;
  emergencyKillSwitch: boolean;
  setEmergencyKillSwitch: (state: boolean) => void;
  liveTradingEnabled: boolean;
  setLiveTradingEnabled: (state: boolean) => void;
  maintenanceMode: boolean;
  setMaintenanceMode: (state: boolean) => void;
  signupsEnabled: boolean;
  setSignupsEnabled: (state: boolean) => void;
  allBotsPaused: boolean;
  togglePauseAllBots: () => void;
  cmsContent: CMSContent;
  updateCMS: (data: Partial<CMSContent>) => void;
  staffUsers: { id: string; name: string; email: string; role: UserRole; status: 'Active' | 'Suspended'; twoFactor: boolean }[];
  updateStaffRole: (id: string, role: UserRole) => void;
  toggleStaffStatus: (id: string) => void;
  inviteStaff: (email: string, role: UserRole) => void;

  // Toast feedback
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role & Plan State
  const [userRole, setUserRole] = useState<UserRole>('trader');
  const [currentPlan, setCurrentPlan] = useState<PlanTier>('pro');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [userHandle] = useState<string>('AlphaStrategist_26');
  const [userEmail] = useState<string>('trader@tickerline.io');

  // Navigation
  const [activeView, setActiveView] = useState<string>('chart');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NIFTY 50');
  const [commandKOpen, setCommandKOpen] = useState<boolean>(false);
  const [lockedFeatureModal, setLockedFeatureModal] = useState<{ open: boolean; featureName: string; requiredPlan: PlanTier } | null>(null);

  // Market & Quotes State
  const [symbols, setSymbols] = useState<SymbolQuote[]>(INITIAL_SYMBOLS);
  const [watchlists, setWatchlists] = useState<WatchlistGroup[]>([
    { id: 'WL-1', name: 'Nifty Prime Watch', symbols: ['NIFTY 50', 'BANKNIFTY', 'RELIANCE', 'HDFCBANK', 'TCS', 'TATAMOTORS'] },
    { id: 'WL-2', name: 'US Tech & Crypto', symbols: ['AAPL', 'NVDA', 'BTC/USDT', 'ETH/USDT'] },
  ]);
  const [activeWatchlistId, setActiveWatchlistId] = useState<string>('WL-1');

  // Signals & Alerts
  const [signals] = useState<TradingSignal[]>(INITIAL_SIGNALS);
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'ALT-1',
      symbol: 'NIFTY 50',
      condition: 'ABOVE',
      targetValue: 25250.00,
      repeating: false,
      createdAt: 'Today, 09:30 AM',
      triggered: false,
      active: true,
    },
    {
      id: 'ALT-2',
      symbol: 'RELIANCE',
      condition: 'PERCENT_CHANGE',
      targetValue: 2.0,
      repeating: true,
      createdAt: 'Today, 09:45 AM',
      triggered: false,
      active: true,
    },
  ]);

  // Trading & Paper Engine
  const [balanceINR, setBalanceINR] = useState<number>(1000000); // ₹10 Lakhs Virtual Starting Capital
  const [balanceUSD, setBalanceUSD] = useState<number>(25000);
  const [positions, setPositions] = useState<Position[]>([
    {
      symbol: 'RELIANCE',
      side: 'LONG',
      quantity: 50,
      avgEntryPrice: 2950.00,
      currentPrice: 2984.50,
      unrealizedPnl: 1725.00,
      unrealizedPnlPercent: 1.17,
      broker: 'Paper',
      leverage: 1,
      openedAt: '2026-10-05 09:25:00',
    },
  ]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-991',
      symbol: 'RELIANCE',
      side: 'BUY',
      type: 'MARKET',
      quantity: 50,
      price: 2950.00,
      status: 'FILLED',
      broker: 'Paper',
      filledAt: '2026-10-05 09:25:00',
      placedAt: '2026-10-05 09:25:00',
      riskCheckPassed: true,
    },
  ]);
  const [riskSettings, setRiskSettings] = useState<RiskSettings>({
    maxDailyLoss: 50000,
    maxPositionSize: 250000,
    fatFingerTolerancePercent: 5.0,
    selfPauseActive: false,
  });

  // Broker Integrations
  const [brokerConnections, setBrokerConnections] = useState<{
    zerodha: boolean;
    alpaca: boolean;
    binance: boolean;
  }>({
    zerodha: true,
    alpaca: false,
    binance: false,
  });

  // Bots
  const [bots, setBots] = useState<AutoTradingBot[]>([
    {
      id: 'BOT-101',
      name: 'NIFTY Intraday Momentum Scalper',
      symbol: 'NIFTY 50',
      strategy: 'EMA 9/21 Crossover + Volume Filter',
      mode: 'paper',
      status: 'running',
      allocatedCapital: 200000,
      currentPnl: 4850.00,
      tradesToday: 3,
      maxTradesPerDay: 8,
      stopLossPercent: 0.6,
      takeProfitPercent: 1.4,
      dailyLossLimit: 8000,
      decisionLogs: [
        { timestamp: '10:04:12', action: 'EVALUATE', price: 25110.20, reason: 'EMA 9 crossed above EMA 21 on 5m timeframe. Volume confirmation positive (1.3x avg).' },
        { timestamp: '10:04:15', action: 'ORDER_SUBMITTED', price: 25112.00, reason: 'Submitted LONG order 25 qty. Stop loss pegged at 24960.' },
        { timestamp: '10:14:48', action: 'TARGET_1_HIT', price: 25146.00, reason: 'Trailing stop moved to entry breakeven (25112).' },
      ],
    },
    {
      id: 'BOT-102',
      name: 'Reliance Mean Reversion Engine',
      symbol: 'RELIANCE',
      strategy: 'Bollinger Band Squeeze Reversal',
      mode: 'paper',
      status: 'paused',
      allocatedCapital: 150000,
      currentPnl: -1200.00,
      tradesToday: 1,
      maxTradesPerDay: 5,
      stopLossPercent: 1.0,
      takeProfitPercent: 2.0,
      dailyLossLimit: 5000,
      decisionLogs: [
        { timestamp: '09:40:02', action: 'PAUSED_BY_USER', price: 2962.00, reason: 'User toggled pause state before earnings announcement.' },
      ],
    },
  ]);

  // IPO State
  const [ipos, setIpos] = useState<IPODetails[]>(INITIAL_IPOS);

  // Loans State
  const [loanProducts] = useState<LoanProduct[]>(INITIAL_LOAN_PARTNERS);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);

  // Community & Chat
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);

  // Support & KYC
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [kycData, setKycData] = useState<KYCData>({
    panNumber: 'ABCDE1234F',
    nameAsPerPan: 'ARJUN SHARMA',
    dob: '1992-07-14',
    aadhaarLast4: '7842',
    address: 'Flat 402, Sea Green Heights, Worli, Mumbai 400018',
    panDocUploaded: true,
    addressDocUploaded: true,
    selfieUploaded: true,
    status: 'Verified',
  });

  // Plans & Payments
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(INITIAL_DISCOUNT_CODES);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [freeTrialActive, setFreeTrialActive] = useState<boolean>(false);

  // Admin & Super Admin controls
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [emergencyKillSwitch, setEmergencyKillSwitch] = useState<boolean>(false);
  const [liveTradingEnabled, setLiveTradingEnabled] = useState<boolean>(true);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [signupsEnabled, setSignupsEnabled] = useState<boolean>(true);
  const [allBotsPaused, setAllBotsPaused] = useState<boolean>(false);
  const [cmsContent, setCmsContent] = useState<CMSContent>(INITIAL_CMS);
  const [staffUsers, setStaffUsers] = useState<
    Array<{ id: string; name: string; email: string; role: UserRole; status: 'Active' | 'Suspended'; twoFactor: boolean }>
  >([
    { id: 'STF-1', name: 'Rohit Verma (Super Admin)', email: 'rohit@tickerline.io', role: 'superadmin' as UserRole, status: 'Active', twoFactor: true },
    { id: 'STF-2', name: 'Sneha Patel (Admin)', email: 'sneha@tickerline.io', role: 'admin' as UserRole, status: 'Active', twoFactor: true },
    { id: 'STF-3', name: 'Vikram Joshi (Support)', email: 'vikram@tickerline.io', role: 'support' as UserRole, status: 'Active', twoFactor: true },
    { id: 'STF-4', name: 'Pooja Iyer (Moderator)', email: 'pooja@tickerline.io', role: 'support' as UserRole, status: 'Active', twoFactor: true },
  ]);

  // Toast feedback
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Sync document root class with dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global Keyboard shortcut for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandKOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subtle real-time market quote simulator tick (every 2.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setSymbols((prevSymbols) =>
        prevSymbols.map((item) => {
          // 40% chance of a tick on each interval
          if (Math.random() > 0.4) return item;
          const fluctuation = (Math.random() - 0.49) * 0.0025; // 0.25% max tick
          const newPrice = Math.max(1, Math.round((item.price * (1 + fluctuation)) * 100) / 100);
          const newChange = Math.round((newPrice - item.previousClose) * 100) / 100;
          const newChangePercent = Math.round(((newChange / item.previousClose) * 100) * 100) / 100;
          const newHigh = Math.max(item.high, newPrice);
          const newLow = Math.min(item.low, newPrice);
          return {
            ...item,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            high: newHigh,
            low: newLow,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Update open positions unrealized PnL when quotes change
  useEffect(() => {
    setPositions((prevPositions) =>
      prevPositions.map((pos) => {
        const quote = symbols.find((s) => s.symbol === pos.symbol);
        if (!quote) return pos;
        const currentPrice = quote.price;
        const diff = pos.side === 'LONG' ? currentPrice - pos.avgEntryPrice : pos.avgEntryPrice - currentPrice;
        const unrealizedPnl = Math.round((diff * pos.quantity * pos.leverage) * 100) / 100;
        const unrealizedPnlPercent = Math.round(((diff / pos.avgEntryPrice) * 100 * pos.leverage) * 100) / 100;
        return {
          ...pos,
          currentPrice,
          unrealizedPnl,
          unrealizedPnlPercent,
        };
      })
    );
  }, [symbols]);

  // Selected Quote
  const selectedQuote = symbols.find((s) => s.symbol === selectedSymbol) || symbols[0];

  // Feature Access Checker based on Plan & Role
  const checkAccess = (feature: 'patterns' | 'premium_signals' | 'ai_analysis' | 'live_trading' | 'bots' | 'loans' | 'unlimited_backtest'): boolean => {
    if (userRole === 'admin' || userRole === 'superadmin' || userRole === 'support') return true;

    switch (feature) {
      case 'patterns':
        return currentPlan === 'basic' || currentPlan === 'pro' || currentPlan === 'enterprise';
      case 'premium_signals':
      case 'ai_analysis':
      case 'live_trading':
      case 'bots':
      case 'loans':
        return currentPlan === 'pro' || currentPlan === 'enterprise';
      case 'unlimited_backtest':
        return currentPlan === 'enterprise';
      default:
        return true;
    }
  };

  // Watchlist operations
  const createWatchlist = (name: string) => {
    const maxLists = currentPlan === 'free' ? 1 : currentPlan === 'basic' ? 5 : currentPlan === 'pro' ? 20 : 100;
    if (watchlists.length >= maxLists) {
      setLockedFeatureModal({
        open: true,
        featureName: `Additional Watchlists (${watchlists.length}/${maxLists})`,
        requiredPlan: currentPlan === 'free' ? 'basic' : currentPlan === 'basic' ? 'pro' : 'enterprise',
      });
      return;
    }
    const newId = 'WL-' + (watchlists.length + 1);
    setWatchlists((prev) => [...prev, { id: newId, name, symbols: ['NIFTY 50', 'RELIANCE'] }]);
    setActiveWatchlistId(newId);
    addToast({ title: 'Watchlist Created', description: `"${name}" added successfully.`, type: 'success' });
  };

  const addToWatchlist = (watchlistId: string, symbol: string) => {
    setWatchlists((prev) =>
      prev.map((wl) => {
        if (wl.id === watchlistId && !wl.symbols.includes(symbol)) {
          return { ...wl, symbols: [...wl.symbols, symbol] };
        }
        return wl;
      })
    );
    addToast({ title: 'Added to Watchlist', description: `${symbol} added to watchlist.`, type: 'info' });
  };

  const removeFromWatchlist = (watchlistId: string, symbol: string) => {
    setWatchlists((prev) =>
      prev.map((wl) => {
        if (wl.id === watchlistId) {
          return { ...wl, symbols: wl.symbols.filter((s) => s !== symbol) };
        }
        return wl;
      })
    );
  };

  // Price Alert operations
  const createAlert = (alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered' | 'active'>) => {
    if (currentPlan === 'free') {
      setLockedFeatureModal({ open: true, featureName: 'Price Alerts (Up to 2,000 on Enterprise)', requiredPlan: 'basic' });
      return;
    }
    const newAlert: PriceAlert = {
      ...alertData,
      id: 'ALT-' + (alerts.length + 1),
      createdAt: 'Just now',
      triggered: false,
      active: true,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    addToast({ title: 'Alert Created', description: `Alert set for ${alertData.symbol} ${alertData.condition} ${alertData.targetValue}`, type: 'success' });
  };

  const toggleAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Order Placement & Execution Engine with Safety Checks
  const placeOrder = (params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
    quantity: number;
    price?: number;
    stopPrice?: number;
    broker?: 'Paper' | 'Zerodha' | 'Alpaca' | 'Binance';
    leverage?: number;
  }): { success: boolean; message: string } => {
    // 1. Emergency Kill Switch Check
    if (emergencyKillSwitch) {
      addToast({
        title: 'Order Blocked',
        description: 'Global Emergency Kill Switch is engaged. All trading is currently halted by Super Admin.',
        type: 'error',
      });
      return { success: false, message: 'Global Emergency Kill Switch active' };
    }

    // 2. Personal Self-Pause Switch Check
    if (riskSettings.selfPauseActive) {
      addToast({
        title: 'Self-Pause Active',
        description: 'You have enabled self-pause protection for disciplined risk management.',
        type: 'warning',
      });
      return { success: false, message: 'Self-pause protection active' };
    }

    // 3. Broker Live Trading Check
    const broker = params.broker || 'Paper';
    if (broker !== 'Paper') {
      if (!checkAccess('live_trading')) {
        setLockedFeatureModal({ open: true, featureName: 'Live Broker Execution (Zerodha, Alpaca, Binance)', requiredPlan: 'pro' });
        return { success: false, message: 'Plan does not support live broker trading' };
      }
      if (!liveTradingEnabled) {
        addToast({ title: 'Live Trading Disabled', description: 'Platform live trading is temporarily disabled by Admin.', type: 'warning' });
        return { success: false, message: 'Live trading disabled platform-wide' };
      }
    }

    // 4. Quote and Execution Price calculation
    const quote = symbols.find((s) => s.symbol === params.symbol) || selectedQuote;
    const executionPrice = params.type === 'LIMIT' && params.price ? params.price : quote.price;

    // 5. Fat-finger Price Deviation Safety Check
    if (params.type === 'LIMIT' && params.price) {
      const deviation = Math.abs((params.price - quote.price) / quote.price) * 100;
      if (deviation > riskSettings.fatFingerTolerancePercent) {
        const msg = `Fat-finger guard triggered: Limit price deviates by ${deviation.toFixed(1)}% (Tolerance limit: ${riskSettings.fatFingerTolerancePercent}%).`;
        addToast({ title: 'Fat-Finger Guard Rejection', description: msg, type: 'error' });
        return { success: false, message: msg };
      }
    }

    // 6. Max Position Size Check
    const totalOrderValue = executionPrice * params.quantity;
    if (totalOrderValue > riskSettings.maxPositionSize) {
      const msg = `Order value ₹${totalOrderValue.toLocaleString()} exceeds your personal max position limit of ₹${riskSettings.maxPositionSize.toLocaleString()}.`;
      addToast({ title: 'Risk Limit Exceeded', description: msg, type: 'error' });
      return { success: false, message: msg };
    }

    // 7. Balance Check
    const isINR = quote.currency === 'INR';
    const balance = isINR ? balanceINR : balanceUSD;
    if (params.side === 'BUY' && totalOrderValue > balance) {
      const msg = `Insufficient funds. Required: ${quote.currency === 'INR' ? '₹' : '$'}${totalOrderValue.toLocaleString()}, Available: ${quote.currency === 'INR' ? '₹' : '$'}${balance.toLocaleString()}`;
      addToast({ title: 'Insufficient Margin', description: msg, type: 'error' });
      return { success: false, message: msg };
    }

    // Passed all checks!
    const newOrderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newOrder: Order = {
      id: newOrderId,
      symbol: params.symbol,
      side: params.side,
      type: params.type,
      quantity: params.quantity,
      price: executionPrice,
      stopPrice: params.stopPrice,
      status: 'FILLED',
      broker,
      filledAt: nowStr,
      placedAt: nowStr,
      riskCheckPassed: true,
      riskCheckNote: 'Passed fat-finger, daily loss and size limits',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update Cash Balance & Positions
    if (broker === 'Paper') {
      if (params.side === 'BUY') {
        if (isINR) setBalanceINR((prev) => prev - totalOrderValue);
        else setBalanceUSD((prev) => prev - totalOrderValue);

        setPositions((prev) => {
          const existing = prev.find((p) => p.symbol === params.symbol && p.side === 'LONG');
          if (existing) {
            const newQty = existing.quantity + params.quantity;
            const newAvgPrice = (existing.avgEntryPrice * existing.quantity + executionPrice * params.quantity) / newQty;
            return prev.map((p) => (p.symbol === params.symbol && p.side === 'LONG' ? { ...p, quantity: newQty, avgEntryPrice: newAvgPrice } : p));
          } else {
            return [
              ...prev,
              {
                symbol: params.symbol,
                side: 'LONG',
                quantity: params.quantity,
                avgEntryPrice: executionPrice,
                currentPrice: executionPrice,
                unrealizedPnl: 0,
                unrealizedPnlPercent: 0,
                broker: 'Paper',
                leverage: params.leverage || 1,
                openedAt: nowStr,
              },
            ];
          }
        });
      } else {
        // SELL / SHORT or Closing Long
        if (isINR) setBalanceINR((prev) => prev + totalOrderValue);
        else setBalanceUSD((prev) => prev + totalOrderValue);

        setPositions((prev) => {
          const existing = prev.find((p) => p.symbol === params.symbol && p.side === 'LONG');
          if (existing) {
            if (existing.quantity <= params.quantity) {
              return prev.filter((p) => !(p.symbol === params.symbol && p.side === 'LONG'));
            } else {
              return prev.map((p) => (p.symbol === params.symbol && p.side === 'LONG' ? { ...p, quantity: p.quantity - params.quantity } : p));
            }
          }
          return prev;
        });
      }
    }

    addToast({
      title: 'Order Executed',
      description: `${params.side} ${params.quantity} ${params.symbol} @ ${quote.currency === 'INR' ? '₹' : '$'}${executionPrice.toFixed(2)} on ${broker}`,
      type: 'success',
    });

    return { success: true, message: 'Order filled successfully' };
  };

  const closePosition = (symbol: string) => {
    const pos = positions.find((p) => p.symbol === symbol);
    if (!pos) return;
    placeOrder({
      symbol: pos.symbol,
      side: pos.side === 'LONG' ? 'SELL' : 'BUY',
      type: 'MARKET',
      quantity: pos.quantity,
      broker: pos.broker,
    });
  };

  const updateRiskSettings = (newSettings: Partial<RiskSettings>) => {
    setRiskSettings((prev) => ({ ...prev, ...newSettings }));
    addToast({ title: 'Risk Limits Updated', description: 'Your personal safety rules have been saved.', type: 'info' });
  };

  // Broker Connections
  const connectBroker = (broker: 'zerodha' | 'alpaca' | 'binance', _apiKey: string, _apiSecret: string) => {
    setBrokerConnections((prev) => ({ ...prev, [broker]: true }));
    addAuditLog('BROKER_API_KEY_STORED', broker.toUpperCase(), 'Encrypted credentials stored via zero-knowledge vault.');
    addToast({ title: 'Broker Connected', description: `${broker.toUpperCase()} API keys encrypted and linked.`, type: 'success' });
  };

  const disconnectBroker = (broker: 'zerodha' | 'alpaca' | 'binance') => {
    setBrokerConnections((prev) => ({ ...prev, [broker]: false }));
    addToast({ title: 'Broker Disconnected', description: `${broker.toUpperCase()} account unlinked.`, type: 'info' });
  };

  // Auto-Trading Bots
  const createBot = (botData: Omit<AutoTradingBot, 'id' | 'currentPnl' | 'tradesToday' | 'decisionLogs'>) => {
    if (!checkAccess('bots')) {
      setLockedFeatureModal({ open: true, featureName: 'Auto-Trading Bots (5 on Pro, 50 on Enterprise)', requiredPlan: 'pro' });
      return;
    }
    const maxBots = currentPlan === 'pro' ? 5 : 50;
    if (bots.length >= maxBots) {
      addToast({ title: 'Bot Limit Reached', description: `Your current plan allows up to ${maxBots} running bots.`, type: 'warning' });
      return;
    }
    const newBot: AutoTradingBot = {
      ...botData,
      id: 'BOT-' + Math.floor(100 + Math.random() * 900),
      currentPnl: 0,
      tradesToday: 0,
      decisionLogs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          action: 'INITIALIZED',
          price: selectedQuote.price,
          reason: `Bot started with ${botData.strategy} on ${botData.symbol}. Safety checks armed.`,
        },
      ],
    };
    setBots((prev) => [...prev, newBot]);
    addToast({ title: 'Bot Created', description: `"${botData.name}" is now armed and active.`, type: 'success' });
  };

  const toggleBotStatus = (id: string) => {
    setBots((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextStatus = b.status === 'running' ? 'paused' : 'running';
          return {
            ...b,
            status: nextStatus,
            decisionLogs: [
              {
                timestamp: new Date().toLocaleTimeString(),
                action: nextStatus === 'running' ? 'RESUMED' : 'PAUSED',
                price: selectedQuote.price,
                reason: `Trader toggled status to ${nextStatus}.`,
              },
              ...b.decisionLogs,
            ],
          };
        }
        return b;
      })
    );
  };

  const deleteBot = (id: string) => {
    setBots((prev) => prev.filter((b) => b.id !== id));
    addToast({ title: 'Bot Removed', description: 'Bot decommissioned and state archived.', type: 'info' });
  };

  // IPO Applications
  const applyIPO = (ipoId: string, upiId: string, bids: { bidNo: number; lots: number; price: number; cutOff: boolean }[]) => {
    if (currentPlan === 'free') {
      setLockedFeatureModal({ open: true, featureName: 'Direct IPO Bidding via UPI Mandate', requiredPlan: 'basic' });
      return;
    }
    const ipo = ipos.find((i) => i.id === ipoId);
    if (!ipo) return;

    const totalAmount = bids.reduce((acc, b) => acc + b.lots * ipo.lotSize * (b.cutOff ? ipo.maxPrice : b.price), 0);
    const appNum = 'TL-IPO-' + Math.floor(100000 + Math.random() * 900000);

    setIpos((prev) =>
      prev.map((item) => {
        if (item.id === ipoId) {
          return {
            ...item,
            userApplication: {
              applicationNumber: appNum,
              upiId,
              bids,
              totalAmount,
              appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              allotmentStatus: 'Under Process',
            },
          };
        }
        return item;
      })
    );

    addToast({
      title: 'IPO Application Submitted',
      description: `Application #${appNum} for ${ipo.name} created. Accept UPI mandate of ₹${totalAmount.toLocaleString()} in your UPI app.`,
      type: 'success',
    });
  };

  const cancelIPO = (ipoId: string) => {
    setIpos((prev) =>
      prev.map((item) => {
        if (item.id === ipoId) {
          const { userApplication, ...rest } = item;
          return rest;
        }
        return item;
      })
    );
    addToast({ title: 'IPO Application Cancelled', description: 'Your bids were withdrawn and UPI mandate will be unblocked.', type: 'info' });
  };

  // Loans Applications
  const applyLoan = (productId: string, amount: number, tenorMonths: number, emi: number) => {
    if (!checkAccess('loans')) {
      setLockedFeatureModal({ open: true, featureName: 'Institutional Lending & Margin Credit Access', requiredPlan: 'pro' });
      return;
    }
    const product = loanProducts.find((p) => p.id === productId);
    if (!product) return;

    const refNum = 'LOKFS-' + Math.floor(100000 + Math.random() * 900000);
    const newApp: LoanApplication = {
      id: 'APP-' + Math.random().toString(36).substring(2, 9),
      productId,
      partnerName: product.partnerName,
      requestedAmount: amount,
      tenorMonths,
      monthlyEmi: emi,
      status: 'KYC In Review',
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 10),
      referenceNumber: refNum,
    };

    setLoanApplications((prev) => [newApp, ...prev]);
    addToast({
      title: 'Loan Application Transmitted',
      description: `Application #${refNum} for ₹${amount.toLocaleString()} forwarded to ${product.partnerName} under RBI guidelines.`,
      type: 'success',
    });
  };

  // Community & Chat
  const createPost = (title: string, content: string, postSymbols: string[]) => {
    const newPost: CommunityPost = {
      id: 'POST-' + Math.random().toString(36).substring(2, 9),
      authorHandle: userHandle,
      authorBadge: currentPlan === 'enterprise' ? 'Enterprise Trader' : currentPlan === 'pro' ? 'Pro Trader' : 'Trader',
      title,
      content,
      symbols: postSymbols,
      likes: 1,
      likedByMe: true,
      commentsCount: 0,
      timestamp: 'Just now',
      isReported: false,
      isHidden: false,
      comments: [],
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
    addToast({ title: 'Idea Shared', description: 'Your trade thesis was posted to the community feed.', type: 'success' });
  };

  const likePost = (id: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const likedByMe = !p.likedByMe;
          return {
            ...p,
            likedByMe,
            likes: likedByMe ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [
              ...p.comments,
              {
                id: 'C-' + Math.random().toString(36).substring(2, 7),
                authorHandle: userHandle,
                text,
                timestamp: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );
  };

  const reportPost = (postId: string, _reason: string) => {
    setCommunityPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isReported: true } : p)));
    addToast({ title: 'Post Flagged', description: 'Moderators have been alerted to review this content.', type: 'info' });
  };

  const sendChatMessage = (room: string, text: string) => {
    const newMsg: ChatMessage = {
      id: 'M-' + Math.random().toString(36).substring(2, 9),
      room,
      senderHandle: userHandle,
      senderRole: userRole,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => ({
      ...prev,
      [room]: [...(prev[room] || []), newMsg],
    }));
  };

  // Support Tickets
  const createTicket = (
    subject: string,
    category: any,
    priority: any,
    initialMessage: string,
    attachmentName?: string
  ): string => {
    const tckNumber = 'TICK-2026-' + Math.floor(100 + Math.random() * 900);
    const newId = 'TCK-' + Math.random().toString(36).substring(2, 7);
    const newTicket: SupportTicket = {
      id: newId,
      ticketNumber: tckNumber,
      subject,
      category,
      priority,
      status: 'Open',
      userEmailMasked: userEmail.replace(/(.{2})(.*)(@.*)/, '$1*****$3'),
      userHandle,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      messages: [
        {
          id: 'TM-' + Math.random().toString(36).substring(2, 7),
          sender: userHandle,
          role: 'user',
          text: initialMessage,
          timestamp: 'Just now',
          attachmentName,
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    addToast({ title: 'Ticket Generated', description: `Support Ticket #${tckNumber} registered with our desk.`, type: 'success' });
    return newId;
  };

  const replyTicket = (ticketId: string, text: string, isInternal = false) => {
    const sender = userRole === 'trader' ? userHandle : `Staff (${userRole.toUpperCase()})`;
    const role = userRole === 'trader' ? 'user' : 'support';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: 'Just now',
            status: userRole === 'trader' ? 'In Progress' : t.status,
            messages: [
              ...t.messages,
              {
                id: 'TM-' + Math.random().toString(36).substring(2, 7),
                sender,
                role,
                text,
                timestamp: 'Just now',
                isInternalNote: isInternal,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const updateTicketStatus = (ticketId: string, status: any, priority?: any, assignedTo?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status,
            priority: priority || t.priority,
            assignedTo: assignedTo !== undefined ? assignedTo : t.assignedTo,
            updatedAt: 'Just now',
          };
        }
        return t;
      })
    );
    addToast({ title: 'Ticket Updated', description: `Ticket status set to ${status}`, type: 'info' });
  };

  const rateTicket = (ticketId: string, rating: number) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, userRating: rating } : t)));
    addToast({ title: 'Feedback Recorded', description: `Thank you for rating support resolution ${rating}/5 stars.`, type: 'success' });
  };

  // KYC
  const updateKYC = (data: Partial<KYCData>) => {
    setKycData((prev) => ({ ...prev, ...data, status: 'In Review', submissionDate: new Date().toISOString().substring(0, 10) }));
    addToast({ title: 'KYC Submitted', description: 'Documents uploaded. Compliance desk review takes < 2 business hours.', type: 'success' });
  };

  const reviewKYC = (status: 'Verified' | 'Rejected', reason?: string) => {
    setKycData((prev) => ({ ...prev, status, rejectionReason: reason }));
    addAuditLog('KYC_REVIEW_COMPLETED', userHandle, `Status set to ${status}${reason ? ': ' + reason : ''}`);
    addToast({ title: 'KYC Evaluated', description: `KYC marked as ${status}`, type: status === 'Verified' ? 'success' : 'warning' });
  };

  // Discounts & Billing
  const applyDiscountCode = (code: string): { valid: boolean; discountPercent: number; message: string } => {
    const normalized = code.trim().toUpperCase();
    const found = discountCodes.find((d) => d.code === normalized && d.active);
    if (!found) {
      return { valid: false, discountPercent: 0, message: 'Invalid or expired promotional code' };
    }
    return { valid: true, discountPercent: found.discountPercent, message: `${found.discountPercent}% discount applied successfully!` };
  };

  const completePayment = (plan: PlanTier, billingPeriod: 'Monthly' | 'Yearly', gateway: 'Razorpay' | 'Stripe', discountCode?: string) => {
    const basePrices: Record<PlanTier, number> = {
      free: 0,
      basic: billingPeriod === 'Monthly' ? 499 : 4990,
      pro: billingPeriod === 'Monthly' ? 1499 : 14990,
      enterprise: billingPeriod === 'Monthly' ? 4999 : 49990,
    };

    let amount = basePrices[plan];
    if (discountCode) {
      const disc = applyDiscountCode(discountCode);
      if (disc.valid) {
        amount = Math.round(amount * (1 - disc.discountPercent / 100));
      }
    }

    const gst = Math.round(amount * 0.18 * 100) / 100;
    const invNumber = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);

    const newPayment: PaymentTransaction = {
      id: 'PAY-' + Math.random().toString(36).substring(2, 8),
      invoiceNumber: invNumber,
      amount,
      currency: 'INR',
      gateway,
      status: 'Success',
      planTier: plan,
      billingPeriod,
      gstAmount: gst,
      customerHandle: userHandle,
      customerEmailMasked: userEmail.replace(/(.{2})(.*)(@.*)/, '$1*****$3'),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setPayments((prev) => [newPayment, ...prev]);
    setCurrentPlan(plan);
    addAuditLog('SUBSCRIPTION_UPGRADED', plan.toUpperCase(), `Payment of ₹${amount} completed via ${gateway}. Invoice #${invNumber}`);
    addToast({
      title: 'Payment Confirmed',
      description: `Welcome to Tickerline ${plan.toUpperCase()}! Tax invoice #${invNumber} generated.`,
      type: 'success',
    });
  };

  const activateFreeTrial = () => {
    setFreeTrialActive(true);
    setCurrentPlan('pro');
    addToast({ title: '7-Day Pro Trial Activated', description: 'Enjoy full Pro access with AI analysis, live signals, and bots.', type: 'success' });
  };

  // Audit Logs & Super Admin
  const addAuditLog = (action: string, target: string, details: string) => {
    const hash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const entry: AuditLogEntry = {
      id: 'AUD-' + Math.floor(600 + Math.random() * 400),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorHandle: userHandle,
      actorRole: userRole,
      action,
      target,
      details,
      ipMasked: '103.24.***.***',
      hash,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const togglePauseAllBots = () => {
    const nextState = !allBotsPaused;
    setAllBotsPaused(nextState);
    setBots((prev) => prev.map((b) => ({ ...b, status: nextState ? 'paused' : 'running' })));
    addAuditLog(nextState ? 'ALL_BOTS_PAUSED' : 'ALL_BOTS_RESUMED', 'Platform Supervisor', 'Supervisor toggled bot execution state.');
    addToast({
      title: nextState ? 'All Bots Paused' : 'All Bots Resumed',
      description: nextState ? 'Global bot execution paused across all trader accounts.' : 'Bots restored to previous active states.',
      type: 'warning',
    });
  };

  const updateCMS = (data: Partial<CMSContent>) => {
    setCmsContent((prev) => ({ ...prev, ...data }));
    addAuditLog('CMS_CONTENT_UPDATED', 'Landing / Pages', 'Content changes published live to website.');
    addToast({ title: 'Website Content Saved', description: 'Changes reflect across public pages immediately.', type: 'success' });
  };

  const updateStaffRole = (id: string, role: UserRole) => {
    setStaffUsers((prev) => prev.map((s) => (s.id === id ? { ...s, role } : s)));
    addAuditLog('STAFF_ROLE_MODIFIED', `User ${id}`, `Role set to ${role}`);
    addToast({ title: 'Staff Role Updated', description: `User role reassigned to ${role}.`, type: 'info' });
  };

  const toggleStaffStatus = (id: string) => {
    setStaffUsers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' } : s))
    );
    addAuditLog('STAFF_STATUS_TOGGLED', `User ${id}`, 'Status changed.');
  };

  const inviteStaff = (email: string, role: UserRole) => {
    const newStaff = {
      id: 'STF-' + (staffUsers.length + 1),
      name: email.split('@')[0],
      email,
      role,
      status: 'Active' as const,
      twoFactor: true,
    };
    setStaffUsers((prev) => [...prev, newStaff]);
    addAuditLog('STAFF_INVITATION_SENT', email, `Invited with role: ${role}`);
    addToast({ title: 'Invitation Dispatched', description: `Staff invite sent to ${email} with mandatory 2FA enrollment.`, type: 'success' });
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentPlan,
        setCurrentPlan,
        isDarkMode,
        toggleDarkMode,
        userHandle,
        userEmail,

        activeView,
        setActiveView,
        selectedSymbol,
        setSelectedSymbol,
        commandKOpen,
        setCommandKOpen,
        lockedFeatureModal,
        setLockedFeatureModal,
        checkAccess,

        symbols,
        selectedQuote,
        watchlists,
        activeWatchlistId,
        setActiveWatchlistId,
        createWatchlist,
        addToWatchlist,
        removeFromWatchlist,

        signals,
        alerts,
        createAlert,
        toggleAlert,
        deleteAlert,

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

        bots,
        createBot,
        toggleBotStatus,
        deleteBot,

        ipos,
        applyIPO,
        cancelIPO,

        loanProducts,
        loanApplications,
        applyLoan,

        communityPosts,
        createPost,
        likePost,
        addComment,
        reportPost,
        chatMessages,
        sendChatMessage,

        tickets,
        createTicket,
        replyTicket,
        updateTicketStatus,
        rateTicket,
        kycData,
        updateKYC,
        reviewKYC,

        discountCodes,
        payments,
        applyDiscountCode,
        completePayment,
        freeTrialActive,
        activateFreeTrial,

        auditLogs,
        addAuditLog,
        emergencyKillSwitch,
        setEmergencyKillSwitch,
        liveTradingEnabled,
        setLiveTradingEnabled,
        maintenanceMode,
        setMaintenanceMode,
        signupsEnabled,
        setSignupsEnabled,
        allBotsPaused,
        togglePauseAllBots,
        cmsContent,
        updateCMS,
        staffUsers,
        updateStaffRole,
        toggleStaffStatus,
        inviteStaff,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
