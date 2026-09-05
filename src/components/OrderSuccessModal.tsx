import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { VerifyPaymentResponse } from '../services/api';
import { ProductConfig } from '../types';
import { 
  CheckCircle2, Download, Mail, ExternalLink, ShieldCheck, 
  FileText, Copy, Check, Eye, X, ArrowDownCircle
} from 'lucide-react';

interface OrderSuccessModalProps {
  product: ProductConfig;
  paymentResult: VerifyPaymentResponse | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  product,
  paymentResult,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    if (paymentResult) {
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#059669', '#38bdf8', '#fbbf24']
        });
      } catch (e) {
        // Fallback gracefully if canvas-confetti is restricted
      }
    }
  }, [paymentResult]);

  if (!paymentResult) return null;

  const copyOrderId = () => {
    navigator.clipboard.writeText(paymentResult.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloadStarted(true);
    window.location.href = paymentResult.downloadUrl;
  };

  const formattedDate = new Date(paymentResult.paidAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="order-success-container"
        className="relative w-full max-w-xl rounded-3xl bg-[#090e1c] border-2 border-emerald-500/50 shadow-2xl overflow-hidden my-6"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-emerald-950/40 via-slate-900/40 to-transparent">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Payment Successful 🎉
          </h3>
          <p className="mt-1.5 text-sm text-slate-300">
            Thank you, <span className="text-emerald-400 font-semibold">{paymentResult.customerName}</span>! Your purchase is confirmed.
          </p>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-8 sm:px-8 space-y-6">
          
          {/* Order Details Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
              <span className="text-slate-400">Order Reference:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-200">{paymentResult.orderId}</span>
                <button
                  onClick={copyOrderId}
                  className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                  title="Copy Order ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Product:</span>
              <span className="font-semibold text-white">{product.title} (200-Page PDF)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Amount Paid:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">₹{paymentResult.amount}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Date & Time:</span>
              <span className="text-slate-300 font-mono">{formattedDate}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Delivery Recipient:</span>
              <span className="text-slate-300 truncate max-w-[200px]">{paymentResult.customerEmail}</span>
            </div>
          </div>

          {/* Secure Download Primary Button */}
          <div className="space-y-3">
            <button
              id="download-ebook-btn"
              onClick={handleDownload}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:brightness-105 text-slate-950 font-extrabold text-base tracking-wide shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>DOWNLOAD YOUR E-BOOK (PDF)</span>
            </button>

            {downloadStarted && (
              <p className="text-xs text-center text-emerald-400 font-medium animate-pulse">
                ✓ Generating verified PDF and starting download... Check your downloads folder.
              </p>
            )}

            {/* Email Dispatch Notice */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span>Your download link has also been sent to your email (<strong>{paymentResult.customerEmail}</strong>). Please check your Inbox and Promotions folder.</span>
              </div>
            </div>
          </div>

          {/* Toggle Customer Email Template Preview */}
          <div className="border-t border-slate-800/80 pt-4">
            <button
              onClick={() => setShowEmailTemplate(!showEmailTemplate)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>View Customer Email Confirmation Template</span>
              </span>
              <Eye className="w-4 h-4 text-slate-400" />
            </button>

            {/* Collapsible Email Template */}
            {showEmailTemplate && (
              <div className="mt-3 p-4 rounded-2xl bg-white text-slate-900 text-xs space-y-3 font-sans shadow-lg">
                <div className="border-b pb-2 flex justify-between items-center text-[11px] text-slate-500">
                  <span>From: orders@the-money-maker.in</span>
                  <span>Subject: Your E-Book Order Confirmation #{paymentResult.orderId}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Namaste {paymentResult.customerName},</h4>
                  <p className="text-slate-600 mt-1">
                    Thank you for investing in yourself! Your order for <strong>{product.title}</strong> has been successfully processed.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-slate-700">
                  <p><strong>Order ID:</strong> {paymentResult.orderId}</p>
                  <p><strong>Product:</strong> {product.title} (Digital PDF Edition)</p>
                  <p><strong>Amount Paid:</strong> ₹{paymentResult.amount} (INR)</p>
                  <p><strong>Date:</strong> {formattedDate}</p>
                </div>
                <div className="text-center py-2">
                  <a
                    href={paymentResult.downloadUrl}
                    className="inline-block px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                  >
                    Download Your E-Book Now
                  </a>
                </div>
                <p className="text-[10px] text-slate-500 text-center">
                  Note: If you have any questions, reply directly to this email or reach our support desk.
                </p>
              </div>
            )}
          </div>

          {/* Footer of modal */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Authenticated Access
            </span>
            <button
              onClick={onClose}
              className="text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              Back to Website
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
