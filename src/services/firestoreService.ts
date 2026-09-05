import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Order, ProductConfig } from '../types';

const ORDERS_COLLECTION = 'orders';
const SETTINGS_COLLECTION = 'settings';
const PRODUCT_DOC = 'product_config';

export const firestoreService = {
  // Save or update an order in Firestore
  async saveOrder(order: Order): Promise<void> {
    const path = `${ORDERS_COLLECTION}/${order.orderId}`;
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, order.orderId), {
        ...order,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.warn('Could not save to Firestore directly, logged error:', error);
      // Don't crash client workflow if Firestore rules reject client write
    }
  },

  // Listen to orders in real-time
  subscribeToOrders(onUpdate: (orders: Order[]) => void, onError?: (err: any) => void) {
    try {
      const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const list: Order[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as Order);
        });
        onUpdate(list);
      }, (error) => {
        if (onError) onError(error);
        try {
          handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
        } catch (e) {
          // Logged
        }
      });
    } catch (err) {
      console.warn('Subscription to Firestore failed:', err);
      return () => {};
    }
  },

  // Save product config to Firestore
  async saveProductConfig(product: ProductConfig): Promise<void> {
    const path = `${SETTINGS_COLLECTION}/${PRODUCT_DOC}`;
    try {
      await setDoc(doc(db, SETTINGS_COLLECTION, PRODUCT_DOC), product, { merge: true });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, path);
      } catch (e) {
        console.warn('Failed saving product config to Firestore:', e);
      }
    }
  },

  // Get product config from Firestore
  async getProductConfig(): Promise<ProductConfig | null> {
    const path = `${SETTINGS_COLLECTION}/${PRODUCT_DOC}`;
    try {
      const snap = await getDoc(doc(db, SETTINGS_COLLECTION, PRODUCT_DOC));
      if (snap.exists()) {
        return snap.data() as ProductConfig;
      }
      return null;
    } catch (error) {
      console.warn('Could not fetch product config from Firestore:', error);
      return null;
    }
  }
};
