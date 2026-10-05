# Tickerline — Indian & Global Trading Platform

Tickerline is a complete financial trading and algorithmic intelligence platform for Indian (NSE/BSE) and global markets (US equities, spot crypto). It features high-frequency charting, automated pattern recognition, quantitative backtesting with walk-forward overfitting metrics, auto-trading bots with risk stops, mainboard IPO 3-bid UPI mandate portal, and RBI-regulated partner lending facilities.

---

## 🌟 Key Features

1. **Markets & Interactive Charts**
   - Candlestick engine with multi-timeframe navigation (`1m`, `5m`, `15m`, `1H`, `1D`, `1W`)
   - Technical overlays: SMA 20, EMA 50, Bollinger Bands, RSI 14 oscillator, Volume profile
   - Automated pattern overlays: Head & Shoulders, Bull Flags, Double Bottoms, Candlestick alerts
   - Fast Symbol Discovery (`Ctrl + K` or `Cmd + K`)
   - AI Market Regime & Trend Analysis powered by Gemini (`gemini-3.8-flash`)

2. **Trading Terminal**
   - **Paper Trading Engine**: Virtual starting capital (₹10,00,000 / $25,000) with Market, Limit, Stop, and Stop-Limit execution
   - **Live Broker Execution**: Zerodha Kite Connect, Alpaca Markets (US), and Binance
   - **Zero-Knowledge Key Storage**: Broker API credentials are hardware-envelope encrypted and cannot be inspected by anyone, platform staff included
   - **Automated Risk Controls**: Fat-finger price deviation protection, single position limits, daily loss cap, and personal Self-Pause switch

3. **Backtesting & Auto-Trading Bots**
   - Built-in strategy backtester (EMA Crossover, RSI Reversal, Momentum Breakout) and No-Code Custom Rule Builder
   - Quantitative evaluation: Total Return vs Buy-and-Hold, Max Drawdown, Win Rate, Profit Factor, and Walk-Forward Overfitting metric
   - Auto-Trading Bots: Paper or live execution with stop-loss %, take-profit %, daily loss limit, and full decision audit logs

4. **Capital Growth (IPOs & Partner Loans)**
   - Mainboard & SME IPO calendar with GMP (Grey Market Premium) tracking and 3-bid UPI mandate submission
   - Partner Lending comparison (HDFC Bank, Bajaj Finance, Tata Capital) with interactive EMI calculator and full Key Fact Statement (KFS) statutory disclosures

5. **Community & Synchronous Rooms**
   - Pseudonymous trade ideas feed with `$SYMBOL` tags, likes, and comment threads
   - Live trading chat rooms (`General`, `Indian Markets`, `US Equities`, `Crypto & Web3`, `IPO Discussion`)

6. **Operations & Multi-Role Governance**
   - **Support / Moderator**: Ticket queue with internal staff notes, community moderation, masked trader contact details, and KYC preview
   - **Admin**: User management, KYC approval with duplicate-PAN checks, plans and promo coupon editor, CMS publishing
   - **Super Admin**: One-click Emergency Kill Switch, platform live-trading master switch, staff RBAC directory, and cryptographic SHA-256 audit log integrity verification

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm`
- Python 3 (optional, for project archive bundling)

### Installation

1. **Clone or extract the archive**:
   ```bash
   cd tickerline
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key (optional for enhanced AI regime analysis; realistic quantitative fallback included):
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3000
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Deploying to GitHub Pages (Fixing Blank White Page)

### Why Does a Blank White Page Happen?
When deploying a Vite/React application to GitHub Pages, a blank white page occurs for two main reasons:
1. **GitHub Pages Source is set to Deploy from Branch (`/ root`)**:
   By default, GitHub Pages serves the root directory (`/`) of your `main` branch. In the root directory, `index.html` references `<script type="module" src="/src/main.tsx"></script>`. Browsers cannot run unbundled `.tsx` files directly, throwing a `404` or MIME-type error in the browser console (`Failed to load module script`), leaving `<div id="root"></div>` completely blank.
2. **Missing Base Path & Jekyll Filtering**:
   If the base path is not set to relative (`./`), assets fail to load from GitHub's repository subfolder (`https://<username>.github.io/<repo>/`). Furthermore, GitHub's default Jekyll engine ignores directories with leading underscores unless `.nojekyll` exists.

---

