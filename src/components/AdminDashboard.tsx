import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ProductConfig, Order, AdminAnalytics } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, sendPasswordResetEmail, User } from 'firebase/auth';
import { firestoreService } from '../services/firestoreService';
import { 
  Lock, X, TrendingUp, IndianRupee, ShoppingBag, CheckCircle, 
  AlertCircle, Download, Search, RefreshCw, Save, Sliders, ShieldCheck, 
  ExternalLink, FileText, Smartphone, Database, LogOut
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: (product: ProductConfig) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onProductUpdated
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'product' | 'gateway'>('orders');

  // Forgot password & Firebase recovery state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('gig.ritik546@gmail.com');
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [productForm, setProductForm] = useState<ProductConfig | null>(null);
  const [razorpayConfigured, setRazorpayConfigured] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        // If user is verified project owner/admin
        if (user.email === 'gig.ritik546@gmail.com') {
          setIsAuthenticated(true);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchAdminData();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await api.adminLogin(password);
      if (res.success) {
        setIsAuthenticated(true);
        fetchAdminData();
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid password (Default: admin)');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);
    const emailToReset = resetEmail.trim();
    if (!emailToReset) {
      setResetStatus({ type: 'error', message: 'Please enter a valid administrator email.' });
      return;
    }

    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, emailToReset);
      setResetStatus({
        type: 'success',
        message: `Password reset instructions dispatched to ${emailToReset}. Please check your inbox!`
      });
    } catch (err: any) {
      console.warn('Firebase password reset error:', err);
      setResetStatus({
        type: 'error',
        message: err.message || 'Failed to send password reset email. Please verify the email.'
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoginError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        fetchAdminData();
      }
    } catch (err: any) {
      console.warn('Firebase popup signin error:', err);
      setLoginError(err.message || 'Firebase sign-in failed');
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminData();
      setOrders(data.orders);
      setAnalytics(data.analytics);
      setProductForm(data.product);
      setRazorpayConfigured(data.razorpayConfigured);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm) return;

    setLoading(true);
    try {
      const res = await api.updateProduct(productForm);
      if (res.success) {
        setSaveSuccess(true);
        onProductUpdated(res.product);
        // Also persist changes to Firestore for cloud persistence
        firestoreService.saveProductConfig(productForm);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#090e1c] border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-['Outfit']">Seller Admin Dashboard</h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Database className="w-2.5 h-2.5" />
                  Firebase Firestore
                </span>
              </div>
              <p className="text-xs text-slate-400">The Money Maker • Orders, Revenue & Content Controls</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                title="Sign out of admin"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication Wall if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400 mb-2">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-white">Unlock Admin Dashboard</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              Manage product pricing, customer orders, digital download access, and live Firestore database records.
            </p>

            {!isForgotPassword ? (
              <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3 pt-2">
                <input
                  type="password"
                  placeholder="Enter password (default: admin)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm text-center focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                {loginError && (
                  <p className="text-xs text-rose-400">{loginError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Unlock Dashboard
                </button>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setResetStatus(null);
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="w-full max-w-xs space-y-3 pt-2 text-left">
                <div className="text-center mb-1">
                  <p className="text-xs text-slate-300 font-semibold">Firebase Password Recovery</p>
                  <p className="text-[11px] text-slate-400">Enter your registered admin email</p>
                </div>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                  autoFocus
                />
                {resetStatus && (
                  <div className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                    resetStatus.type === 'success'
                      ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/60 border border-rose-500/50 text-rose-300'
                  }`}>
                    {resetStatus.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <span>{resetStatus.message}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSendingReset ? 'Sending Reset Email...' : 'Send Password Reset Link'}
                </button>
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetStatus(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    ← Back to Password Login
                  </button>
                </div>
              </form>
            )}

            <div className="w-full max-w-xs pt-3 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-400 mb-2">Or verify via Firebase Admin</p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* KPI Analytics Cards */}
            {analytics && (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                    ₹{analytics.totalRevenue}
                  </p>
                  <span className="text-[10px] text-slate-500">Gross INR collected</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Paid Orders</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                    {analytics.successfulPayments}
                  </p>
                  <span className="text-[10px] text-emerald-400">Completed & Verified</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">All Orders</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                    {analytics.totalOrders}
                  </p>
                  <span className="text-[10px] text-slate-500">Initiated checkouts</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Conversion</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-teal-400 mt-1">
                    {analytics.conversionRate}%
                  </p>
                  <span className="text-[10px] text-slate-500">Checkout to paid ratio</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 lg:col-span-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">PDF Downloads</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-blue-400 mt-1">
                    {analytics.totalDownloads}
                  </p>
                  <span className="text-[10px] text-slate-500">Total client deliveries</span>
                </div>
              </div>
            )}

            {/* Dashboard Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'orders' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Customer Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('product')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'product' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Product & Pricing
                </button>
                <button
                  onClick={() => setActiveTab('gateway')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'gateway' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Razorpay Gateway Status
                </button>
              </div>

              <button
                onClick={fetchAdminData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white"
                title="Refresh latest data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Tab 1: Orders Table */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer Name, or Email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Orders List */}
                <div className="rounded-2xl border border-slate-800 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Downloads</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {orders
                        .filter(o => 
                          o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((order) => (
                          <tr key={order.id} className="hover:bg-slate-900/40">
                            <td className="px-4 py-3 font-mono font-bold text-white">
                              {order.orderId}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-white">{order.customerName}</p>
                              <p className="text-[11px] text-slate-400">{order.customerEmail}</p>
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                              +91 {order.customerPhone}
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                              ₹{order.amount}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.status === 'paid' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}>
                                {order.status === 'paid' ? 'Paid & Verified' : 'Created'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono text-slate-200">{order.downloadCount}</span>
                              <span className="text-slate-500"> / {order.downloadLimit}</span>
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Product & Pricing Settings */}
            {activeTab === 'product' && productForm && (
              <form onSubmit={handleSaveProduct} className="space-y-4 max-w-2xl">
                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Product settings successfully saved and updated on live landing page!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">E-Book Title</label>
                    <input
                      type="text"
                      value={productForm.title}
                      onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Author Name</label>
                    <input
                      type="text"
                      value={productForm.author}
                      onChange={(e) => setProductForm({ ...productForm, author: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Selling Price (INR ₹)</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-emerald-400 font-bold font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Original MRP (₹)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Page Count</label>
                    <input
                      type="number"
                      value={productForm.pages}
                      onChange={(e) => setProductForm({ ...productForm, pages: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Landing Page Headline</label>
                  <input
                    type="text"
                    value={productForm.headline}
                    onChange={(e) => setProductForm({ ...productForm, headline: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Supporting Subtitle Text</label>
                  <textarea
                    rows={3}
                    value={productForm.supportingText}
                    onChange={(e) => setProductForm({ ...productForm, supportingText: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Meta (Facebook) Pixel ID</span>
                    <span className="text-[10px] text-emerald-400 font-normal">Tracking PageView, InitiateCheckout & Purchase</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 123456789012345"
                    value={productForm.metaPixelId || ''}
                    onChange={(e) => setProductForm({ ...productForm, metaPixelId: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Dispatches standard conversion events to your Meta Ads Manager for retargeting and ROAS tracking.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </form>
            )}

            {/* Tab 3: Gateway Status */}
            {activeTab === 'gateway' && (
              <div className="space-y-4 max-w-2xl text-xs text-slate-300">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Razorpay Integration Mode</span>
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      razorpayConfigured
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    }`}>
                      {razorpayConfigured ? '● Live Gateway Active' : '● Test Simulator Sandbox Mode'}
                    </span>
                  </div>
                  <p className="leading-relaxed">
                    The backend is fully programmed with standard Razorpay order generation (`/api/create-order`) and server-side HMAC-SHA256 signature verification (`/api/verify-payment`).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <p className="font-bold text-white">How to connect your real Razorpay Account:</p>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                    <li>Sign in to your Razorpay Dashboard (https://dashboard.razorpay.com).</li>
                    <li>Navigate to <strong>Settings → API Keys → Generate Key</strong>.</li>
                    <li>Copy your <code className="text-emerald-400">Key ID</code> and <code className="text-emerald-400">Key Secret</code>.</li>
                    <li>Add them to your project's environment variables:
                      <pre className="mt-2 p-3 bg-slate-950 rounded-xl font-mono text-emerald-300 border border-slate-800">
                        RAZORPAY_KEY_ID=rzp_live_your_key_id{"\n"}
                        RAZORPAY_KEY_SECRET=your_key_secret
                      </pre>
                    </li>
                  </ol>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>The Money Maker • RBI-Compliant Digital Commerce</span>
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="text-slate-400 hover:text-rose-400 font-medium cursor-pointer"
            >
              Lock Admin Panel
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
