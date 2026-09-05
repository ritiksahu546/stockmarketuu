import React, { useState, useEffect } from 'react';
import { ProductConfig } from '../types';
import { api, VerifyPaymentResponse } from '../services/api';
import { pixelService } from '../services/pixel';
import { 
  X, Lock, ShieldCheck, User, Mail, Phone, ArrowRight, 
  Loader2, CheckCircle, AlertTriangle, CreditCard, QrCode
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
      if (orderData.isRealGateway && typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'The Money Maker',
          description: `Stock Market E-Book by ${product.author}`,
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
              setError(vErr.message || 'Payment verification failed');
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setError(resp.error?.description || 'Payment was unsuccessful');
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // 3. Sandbox / Preview Test Gateway Mode
        setSimulatorState({
          active: true,
          orderId: orderData.orderId,
          razorpayOrderId: orderData.razorpayOrderId,
          amount: orderData.amountInInr
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

          {/* Simulator Notification if active */}
          {simulatorState && (
            <div className="p-5 rounded-2xl bg-slate-900 border-2 border-emerald-500/60 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <QrCode className="w-5 h-5" />
                <span>Razorpay Gateway Test Simulator</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You are in preview testing mode. To accept real live customer payments, configure <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-300">RAZORPAY_KEY_ID</code> and <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-300">RAZORPAY_KEY_SECRET</code> in the project settings.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 text-xs font-mono text-slate-300 space-y-1">
                <p>Order ID: <span className="text-emerald-400">{simulatorState.orderId}</span></p>
                <p>Amount: <span className="text-emerald-400 font-bold">₹{simulatorState.amount}</span></p>
                <p>Customer: {name} ({email})</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSimulatePaymentCompletion(true)}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  <span>Simulate Successful Payment (₹{simulatorState.amount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulatePaymentCompletion(false)}
                  disabled={isProcessing}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold cursor-pointer"
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

