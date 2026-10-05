import React, { useState } from 'react';
import { BookOpen, HelpCircle, Shield, FileText, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicContentPages: React.FC<{ view: 'blog' | 'help' | 'terms' | 'privacy' | 'risk' }> = ({ view }) => {
  const { cmsContent, setActiveView } = useApp();
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('All');
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const categories = ['All', 'Trading & Execution', 'Security & Keys', 'Paper Trading', 'IPO & Loans'];

  const filteredFaqs = cmsContent.faqs.filter((f) => {
    const matchesCat = activeFaqCategory === 'All' || f.category === activeFaqCategory;
    const matchesSearch =
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 md:py-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Blog View */}
      {view === 'blog' && (
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 uppercase tracking-wider font-mono mb-2">
              <BookOpen className="w-4 h-4" /> Market Research & Quantitative Papers
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              The Tickerline Research Journal
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Deep dives on market regime detection, statistical arbitrage, SEBI regulatory updates, and IPO underwriting mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cmsContent.blogPosts.map((post) => (
              <div
                key={post.id}
                className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-snug mb-3">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-medium">{post.author}</span>
                  <button
                    onClick={() => alert(`Full article reader for: "${post.title}"\n\n${post.content}`)}
                    className="text-emerald-500 hover:text-emerald-400 font-semibold"
                  >
                    Read Paper →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Help Center & FAQ View */}
      {view === 'help' && (
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 uppercase tracking-wider font-mono mb-2">
              <HelpCircle className="w-4 h-4" /> Support & Operating Knowledge Base
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Help Center & Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Find answers on Zerodha Kite API setup, paper trading engine behavior, and UPI mandate processes.
            </p>

            {/* Search Input */}
            <div className="mt-6 relative max-w-md mx-auto">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search help articles & FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFaqCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg transition-colors font-medium ${
                  activeFaqCategory === cat
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQs List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="p-4 pt-0 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center max-w-xl mx-auto">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Still need assistance?</h3>
            <p className="text-xs text-neutral-500 mt-1 mb-4">
              Our support team operates 24/5 across Indian market hours and US trading sessions.
            </p>
            <button
              onClick={() => setActiveView('landing')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
            >
              Submit Support Ticket
            </button>
          </div>
        </div>
      )}

      {/* 3. Legal: Terms of Service */}
      {view === 'terms' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              Terms of Service
            </h1>
            <div className="text-xs text-neutral-400 mt-1">Last Updated: October 2026 · Ver 3.4</div>
          </div>
          <div className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-4">
            <p>
              Welcome to Tickerline. By creating an account or accessing our services, you agree to these legally binding Terms of Service. Please read them thoroughly.
            </p>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">1. Scope of Services</h2>
            <p>
              Tickerline provides financial market data visualisations, technical charting indicators, paper trading simulations, automated rule backtesting engines, and third-party API integration interfaces for Zerodha, Alpaca, and Binance accounts.
            </p>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">2. Non-Advisory Nature</h2>
            <p>
              Tickerline is a software development and technology platform. We are NOT registered with the Securities and Exchange Board of India (SEBI) as a Portfolio Manager, Research Analyst, or Investment Advisor. All algorithmic signals, patterns, and indicators are computational outputs based on mathematical price action models.
            </p>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">3. Zero-Knowledge Key Storage</h2>
            <p>
              Brokerage credentials and API secrets provided by traders are stored with client-derived cryptographic envelopes. While Tickerline implements industry-standard zero-knowledge storage, you remain exclusively responsible for API permissions, IP whitelisting, and daily session revocations.
            </p>
          </div>
        </div>
      )}

      {/* 4. Legal: DPDP Privacy Policy */}
      {view === 'privacy' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              DPDP Act Privacy Policy & Data Sovereignty
            </h1>
            <div className="text-xs text-neutral-400 mt-1">Compliant with the Digital Personal Data Protection Act, 2023</div>
          </div>
          <div className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-4">
            <p>
              Tickerline is deeply committed to preserving your digital personal data rights. We process personal identifiers solely to comply with financial integrity and KYC verification standards.
            </p>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">1. Your Statutory Rights</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Right to Data Portability:</strong> You can export your full trading journal, bot decision logs, and KYC history as a signed JSON dump from your Account Settings.</li>
              <li><strong>Right to Erasure:</strong> You can request permanent account deletion and removal of personal identifiers under DPDP guidelines.</li>
              <li><strong>Right to Redressal:</strong> Dedicated Data Protection Officer (DPO) reachable via compliance@tickerline.io.</li>
            </ul>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">2. Community Privacy & Public Handles</h2>
            <p>
              In all public forums, chat rooms, and trade idea feeds, your identity is masked behind a chosen public pseudonym (handle). Your legal name, registered email address, and brokerage balances are strictly air-gapped from other members.
            </p>
          </div>
        </div>
      )}

      {/* 5. Legal: Risk Disclosure */}
      {view === 'risk' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h1 className="text-2xl sm:text-3xl font-bold text-rose-500 flex items-center gap-2">
              <Shield className="w-6 h-6" /> Risk Disclosure Document for Derivatives & Equities
            </h1>
            <div className="text-xs text-neutral-400 mt-1">Mandatory Regulatory Warning under SEBI Guidelines</div>
          </div>
          <div className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 font-medium">
              As per SEBI study, 9 out of 10 individual traders in equity Futures and Options segment incur net losses. On average, loss-makers registered net trading losses close to ₹50,000. Over and above net trading losses, loss-makers incurred an additional 28% of net trading losses as transaction costs.
            </div>
            <p>
              Trading in equities, futures, options, commodities, foreign currencies, and digital assets involves substantial financial risk. Market prices are subject to severe fluctuations, liquidity vacuums, slippage, and overnight gap events.
            </p>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">Automated & Algorithmic Trading Risks</h2>
            <p>
              Algorithmic trading strategies, automated bots, and backtested results simulate historical market states and do NOT guarantee future profitability. Network latencies, broker API disconnects, exchange throttling, or extreme market volatility may result in unexecuted stop-losses or unexpected order execution prices.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
