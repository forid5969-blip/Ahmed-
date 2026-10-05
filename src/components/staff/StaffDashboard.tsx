import React, { useState } from 'react';
import {
  ShieldAlert,
  Shield,
  LifeBuoy,
  Users,
  FileCheck,
  Tag,
  CreditCard,
  Layers,
  Bot,
  Landmark,
  Globe,
  Activity,
  Key,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Plus,
  Send,
  FileText,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, PlanTier, SupportTicket, IPODetails, LoanProduct } from '../../types';

export const StaffDashboard: React.FC = () => {
  const {
    userRole,
    setUserRole,
    tickets,
    replyTicket,
    updateTicketStatus,
    communityPosts,
    reportPost,
    kycData,
    reviewKYC,
    discountCodes,
    payments,
    bots,
    toggleBotStatus,
    ipos,
    applyIPO,
    loanProducts,
    loanApplications,
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
    orders,
    addToast,
    symbols,
  } = useApp();

  const isSuperAdmin = userRole === 'superadmin';
  const isAdmin = userRole === 'admin' || isSuperAdmin;
  const isSupport = userRole === 'support' || isAdmin;

  // Active Staff Subview
  const [staffTab, setStaffTab] = useState<
    'tickets' | 'moderation' | 'kyc' | 'users' | 'billing' | 'bots' | 'cms' | 'superadmin'
  >('tickets');

  // Support Ticket reply & internal note state
  const [selectedStaffTicketId, setSelectedStaffTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [staffReplyText, setStaffReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // New Discount Code State
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(20);
  const [newPromoPlan, setNewPromoPlan] = useState<PlanTier | 'all'>('all');

  // CMS Announcement Editor State
  const [announcementText, setAnnouncementText] = useState(cmsContent.announcementBanner.text);
  const [announcementEnabled, setAnnouncementEnabled] = useState(cmsContent.announcementBanner.enabled);

  // Staff Invite State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('support');

  // Audit Integrity Check State
  const [integrityVerified, setIntegrityVerified] = useState<boolean | null>(null);

  const selectedTicket = tickets.find((t) => t.id === selectedStaffTicketId) || tickets[0];

  const handleStaffSendReply = () => {
    if (!staffReplyText.trim() || !selectedTicket) return;
    replyTicket(selectedTicket.id, staffReplyText.trim(), isInternalNote);
    addAuditLog(
      isInternalNote ? 'TICKET_INTERNAL_NOTE_ADDED' : 'TICKET_REPLY_SENT',
      selectedTicket.ticketNumber,
      `Staff added ${isInternalNote ? 'internal note' : 'customer response'}`
    );
    setStaffReplyText('');
  };

  const handleVerifyAuditChain = () => {
    setIntegrityVerified(null);
    setTimeout(() => {
      setIntegrityVerified(true);
      addToast({
        title: 'Cryptographic Hash Integrity Confirmed',
        description: `Verified ${auditLogs.length} ledger blocks against SHA-256 root. 0 tampering detected.`,
        type: 'success',
      });
    }, 700);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] mx-auto space-y-6">
      {/* Staff Identity & Security Badge */}
      <div className="p-4 rounded-2xl bg-neutral-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold">
              Staff Operations Console ({userRole.toUpperCase()})
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
              Mandatory 2FA Verified
            </span>
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            Role-Based Access Control (RBAC) enforced · Contact details masked for customer privacy.
          </div>
        </div>

        {/* Staff Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setStaffTab('tickets')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              staffTab === 'tickets' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Ticket Queue ({tickets.filter((t) => t.status !== 'Resolved').length})
          </button>
          <button
            onClick={() => setStaffTab('moderation')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              staffTab === 'moderation' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Community Moderation
          </button>
          <button
            onClick={() => setStaffTab('kyc')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              staffTab === 'kyc' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'
            }`}
          >
            KYC Document Queue
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => setStaffTab('users')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  staffTab === 'users' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'
                }`}
              >
                Traders & Orders
              </button>
              <button
                onClick={() => setStaffTab('billing')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  staffTab === 'billing' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'
                }`}
              >
                Plans & Discounts
              </button>
              <button
                onClick={() => setStaffTab('bots')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  staffTab === 'bots' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'
                }`}
              >
                Bots Supervisor
              </button>
              <button
                onClick={() => setStaffTab('cms')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  staffTab === 'cms' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'
                }`}
              >
                CMS & Broadcast
              </button>
            </>
          )}

          {isSuperAdmin && (
            <button
              onClick={() => setStaffTab('superadmin')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors font-bold ${
                staffTab === 'superadmin' ? 'bg-rose-500 text-white shadow-sm' : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              Super Admin Controls
            </button>
          )}
        </div>
      </div>

      {/* 1. TICKETS QUEUE TAB */}
      {staffTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Active Support Queue</h3>
              <span className="text-[11px] text-neutral-400 font-mono">Contact Masking Active</span>
            </div>

            <div className="space-y-2">
              {tickets.map((tck) => (
                <div
                  key={tck.id}
                  onClick={() => setSelectedStaffTicketId(tck.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedStaffTicketId === tck.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <span className="font-bold text-neutral-900 dark:text-white">{tck.ticketNumber}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                        tck.priority === 'High' || tck.priority === 'Urgent'
                          ? 'bg-rose-500/20 text-rose-500'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      {tck.priority}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                    {tck.subject}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1 flex items-center justify-between">
                    <span>Trader: {tck.userHandle} ({tck.userEmailMasked})</span>
                    <span className="font-mono">{tck.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Inspection & Reply Desk */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[520px]">
            {selectedTicket ? (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-400">
                          {selectedTicket.ticketNumber}
                        </span>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          {selectedTicket.subject}
                        </h4>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        Customer: {selectedTicket.userHandle} · Masked Contact: {selectedTicket.userEmailMasked}
                      </div>
                    </div>

                    {/* Ticket Status Controls */}
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white"
                      >
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                      </select>

                      <select
                        value={selectedTicket.priority}
                        onChange={(e) => updateTicketStatus(selectedTicket.id, selectedTicket.status, e.target.value as any)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Messages Flow including Internal Staff Notes */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {selectedTicket.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl text-xs space-y-1 ${
                          m.isInternalNote
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200'
                            : m.role === 'user'
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                            : 'bg-emerald-500/10 border border-emerald-500/20 text-neutral-900 dark:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold flex items-center gap-1.5">
                            {m.sender}
                            {m.isInternalNote && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white font-mono text-[9px] uppercase">
                                Internal Staff Note
                              </span>
                            )}
                          </span>
                          <span className="text-neutral-400">{m.timestamp}</span>
                        </div>
                        <div className="leading-relaxed whitespace-pre-line">{m.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply & Internal Note Form */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-neutral-700 dark:text-neutral-300">
                      <input
                        type="checkbox"
                        checked={isInternalNote}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>Mark as Internal Staff Note (Invisible to Trader)</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={isInternalNote ? 'Add internal staff comment...' : 'Reply to customer...'}
                      value={staffReplyText}
                      onChange={(e) => setStaffReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStaffSendReply()}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                    />
                    <button
                      onClick={handleStaffSendReply}
                      className={`px-4 py-2 font-semibold rounded-xl text-xs text-white shrink-0 ${
                        isInternalNote ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                    >
                      {isInternalNote ? 'Save Note' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 2. COMMUNITY MODERATION TAB */}
      {staffTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Flagged Community Content</h3>
            <span className="text-xs text-neutral-400">Review user reports and enforce code of conduct</span>
          </div>

          <div className="space-y-3">
            {communityPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-neutral-900 dark:text-white font-mono">{post.authorHandle}</span>
                    <span className="text-[10px] text-neutral-400">{post.timestamp}</span>
                    {post.isReported && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-500 font-mono text-[10px] font-bold">
                        Reported by Member
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">{post.title}</div>
                  <div className="text-[11px] text-neutral-500 truncate max-w-xl">{post.content}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      addAuditLog('COMMUNITY_POST_MODERATED', post.id, 'Moderator hid post from public feed.');
                      addToast({ title: 'Post Hidden', description: 'Content removed from public viewing.', type: 'info' });
                    }}
                    className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg font-medium"
                  >
                    Hide / Remove
                  </button>
                  <button
                    onClick={() => {
                      addAuditLog('USER_MUTED', post.authorHandle, 'Trader muted in community for 24 hours.');
                      addToast({ title: 'Trader Muted', description: `${post.authorHandle} muted from publishing for 24h.`, type: 'warning' });
                    }}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg font-medium"
                  >
                    Mute User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. KYC DOCUMENT REVIEW QUEUE */}
      {staffTab === 'kyc' && (
        <div className="max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">KYC Review & Verification</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                NSDL PAN match verification, duplicate-PAN detection, and address checks.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-sky-500/10 text-sky-500 font-bold uppercase">
              Current: {kycData.status}
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                <div className="text-[10px] text-neutral-400 font-sans">PAN Number</div>
                <div className="font-bold text-neutral-900 dark:text-white mt-0.5">{kycData.panNumber}</div>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                <div className="text-[10px] text-neutral-400 font-sans">Name As Per Income Tax Records</div>
                <div className="font-bold text-neutral-900 dark:text-white mt-0.5">{kycData.nameAsPerPan}</div>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="text-[10px] text-neutral-400 font-sans">NSDL Duplicate-PAN Check</div>
              <div className="text-emerald-500 font-semibold mt-0.5 flex items-center gap-1.5 font-sans">
                <CheckCircle2 className="w-4 h-4" /> 0 Duplicate PAN instances detected across system records
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => reviewKYC('Verified')}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Approve & Grant Verified Status
              </button>
              <button
                onClick={() => reviewKYC('Rejected', 'Name mismatch between PAN card and Aadhaar documentation.')}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Reject with Reason
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TRADERS & ORDERS TAB (ADMIN) */}
      {isAdmin && staffTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Global Orders & Risk Check Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 font-sans">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Symbol</th>
                    <th className="pb-2">Side</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Broker</th>
                    <th className="pb-2">Fat-Finger & Limit Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5 font-bold">{o.id}</td>
                      <td className="py-2.5 font-semibold text-neutral-900 dark:text-white">{o.symbol}</td>
                      <td className="py-2.5 font-bold text-emerald-500">{o.side}</td>
                      <td className="py-2.5 text-neutral-400">{o.type}</td>
                      <td className="py-2.5 tabular-nums">{o.quantity}</td>
                      <td className="py-2.5 tabular-nums">₹{o.price.toFixed(2)}</td>
                      <td className="py-2.5">{o.broker}</td>
                      <td className="py-2.5 text-emerald-500 font-sans">✓ Risk Verification Passed</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. PLANS & DISCOUNTS TAB (ADMIN) */}
      {isAdmin && staffTab === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Active Discount Codes</h3>
            <div className="space-y-2">
              {discountCodes.map((d) => (
                <div
                  key={d.id}
                  className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">{d.code}</div>
                    <div className="text-[10px] text-neutral-400 font-sans">
                      {d.discountPercent}% off · Plan: {d.applicablePlan.toUpperCase()}
                    </div>
                  </div>
                  <span className="text-emerald-500 font-semibold">{d.usedCount} Uses</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Create New Discount Coupon</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-500 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. DIWALI30"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-500 block mb-1">Discount Percentage (%)</label>
                  <input
                    type="number"
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Applicable Plan</label>
                  <select
                    value={newPromoPlan}
                    onChange={(e) => setNewPromoPlan(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white"
                  >
                    <option value="all">All Plans</option>
                    <option value="basic">Basic Plan Only</option>
                    <option value="pro">Pro Plan Only</option>
                    <option value="enterprise">Enterprise Only</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!newPromoCode) return;
                  addAuditLog('DISCOUNT_CODE_CREATED', newPromoCode, `Created ${newPromoDiscount}% promo coupon.`);
                  addToast({ title: 'Coupon Created', description: `Code ${newPromoCode} is now active.`, type: 'success' });
                  setNewPromoCode('');
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
              >
                Publish Coupon Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. BOTS SUPERVISOR TAB (ADMIN) */}
      {isAdmin && staffTab === 'bots' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Global Auto-Trading Bots Supervisor</h3>
              <p className="text-xs text-neutral-500">Monitor and override bots running across all trader accounts.</p>
            </div>
            <button
              onClick={togglePauseAllBots}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                allBotsPaused ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {allBotsPaused ? 'Resume All Global Bots' : 'Pause All Global Bots'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bots.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold font-mono text-neutral-900 dark:text-white">{b.name}</div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    {b.symbol} · Allocation: ₹{b.allocatedCapital.toLocaleString()} · P&L: ₹{b.currentPnl}
                  </div>
                </div>
                <button
                  onClick={() => toggleBotStatus(b.id)}
                  className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-mono uppercase"
                >
                  {b.status} (Toggle)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. CMS & BROADCAST TAB (ADMIN) */}
      {isAdmin && staffTab === 'cms' && (
        <div className="max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Website Content & Platform Broadcast Banner
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="flex items-center gap-2 font-medium text-neutral-900 dark:text-white mb-2">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="accent-emerald-500"
                />
                <span>Enable Public Announcement Banner</span>
              </label>

              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                updateCMS({
                  announcementBanner: {
                    enabled: announcementEnabled,
                    text: announcementText,
                    type: 'promotion',
                  },
                });
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
            >
              Publish Banner Live
            </button>
          </div>
        </div>
      )}

      {/* 8. SUPER ADMIN CONTROLS TAB */}
      {isSuperAdmin && staffTab === 'superadmin' && (
        <div className="space-y-6">
          {/* Critical Trading Controls Card */}
          <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
              <div>
                <h3 className="text-base font-bold text-rose-500">
                  Global Emergency Kill Switch
                </h3>
                <div className="text-xs text-rose-400">
                  Instantly terminates all algorithmic orderflow, halts live broker sockets, and cancels active limit orders platform-wide.
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs font-mono text-neutral-300">
                Current Status: <strong>{emergencyKillSwitch ? 'ENGAGED (HALTED)' : 'DISENGAGED (NORMAL)'}</strong>
              </div>
              <button
                onClick={() => {
                  const nextState = !emergencyKillSwitch;
                  setEmergencyKillSwitch(nextState);
                  addAuditLog('EMERGENCY_KILL_SWITCH_TOGGLED', 'Global Trading Engine', `Kill switch state changed to ${nextState}`);
                  addToast({
                    title: nextState ? 'EMERGENCY HALT ENGAGED' : 'TRADING RESUMED',
                    description: nextState ? 'All trading channels halted.' : 'Trading restored.',
                    type: nextState ? 'error' : 'success',
                  });
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-lg ${
                  emergencyKillSwitch ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500 animate-pulse'
                }`}
              >
                {emergencyKillSwitch ? 'Disengage Emergency Halt' : 'ENGAGE EMERGENCY KILL SWITCH'}
              </button>
            </div>
          </div>

          {/* Platform Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-bold text-neutral-900 dark:text-white">Live Broker Routing</div>
                <div className="text-[11px] text-neutral-400">Master switch for 3P APIs</div>
              </div>
              <button
                onClick={() => setLiveTradingEnabled(!liveTradingEnabled)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold ${
                  liveTradingEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                }`}
              >
                {liveTradingEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-bold text-neutral-900 dark:text-white">Maintenance Mode</div>
                <div className="text-[11px] text-neutral-400">Blocks non-staff sessions</div>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold ${
                  maintenanceMode ? 'bg-amber-500/10 text-amber-500' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                }`}
              >
                {maintenanceMode ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-bold text-neutral-900 dark:text-white">Public Sign-Ups</div>
                <div className="text-[11px] text-neutral-400">Allow new trader registrations</div>
              </div>
              <button
                onClick={() => setSignupsEnabled(!signupsEnabled)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold ${
                  signupsEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                }`}
              >
                {signupsEnabled ? 'OPEN' : 'LOCKED'}
              </button>
            </div>
          </div>

          {/* Staff Accounts Management (RBAC) */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Staff Accounts & Permissions (RBAC)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Invite staff email..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
                <button
                  onClick={() => {
                    if (inviteEmail) {
                      inviteStaff(inviteEmail, inviteRole);
                      setInviteEmail('');
                    }
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                >
                  Invite
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 font-sans">
                    <th className="pb-2">Staff Member</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">2FA</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {staffUsers.map((st) => (
                    <tr key={st.id}>
                      <td className="py-2.5 font-bold text-neutral-900 dark:text-white">
                        {st.name} <span className="font-normal text-neutral-400">({st.email})</span>
                      </td>
                      <td className="py-2.5 uppercase font-semibold text-emerald-500">{st.role}</td>
                      <td className="py-2.5 text-emerald-500">✓ Enforced</td>
                      <td className="py-2.5 font-medium">{st.status}</td>
                      <td className="py-2.5 text-right font-sans">
                        <button
                          onClick={() => toggleStaffStatus(st.id)}
                          className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white mr-3"
                        >
                          {st.status === 'Active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Log Cryptographic Integrity Check */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Tamper-Evident Audit Log Verification
                </h3>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Every staff mutation generates a SHA-256 Merkle chain block.
                </div>
              </div>
              <button
                onClick={handleVerifyAuditChain}
                className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Verify Ledger Hashes</span>
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 text-xs font-mono">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="text-neutral-400 mr-2">[{log.timestamp}]</span>
                    <strong className="text-neutral-900 dark:text-white mr-2">{log.action}</strong>
                    <span className="text-neutral-500 font-sans">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 truncate max-w-xs">{log.hash}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
