import React, { useState } from 'react';
import {
  Search,
  Sun,
  Moon,
  ShieldAlert,
  ChevronDown,
  Layers,
  Sparkles,
  User,
  ExternalLink,
  Laptop,
  Download,
  Terminal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, PlanTier } from '../../types';

export const Header: React.FC = () => {
  const {
    userRole,
    setUserRole,
    currentPlan,
    setCurrentPlan,
    isDarkMode,
    toggleDarkMode,
    activeView,
    setActiveView,
    setCommandKOpen,
    emergencyKillSwitch,
    userHandle,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // Clean navigation links depending on persona
  const isStaff = userRole === 'support' || userRole === 'admin' || userRole === 'superadmin';
  const isVisitor = userRole === 'visitor';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md px-4 sm:px-6 py-2.5 transition-colors">
        <div className="flex items-center justify-between gap-4 max-w-[1720px] mx-auto">
          {/* Zone 1: Single text element Brand wordmark (Strict Top Bar Contract) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isVisitor) setActiveView('landing');
                else if (isStaff) setActiveView('staff-console');
                else setActiveView('chart');
              }}
              className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5 focus:outline-none"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Tickerline</span>
            </button>
            {emergencyKillSwitch && (
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> HALT ENGAGED
              </span>
            )}
          </div>

          {/* Zone 2: 4-6 clean text navigation links (single line, no pills) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {isVisitor ? (
              <>
                <button
                  onClick={() => setActiveView('landing')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'landing' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  Market Board
                </button>
                <button
                  onClick={() => setActiveView('public-ipo')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'public-ipo' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  IPO Calendar
                </button>
                <button
                  onClick={() => setActiveView('pricing')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'pricing' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  Pricing
                </button>
                <button
                  onClick={() => setActiveView('blog')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'blog' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  Research Blog
                </button>
                <button
                  onClick={() => setActiveView('help')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'help' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  Help Center
                </button>
              </>
            ) : isStaff ? (
              <>
                <button
                  onClick={() => setActiveView('staff-tickets')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'staff-tickets' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  Support Queue
                </button>
                <button
                  onClick={() => setActiveView('staff-moderation')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'staff-moderation' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  Community Moderation
                </button>
                <button
                  onClick={() => setActiveView('staff-kyc')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'staff-kyc' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  KYC Verification
                </button>
                {(userRole === 'admin' || userRole === 'superadmin') && (
                  <>
                    <button
                      onClick={() => setActiveView('staff-users')}
                      className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                        activeView === 'staff-users' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                      }`}
                    >
                      User & Plan Admin
                    </button>
                    <button
                      onClick={() => setActiveView('staff-cms')}
                      className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                        activeView === 'staff-cms' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                      }`}
                    >
                      Content & IPO
                    </button>
                  </>
                )}
                {userRole === 'superadmin' && (
                  <button
                    onClick={() => setActiveView('staff-super')}
                    className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                      activeView === 'staff-super' ? 'text-rose-400 font-semibold' : 'text-neutral-400'
                    }`}
                  >
                    Kill Switch & Health
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveView('chart')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'chart' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  Charts & Signals
                </button>
                <button
                  onClick={() => setActiveView('trading')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'trading' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  Paper & Live Trading
                </button>
                <button
                  onClick={() => setActiveView('backtesting')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'backtesting' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  Backtest & Bots
                </button>
                <button
                  onClick={() => setActiveView('investing')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'investing' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  IPO & Loans
                </button>
                <button
                  onClick={() => setActiveView('community')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'community' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  Community & Chat
                </button>
                <button
                  onClick={() => setActiveView('account')}
                  className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap ${
                    activeView === 'account' ? 'text-neutral-900 dark:text-white font-semibold' : ''
                  }`}
                >
                  Account & KYC
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: 1-2 primary actions + Persona Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Quick Symbol Search Ctrl+K */}
            <button
              onClick={() => setCommandKOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-800 transition-colors cursor-pointer"
              title="Search Symbol (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Search symbol...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400">
                Ctrl K
              </kbd>
            </button>

            {/* Install PWA / Desktop App hint */}
            <button
              onClick={() => setPwaModalOpen(true)}
              className="p-1.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title="Install Desktop App / PWA"
            >
              <Laptop className="w-4 h-4" />
            </button>

            {/* Direct Project Download Button */}
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
              title="Download Project Source Code ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Code</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Role & Plan Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="capitalize">{userRole}</span>
                {userRole === 'trader' && (
                  <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400">
                    {currentPlan}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase px-2 py-1">
                    Select System Role
                  </div>
                  <div className="space-y-1">
                    {[
                      { role: 'visitor', label: 'Visitor (Public Landing & Pricing)', desc: 'Unauthenticated preview, IPOs, marketing' },
                      { role: 'trader', label: 'Trader (Customer Dashboard)', desc: 'Trading, bots, signals, backtesting' },
                      { role: 'support', label: 'Support / Moderator (Staff)', desc: 'Tickets queue, community moderation, KYC preview' },
                      { role: 'admin', label: 'Admin (Staff Operations)', desc: 'Users, billing, instruments, CMS, IPO' },
                      { role: 'superadmin', label: 'Super Admin (Platform Owner)', desc: 'Kill switch, staff RBAC, system health, audit logs' },
                    ].map((item) => (
                      <button
                        key={item.role}
                        onClick={() => {
                          setUserRole(item.role as UserRole);
                          if (item.role === 'visitor') setActiveView('landing');
                          else if (item.role === 'trader') setActiveView('chart');
                          else setActiveView('staff-tickets');
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex flex-col ${
                          userRole === item.role
                            ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <span className="font-medium">{item.label}</span>
                        <span className="text-[11px] text-neutral-400">{item.desc}</span>
                      </button>
                    ))}
                  </div>

                  {userRole === 'trader' && (
                    <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase px-2 py-1">
                        Active Trader Plan
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        {(['free', 'basic', 'pro', 'enterprise'] as PlanTier[]).map((tier) => (
                          <button
                            key={tier}
                            onClick={() => {
                              setCurrentPlan(tier);
                              setRoleMenuOpen(false);
                            }}
                            className={`px-2 py-1.5 rounded text-xs font-mono uppercase text-center transition-colors ${
                              currentPlan === tier
                                ? 'bg-emerald-600 text-white font-semibold'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 px-2 text-[11px] text-neutral-400 flex items-center justify-between">
                    <span>Signed in as:</span>
                    <span className="font-mono text-neutral-700 dark:text-neutral-200 truncate max-w-[120px]">
                      {userHandle}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            {isVisitor ? (
              <button
                onClick={() => {
                  setUserRole('trader');
                  setActiveView('chart');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                Sign In / Launch
              </button>
            ) : (
              <button
                onClick={() => {
                  if (isStaff) setActiveView('staff-super');
                  else setActiveView('pricing');
                }}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap"
              >
                {isStaff ? 'Operations Hub' : 'Upgrade Plan'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* PWA & Windows App Modal */}
      {pwaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Laptop className="w-5 h-5 text-emerald-500" />
                Tickerline Native Desktop & PWA
              </h3>
              <button
                onClick={() => setPwaModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-200 text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
              Tickerline is fully engineered as a Progressive Web App (PWA) with offline trade journal caching, and as a lightweight Windows Electron desktop binary with direct broker WebSocket tunneling.
            </p>
            <div className="space-y-3 mb-6 text-xs text-neutral-600 dark:text-neutral-300">
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">PWA Web App</div>
                  <div className="text-[11px] text-neutral-400">Install directly into Chrome, Edge or Safari</div>
                </div>
                <button
                  onClick={() => {
                    alert('Progressive Web App installation prompt registered with browser.');
                    setPwaModalOpen(false);
                  }}
                  className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg text-xs"
                >
                  Install PWA
                </button>
              </div>
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">Windows 64-bit MSIX</div>
                  <div className="text-[11px] text-neutral-400">High-refresh rate hardware acceleration</div>
                </div>
                <button
                  onClick={() => {
                    alert('Tickerline-Setup-x64.msix package build initialized.');
                    setPwaModalOpen(false);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs"
                >
                  Download .exe
                </button>
              </div>
            </div>
            <div className="text-[11px] text-neutral-400 text-center">
              Requires Windows 10/11 or modern web browser with WebGL 2.0.
            </div>
          </div>
        </div>
      )}

      {/* Project Source Code Download Modal */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-500" />
                Download Tickerline Project Source Code
              </h3>
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
              You can download the full, complete production-ready codebase as a standalone ZIP archive, ready to run on any computer or cloud server.
            </p>

            <div className="space-y-4 mb-6">
              {/* Direct Download Action */}
              <a
                href="/api/download-project"
                download="tickerline-project.zip"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download tickerline-project.zip (3.3 MB)</span>
              </a>

              {/* Instructions */}
              <div className="p-3.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl space-y-2 text-xs">
                <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span>How to Run Locally:</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] bg-neutral-950 text-neutral-200 p-3 rounded-lg overflow-x-auto">
                  <div className="text-neutral-500"># 1. Extract the downloaded zip</div>
                  <div>unzip tickerline-project.zip</div>
                  <div className="text-neutral-500 pt-1"># 2. Install dependencies</div>
                  <div>npm install</div>
                  <div className="text-neutral-500 pt-1"># 3. Launch local dev server</div>
                  <div className="text-emerald-400">npm run dev</div>
                </div>
              </div>

              {/* GitHub Pages Deployment Note */}
              <div className="p-3.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl space-y-2 text-xs">
                <div className="font-semibold text-neutral-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    Deploying to GitHub Pages?
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-medium">Zero Blank Screen</span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  If you see a blank white page, it is because GitHub Pages defaults to serving uncompiled source code from root (<code className="font-mono text-emerald-500">/</code>).
                </p>
                <div className="font-mono text-[11px] bg-neutral-950 text-neutral-200 p-3 rounded-lg space-y-1.5">
                  <div className="text-neutral-400 font-sans font-semibold">Option A (Recommended - GitHub Actions):</div>
                  <div className="text-neutral-300">1. Repo Settings → Pages → Source: Select <span className="text-emerald-400">"GitHub Actions"</span></div>
                  <div className="text-neutral-300">2. Push your code. <span className="text-neutral-500">(Workflow automatically builds and deploys dist)</span></div>
                  <div className="text-neutral-400 font-sans font-semibold pt-1">Option B (One-Command Deploy):</div>
                  <div className="text-emerald-400">npm run deploy</div>
                  <div className="text-neutral-500"># Pushes production dist to gh-pages branch</div>
                </div>
              </div>

              {/* Note on Google AI Studio UI download */}
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl text-[11px] text-neutral-500 leading-relaxed">
                <strong>Google AI Studio UI Option:</strong> You can also export or download this project directly using the top-right AI Studio project menu (select <em>Export to GitHub</em> or <em>Download Code</em> in the header toolbar).
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
