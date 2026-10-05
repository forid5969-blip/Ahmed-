import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  Bot,
  Landmark,
  Users,
  CheckCircle2,
  Lock,
  Mail,
  Send,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import heroChartImg from '../../assets/images/tickerline_hero_chart_1791220618323.jpg';
import partnerBankImg from '../../assets/images/partner_bank_hdfc_1791220632097.jpg';
import tradingDeskImg from '../../assets/images/trading_desk_community_1791220646579.jpg';

export const LandingPage: React.FC = () => {
  const { symbols, setSelectedSymbol, setActiveView, setUserRole, createTicket, addToast } = useApp();

  // Contact Form State with Honeypot & Math Captcha spam protection
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Quick Sign up State
  const [signUpEmail, setSignUpEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot check
    if (honeypot) return;
    // Simple math captcha: 7 + 5 = 12
    if (mathAnswer.trim() !== '12') {
      addToast({ title: 'Anti-Spam Verification Failed', description: 'Please solve the verification math challenge correctly.', type: 'error' });
      return;
    }

    const ticketId = createTicket(
      contactSubject || 'Inquiry from Public Website Contact Form',
      'General',
      'Medium',
      `Sender: ${contactName} (${contactEmail})\n\nMessage:\n${contactMessage}`
    );
    setSubmittedTicket(ticketId);
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
    setMathAnswer('');
    addToast({ title: 'Message Transmitted', description: 'Your inquiry created support ticket #' + ticketId + '. Our desk will respond within 4 hours.', type: 'success' });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail || !signUpEmail.includes('@')) {
      addToast({ title: 'Valid Email Required', description: 'Please enter a valid email address.', type: 'warning' });
      return;
    }
    setVerificationSent(true);
    addToast({
      title: 'Verification Link Dispatched',
      description: `A 6-digit confirmation token was dispatched to ${signUpEmail}. Click below to enter your workstation.`,
      type: 'success',
    });
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Engineered for Indian NSE/BSE & Global Markets</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1] text-balance">
                Precision charts, algorithmic bots, and capital tools for modern traders.
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                Execute with confidence using high-refresh rate candlestick charts, AI regime recognition, paper trading, and RBI-regulated margin lending — with encrypted zero-knowledge broker keys.
              </p>

              {/* Action row & Sign Up Form */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => {
                    setUserRole('trader');
                    setActiveView('chart');
                  }}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20"
                >
                  <span>Launch Trader Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveView('pricing')}
                  className="px-6 py-3.5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white font-medium rounded-xl text-sm transition-colors text-center"
                >
                  Compare Plans & Pricing
                </button>
              </div>

              {/* Editorial Trust Markers */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>SEBI DPDP Act Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Encrypted Zero-Knowledge Keys</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>7-Day Free Trial with Pro Access</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl bg-neutral-900">
                <img
                  src={heroChartImg}
                  alt="Tickerline Financial Terminal"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent flex items-end p-6">
                  <div className="w-full bg-neutral-950/80 backdrop-blur-md rounded-xl p-3 border border-neutral-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-neutral-400 font-mono text-[10px]">LIVE FEED ACTIVE</div>
                      <div className="font-semibold text-white">NIFTY 50 · ₹25,142.80</div>
                    </div>
                    <span className="text-emerald-400 font-mono font-medium">+0.57%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Market Board (Delayed Quotes) */}
      <section className="py-12 bg-neutral-50/50 dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Live Market Quotes & Delayed Board
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Indian indices, large-cap equities, US market leaders, and crypto pairs. (Public quotes delayed 15 mins by exchange rules).
              </p>
            </div>
            <button
              onClick={() => {
                setUserRole('trader');
                setActiveView('chart');
              }}
              className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Unlock Real-Time Low-Latency Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {symbols.slice(0, 10).map((quote) => {
              const isPositive = quote.change >= 0;
              return (
                <div
                  key={quote.symbol}
                  onClick={() => {
                    setSelectedSymbol(quote.symbol);
                    setUserRole('trader');
                    setActiveView('chart');
                  }}
                  className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {quote.symbol}
                    </span>
                    <span className="text-[10px] text-neutral-400">{quote.market}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mb-2">
                    {quote.name}
                  </div>
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white tabular-nums">
                      {quote.currency === 'INR' ? '₹' : '$'}
                      {quote.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`text-xs font-medium tabular-nums flex items-center gap-0.5 ${
                        isPositive ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}
                      {quote.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Platform Pillars / Feature Breakdown */}
      <section className="py-16 md:py-24 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              An integrated ecosystem designed for quantitative discipline.
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Every tool in Tickerline is built to enforce personal risk boundaries, eliminate emotional biases, and provide seamless access to Indian and international liquidity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Technical Charts & Pattern Recognition
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                Interactive candlestick views with customizable indicators (SMA, EMA, Bollinger, RSI, MACD) and automatic recognition of Head & Shoulders, Bull Flags, and Double Bottom formations drawn dynamically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Backtesting & Auto-Trading Bots
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                Test trading rules against historical tick data with overfitting safeguards. Deploy paper or live execution bots with hard daily loss caps, stop-loss pegs, and full decision audit logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                IPO Bidding & RBI-Regulated Loans
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                Apply for mainboard Indian IPOs with up to 3 bids via instant UPI mandates. Access Loans Against Securities (LAS) directly from RBI-regulated banking partners with transparent Key Fact Statements (KFS).
              </p>
            </div>
          </div>

          {/* Institutional adjacency showcase */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider font-mono">
                Lending & Banking Connectivity
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Empowered by RBI-Regulated Institutional Partners
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Tickerline strictly adheres to regulatory demarcations: the platform does not lend money. Instead, we connect qualified market participants directly with premier licensed banking partners including HDFC Bank, Bajaj Finance, and Tata Capital.
              </p>
              <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full Key Fact Statement (KFS) disclosure prior to submission</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Zero pre-closure penalty options for Loan Against Securities (LAS)</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md">
              <img
                src={partnerBankImg}
                alt="Institutional Banking Partners"
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Community & Collective Edge */}
      <section className="py-16 md:py-20 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md">
              <img
                src={tradingDeskImg}
                alt="Community Trading Floor"
                referrerPolicy="no-referrer"
                className="w-full h-72 object-cover"
              />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider font-mono">
                Trader Privacy & Community
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Share theses under public pseudonyms. Zero email or identity leaks.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Connect with Indian and global traders in live market rooms (Nifty Scalping, US Tech, Crypto, and IPOs). Member privacy is strictly enforced: your legal name, email, and brokerage balances are never visible to other members.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => {
                    setUserRole('trader');
                    setActiveView('community');
                  }}
                  className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold rounded-xl text-xs hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                >
                  Explore Public Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Quantitative Testimonials & Adjacency */}
      <section className="py-16 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              Grounded proof from active algorithmic participants
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                "The fat-finger price protection saved me from a 12% execution slippage during Bank Nifty expiry volatility. The zero-knowledge encryption for Zerodha keys gives our desk total confidence."
              </p>
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">Aarav Kulkarni</div>
              <div className="text-[11px] text-neutral-400">Head of Systematic Trading, Apex Equity LLP</div>
              <div className="text-[11px] font-mono text-emerald-500 mt-1">+34% Execution Efficiency in 6 Months</div>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                "We automated our EMA crossover strategies with Tickerline bots. The overfitting safeguard prevents the classic curve-fitting trap on historical 5-minute bar tests."
              </p>
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">Meera Venkatesh</div>
              <div className="text-[11px] text-neutral-400">Independent Quant & Derivatives Trader</div>
              <div className="text-[11px] font-mono text-emerald-500 mt-1">2.1x Risk-to-Reward Ratio Maintained</div>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                "Applied for Swiggy and Bajaj Housing Finance IPOs directly through the 3-bid UPI module. The mandate arrived on Google Pay within 90 seconds without navigating messy broker interfaces."
              </p>
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">Nikhil Bansal</div>
              <div className="text-[11px] text-neutral-400">Retail Portfolio Manager, Pune</div>
              <div className="text-[11px] font-mono text-emerald-500 mt-1">100% UPI Mandate Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Spam-Protected Contact Form (Creates Support Ticket) */}
      <section className="py-16 md:py-24 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Connect with our Institutional Desk
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Have a question regarding broker API integration, enterprise seats, or partner lending? Submitting this form automatically creates an encrypted support ticket.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl">
            {submittedTicket ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Ticket Generated Successfully!
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Your ticket has been dispatched to our compliance and technical teams. Our desk will update you via email.
                </p>
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl font-mono text-xs font-semibold text-emerald-500 inline-block">
                  Reference: {submittedTicket}
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {/* Honeypot field (hidden from humans, traps automated spam bots) */}
                <input
                  type="text"
                  name="website_url_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Mehta"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Work / Personal Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Subject / Area of Interest
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zerodha Kite API token renewal query"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Message Detail *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry or technical requirement in detail..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Anti-Spam Math Challenge */}
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Anti-Spam Verification: What is <strong>7 + 5</strong>?</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Answer"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    className="w-24 px-2.5 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-center font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Inquiry & Create Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. Footer & Compliance Disclaimers */}
      <footer className="py-12 bg-neutral-100 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-900 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-base font-bold text-neutral-900 dark:text-white mb-2">Tickerline</div>
              <p className="text-[11px] leading-relaxed">
                Institutional algorithmic intelligence and market connectivity for Indian and global trading participants.
              </p>
            </div>
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white mb-2">Platform</div>
              <div className="space-y-1.5 flex flex-col text-[11px]">
                <button onClick={() => setActiveView('landing')} className="hover:text-emerald-500 text-left">Market Board</button>
                <button onClick={() => setActiveView('public-ipo')} className="hover:text-emerald-500 text-left">IPO Calendar</button>
                <button onClick={() => setActiveView('pricing')} className="hover:text-emerald-500 text-left">Subscription Plans</button>
              </div>
            </div>
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white mb-2">Knowledge & Legal</div>
              <div className="space-y-1.5 flex flex-col text-[11px]">
                <button onClick={() => setActiveView('blog')} className="hover:text-emerald-500 text-left">Research Blog</button>
                <button onClick={() => setActiveView('help')} className="hover:text-emerald-500 text-left">Help Center</button>
                <button onClick={() => setActiveView('terms')} className="hover:text-emerald-500 text-left">Terms & Conditions</button>
                <button onClick={() => setActiveView('privacy')} className="hover:text-emerald-500 text-left">DPDP Privacy Policy</button>
                <button onClick={() => setActiveView('risk')} className="hover:text-emerald-500 text-left">Risk Disclosure</button>
              </div>
            </div>
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white mb-2">Regulatory Demarcation</div>
              <p className="text-[10px] leading-normal text-neutral-500">
                Tickerline is a technology service provider and is not a registered investment advisor or banking institution. Partner loan facilities are underwritten exclusively by RBI-regulated lenders.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>© 2026 Tickerline Technologies Pvt. Ltd. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>NSE / BSE Delayed 15m</span>
              <span>·</span>
              <span>Encrypted HSM Key Storage</span>
              <span>·</span>
              <span>ISO 27001 Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
