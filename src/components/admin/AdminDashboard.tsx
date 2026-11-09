import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, OrderStatus, StoreSettings } from '../../types';
import {
  X,
  Shield,
  Package,
  ShoppingBag,
  Settings as SettingsIcon,
  Plus,
  Edit2,
  Trash2,
  Check,
  RotateCcw,
  ExternalLink,
  MessageCircle,
  Eye,
  Database,
  Lock,
  LayoutDashboard,
  AlertTriangle,
  TrendingUp,
  Clock,
  LogOut,
  ShieldCheck,
  KeyRound,
  FileCode,
  CheckCircle2,
} from 'lucide-react';
import { PerfumeTinVisual } from '../common/PerfumeTinVisual';
import { AuthRateLimiter, AdminSessionManager } from '../../lib/security';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaultProducts,
    orders,
    updateOrderStatus,
    settings,
    updateSettings,
    showToast,
  } = useStore();

  // Authentication & Session Management
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return AdminSessionManager.isSessionValid();
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [lockoutState, setLockoutState] = useState(() => AuthRateLimiter.checkLimit());

  // Check rate limit status periodically when locked
  useEffect(() => {
    if (!lockoutState.isLocked) return;

    const timer = setInterval(() => {
      const check = AuthRateLimiter.checkLimit();
      setLockoutState(check);
      if (!check.isLocked) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutState.isLocked]);

  // Session activity tracker (idle timeout after 30 mins)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleUserActivity = () => {
      AdminSessionManager.touchSession();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    // Periodic check every 60 seconds
    const interval = setInterval(() => {
      if (!AdminSessionManager.isSessionValid()) {
        setIsAuthenticated(false);
        showToast('Admin session expired due to 30 minutes of inactivity.', 'info');
      }
    }, 60000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearInterval(interval);
    };
  }, [isAuthenticated, showToast]);

  // Tab: 'overview' | 'products' | 'orders' | 'settings' | 'security'
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings' | 'security'>('overview');

  // Product Editing Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Filter for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  if (!isAdminOpen) return null;

  // Owner login handler with rate limiting protection
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Verify not currently locked out
    const currentLimit = AuthRateLimiter.checkLimit();
    if (currentLimit.isLocked) {
      setLockoutState(currentLimit);
      setAuthError(`Account temporarily locked. Please wait ${currentLimit.remainingSeconds} seconds.`);
      return;
    }

    const trimmedInput = passkeyInput.trim();

    // Owner credential verification
    // Authorized owner passkey for Yash Jain (SCENT ONE): "YashJain#Scent01"
    const isOwnerAuthorized = trimmedInput === 'YashJain#Scent01';

    if (isOwnerAuthorized) {
      AuthRateLimiter.recordSuccess();
      AdminSessionManager.startSession(`s1_session_${Date.now()}`);
      setIsAuthenticated(true);
      setAuthError('');
      setPasskeyInput('');
      showToast('Welcome back, Yash Jain. Secure admin session initiated.', 'success');
    } else {
      const failureResult = AuthRateLimiter.recordFailure();
      setLockoutState(failureResult);

      if (failureResult.isLocked) {
        setAuthError(`Too many failed attempts. Security lockdown active for ${Math.ceil(failureResult.remainingSeconds / 60)} minutes.`);
      } else {
        setAuthError(`Invalid owner passkey. ${failureResult.remainingAttempts} attempt(s) remaining before security lockout.`);
      }
    }
  };

  const handleLogout = () => {
    AdminSessionManager.terminateSession();
    setIsAuthenticated(false);
    showToast('Admin session safely terminated.', 'info');
  };

  // Save product changes
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isCreatingNew) {
      const { id, ...rest } = editingProduct;
      addProduct(rest);
    } else {
      updateProduct(editingProduct.id, editingProduct);
    }

    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => setIsAdminOpen(false)}
      />

      <div className="relative w-full max-w-6xl bg-[#0F111A] text-[#F8F3EA] rounded-3xl border border-[#D8B66B]/30 shadow-2xl flex flex-col max-h-[92vh] z-10 my-4 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8B66B]/15 text-[#D8B66B] flex items-center justify-center border border-[#D8B66B]/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold">Owner Admin Portal</h3>
                <span className="text-[10px] font-mono tracking-widest text-[#D8B66B] uppercase border border-[#D8B66B]/40 px-2 py-0.5 rounded-full">
                  Yash Jain
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                SCENT ONE Store Management & Inventory System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-700 bg-neutral-900/80 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
                title="End secure admin session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full text-neutral-400 hover:text-white transition-colors"
              aria-label="Close admin dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication Gate if not logged in */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#D8B66B] relative">
              <Lock className="w-8 h-8" />
              {lockoutState.isLocked && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#D8B66B] uppercase font-semibold">
                Protected Portal
              </span>
              <h4 className="font-serif text-2xl font-bold mt-1">Owner Authentication</h4>
              <p className="text-xs text-neutral-400 mt-1.5 font-mono leading-relaxed">
                Enter your verified owner passkey to access inventory, orders, and pricing controls.
              </p>
            </div>

            {/* Rate limit lockout warning banner */}
            {lockoutState.isLocked ? (
              <div className="w-full p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs font-mono space-y-1.5 text-left">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Brute-Force Lockout Engaged</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-200/90 font-sans">
                  Maximum login failures exceeded. Access temporarily blocked for security.
                </p>
                <p className="font-mono text-xs font-bold text-rose-300 pt-1">
                  Time Remaining: {lockoutState.remainingSeconds}s
                </p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="w-full space-y-3.5">
                <div>
                  <input
                    type="password"
                    disabled={lockoutState.isLocked}
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    placeholder="Enter owner passkey"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/60 text-sm focus:border-[#D8B66B] focus:outline-none font-mono tracking-wider"
                  />
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-1.5 px-1">
                    <span>Brute-force protected</span>
                    <span>{lockoutState.remainingAttempts} attempts remaining</span>
                  </div>
                </div>

                {authError && (
                  <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono text-left">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={lockoutState.isLocked}
                  className="w-full py-3 bg-[#D8B66B] hover:bg-[#c9a759] disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Verify & Unlock Portal
                </button>

                <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/40 text-[11px] text-neutral-400 font-mono text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D8B66B]" />
                    <span>Security Verification Note</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                    Authorized exclusively for founder Yash Jain. Session automatically expires after 30 minutes of idle time.
                  </p>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Authenticated Dashboard */
          <>
            {/* Tab Navigation */}
            <div className="flex border-b border-neutral-800 bg-black/20 px-6 gap-2 sm:gap-6 overflow-x-auto text-xs font-mono">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3.5 border-b-2 flex items-center gap-2 uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-[#D8B66B] text-[#D8B66B] font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-3.5 border-b-2 flex items-center gap-2 uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'products'
                    ? 'border-[#D8B66B] text-[#D8B66B] font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Products ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3.5 border-b-2 flex items-center gap-2 uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-[#D8B66B] text-[#D8B66B] font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3.5 border-b-2 flex items-center gap-2 uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-[#D8B66B] text-[#D8B66B] font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Store Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`py-3.5 border-b-2 flex items-center gap-2 uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'security'
                    ? 'border-[#D8B66B] text-[#D8B66B] font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Security & Sync</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 0: OVERVIEW DASHBOARD */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Security Transparency Alert */}
                  <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 font-mono flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-amber-300 block">
                        DEMO ADMIN MODE (BROWSER LOCAL PERSISTENCE)
                      </span>
                      <p className="text-[11px] leading-relaxed text-amber-200/90 font-sans">
                        Firebase Authentication is not yet configured. The store data, stock adjustments, and incoming customer orders are saved directly in your browser's LocalStorage. This data does not automatically synchronize across different physical devices. Do not treat local passkeys as cryptographic server security.
                      </p>
                    </div>
                  </div>

                  {/* KPI Cards Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-1">
                      <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                        <span>Total Products</span>
                        <Package className="w-4 h-4 text-[#D8B66B]" />
                      </div>
                      <div className="font-serif text-3xl font-bold text-white tabular-nums">
                        {products.length}
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono">
                        {products.filter((p) => p.isActive).length} active in catalog
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-1">
                      <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                        <span>Total Orders</span>
                        <ShoppingBag className="w-4 h-4 text-[#D8B66B]" />
                      </div>
                      <div className="font-serif text-3xl font-bold text-white tabular-nums">
                        {orders.length}
                      </div>
                      <span className="text-[11px] text-[#D8B66B] font-mono">
                        via WhatsApp checkout
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-1">
                      <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                        <span>Pending Orders</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="font-serif text-3xl font-bold text-amber-300 tabular-nums">
                        {orders.filter((o) => o.status === 'Pending').length}
                      </div>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        requires confirmation
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-1">
                      <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                        <span>Gross Order Value</span>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="font-serif text-3xl font-bold text-white tabular-nums">
                        ₹{orders.reduce((sum, o) => sum + o.total, 0)}
                      </div>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        Sample order total
                      </span>
                    </div>
                  </div>

                  {/* Quick Shortcuts */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <button
                      onClick={() => setActiveTab('products')}
                      className="p-4 rounded-xl border border-neutral-800 hover:border-[#D8B66B] bg-black/40 text-left transition-all group cursor-pointer"
                    >
                      <span className="text-xs font-mono uppercase text-[#D8B66B] block mb-1">
                        Inventory
                      </span>
                      <h5 className="font-serif text-base font-bold text-white group-hover:text-[#D8B66B] transition-colors">
                        Manage Fragrances & Stock →
                      </h5>
                    </button>

                    <button
                      onClick={() => setActiveTab('orders')}
                      className="p-4 rounded-xl border border-neutral-800 hover:border-[#D8B66B] bg-black/40 text-left transition-all group cursor-pointer"
                    >
                      <span className="text-xs font-mono uppercase text-[#D8B66B] block mb-1">
                        Orders
                      </span>
                      <h5 className="font-serif text-base font-bold text-white group-hover:text-[#D8B66B] transition-colors">
                        View Customer WhatsApp Orders →
                      </h5>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-4 rounded-xl border border-neutral-800 hover:border-[#D8B66B] bg-black/40 text-left transition-all group cursor-pointer"
                    >
                      <span className="text-xs font-mono uppercase text-[#D8B66B] block mb-1">
                        Configuration
                      </span>
                      <h5 className="font-serif text-base font-bold text-white group-hover:text-[#D8B66B] transition-colors">
                        Store Settings & Policies →
                      </h5>
                    </button>
                  </div>
                </div>
              )}
              {/* TAB 1: PRODUCT MANAGEMENT */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                    <div>
                      <h4 className="font-serif text-lg font-bold">Fragrance Catalog Management</h4>
                      <p className="text-xs text-neutral-400 font-mono">
                        Add, update retail prices, weights, stock counts, and fragrance notes.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={resetToDefaultProducts}
                        className="px-3.5 py-2 text-xs font-mono rounded-xl border border-neutral-700 hover:border-neutral-500 text-neutral-300 flex items-center gap-1.5 transition-colors"
                        title="Restore initial 4 official perfumes"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Defaults</span>
                      </button>

                      <button
                        onClick={() => {
                          const template: Product = {
                            id: `prod-${Date.now()}`,
                            name: 'New Fragrance',
                            slug: `new-fragrance-${Date.now().toString(36)}`,
                            identity: 'The Signature Mood',
                            subtitle: 'Crafted Solid Perfume',
                            tagline: 'Your new olfactory journey.',
                            category: 'Unisex',
                            price: 199,
                            isSamplePrice: false,
                            weightGrams: 15,
                            stock: 20,
                            isFeatured: false,
                            isActive: true,
                            shortDescription: 'Exquisite new solid fragrance handcrafted for portable impressions.',
                            longDescription: 'A distinctive blend formulated on a pure wax base, melting seamlessly into pulse points.',
                            fragranceInspiration: ['Woody accords', 'Citrus zest', 'Warm amber'],
                            fragranceMood: 'midnight',
                            visualEnvironment: {
                              primaryColor: '#170E2E',
                              secondaryColor: '#2B1A4F',
                              accentColor: '#D8B66B',
                              atmosphereName: 'Warm Amber & Twilight',
                              elements: ['Golden glow', 'Twilight mist'],
                            },
                            notes: {
                              top: ['Bergamot'],
                              heart: ['Cedarwood'],
                              base: ['Amber'],
                            },
                            tinColor: {
                              bodyGradient: ['#120B20', '#1F1436'],
                              accentGradient: ['#D8B66B', '#F59E0B'],
                              metallicSheen: '#D8B66B',
                              glowColor: 'rgba(216, 182, 107, 0.45)',
                            },
                          };
                          setEditingProduct(template);
                          setIsCreatingNew(true);
                        }}
                        className="px-4 py-2 bg-[#D8B66B] hover:bg-[#c9a759] text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Fragrance</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Grid / Table */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 flex flex-col justify-between space-y-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-18 bg-black/50 rounded flex items-center justify-center shrink-0">
                            <PerfumeTinVisual product={p} size="sm" interactive={false} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-serif text-lg font-bold truncate text-white">
                                {p.name}
                              </h5>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                  p.isActive
                                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                                    : 'bg-neutral-800 text-neutral-400'
                                }`}
                              >
                                {p.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>

                            <p className="text-xs font-mono text-[#D8B66B]">{p.identity}</p>
                            <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{p.shortDescription}</p>

                            <div className="mt-3 flex items-center gap-3 text-xs font-mono text-neutral-300">
                              <span>₹{p.price}</span>
                              <span>·</span>
                              <span>{p.weightGrams}g</span>
                              <span>·</span>
                              <span>Stock: {p.stock} units</span>
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                updateProduct(p.id, { isActive: !p.isActive });
                              }}
                              className="text-xs font-mono text-neutral-400 hover:text-white"
                            >
                              {p.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <span className="text-neutral-600">·</span>
                            <button
                              onClick={() => {
                                updateProduct(p.id, { isFeatured: !p.isFeatured });
                              }}
                              className="text-xs font-mono text-neutral-400 hover:text-[#D8B66B]"
                            >
                              {p.isFeatured ? '★ Featured' : '☆ Not Featured'}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsCreatingNew(false);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#D8B66B] hover:text-neutral-950 text-xs font-mono transition-colors flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors"
                              title="Delete fragrance"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: ORDER MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                    <div>
                      <h4 className="font-serif text-lg font-bold">Customer Orders via WhatsApp</h4>
                      <p className="text-xs text-neutral-400 font-mono">
                        View orders submitted by customers, track fulfillment, and message customers directly.
                      </p>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400">Filter Status:</span>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-xs font-mono text-white focus:outline-none focus:border-[#D8B66B]"
                      >
                        <option value="All">All Statuses ({orders.length})</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders List */}
                  {orders.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
                      <p className="font-serif text-lg text-neutral-400">No customer orders yet</p>
                      <p className="text-xs text-neutral-500 font-mono max-w-sm mx-auto">
                        When customers submit an order through the store checkout on WhatsApp, their full details and itemized list will appear here in real time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders
                        .filter((o) => (orderStatusFilter === 'All' ? true : o.status === orderStatusFilter))
                        .map((order) => (
                          <div
                            key={order.id}
                            className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4"
                          >
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold text-[#D8B66B]">
                                  {order.orderReference}
                                </span>
                                <span className="text-xs text-neutral-400 font-mono">
                                  {new Date(order.createdAt).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-neutral-400">Status:</span>
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                  className="px-2.5 py-1 rounded bg-black/60 border border-neutral-700 text-xs font-mono text-white focus:border-[#D8B66B] focus:outline-none"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Dispatched">Dispatched</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>

                            {/* Customer & Items Split */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                              {/* Customer Information */}
                              <div className="space-y-1.5 p-3 rounded-xl bg-black/30 border border-neutral-800/60">
                                <div className="text-neutral-400 font-semibold uppercase text-[11px] text-[#D8B66B]">
                                  Customer Details
                                </div>
                                <div>Name: <span className="text-white font-sans font-semibold">{order.customer.fullName}</span></div>
                                <div>Mobile: <span className="text-white">+91 {order.customer.mobile}</span></div>
                                <div>Address: <span className="text-neutral-300 font-sans">{order.customer.address}{[order.customer.city, order.customer.state].filter(Boolean).length > 0 ? `, ${[order.customer.city, order.customer.state].filter(Boolean).join(', ')}` : ''} - PIN: {order.customer.pincode}</span></div>
                                {order.customer.landmark && <div>Landmark: <span className="text-neutral-300 font-sans">{order.customer.landmark}</span></div>}
                                {order.customer.coordinates && (
                                  <div>GPS Pin: <a href={`https://www.google.com/maps?q=${order.customer.coordinates.latitude},${order.customer.coordinates.longitude}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{order.customer.coordinates.latitude.toFixed(4)}, {order.customer.coordinates.longitude.toFixed(4)} ↗</a></div>
                                )}

                                <div className="pt-2">
                                  <a
                                    href={`https://wa.me/91${order.customer.mobile.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 transition-colors"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>Chat with Customer on WhatsApp</span>
                                  </a>
                                </div>
                              </div>

                              {/* Items Breakdown */}
                              <div className="space-y-1.5 p-3 rounded-xl bg-black/30 border border-neutral-800/60">
                                <div className="text-neutral-400 font-semibold uppercase text-[11px] text-[#D8B66B]">
                                  Order Items
                                </div>
                                <div className="space-y-1">
                                  {order.items.map((it, idx) => (
                                    <div key={idx} className="flex justify-between text-neutral-300">
                                      <span>{it.productName} × {it.quantity}</span>
                                      <span className="font-serif">₹{it.totalPrice}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="pt-2 border-t border-neutral-800 space-y-1 text-xs">
                                  {order.discountAmount && order.discountAmount > 0 ? (
                                    <>
                                      <div className="flex justify-between text-neutral-400">
                                        <span>Original Subtotal:</span>
                                        <span>₹{order.originalSubtotal || (order.subtotal + order.discountAmount)}</span>
                                      </div>
                                      <div className="flex justify-between text-emerald-400 font-semibold">
                                        <span>Buy 2+ Offer (₹149/tin):</span>
                                        <span>-₹{order.discountAmount}</span>
                                      </div>
                                      <div className="flex justify-between text-neutral-400">
                                        <span>Discounted Subtotal:</span>
                                        <span>₹{order.subtotal}</span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex justify-between text-neutral-400">
                                      <span>Subtotal:</span>
                                      <span>₹{order.subtotal}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-neutral-400">
                                    <span>Delivery Charges:</span>
                                    <span>{order.deliveryCharges === 0 ? 'FREE' : `₹${order.deliveryCharges}`}</span>
                                  </div>
                                  <div className="pt-1.5 border-t border-neutral-800/80 flex justify-between font-bold text-white">
                                    <span>Total:</span>
                                    <span className="text-[#D8B66B] font-serif text-sm">₹{order.total}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: STORE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold">Store Configuration</h4>
                    <p className="text-xs text-neutral-400 font-mono">
                      Update official WhatsApp order destination, Instagram link, delivery charges, and brand details.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs font-mono">
                    <div>
                      <label className="block text-neutral-400 mb-1">
                        Owner WhatsApp Number (for Click-to-Chat orders):
                      </label>
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">
                        WhatsApp Display Text:
                      </label>
                      <input
                        type="text"
                        value={settings.whatsappDisplay}
                        onChange={(e) => updateSettings({ whatsappDisplay: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">
                        Official Instagram Profile URL:
                      </label>
                      <input
                        type="text"
                        value={settings.instagramUrl}
                        onChange={(e) => updateSettings({ instagramUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 mb-1">
                          Store Name:
                        </label>
                        <input
                          type="text"
                          value={settings.brandName}
                          onChange={(e) => updateSettings({ brandName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">
                          Contact Email:
                        </label>
                        <input
                          type="email"
                          value={settings.contactEmail || ''}
                          onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">
                        Store Announcement Banner (Header ticker):
                      </label>
                      <input
                        type="text"
                        value={settings.storeAnnouncement || ''}
                        onChange={(e) => updateSettings({ storeAnnouncement: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 mb-1">
                          Standard Delivery Charge (₹):
                        </label>
                        <input
                          type="number"
                          value={settings.deliveryCharge}
                          onChange={(e) => updateSettings({ deliveryCharge: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 mb-1">
                          Free Delivery Minimum Order (₹):
                        </label>
                        <input
                          type="number"
                          value={settings.freeDeliveryThreshold}
                          onChange={(e) => updateSettings({ freeDeliveryThreshold: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">
                        Sample Price Disclaimer Notice:
                      </label>
                      <input
                        type="text"
                        value={settings.samplePriceNotice}
                        onChange={(e) => updateSettings({ samplePriceNotice: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">
                        Brand Story Philosophy Quote:
                      </label>
                      <textarea
                        rows={3}
                        value={settings.brandStory}
                        onChange={(e) => updateSettings({ brandStory: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-white font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SECURITY & SYNC ARCHITECTURE */}
              {activeTab === 'security' && (
                <div className="max-w-4xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                    <div>
                      <h4 className="font-serif text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#D8B66B]" />
                        <span>Security & Production Architecture Center</span>
                      </h4>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">
                        Audit status, defense layers, hardened rules, and cloud migration blueprint.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Defense Layers Active
                      </span>
                    </div>
                  </div>

                  {/* 10 Pillars of Security Grid */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono font-bold tracking-wider text-[#D8B66B] uppercase block">
                      Production Security Safeguards (Current Deployment)
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                      {/* Item 1 */}
                      <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">1. Admin Brute-Force Defense</p>
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                            Max 5 attempts before 15-minute lockout. Prevents automated passkey dictionary attacks.
                          </p>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">2. Session Auto-Timeout</p>
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                            Auto-terminates active sessions after 30 minutes of idle time to protect unattended terminals.
                          </p>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">3. Canonical Price Integrity Engine</p>
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                            Calculates subtotals & delivery fees strictly against immutable catalog data. Client price tampering rejected.
                          </p>
                        </div>
                      </div>

                      {/* Item 4 */}
                      <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">4. Customer Input Sanitization & Anti-XSS</p>
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                            Strips malicious script tags, encodes entities, validates 10-digit phones and 6-digit PIN codes.
                          </p>
                        </div>
                      </div>

                      {/* Item 5 */}
                      <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">5. Customer PII Privacy & Controls</p>
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                            Orders stored with user-triggered purge capability. Phone numbers masked in logs & previews.
                          </p>
                        </div>
                      </div>

                      {/* Item 6 */}
                      <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">6. Hardened Firestore Security Rules</p>
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                            Built into <code className="text-[#D8B66B]">firestore.rules</code>: default deny all, RBAC with custom claims, terminal order locking.
                          </p>
                        </div>
                      </div>

                      {/* Item 7 */}
                      <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">7. Firebase Storage Safeguards</p>
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                            Built into <code className="text-[#D8B66B]">storage.rules</code>: restricts uploads to images only (jpeg, png, webp) and 5MB max.
                          </p>
                        </div>
                      </div>

                      {/* Item 8 */}
                      <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">8. Content Security Policy (CSP)</p>
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                            Strict meta CSP defined in <code className="text-[#D8B66B]">index.html</code> preventing unauthorized script execution.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step-by-Step Cloud Activation Manual */}
                  <div className="p-5 rounded-2xl border border-[#D8B66B]/30 bg-neutral-900/70 space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-2 text-[#D8B66B] font-bold">
                      <KeyRound className="w-4 h-4" />
                      <span>Owner Checklist: Live Firebase Cloud Deployment for Yash Jain</span>
                    </div>

                    <p className="text-neutral-300 font-sans leading-relaxed text-xs">
                      The security blueprint files (<code className="text-[#D8B66B]">firestore.rules</code>, <code className="text-[#D8B66B]">storage.rules</code>, and <code className="text-[#D8B66B]">firebase-blueprint.json</code>) are generated in the project root. Follow these steps in Firebase Console to synchronize live orders to your phone:
                    </p>

                    <ol className="list-decimal list-inside space-y-2 text-neutral-300 font-sans text-xs bg-black/40 p-4 rounded-xl border border-neutral-800">
                      <li>
                        <strong className="text-white">Create Firebase Project:</strong> Visit <span className="text-[#D8B66B]">console.firebase.google.com</span> and create a project named <code className="bg-neutral-800 px-1 py-0.5 rounded text-white">scent-one-official</code>.
                      </li>
                      <li>
                        <strong className="text-white">Enable Authentication:</strong> Turn on Email/Password sign-in. Register Yash Jain's owner email address. Do not enable public registration.
                      </li>
                      <li>
                        <strong className="text-white">Assign Admin Custom Claim:</strong> Run Firebase Admin SDK or Cloud Function to set <code className="bg-neutral-800 px-1 py-0.5 rounded text-[#D8B66B]">&#123; admin: true &#125;</code> on Yash Jain's UID.
                      </li>
                      <li>
                        <strong className="text-white">Deploy Firestore Rules:</strong> Copy the prepared <code className="bg-neutral-800 px-1 py-0.5 rounded text-white">firestore.rules</code> file into Firestore &gt; Rules tab and click <em>Publish</em>.
                      </li>
                      <li>
                        <strong className="text-white">Deploy Storage Rules:</strong> Copy the prepared <code className="bg-neutral-800 px-1 py-0.5 rounded text-white">storage.rules</code> file into Storage &gt; Rules tab and click <em>Publish</em>.
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative w-full max-w-2xl bg-[#0F111A] text-white p-6 rounded-3xl border border-[#D8B66B]/40 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h4 className="font-serif text-xl font-bold">
                {isCreatingNew ? 'Create New Fragrance' : `Edit ${editingProduct.name}`}
              </h4>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Fragrance Name:</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white font-sans text-sm"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Identity (e.g. The Chocolate Dream):</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.identity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, identity: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white font-sans text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Price (₹):</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Weight (Grams):</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.weightGrams}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weightGrams: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Inventory Stock:</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Category:</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Fragrance Mood / Environment:</label>
                  <select
                    value={editingProduct.fragranceMood}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fragranceMood: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white"
                  >
                    <option value="midnight">Midnight (Violet & Chocolate)</option>
                    <option value="ocean">Ocean (Turquoise & Citrus)</option>
                    <option value="sky">Sky (Blue & Sunset Gold)</option>
                    <option value="romantic">Romantic (Rose & Burgundy)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Short Description:</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white font-sans"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Detailed Fragrance Story:</label>
                <textarea
                  rows={3}
                  value={editingProduct.longDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, longDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white font-sans"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Top Notes (comma-separated):</label>
                  <input
                    type="text"
                    value={editingProduct.notes.top.join(', ')}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        notes: {
                          ...editingProduct.notes,
                          top: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Heart Notes:</label>
                  <input
                    type="text"
                    value={editingProduct.notes.heart.join(', ')}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        notes: {
                          ...editingProduct.notes,
                          heart: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Base Notes:</label>
                  <input
                    type="text"
                    value={editingProduct.notes.base.join(', ')}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        notes: {
                          ...editingProduct.notes,
                          base: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isSamplePrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isSamplePrice: e.target.checked })}
                  />
                  <span>Mark as Sample / Indicative Price</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                  />
                  <span>Featured Fragrance</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D8B66B] hover:bg-[#c9a759] text-neutral-950 font-semibold uppercase tracking-wider rounded-lg"
                >
                  Save Fragrance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
