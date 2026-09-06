import React, { useState, useEffect } from 'react';
import { ProductConfig } from '../types';
import { api, VerifyPaymentResponse } from '../services/api';
import { pixelService } from '../services/pixel';
import { 
  X, Lock, ShieldCheck, User, Mail, Phone, ArrowRight, 
  Loader2, CheckCircle, AlertTriangle, CreditCard, QrCode,
  Smartphone, Sparkles
} from 'lucide-react';

interface CheckoutModalProps {
  product: ProductConfig;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentResult: VerifyPaymentResponse) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Dynamically loads Razorpay checkout SDK if not already loaded in the document
 */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState<'upi' | 'card' | 'instant'>('upi');
  const [simulatorState, setSimulatorState] = useState<{
    active: boolean;
    orderId: string;
    razorpayOrderId: string;
    amount: number;
  } | null>(null);

  // Trigger Meta Pixel InitiateCheckout when checkout modal opens
  useEffect(() => {
    if (isOpen) {
      pixelService.trackInitiateCheckout({
        title: product.title,
        price: product.price,
        currency: product.currency || 'INR'
      });
      loadRazorpayScript();
    }
  }, [isOpen, product.title, product.price, product.currency]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address for e-book delivery');
      return false;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    setError(null);
    return true;
  };

  const handleCheckout = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!validateForm()) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create order securely on backend
      const orderData = await api.createOrder({
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim()
      });

      // 2. Check if real Razorpay Checkout is available
      const isScriptLoaded = await loadRazorpayScript();
      if (orderData.isRealGateway && orderData.keyId && isScriptLoaded && window.Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount, // 29500 paise
          currency: orderData.currency || 'INR',
          name: 'The Money Maker',
          description: `200-Page PDF Guide • By ${product.author}`,
          image: '/assets/ebook-cover.png',
          order_id: orderData.razorpayOrderId,
          prefill: {
            name: name.trim(),
            email: email.trim(),
            contact: phone.trim()
          },
          theme: {
            color: '#10b981'
          },
          modal: {
            backdropclose: false,
            escape: false,
            handleback: true,
            confirm_close: true,
            ondismiss: function () {
              setIsProcessing(false);
            }
          },
          handler: async function (response: any) {
            try {
              // 3. Verify signature securely on backend
              const verificationResult = await api.verifyPayment({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                customerName: name.trim(),
                customerEmail: email.trim(),
                customerPhone: phone.trim()
              });

              setIsProcessing(false);
              onSuccess(verificationResult);
            } catch (vErr: any) {
              setError(vErr.message || 'Payment signature verification failed');
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setError(resp.error?.description || resp.error?.reason || 'Payment was unsuccessful or cancelled by bank');
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // 3. Sandbox / Preview Test Gateway Mode
        setSimulatorState({
          active: true,
          orderId: orderData.orderId,
          razorpayOrderId: orderData.razorpayOrderId,
          amount: orderData.amountInInr || 295
        });
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || 'Could not initiate checkout');
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleCheckout();
    }
  };

  const handleSimulatePaymentCompletion = async (success: boolean) => {
    if (!simulatorState) return;

    if (!success) {
      setError('Payment was cancelled or failed.');
      setSimulatorState(null);
      return;
    }

    setIsProcessing(true);
    try {
      const mockPaymentId = `pay_sim_${Date.now()}`;
      const mockSignature = `sig_sim_${Date.now()}`;

      // Server verification
      const verifyRes = await api.verifyPayment({
        orderId: simulatorState.orderId,
        razorpayOrderId: simulatorState.razorpayOrderId,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: mockSignature,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim()
      });

      setIsProcessing(false);
      setSimulatorState(null);
      onSuccess(verifyRes);
    } catch (err: any) {
      setError(err.message || 'Payment simulation verification failed');
      setIsProcessing(false);
    }
  };

  // Safe backdrop click handler that prevents accidental unmounting/reset of customer progress
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // If user hasn't typed anything and no payment is active, safe to dismiss
      if (!name.trim() && !email.trim() && !phone.trim() && !simulatorState && !isProcessing) {
        onClose();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        id="checkout-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[#090e1c] border border-emerald-500/30 shadow-2xl overflow-hidden"
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white tracking-wide">
              Secure Checkout • 256-Bit SSL
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Order Summary Ribbon */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Selected Product</p>
              <h4 className="text-base font-bold text-white">{product.title}</h4>
              <p className="text-xs text-slate-300">200-Page PDF Guide • Abhishek ji</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-emerald-400 font-mono">₹{product.price}</span>
              <p className="text-[10px] text-slate-400 line-through">₹{product.originalPrice}</p>
            </div>
          </div>

          {/* Payment Method Selector / Simulator Mode if Razorpay Keys not yet loaded in env */}
          {simulatorState && (
            <div className="p-5 rounded-2xl bg-slate-900 border-2 border-emerald-500/60 space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <QrCode className="w-5 h-5" />
                  <span>Choose Payment Option (₹{simulatorState.amount})</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Razorpay Ready
                </span>
              </div>

              {/* Payment Tabs: UPI, Card, 1-Click */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActivePaymentTab('upi')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activePaymentTab === 'upi' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePaymentTab('card')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activePaymentTab === 'card' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards / Bank</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePaymentTab('instant')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activePaymentTab === 'instant' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Test</span>
                </button>
              </div>

              {/* Tab 1: UPI & QR Code */}
              {activePaymentTab === 'upi' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Scan QR Code or Pay via UPI:</span>
                    <span className="text-emerald-400 font-mono font-bold">₹{simulatorState.amount}</span>
                  </div>

                  {/* QR Mockup */}
                  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl text-slate-950 max-w-[200px] mx-auto text-center shadow-inner">
                    <div className="w-36 h-36 bg-slate-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-slate-400 p-2">
                      <QrCode className="w-24 h-24 text-slate-900" />
                      <span className="text-[10px] font-mono font-bold text-slate-700">UPI ID: themoneymaker@rzp</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 mt-1">GPay • PhonePe • Paytm • BHIM</span>
                  </div>

                  {/* Supported UPI Apps */}
                  <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-semibold">Google Pay</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400 font-semibold">PhonePe</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400 font-semibold">Paytm</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-400 font-semibold">BHIM / CRED</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePaymentCompletion(true)}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    <span>Confirm UPI Payment (₹{simulatorState.amount})</span>
                  </button>
                </div>
              )}

              {/* Tab 2: Cards / NetBanking */}
              {activePaymentTab === 'card' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">All Indian Cards & NetBanking</span>
                    <span className="text-emerald-400 font-mono font-bold">₹{simulatorState.amount}</span>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Cards Supported:</span>
                      <span className="text-white font-medium">Visa • MasterCard • RuPay • Maestro</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Banks:</span>
                      <span className="text-white font-medium">HDFC • SBI • ICICI • Axis • Kotak</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePaymentCompletion(true)}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    <span>Simulate Successful Card/Bank Payment (₹{simulatorState.amount})</span>
                  </button>
                </div>
              )}

              {/* Tab 3: Instant Test */}
              {activePaymentTab === 'instant' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 text-xs">
                  <p className="text-slate-300 leading-relaxed">
                    Instantly approve the transaction with simulated server-side verification and trigger automated PDF generation.
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                    <p>Order ID: <span className="text-emerald-400">{simulatorState.orderId}</span></p>
                    <p>Amount: <span className="text-emerald-400 font-bold">₹{simulatorState.amount}</span></p>
                    <p>Customer: {name} ({email})</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSimulatePaymentCompletion(true)}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    <span>1-Click Test Payment Approval</span>
                  </button>
                </div>
              )}

              {/* Live Razorpay Info Notice */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="text-slate-300 font-semibold">
                  <span>ℹ️ To accept real customer payments on Vercel:</span>
                </p>
                <p className="text-[11px]">
                  Add <code className="text-emerald-400 font-mono">RAZORPAY_KEY_ID</code> and <code className="text-emerald-400 font-mono">RAZORPAY_KEY_SECRET</code> to your Vercel Project Settings → Environment Variables. Real Razorpay popup will open automatically.
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleSimulatePaymentCompletion(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Customer Input Container (No Native Form To Prevent Browser Reloads) */}
          {!simulatorState && (
            <div className="space-y-4">
              
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Name</span>
                </label>
                <input
                  id="checkout-name-input"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Email Address (For PDF Delivery)</span>
                </label>
                <input
                  id="checkout-email-input"
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Your PDF download link and attachment will be dispatched to this email immediately.
                </p>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mobile Number (WhatsApp updates)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-mono font-bold">
                    +91
                  </div>
                  <input
                    id="checkout-phone-input"
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={handleKeyDown}
                    disabled={isProcessing}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="checkout-proceed-btn"
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full mt-2 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:brightness-105 text-slate-950 font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connecting Secure Razorpay Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>PROCEED TO PAYMENT (₹{product.price})</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  RBI-Compliant
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  UPI, Cards, NetBanking
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Instant Digital Delivery
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