### How It Has Been Fixed in This Project:
- **`vite.config.ts`**: Configured with `base: './'` for universal relative asset resolution.
- **`public/.nojekyll`**: Automatically copied to `dist/` to disable Jekyll processing.
- **`dist/404.html`**: Automatically generated on build so deep links and direct page reloads don't result in GitHub 404s.
- **`package.json`**: Pre-configured with `gh-pages` and `"deploy": "gh-pages -d dist"`.
- **`.github/workflows/deploy.yml`**: Pre-configured GitHub Actions workflow for zero-configuration automated deployment.

---

### Step-by-Step Deployment (Choose either Option A or Option B):

#### Option A: Using GitHub Actions (Recommended — 100% Automated)
1. Push your repository to GitHub.
2. In your GitHub repository:
   - Navigate to **Settings** > **Pages** (under the left sidebar "Code and automation").
   - Under **Build and deployment** > **Source**, change the dropdown from **"Deploy from a branch"** to **"GitHub Actions"**.
3. Push any commit to `main` (or trigger it under the **Actions** tab by clicking "Run workflow").
4. GitHub Actions will install dependencies, build the production `dist/` bundle, and deploy the live site automatically with zero blank screen!

#### Option B: Using the `gh-pages` Command (One Command)
If you prefer deploying from your terminal:
1. Ensure your git remote is set:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   ```
2. Run the deploy script:
   ```bash
   npm run deploy
   ```
   *(This builds `dist/` and automatically creates & pushes to the `gh-pages` branch).*
3. In your GitHub repository:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, ensure it is set to **"Deploy from a branch"**.
   - Select Branch: **`gh-pages`** and folder: **`/ (root)`**, then click **Save**.
4. Your site will be live immediately!

---

## 📁 Project Structure

```
├── server.ts                       # Express backend + Vite middleware + Gemini AI endpoint
├── index.html                      # HTML entry point with typography
├── metadata.json                   # App capabilities and permissions
├── package.json                    # Dependencies and run scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration with Tailwind CSS v4
├── scripts/
│   └── bundle_project.py           # Source archive generator
└── src/
    ├── main.tsx                    # React client entry point
    ├── App.tsx                     # Core application view router
    ├── index.css                   # Global Tailwind CSS imports
    ├── types/
    │   └── index.ts                # Domain TypeScript interfaces
    ├── data/
    │   └── mockData.ts             # Initial symbols, quotes, IPOs, loans, and CMS content
    ├── context/
    │   └── AppContext.tsx          # Central reactive state manager & order execution engine
    └── components/
        ├── common/
        │   ├── Header.tsx          # Top navigation bar with persona switcher & download modal
        │   ├── CommandKModal.tsx   # Symbol search modal
        │   ├── FeatureLockModal.tsx# Plan tier upgrade dialog
        │   ├── ToastContainer.tsx  # Notification toasts
        │   └── EmergencyKillBanner.tsx # Super Admin circuit breaker banner
        ├── visitor/
        │   ├── LandingPage.tsx     # Hero, delayed quotes board, spam-protected contact desk
        │   ├── PublicPricing.tsx   # Plan comparison matrix, coupons, Razorpay/Stripe checkout
        │   ├── PublicIPOCalendar.tsx # Mainboard IPO tracking with GMP
        │   └── PublicContentPages.tsx # Research blog, Help Center, DPDP terms, Risk disclosure
        ├── trader/
        │   ├── MarketChartView.tsx # SVG candlestick chart, indicators, AI analysis
        │   ├── TradingTerminalView.tsx # Paper/Live execution, positions, risk limits
        │   ├── BacktestingBotsView.tsx # Backtester, equity curve, bots supervisor
        │   ├── InvestingBorrowingView.tsx # IPO 3-bid UPI, partner loans & KFS
        │   ├── CommunityView.tsx   # Trade ideas feed & live chat rooms
        │   └── AccountSettingsView.tsx # KYC, 2FA, sessions, DPDP data export, tickets
        └── staff/
            └── StaffDashboard.tsx  # Support queue, KYC queue, CMS, Super Admin kill switch
```

---

## 🛡️ Compliance & Security Notice

- **DPDP Act 2023**: Indian Digital Personal Data Protection Act compliant with data portability (`JSON` download) and permanent right-to-erasure workflows.
- **SEBI Demarcation**: Tickerline is an execution and analysis technology tool; partner credit facilities are underwritten exclusively by RBI-regulated banking partners.
- **Zero-Knowledge Architecture**: Brokerage API keys are encrypted client-side and stored in isolated security envelopes.

---

© 2026 Tickerline Technologies Pvt. Ltd. All rights reserved.
