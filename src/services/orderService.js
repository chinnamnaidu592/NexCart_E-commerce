import apiClient from './apiClient';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { ORDER_STATUSES } from '@/constants/orderStatus';

const ORDERS_STORAGE_KEY = 'nexcart_user_orders';
const ORDER_OVERRIDES_KEY = 'nexcart_order_status_overrides';

export const orderService = {
  /**
   * Fetches orders by combining:
   * 1. Real orders placed by current user during checkout (stored in localStorage)
   * 2. Mock order records shaped from DummyJSON GET /carts to simulate an active store
   */
  async getOrders() {
    const localOrders = getStorageItem(ORDERS_STORAGE_KEY, []);
    const statusOverrides = getStorageItem(ORDER_OVERRIDES_KEY, {});

    let apiOrders = [];
    try {
      const response = await apiClient.get('/carts?limit=15');
      const carts = response.data.carts || [];

      // Map carts into realistic order models
      apiOrders = carts.map((cart, idx) => {
        const statuses = [
          ORDER_STATUSES.DELIVERED,
          ORDER_STATUSES.SHIPPED,
          ORDER_STATUSES.PROCESSING,
          ORDER_STATUSES.PENDING,
        ];
        const status = statusOverrides[cart.id] || statuses[idx % statuses.length];

        const MOCK_INDIAN_ADDRESSES = [
          { fullName: 'Ananya Deshmukh', address: 'Flat 402, Lotus Grandeur, Road No. 36, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', zip: '500033' },
          { fullName: 'Rohan Mehra', address: '14/2, 80 Feet Road, 4th Block, Koramangala', city: 'Bengaluru', state: 'Karnataka', zip: '560034' },
          { fullName: 'Pooja Kulkarni', address: 'B-601, Raheja Heights, Dindoshi, Malad East', city: 'Mumbai', state: 'Maharashtra', zip: '400097' },
          { fullName: 'Kabir Singhania', address: 'C-28, Defence Colony, Ring Road', city: 'New Delhi', state: 'Delhi (NCT)', zip: '110024' },
          { fullName: 'Suresh Iyer', address: 'Plot 88, Anna Nagar West Extension', city: 'Chennai', state: 'Tamil Nadu', zip: '600101' },
          { fullName: 'Deepak Verma', address: '72, Sector 15, Urban Estate', city: 'Gurugram', state: 'Haryana', zip: '122001' },
          { fullName: 'Aditi Sengupta', address: '55B, Southern Avenue, Lake Market', city: 'Kolkata', state: 'West Bengal', zip: '700029' },
          { fullName: 'Varun Joshi', address: '9, Shivajinagar, FC Road', city: 'Pune', state: 'Maharashtra', zip: '411005' },
        ];
        const addr = MOCK_INDIAN_ADDRESSES[idx % MOCK_INDIAN_ADDRESSES.length];

        return {
          id: cart.id,
          orderNumber: `ORD-98${100 + cart.id}`,
          userId: cart.userId,
          customerName: addr.fullName,
          customerEmail: `customer${cart.userId}@example.com`,
          items: cart.products.map((p) => ({
            id: p.id,
            title: p.title,
            price: Math.round((Number(p.price) || 15) * 85),
            quantity: p.quantity,
            thumbnail: p.thumbnail,
          })),
          total: Math.round((Number(cart.total) || 120) * 85),
          status,
          createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 2).toISOString(),
          paymentMethod: idx % 3 === 0 ? 'Instant UPI' : idx % 3 === 1 ? 'Credit / Debit Card' : 'Cash on Delivery',
          shippingAddress: {
            fullName: addr.fullName,
            address: addr.address,
            city: addr.city,
            state: addr.state,
            zip: addr.zip,
          },
        };
      });
    } catch {
      // If carts endpoint fails, gracefully fall back to local orders
    }

    // Apply any status overrides to local orders as well
    const patchedLocal = localOrders.map((ord) => ({
      ...ord,
      status: statusOverrides[ord.id] || ord.status,
    }));

    // Local placed orders appear first
    return [...patchedLocal, ...apiOrders];
  },

  /**
   * Saves a newly placed checkout order into localStorage
   */
  async placeOrder(orderData) {
    const localOrders = getStorageItem(ORDERS_STORAGE_KEY, []);

    const newOrder = {
      ...orderData,
      id: Date.now(),
      orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: ORDER_STATUSES.PENDING,
      createdAt: new Date().toISOString(),
    };

    setStorageItem(ORDERS_STORAGE_KEY, [newOrder, ...localOrders]);
    return newOrder;
  },

  /**
   * Returns orders belonging to a specific customer or guest session
   */
  async getOrdersByUser(userId) {
    const all = await this.getOrders();
    if (!userId) {
      // Return guest orders placed in this browser
      return getStorageItem(ORDERS_STORAGE_KEY, []);
    }
    return all.filter((o) => String(o.userId) === String(userId));
  },

  /**
   * Updates order lifecycle status (Admin feature)
   */
  async updateOrderStatus(orderId, newStatus) {
    const overrides = getStorageItem(ORDER_OVERRIDES_KEY, {});
    overrides[orderId] = newStatus;
    setStorageItem(ORDER_OVERRIDES_KEY, overrides);

    // Also update directly in local orders if present
    const localOrders = getStorageItem(ORDERS_STORAGE_KEY, []);
    const updatedLocal = localOrders.map((o) =>
      String(o.id) === String(orderId) ? { ...o, status: newStatus } : o
    );
    setStorageItem(ORDERS_STORAGE_KEY, updatedLocal);

    return { id: orderId, status: newStatus };
  },
};
