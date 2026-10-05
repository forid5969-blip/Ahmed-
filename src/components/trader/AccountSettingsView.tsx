import React, { useState } from 'react';
import {
  User,
  Shield,
  CreditCard,
  FileText,
  Lock,
  Download,
  Trash2,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Star,
  ExternalLink,
  Smartphone,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AccountSettingsView: React.FC = () => {
  const {
    userHandle,
    userEmail,
    currentPlan,
    setCurrentPlan,
    kycData,
    updateKYC,
    payments,
    tickets,
    createTicket,
    rateTicket,
    replyTicket,
    freeTrialActive,
    activateFreeTrial,
    addToast,
    orders,
    positions,
    bots,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'billing' | 'kyc' | 'security' | 'notifications' | 'privacy' | 'support'>('billing');

  // Support ticket create dialog
  const [newTicketModal, setNewTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<any>('General');
  const [ticketPriority, setTicketPriority] = useState<any>('Medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketAttachment, setTicketAttachment] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorModal, setTwoFactorModal] = useState(false);

  // Active Sessions
  const [activeSessions, setActiveSessions] = useState([
    { id: 'S-1', device: 'Chrome on Windows 11', ip: '103.24.88.12', location: 'Mumbai, India', current: true },
    { id: 'S-2', device: 'Tickerline Mobile PWA (iOS)', ip: '49.36.120.4', location: 'Pune, India', current: false },
  ]);

  // Notifications quiet hours
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);

  // DPDP Export Handler
  const handleExportData = () => {
    const exportBundle = {
      exportTimestamp: new Date().toISOString(),
      account: { userHandle, userEmail, plan: currentPlan },
      kyc: kycData,
      positions,
      orders,
      bots,
      paymentHistory: payments,
      complianceNote: 'Exported under DPDP Act (Digital Personal Data Protection Act, 2023)',
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickerline_data_export_${userHandle}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({ title: 'Data Export Generated', description: 'Complete encrypted trade journal downloaded.', type: 'success' });
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    const newId = createTicket(ticketSubject, ticketCategory, ticketPriority, ticketMessage, ticketAttachment || undefined);
    setNewTicketModal(false);
    setTicketSubject('');
    setTicketMessage('');
    setTicketAttachment('');
    setActiveTicketId(newId);
  };

  const handleSendTicketReply = (ticketId: string) => {
    if (!ticketReplyText.trim()) return;
    replyTicket(ticketId, ticketReplyText.trim());
    setTicketReplyText('');
  };

  const handleSignOutEverywhere = () => {
    setActiveSessions((prev) => prev.filter((s) => s.current));
    addToast({ title: 'Sessions Terminated', description: 'All other devices and tokens revoked.', type: 'info' });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500" />
            Account Settings, Compliance & Security
          </h1>
          <div className="text-xs text-neutral-500 mt-0.5">
            Handle: <strong className="text-neutral-900 dark:text-white font-mono">{userHandle}</strong> · {userEmail}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
          {[
            { id: 'billing', label: 'Plans & Invoices' },
            { id: 'kyc', label: 'KYC Verification' },
            { id: 'security', label: '2FA & Sessions' },
            { id: 'notifications', label: 'Alert Preferences' },
            { id: 'privacy', label: 'DPDP Privacy' },
            { id: 'support', label: 'Support Tickets' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. BILLING & INVOICES TAB */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider font-mono">
                Current Subscription Tier
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white font-mono uppercase mt-1">
                {currentPlan} Plan
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                {currentPlan === 'enterprise'
                  ? 'Full DMA access, 50 running bots, and 1,000 daily backtests.'
                  : currentPlan === 'pro'
                  ? 'AI regime analysis, premium signals, 5 running bots, and partner lending.'
                  : currentPlan === 'basic'
                  ? 'Pattern recognition and 10 daily backtests.'
                  : 'Basic charts and community access.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!freeTrialActive && currentPlan === 'free' && (
                <button
                  onClick={activateFreeTrial}
                  className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold text-xs rounded-xl transition-colors"
                >
                  Activate 7-Day Pro Trial
                </button>
              )}
              <button
                onClick={() => setCurrentPlan(currentPlan === 'pro' ? 'enterprise' : 'pro')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
              >
                Change or Upgrade Plan
              </button>
            </div>
          </div>

          {/* GST Invoices Table */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              B2B GST Tax Invoices & Payment Receipts
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 font-sans">
                    <th className="pb-2">Invoice #</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Plan</th>
                    <th className="pb-2">Gateway</th>
                    <th className="pb-2">Base + GST</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 font-bold text-neutral-900 dark:text-white">{p.invoiceNumber}</td>
                      <td className="py-3 text-neutral-400">{p.timestamp.substring(0, 10)}</td>
                      <td className="py-3 uppercase font-semibold">{p.planTier} ({p.billingPeriod})</td>
                      <td className="py-3">{p.gateway}</td>
                      <td className="py-3 font-semibold">
                        ₹{p.amount.toLocaleString()} (+₹{p.gstAmount} GST)
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() =>
                            alert(
                              `TAX INVOICE: ${p.invoiceNumber}\nCustomer: ${p.customerHandle}\nAmount: INR ${p.amount}\nGST 18%: INR ${p.gstAmount}\nVerified Gateway: ${p.gateway}\nStatus: Paid`
                            )
                          }
                          className="text-emerald-500 hover:underline font-sans text-xs font-semibold"
                        >
                          PDF Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. KYC VERIFICATION TAB */}
      {activeTab === 'kyc' && (
        <div className="max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">KYC Verification Status</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Required for UPI IPO mandate routing and partner lending underwriting.
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                kycData.status === 'Verified'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : kycData.status === 'In Review'
                  ? 'bg-sky-500/10 text-sky-500'
                  : 'bg-amber-500/10 text-amber-500'
              }`}
            >
              {kycData.status}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-500 block mb-1">Permanent Account Number (PAN)</label>
                <input
                  type="text"
                  disabled
                  value={kycData.panNumber}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-neutral-500 block mb-1">Name as per Income Tax PAN</label>
                <input
                  type="text"
                  disabled
                  value={kycData.nameAsPerPan}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-neutral-500 block mb-1">Registered Address (Aadhaar / DigiLocker)</label>
              <input
                type="text"
                disabled
                value={kycData.address}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            {/* Document Badges */}
            <div className="pt-2">
              <div className="text-neutral-500 font-medium mb-2">Uploaded Identity Documents:</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  <div className="font-semibold text-neutral-900 dark:text-white">PAN Card</div>
                  <div className="text-[10px] text-neutral-400">Verified NSDL</div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  <div className="font-semibold text-neutral-900 dark:text-white">Address Proof</div>
                  <div className="text-[10px] text-neutral-400">UIDAI XML</div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  <div className="font-semibold text-neutral-900 dark:text-white">Live Selfie</div>
                  <div className="text-[10px] text-neutral-400">Liveness Passed</div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() =>
                  updateKYC({ status: 'In Review', submissionDate: new Date().toISOString().substring(0, 10) })
                }
                className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg text-xs font-semibold"
              >
                Re-upload Updated Address Proof
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SECURITY & 2FA TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-3xl">
          {/* 2FA Section */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Two-Factor Authentication (2FA / TOTP)
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Protect your trading execution and withdrawal permissions with an authenticator app (Google Authenticator, Microsoft Authenticator or Authy).
                </p>
              </div>

              <button
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  addToast({
                    title: !twoFactorEnabled ? '2FA Armed' : '2FA Deactivated',
                    description: !twoFactorEnabled ? 'Authenticator app enabled for future logins.' : '2FA disabled.',
                    type: !twoFactorEnabled ? 'success' : 'warning',
                  });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  twoFactorEnabled
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {twoFactorEnabled ? '2FA Active (Enabled)' : 'Enable Authenticator'}
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Active Device Sessions</h3>
              <button
                onClick={handleSignOutEverywhere}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Everywhere Else</span>
              </button>
            </div>

            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-neutral-400" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>{session.device}</span>
                        {session.current && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 font-mono">
                            Current Device
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        IP: {session.ip} · {session.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-500" />
            Alerts & Notification Channels
          </h3>

          <div className="space-y-3 text-xs pt-2">
            <label className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl cursor-pointer">
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">In-App Sound & Banners</div>
                <div className="text-neutral-400 text-[11px]">Real-time execution audio alerts</div>
              </div>
              <input
                type="checkbox"
                checked={notifyInApp}
                onChange={(e) => setNotifyInApp(e.target.checked)}
                className="accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl cursor-pointer">
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">Email Digest & Signals</div>
                <div className="text-neutral-400 text-[11px]">Daily pre-market briefing & trade summaries</div>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl cursor-pointer">
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">Quiet Hours (Sleep Mode)</div>
                <div className="text-neutral-400 text-[11px]">Silence non-critical alerts between 10:00 PM – 08:00 AM</div>
              </div>
              <input
                type="checkbox"
                checked={quietHoursEnabled}
                onChange={(e) => setQuietHoursEnabled(e.target.checked)}
                className="accent-emerald-500"
              />
            </label>
          </div>
        </div>
      )}

      {/* 5. PRIVACY & DPDP ACT TAB */}
      {activeTab === 'privacy' && (
        <div className="max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              DPDP Act Compliance & Data Sovereignty
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              India’s Digital Personal Data Protection Act grants you unconditional rights to inspect, download, and erase your financial footprint.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-neutral-900 dark:text-white">
                  Download Complete Data Bundle (JSON)
                </div>
                <div className="text-[11px] text-neutral-400">
                  Export all executed trades, paper history, bot logs, and KYC verification records.
                </div>
              </div>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export My Data</span>
              </button>
            </div>

            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-rose-500">
                  Request Permanent Account Erasure
                </div>
                <div className="text-[11px] text-neutral-500">
                  Irrevocably deletes your profile, broker keys, and past activity under DPDP provisions.
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to request permanent account deletion under the DPDP Act? This will wipe all trading logs.')) {
                    addToast({ title: 'Erasure Request Registered', description: 'Your account deletion request was queued with compliance.', type: 'warning' });
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUPPORT TICKETS TAB */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tickets Directory */}
          <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">My Support Tickets</h3>
              <button
                onClick={() => setNewTicketModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                + New Ticket
              </button>
            </div>

            <div className="space-y-2">
              {tickets.map((tck) => (
                <div
                  key={tck.id}
                  onClick={() => setActiveTicketId(tck.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    activeTicketId === tck.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-neutral-900 dark:text-white font-mono">{tck.ticketNumber}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                        tck.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : 'bg-sky-500/20 text-sky-500'
                      }`}
                    >
                      {tck.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                    {tck.subject}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-1">
                    Updated {tck.updatedAt} · {tck.category}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Messages Thread */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[480px]">
            {(() => {
              const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];
              if (!activeTicket) {
                return (
                  <div className="py-24 text-center text-xs text-neutral-400">
                    Select a ticket on the left or create a new inquiry.
                  </div>
                );
              }

              return (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-neutral-400">
                            {activeTicket.ticketNumber}
                          </span>
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                            {activeTicket.subject}
                          </h4>
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          Category: {activeTicket.category} · Priority: {activeTicket.priority}
                        </div>
                      </div>

                      {/* 5-Star Rating if resolved */}
                      {activeTicket.status === 'Resolved' && (
                        <div className="text-right">
                          <div className="text-[10px] text-neutral-400 mb-1">Resolution Rating:</div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => rateTicket(activeTicket.id, star)}
                                className={`text-sm ${
                                  (activeTicket.userRating || 0) >= star
                                    ? 'text-amber-400'
                                    : 'text-neutral-300 dark:text-neutral-700'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Messages */}
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                      {activeTicket.messages.map((m) => {
                        // Hide internal notes from customer view
                        if (m.isInternalNote) return null;
                        const isUser = m.role === 'user';
                        return (
                          <div
                            key={m.id}
                            className={`p-3 rounded-xl text-xs space-y-1 ${
                              isUser
                                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ml-6'
                                : 'bg-emerald-500/10 border border-emerald-500/20 text-neutral-900 dark:text-white mr-6'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                              <span className="font-bold text-neutral-700 dark:text-neutral-300">
                                {m.sender}
                              </span>
                              <span>{m.timestamp}</span>
                            </div>
                            <div className="leading-relaxed whitespace-pre-line">{m.text}</div>
                            {m.attachmentName && (
                              <div className="pt-1 text-[10px] text-emerald-500 font-mono">
                                📎 Attachment: {m.attachmentName}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reply Input */}
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add a reply to support staff..."
                      value={ticketReplyText}
                      onChange={(e) => setTicketReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendTicketReply(activeTicket.id)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleSendTicketReply(activeTicket.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shrink-0"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* New Support Ticket Modal */}
      {newTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
              Create Support Ticket
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Our support desk will respond directly to your ticket within 2 to 4 business hours.
            </p>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zerodha daily token renewal question"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option>Trading & Execution</option>
                    <option>Billing & Plans</option>
                    <option>KYC & Verification</option>
                    <option>Broker API</option>
                    <option>General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Priority
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Message Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide complete details including symbol, order ID, or broker error messages..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Attachment Name (Simulated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. error_screenshot_kite.png"
                  value={ticketAttachment}
                  onChange={(e) => setTicketAttachment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewTicketModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
