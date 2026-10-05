export type UserRole = 'visitor' | 'trader' | 'support' | 'admin' | 'superadmin';
export type PlanTier = 'free' | 'basic' | 'pro' | 'enterprise';

export type MarketType = 'NSE' | 'BSE' | 'US' | 'CRYPTO';

export interface SymbolQuote {
  symbol: string;
  name: string;
  market: MarketType;
  currency: 'INR' | 'USD';
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  volumeStr: string;
  marketCap?: string;
  peRatio?: number;
  week52High: number;
  week52Low: number;
  sector: string;
}

export interface Candle {
  timestamp: number;
  timeStr: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartPattern {
  id: string;
  name: string;
  type: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  timeframe: string;
  description: string;
  points: { index: number; price: number }[];
  targetPrice?: number;
  stopPrice?: number;
}

export interface TradingSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  strength: 'Strong' | 'Moderate' | 'Neutral';
  confidence: number; // Pro & Enterprise
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  timeframe: string;
  reason: string;
  timestamp: string;
  isPremium: boolean;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'ABOVE' | 'BELOW' | 'CROSSING' | 'PERCENT_CHANGE';
  targetValue: number;
  repeating: boolean;
  createdAt: string;
  triggered: boolean;
  active: boolean;
}

export interface Position {
  symbol: string;
  side: 'LONG' | 'SHORT';
  quantity: number;
  avgEntryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  broker: 'Paper' | 'Zerodha' | 'Alpaca' | 'Binance';
  leverage: number;
  openedAt: string;
}

export interface Order {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  quantity: number;
  price: number;
  stopPrice?: number;
  status: 'FILLED' | 'PENDING' | 'CANCELLED' | 'REJECTED';
  broker: 'Paper' | 'Zerodha' | 'Alpaca' | 'Binance';
  filledAt?: string;
  placedAt: string;
  riskCheckPassed: boolean;
  riskCheckNote?: string;
}

export interface RiskSettings {
  maxDailyLoss: number;
  maxPositionSize: number;
  fatFingerTolerancePercent: number;
  selfPauseActive: boolean;
  selfPauseUntil?: string;
}

export interface BacktestRule {
  indicatorA: string;
  operator: 'GREATER_THAN' | 'LESS_THAN' | 'CROSSES_ABOVE' | 'CROSSES_BELOW';
  indicatorBOrValue: string;
}

export interface BacktestResult {
  strategyName: string;
  symbol: string;
  timeframe: string;
  totalReturnPercent: number;
  buyAndHoldPercent: number;
  maxDrawdownPercent: number;
  winRatePercent: number;
  profitFactor: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  overfittingScore: number; // 0-100, lower is better
  equityCurve: { date: string; equity: number; benchmark: number }[];
  trades: {
    id: string;
    type: 'BUY' | 'SELL';
    entryDate: string;
    exitDate: string;
    entryPrice: number;
    exitPrice: number;
    pnl: number;
    pnlPercent: number;
  }[];
}

export interface AutoTradingBot {
  id: string;
  name: string;
  symbol: string;
  strategy: string;
  mode: 'paper' | 'live';
  status: 'running' | 'paused' | 'stopped';
  allocatedCapital: number;
  currentPnl: number;
  tradesToday: number;
  maxTradesPerDay: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  dailyLossLimit: number;
  decisionLogs: {
    timestamp: string;
    action: string;
    price: number;
    reason: string;
  }[];
}

export interface IPODetails {
  id: string;
  name: string;
  symbol: string;
  companyDescription: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed';
  issuePriceBand: string;
  minPrice: number;
  maxPrice: number;
  lotSize: number;
  minInvestment: number;
  issueSize: string;
  gmp: number; // Grey Market Premium in INR
  gmpPercent: number;
  openDate: string;
  closeDate: string;
  allotmentDate: string;
  listingDate: string;
  subscription: {
    qib: number;
    nii: number;
    retail: number;
    total: number;
  };
  userApplication?: {
    applicationNumber: string;
    upiId: string;
    bids: { bidNo: number; lots: number; price: number; cutOff: boolean }[];
    totalAmount: number;
    appliedAt: string;
    allotmentStatus: 'Under Process' | 'Allotted' | 'Not Allotted' | 'Refunded';
  };
}

