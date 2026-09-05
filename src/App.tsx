import React, { useState, useEffect } from 'react';
import { defaultProduct, defaultChapters, defaultTestimonials, defaultFAQs } from './data/defaultData';
import { ProductConfig } from './types';
import { api, VerifyPaymentResponse } from './services/api';
import { testFirestoreConnection } from './lib/firebase';
import { firestoreService } from './services/firestoreService';
import { pixelService } from './services/pixel';

import { Navbar } from './components/Navbar';
import { TickerBar } from './components/TickerBar';
import { Hero } from './components/Hero';
import { LearnChapters } from './components/LearnChapters';
import { BookPreview } from './components/BookPreview';
import { WhyThisBook } from './components/WhyThisBook';
import { PricingSection } from './components/PricingSection';
import { SocialProof } from './components/SocialProof';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { StickyMobileCta } from './components/StickyMobileCta';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LegalModals, LegalModalType } from './components/LegalModals';

export default function App() {
  const [product, setProduct] = useState<ProductConfig>(defaultProduct);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<VerifyPaymentResponse | null>(null);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  useEffect(() => {
    // Validate Firestore connection on boot as required by Firebase skill
    testFirestoreConnection();

    // Fetch live config and product details from server
    api.getConfig()
      .then((data) => {
        if (data && data.product) {
          setProduct((prev) => ({ ...prev, ...data.product }));
          if (data.product.metaPixelId) {
            pixelService.init(data.product.metaPixelId);
          }
        }
      })
      .catch((err) => {
        console.warn('Using default local product config:', err);
      });
  }, []);

  // Initialize or reinitialize Meta Pixel when metaPixelId is present or updated
  useEffect(() => {
    if (product.metaPixelId) {
      pixelService.init(product.metaPixelId);
    }
  }, [product.metaPixelId]);

  const handleOpenBuy = () => {
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (result: VerifyPaymentResponse) => {
    setIsCheckoutOpen(false);
    setPaymentSuccessData(result);

    // Track standard Meta Purchase event
    pixelService.trackPurchase({
      amount: result.amount || product.price,
      currency: 'INR',
      orderId: result.orderId
    });

    // Synchronize paid order to Firestore for durable multi-device storage
    if (result.success && result.orderId) {
      firestoreService.saveOrder({
        id: result.orderId,
        orderId: result.orderId,
        razorpayPaymentId: result.paymentId,
        customerName: result.customerName,
        customerEmail: result.customerEmail,
        customerPhone: result.customerPhone || '9876543210',
        amount: result.amount,
        currency: 'INR',
        status: 'paid',
        createdAt: result.paidAt || new Date().toISOString(),
        paidAt: result.paidAt || new Date().toISOString(),
        downloadToken: result.downloadToken,
        downloadCount: 0,
        downloadLimit: 5
      });
    }
  };

  const handleScrollToPreview = () => {
    const el = document.getElementById('preview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Sticky Navigation */}
      <Navbar
        product={product}
        onBuyClick={handleOpenBuy}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {/* Stock Market Real-Time Indices Ticker */}
      <TickerBar />

      <main className="flex-1">
        {/* Hero Section with 3D Book Cover & Primary CTA */}
        <Hero
          product={product}
          onBuyClick={handleOpenBuy}
          onPreviewClick={handleScrollToPreview}
        />

        {/* 12 Major Chapters Breakdown */}
        <LearnChapters chapters={defaultChapters} />

        {/* Look Inside: Interactive E-Book Sample Pages */}
        <BookPreview onBuyClick={handleOpenBuy} />

        {/* Why This E-Book / Benefits Section */}
        <WhyThisBook />

        {/* High-Converting Pricing Card with Genuine Countdown */}
        <PricingSection
          product={product}
          onBuyClick={handleOpenBuy}
        />

        {/* Realistic Social Proof & Reader Testimonials */}
        <SocialProof testimonials={defaultTestimonials} />

        {/* Frequently Asked Questions Accordion */}
        <FaqSection faqs={defaultFAQs} />
      </main>

      {/* Comprehensive Footer with Policies, About, Socials & Disclaimers */}
      <Footer
        product={product}
        onOpenLegal={(type) => setLegalModalType(type)}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {/* Mobile Sticky Buy Button */}
      <StickyMobileCta
        product={product}
        onBuyClick={handleOpenBuy}
      />

      {/* Checkout Modal with Form Validation & Razorpay Architecture */}
      <CheckoutModal
        product={product}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Payment Success & Secure Digital Download Screen */}
      <OrderSuccessModal
        product={product}
        paymentResult={paymentSuccessData}
        onClose={() => setPaymentSuccessData(null)}
      />

      {/* Seller Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductUpdated={(updated) => setProduct(updated)}
      />

      {/* Legal & Policy Modals */}
      <LegalModals
        activeModal={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
