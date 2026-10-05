import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { CommandKModal } from './components/common/CommandKModal';
import { FeatureLockModal } from './components/common/FeatureLockModal';
import { ToastContainer } from './components/common/ToastContainer';
import { EmergencyKillBanner } from './components/common/EmergencyKillBanner';

// Visitor Views
import { LandingPage } from './components/visitor/LandingPage';
import { PublicPricing } from './components/visitor/PublicPricing';
import { PublicIPOCalendar } from './components/visitor/PublicIPOCalendar';
import { PublicContentPages } from './components/visitor/PublicContentPages';

// Trader Views
import { MarketChartView } from './components/trader/MarketChartView';
import { TradingTerminalView } from './components/trader/TradingTerminalView';
import { BacktestingBotsView } from './components/trader/BacktestingBotsView';
import { InvestingBorrowingView } from './components/trader/InvestingBorrowingView';
import { CommunityView } from './components/trader/CommunityView';
import { AccountSettingsView } from './components/trader/AccountSettingsView';

// Staff Views
import { StaffDashboard } from './components/staff/StaffDashboard';

const MainLayout: React.FC = () => {
  const { userRole, activeView, maintenanceMode } = useApp();

  const isStaff = userRole === 'support' || userRole === 'admin' || userRole === 'superadmin';

  // If maintenance mode enabled and user is not staff, show maintenance banner
  if (maintenanceMode && !isStaff) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-neutral-950 text-white">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 text-2xl font-mono font-bold">
          !
        </div>
        <h1 className="text-2xl font-bold">Scheduled System Maintenance</h1>
        <p className="text-sm text-neutral-400 mt-2 max-w-md">
          Tickerline is currently performing exchange socket synchronization and hardware database maintenance. Live trading will resume momentarily.
        </p>
      </div>
    );
  }

  // Render view depending on userRole and activeView
  const renderCurrentView = () => {
    // 1. Staff dashboard
    if (isStaff) {
      return <StaffDashboard />;
    }

    // 2. Visitor Views
    if (userRole === 'visitor') {
      switch (activeView) {
        case 'pricing':
          return <PublicPricing />;
        case 'public-ipo':
          return <PublicIPOCalendar />;
        case 'blog':
          return <PublicContentPages view="blog" />;
        case 'help':
          return <PublicContentPages view="help" />;
        case 'terms':
          return <PublicContentPages view="terms" />;
        case 'privacy':
          return <PublicContentPages view="privacy" />;
        case 'risk':
          return <PublicContentPages view="risk" />;
        case 'landing':
        default:
          return <LandingPage />;
      }
    }

    // 3. Trader Views
    switch (activeView) {
      case 'trading':
        return <TradingTerminalView />;
      case 'backtesting':
        return <BacktestingBotsView />;
      case 'investing':
        return <InvestingBorrowingView />;
      case 'community':
        return <CommunityView />;
      case 'account':
        return <AccountSettingsView />;
      case 'pricing':
        return <PublicPricing />;
      case 'chart':
      default:
        return <MarketChartView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <EmergencyKillBanner />
      <Header />
      <main className="flex-1 w-full">{renderCurrentView()}</main>

      {/* Global Modals & Overlays */}
      <CommandKModal />
      <FeatureLockModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
