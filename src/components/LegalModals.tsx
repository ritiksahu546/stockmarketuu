import React from 'react';
import { X, ShieldAlert, FileText, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';

export type LegalModalType = 'refund' | 'privacy' | 'terms' | 'contact' | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#090e1c] border border-slate-700 shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xl font-bold text-white font-['Outfit']">
            {activeModal === 'refund' && 'Refund & Cancellation Policy'}
            {activeModal === 'privacy' && 'Privacy Policy'}
            {activeModal === 'terms' && 'Terms and Conditions'}
            {activeModal === 'contact' && 'Contact Support Desk'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="text-sm text-slate-300 leading-relaxed space-y-3">
          {activeModal === 'refund' && (
            <>
              <p>
                <strong>Digital Goods Policy:</strong> "The Money Maker" is an instant digital product (PDF format). Because access to the complete 200-page educational material is granted and downloadable immediately upon successful payment confirmation, orders cannot be cancelled, refunded, or returned once the payment is completed.
              </p>
              <p>
                <strong>Download Assistance Guarantee:</strong> If you encounter any technical glitch while downloading, such as an interrupted internet connection, corrupted file transfer, or non-receipt of the confirmation email, our support team will manually dispatch a verified fresh PDF copy to your registered email address within 2 to 4 business hours.
              </p>
              <p>
                For any download queries, please contact: <strong>support@the-money-maker.in</strong> with your Order Reference ID.
              </p>
            </>
          )}

          {activeModal === 'privacy' && (
            <>
              <p>
                We respect your personal privacy. When you purchase The Money Maker e-book, we collect your Full Name, Email Address, and Phone Number exclusively for:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Generating and dispatching your unique e-book download access.</li>
                <li>Transmitting your order receipt and transaction confirmation.</li>
                <li>Providing customer support and future edition updates.</li>
              </ul>
              <p>
                <strong>Payment Security:</strong> We do NOT collect, process, or store your debit/credit card numbers, UPI PINs, or banking passwords. All financial transactions are processed directly through Razorpay's RBI-compliant, 256-bit encrypted secure payment gateway.
              </p>
              <p>
                We will never sell or rent your personal contact information to third-party marketing brokers.
              </p>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <p>
                <strong>1. Intellectual Property & Copyright:</strong> All contents of "The Money Maker" e-book, including text, chart illustrations, chapter layouts, and pedagogical frameworks, are the intellectual property of Abhishek ji and protected under Indian and International copyright laws.
              </p>
              <p>
                <strong>2. Single-User License:</strong> Your purchase grants you a single-user personal educational license. You may not re-distribute, resell, upload to public torrent/cloud drives, or reproduce copies for commercial redistribution.
              </p>
              <p>
                <strong>3. Educational Disclaimer:</strong> All material is strictly educational. Neither the author nor the publisher provides SEBI-registered investment advisory or financial portfolio management services. Stock market investments carry inherent financial risk.
              </p>
            </>
          )}

          {activeModal === 'contact' && (
            <div className="space-y-4">
              <p>
                Have questions before ordering or need assistance with your download? Our dedicated Indian support team is available Monday to Saturday, 9:00 AM – 7:00 PM IST.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>Email: <strong>support@the-money-maker.in</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Support: <strong>+91 98765 43210</strong> (Message Only)</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Publisher Office: Mumbai / Bengaluru, India</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
