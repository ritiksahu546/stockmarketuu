declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

let currentPixelId: string | null = null;

export const pixelService = {
  /**
   * Initializes the Meta (Facebook) Pixel with dynamic ID
   */
  init(pixelId?: string) {
    if (!pixelId || typeof window === 'undefined') return;
    const cleanId = pixelId.trim();
    if (!cleanId) return;

    if (currentPixelId === cleanId && window.fbq) {
      return;
    }

    if (!window.fbq) {
      const fbqFunction: any = function (...args: any[]) {
        if (fbqFunction.callMethod) {
          fbqFunction.callMethod.apply(fbqFunction, args);
        } else {
          fbqFunction.queue.push(args);
        }
      };

      if (!window._fbq) {
        window._fbq = fbqFunction;
      }
      fbqFunction.push = fbqFunction;
      fbqFunction.loaded = true;
      fbqFunction.version = '2.0';
      fbqFunction.queue = [];

      window.fbq = fbqFunction;

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    }

    try {
      window.fbq('init', cleanId);
      currentPixelId = cleanId;
      this.trackPageView();
    } catch (e) {
      console.warn('Meta Pixel initialization error:', e);
    }
  },

  /**
   * Tracks PageView event
   */
  trackPageView() {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'PageView');
      } catch (e) {
        console.warn('Meta Pixel PageView error:', e);
      }
    }
  },

  /**
   * Tracks InitiateCheckout event with product details
   */
  trackInitiateCheckout(product: { title: string; price: number; currency?: string }) {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'InitiateCheckout', {
          content_name: product.title,
          value: product.price,
          currency: product.currency || 'INR'
        });
      } catch (e) {
        console.warn('Meta Pixel InitiateCheckout error:', e);
      }
    }
  },

  /**
   * Tracks Purchase event when payment succeeds
   */
  trackPurchase(order: { amount: number; currency?: string; orderId?: string }) {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'Purchase', {
          value: order.amount,
          currency: order.currency || 'INR',
          content_type: 'product',
          content_name: 'The Money Maker E-Book',
          order_id: order.orderId
        });
      } catch (e) {
        console.warn('Meta Pixel Purchase error:', e);
      }
    }
  }
};