export interface LoanProduct {
  id: string;
  partnerName: string;
  logo: string;
  productTitle: string;
  category: 'Loan Against Securities (LAS)' | 'Business Credit' | 'Margin Funding';
  interestRateAnnual: number; // e.g. 9.5
  apr: number; // Annual percentage rate e.g. 10.2
  minAmount: number;
  maxAmount: number;
  tenorMonthsMin: number;
  tenorMonthsMax: number;
  processingFeePercent: number;
  preClosureChargesPercent: number;
  penalChargesPerMonth: number;
  coolingOffPeriodDays: number;
  eligibility: string;
  rbiRegulated: boolean;
}

export interface LoanApplication {
  id: string;
  productId: string;
  partnerName: string;
  requestedAmount: number;
  tenorMonths: number;
  monthlyEmi: number;
  status: 'Submitted' | 'KYC In Review' | 'Lender Approved' | 'Disbursed' | 'Rejected';
  appliedAt: string;
  referenceNumber: string;
}

export interface CommunityPost {
  id: string;
  authorHandle: string;
  authorBadge?: string;
  title: string;
  content: string;
  symbols: string[];
  likes: number;
  likedByMe: boolean;
  commentsCount: number;
  timestamp: string;
  isReported: boolean;
  isHidden: boolean;
  comments: {
    id: string;
    authorHandle: string;
    text: string;
    timestamp: string;
  }[];
}

export interface ChatMessage {
  id: string;
  room: string;
  senderHandle: string;
  senderRole?: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'Trading & Execution' | 'Billing & Plans' | 'KYC & Verification' | 'Broker API' | 'General';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  userEmailMasked: string;
  userHandle: string;
  createdAt: string;
  updatedAt: string;
  userRating?: number;
  messages: {
    id: string;
    sender: string;
    role: 'user' | 'support' | 'admin' | 'system';
    text: string;
    timestamp: string;
    isInternalNote?: boolean;
    attachmentName?: string;
  }[];
}

export interface KYCData {
  panNumber: string;
  nameAsPerPan: string;
  dob: string;
  aadhaarLast4: string;
  address: string;
  panDocUploaded: boolean;
  addressDocUploaded: boolean;
  selfieUploaded: boolean;
  status: 'Not Submitted' | 'In Review' | 'Verified' | 'Rejected';
  rejectionReason?: string;
  submissionDate?: string;
  duplicatePanDetected?: boolean;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountPercent: number;
  applicablePlan: PlanTier | 'all';
  validUntil: string;
  usedCount: number;
  maxUses: number;
  active: boolean;
}

export interface PaymentTransaction {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: 'INR' | 'USD';
  gateway: 'Razorpay' | 'Stripe';
  status: 'Success' | 'Refunded' | 'Pending';
  planTier: PlanTier;
  billingPeriod: 'Monthly' | 'Yearly';
  gstAmount: number;
  customerHandle: string;
  customerEmailMasked: string;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorHandle: string;
  actorRole: UserRole;
  action: string;
  target: string;
  details: string;
  ipMasked: string;
  hash: string; // Tamper-evident verification hash
}

export interface CMSContent {
  announcementBanner: {
    enabled: boolean;
    text: string;
    type: 'info' | 'warning' | 'promotion';
  };
  blogPosts: {
    id: string;
    title: string;
    readTime: string;
    date: string;
    excerpt: string;
    content: string;
    author: string;
  }[];
  faqs: {
    question: string;
    answer: string;
    category: string;
  }[];
  legal: {
    terms: string;
    privacy: string;
    riskDisclosure: string;
  };
}
