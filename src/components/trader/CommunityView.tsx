import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Share2,
  Flag,
  Send,
  Plus,
  Hash,
  Shield,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommunityView: React.FC = () => {
  const {
    communityPosts,
    createPost,
    likePost,
    addComment,
    reportPost,
    chatMessages,
    sendChatMessage,
    userHandle,
    userRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'feed' | 'chat'>('feed');
  const [activeChatRoom, setActiveChatRoom] = useState<string>('General');
  const [chatInput, setChatInput] = useState('');

  // New Post Dialog
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postSymbols, setPostSymbols] = useState('NIFTY 50');

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  // Report Modal
  const [reportModalPostId, setReportModalPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Off-topic / Unverified hype');

  const chatRooms = [
    { id: 'General', name: 'General Market Floor', count: 342 },
    { id: 'Indian Markets', name: 'NSE & BSE Equities', count: 512 },
    { id: 'US Equities', name: 'Wall Street & Tech', count: 184 },
    { id: 'Crypto & Web3', name: 'Bitcoin & Spot Crypto', count: 228 },
    { id: 'IPO Discussion', name: 'Indian IPO Bidding', count: 146 },
  ];

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) return;
    const syms = postSymbols
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    createPost(postTitle, postContent, syms);
    setNewPostModalOpen(false);
    setPostTitle('');
    setPostContent('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(activeChatRoom, chatInput.trim());
    setChatInput('');
  };

  const handleAddCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setActiveCommentPostId(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Trader Community & Synchronous Chat Rooms
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Share trade theses and debate orderflow anonymously. Personal emails and real legal names are permanently air-gapped.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'feed'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Trade Ideas Feed
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>Live Chat Rooms</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>
      </div>

      {/* 1. TRADE IDEAS FEED */}
      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-5">
            {/* Create Post Banner */}
            <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs font-mono">
                  {userHandle.substring(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Publish a trade idea or question
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Posting as: <span className="font-mono text-emerald-500">{userHandle}</span> (email masked)
                  </div>
                </div>
              </div>

              <button
                onClick={() => setNewPostModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Idea</span>
              </button>
            </div>

            {/* Posts List */}
            {communityPosts.map((post) => {
              if (post.isHidden) return null;
              return (
                <div
                  key={post.id}
                  className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono flex items-center justify-center font-bold text-xs">
                        {post.authorHandle.substring(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white font-mono">
                            {post.authorHandle}
                          </span>
                          {post.authorBadge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono">
                              {post.authorBadge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-400">{post.timestamp}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setReportModalPostId(post.id)}
                      className="text-neutral-400 hover:text-rose-500 p-1 transition-colors"
                      title="Report content"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Symbols Tags */}
                  {post.symbols.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {post.symbols.map((sym) => (
                        <span
                          key={sym}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-emerald-500"
                        >
                          ${sym}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Interactions Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => likePost(post.id)}
                        className={`flex items-center gap-1.5 hover:text-emerald-500 transition-colors ${
                          post.likedByMe ? 'text-emerald-500 font-bold' : ''
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="font-mono tabular-nums">{post.likes}</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                        }
                        className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="font-mono tabular-nums">{post.commentsCount}</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-neutral-400 font-mono">
                      End-to-End Pseudonymous
                    </div>
                  </div>

                  {/* Comments Thread */}
                  {activeCommentPostId === post.id && (
                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-3">
                      <div className="space-y-2">
                        {post.comments.map((c) => (
                          <div
                            key={c.id}
                            className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                              <span className="font-bold text-neutral-800 dark:text-neutral-200">
                                {c.authorHandle}
                              </span>
                              <span>{c.timestamp}</span>
                            </div>
                            <div className="text-neutral-700 dark:text-neutral-300">{c.text}</div>
                          </div>
                        ))}
                      </div>

                      {/* Add comment box */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Write a constructive comment or critique..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCommentSubmit(post.id)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddCommentSubmit(post.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shrink-0"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Sidebar: Rules & Guidelines */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs space-y-3 text-xs">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Community Code of Conduct
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                To maintain institutional-grade quality, our moderator team strictly flags and deletes paid tip groups, pump-and-dump coordination, or unsolicited solicitations.
              </p>
              <div className="space-y-2 text-[11px] text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Back trade ideas with charts or rationale</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Tag instruments with $SYMBOL format</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Zero sharing of personal emails or phone numbers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SYNCHRONOUS LIVE CHAT ROOMS */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px]">
          {/* Left Rooms Directory */}
          <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-1">
              <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase px-2 mb-2">
                Active Trading Rooms
              </div>
              {chatRooms.map((room) => {
                const isActive = activeChatRoom === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => setActiveChatRoom(room.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-xs ${
                      isActive
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-emerald-500" />
                      <span>{room.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">{room.count} live</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl text-[11px] text-neutral-500">
              Active identity: <strong className="text-neutral-900 dark:text-white font-mono">{userHandle}</strong>
            </div>
          </div>

          {/* Right Live Messages Stream */}
          <div className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col justify-between shadow-xs overflow-hidden">
            {/* Room Header */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-emerald-500" />
                  {activeChatRoom}
                </h3>
                <div className="text-[11px] text-neutral-400">Stream encrypted via WebSocket</div>
              </div>
              <span className="text-xs font-mono text-emerald-500 font-semibold">● 100% Online</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {(chatMessages[activeChatRoom] || []).map((msg) => {
                const isMe = msg.senderHandle === userHandle;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} text-xs`}
                  >
                    <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 mb-0.5">
                      <span className="font-bold text-neutral-700 dark:text-neutral-300">
                        {msg.senderHandle}
                      </span>
                      {msg.senderRole && msg.senderRole !== 'trader' && (
                        <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-500 uppercase text-[9px]">
                          {msg.senderRole}
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-2xl max-w-md leading-relaxed ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-tr-xs'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950/40">
              <input
                type="text"
                placeholder={`Message #${activeChatRoom}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {newPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
              Publish Trade Idea
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Your author handle will be displayed as <strong>{userHandle}</strong>.
            </p>

            <form onSubmit={handleCreatePostSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIFTY 50 25,200 Call Writing Absorption Setup"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Symbols Tagged (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. NIFTY 50, RELIANCE, BANKNIFTY"
                  value={postSymbols}
                  onChange={(e) => setPostSymbols(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Analysis & Thesis
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the technical setup, volume profile, or orderflow structure..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewPostModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Publish to Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
              Report Inappropriate Content
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Help our compliance and moderation desks maintain high-quality discussions.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Reason for flag
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option>Off-topic / Unverified hype</option>
                  <option>Spam or commercial solicitation</option>
                  <option>Abusive or aggressive language</option>
                  <option>Attempted pump-and-dump scheme</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setReportModalPostId(null)}
                  className="flex-1 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    reportPost(reportModalPostId, reportReason);
                    setReportModalPostId(null);
                  }}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Submit Flag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
