import apiClient from './apiClient';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import {
  MERCHANT_CANCELLATION_REQUEST_STATUSES,
  MERCHANT_ORDER_STATUS_TRANSITIONS,
  ORDER_STATUSES,
} from '@/constants/orderStatus';
import { productService } from './productService';
import { stripSensitiveFields } from '@/utils/sanitize';

const ORDERS_STORAGE_KEY = 'nexcart_user_orders';
const ORDER_OVERRIDES_KEY = 'nexcart_order_status_overrides';
const MERCHANT_ORDER_OVERRIDES_KEY = 'nexcart_merchant_order_status_overrides';
const VALID_ORDER_STATUSES = new Set(Object.values(ORDER_STATUSES));
const getMerchantStatusOptions = (status) => (
  MERCHANT_ORDER_STATUS_TRANSITIONS[status] || []
);

const asArray = (value) => (
  Array.isArray(value) ? value.filter((item) => item && typeof item === 'object' && !Array.isArray(item)) : []
);
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value) ? value : {}
);

const getMerchantId = (merchantUser) => {
  if (merchantUser?.role !== 'merchant' || merchantUser.id === undefined || merchantUser.id === null) {
    throw new Error('A signed-in Merchant with a stable user ID is required.');
  }
  const merchantId = String(merchantUser.id).trim();
  if (!merchantId) {
    throw new Error('A signed-in Merchant with a stable user ID is required.');
  }
  return merchantId;
};

const saveOrders = (orders) => {
  if (!setStorageItem(ORDERS_STORAGE_KEY, orders)) {
    throw new Error('Could not save order changes to this browser.');
  }
};

const saveMerchantStatusOverrides = (overrides) => {
  if (!setStorageItem(MERCHANT_ORDER_OVERRIDES_KEY, overrides)) {
    throw new Error('Could not save order status changes to this browser.');
  }
};

const getMerchantCancellationRequest = (order, merchantId) => {
  const requests = asRecord(order.merchantCancellationRequestsById);
  const request = requests[merchantId];
  if (!request || typeof request !== 'object' || Array.isArray(request)) return null;
  return {
    status: request.status === MERCHANT_CANCELLATION_REQUEST_STATUSES.APPROVED
      ? MERCHANT_CANCELLATION_REQUEST_STATUSES.APPROVED
      : MERCHANT_CANCELLATION_REQUEST_STATUSES.PENDING,
    reason: typeof request.reason === 'string' ? request.reason : '',
    requestedAt: typeof request.requestedAt === 'string' ? request.requestedAt : '',
    resolvedAt: typeof request.resolvedAt === 'string' ? request.resolvedAt : '',
    resolution: typeof request.resolution === 'string' ? request.resolution : '',
  };
};

const createLocalOrderId = (orders) => {
  const existingIds = new Set(orders.map((order) => String(order.id)));
  let orderId = Date.now();
  while (existingIds.has(String(orderId))) orderId += 1;
  return orderId;
};

const projectMerchantOrder = (order, merchantId, merchantStatusOverrides) => {
  const merchantItems = asArray(order.merchantItemsById?.[merchantId])
    .map((item) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      const productId = item.productId ?? item.id;
      return {
        productId: productId === undefined || productId === null ? null : String(productId),
        title: typeof item.title === 'string' ? item.title : 'Product unavailable',
        price: Number.isFinite(price) && price >= 0 ? price : 0,
        quantity: Number.isFinite(quantity) && quantity >= 0 ? quantity : 0,
        thumbnail: typeof item.thumbnail === 'string' ? item.thumbnail : '',
      };
    })
    .filter((item) => item.productId !== null);
  if (!merchantItems.length) return null;
  const merchantSubtotal = merchantItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const storedStatus = order.status === ORDER_STATUSES.CANCELLED
    ? ORDER_STATUSES.CANCELLED
    : merchantStatusOverrides[String(order.id)] || order.status;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: typeof order.customerName === 'string' ? order.customerName : '',
    items: merchantItems,
    itemsSubtotal: merchantSubtotal,
    status: VALID_ORDER_STATUSES.has(storedStatus) ? storedStatus : ORDER_STATUSES.PENDING,
    createdAt: order.createdAt,
    merchantId,
    cancellationRequest: getMerchantCancellationRequest(order, merchantId),
  };
};

const getMerchantOrdersForUser = (merchantUser) => {
  const merchantId = getMerchantId(merchantUser);
  const localOrders = asArray(getStorageItem(ORDERS_STORAGE_KEY, []));
  const storedOverrides = asRecord(getStorageItem(MERCHANT_ORDER_OVERRIDES_KEY, {}));
  const merchantOverrides = asRecord(storedOverrides[merchantId]);

  return localOrders
    .map((order) => projectMerchantOrder(order, merchantId, merchantOverrides))
    .filter(Boolean);
};

export const orderService = {
  /**
   * Fetches locally placed customer orders and unowned DummyJSON demo orders.
   */
  async getOrders() {
    const localOrders = asArray(getStorageItem(ORDERS_STORAGE_KEY, []));
    const statusOverrides = asRecord(getStorageItem(ORDER_OVERRIDES_KEY, {}));

    let apiOrders = [];
    try {
      const response = await apiClient.get('/carts?limit=15');
      const carts = asArray(response.data?.carts);

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
          items: asArray(cart.products).map((product) => ({
            id: product.id,
            title: product.title,
            price: Math.round((Number(product.price) || 15) * 85),
            quantity: product.quantity,
            thumbnail: product.thumbnail,
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
      // If carts endpoint fails, gracefully fall back to local orders.
    }

    const patchedLocal = localOrders.map((order) => ({
      ...order,
      status: statusOverrides[order.id] || order.status,
    }));

    return [...patchedLocal, ...apiOrders];
  },

  /**
   * Returns only local checkout orders containing items owned by this Merchant.
   */
  async getMerchantOrders(merchantUser) {
    return getMerchantOrdersForUser(merchantUser);
  },

  async getMerchantOrderById(orderId, merchantUser) {
    const merchantOrders = getMerchantOrdersForUser(merchantUser);
    const order = merchantOrders.find((candidate) => String(candidate.id) === String(orderId));
    if (!order) {
      throw new Error('Order not found in your store or you do not have permission to access it.');
    }
    return order;
  },

  getMerchantOrderStatusOptions(status, cancellationRequest) {
    if (cancellationRequest?.status === MERCHANT_CANCELLATION_REQUEST_STATUSES.PENDING) {
      return [];
    }
    return [...getMerchantStatusOptions(status)];
  },

  async requestMerchantOrderCancellation(orderId, reason, merchantUser) {
    const merchantId = getMerchantId(merchantUser);
    if (typeof reason !== 'string' || !reason.trim()) {
      throw new Error('A cancellation reason is required.');
    }
    const cleanReason = reason.trim();
    if (cleanReason.length > 500) {
      throw new Error('The cancellation reason must be 500 characters or fewer.');
    }

    const localOrders = asArray(getStorageItem(ORDERS_STORAGE_KEY, []));
    const orderIndex = localOrders.findIndex((candidate) => String(candidate.id) === String(orderId));
    const order = localOrders[orderIndex];
    if (!order || !asArray(order.merchantItemsById?.[merchantId]).length) {
      throw new Error('Order not found in your store or you do not have permission to request its cancellation.');
    }
    if (order.status === ORDER_STATUSES.CANCELLED) {
      throw new Error('This order has already been cancelled by Admin.');
    }
    const merchantOverrides = asRecord(
      asRecord(getStorageItem(MERCHANT_ORDER_OVERRIDES_KEY, {}))[merchantId]
    );
    const currentStatus = merchantOverrides[String(orderId)] || order.status;
    if (!VALID_ORDER_STATUSES.has(currentStatus) || currentStatus === ORDER_STATUSES.CANCELLED) {
      throw new Error('A cancellation request cannot be submitted for this order status.');
    }

    const requests = asRecord(order.merchantCancellationRequestsById);
    if (requests[merchantId]) {
      throw new Error('A cancellation request has already been recorded for your items in this order.');
    }

    const updatedOrder = {
      ...order,
      merchantCancellationRequestsById: {
        ...requests,
        [merchantId]: {
          status: MERCHANT_CANCELLATION_REQUEST_STATUSES.PENDING,
          reason: cleanReason,
          requestedAt: new Date().toISOString(),
        },
      },
    };
    const updatedOrders = [...localOrders];
    updatedOrders[orderIndex] = updatedOrder;
    saveOrders(updatedOrders);

    return getMerchantCancellationRequest(updatedOrder, merchantId);
  },

  /**
   * Saves a checkout order and snapshots only locally owned product lines by Merchant.
   */
  async placeOrder(orderData) {
    if (!orderData || typeof orderData !== 'object' || Array.isArray(orderData)) {
      throw new Error('Order data must be an object.');
    }
    const localOrders = asArray(getStorageItem(ORDERS_STORAGE_KEY, []));
    const merchantItemsById = {};

    for (const item of asArray(orderData.items)) {
      const productId = item.productId ?? item.id;
      const merchantId = productService.getProductMerchantId(productId);
      if (merchantId === null) continue;
      if (!merchantItemsById[merchantId]) merchantItemsById[merchantId] = [];
      merchantItemsById[merchantId].push({ ...stripSensitiveFields(item), productId });
    }

    const safeOrderData = stripSensitiveFields(orderData);
    ['merchantId', 'merchantIds', 'ownerId', 'ownershipType', 'merchantItemsById']
      .forEach((fieldName) => delete safeOrderData[fieldName]);
    const newOrder = {
      ...safeOrderData,
      merchantItemsById,
      id: createLocalOrderId(localOrders),
      orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: ORDER_STATUSES.PENDING,
      createdAt: new Date().toISOString(),
    };

    saveOrders([newOrder, ...localOrders]);
    return newOrder;
  },

  /**
   * Returns orders belonging to a specific customer or guest session.
   */
  async getOrdersByUser(userId, guestSessionId = null) {
    const all = await this.getOrders();
    if (userId !== undefined && userId !== null && String(userId).trim()) {
      return all.filter((order) => String(order.userId) === String(userId));
    }

    if (!guestSessionId) return [];
    return asArray(getStorageItem(ORDERS_STORAGE_KEY, []))
      .filter((order) => order.guestSessionId === guestSessionId);
  },

  /**
   * Updates an order status for a Merchant only when that order includes their products.
   */
  async updateMerchantOrderStatus(orderId, newStatus, merchantUser) {
    const merchantId = getMerchantId(merchantUser);
    if (!VALID_ORDER_STATUSES.has(newStatus)) {
      throw new Error('Choose a valid order status.');
    }

    const localOrders = asArray(getStorageItem(ORDERS_STORAGE_KEY, []));
    const order = localOrders.find((candidate) => String(candidate.id) === String(orderId));
    const merchantItems = order && asArray(order.merchantItemsById?.[merchantId]);
    if (!order || !merchantItems.length) {
      throw new Error('Order not found in your store or you do not have permission to update it.');
    }
    if (order.status === ORDER_STATUSES.CANCELLED) {
      throw new Error('This order was cancelled by Admin and cannot be changed by a Merchant.');
    }

    const overrides = asRecord(getStorageItem(MERCHANT_ORDER_OVERRIDES_KEY, {}));
    const merchantOverrides = asRecord(overrides[merchantId]);
    const currentStatus = merchantOverrides[String(orderId)] || order.status;
    const cancellationRequest = getMerchantCancellationRequest(order, merchantId);
    if (cancellationRequest?.status === MERCHANT_CANCELLATION_REQUEST_STATUSES.PENDING) {
      throw new Error('Fulfillment cannot advance while your cancellation request is awaiting review.');
    }
    if (!getMerchantStatusOptions(currentStatus).includes(newStatus)) {
      throw new Error(`Cannot change order status from "${currentStatus}" to "${newStatus}".`);
    }
    const nextOverrides = {
      ...overrides,
      [merchantId]: { ...merchantOverrides, [String(orderId)]: newStatus },
    };
    saveMerchantStatusOverrides(nextOverrides);

    return { id: orderId, status: newStatus, merchantId };
  },

  /**
   * Updates order lifecycle status (Admin feature).
   */
  async updateOrderStatus(orderId, newStatus) {
    const overrides = asRecord(getStorageItem(ORDER_OVERRIDES_KEY, {}));
    if (!setStorageItem(ORDER_OVERRIDES_KEY, { ...overrides, [orderId]: newStatus })) {
      throw new Error('Could not save order status changes to this browser.');
    }

    const merchantOverrides = asRecord(getStorageItem(MERCHANT_ORDER_OVERRIDES_KEY, {}));
    const updatedMerchantOverrides = Object.fromEntries(
      Object.entries(merchantOverrides).map(([merchantId, statuses]) => {
        const merchantStatuses = { ...asRecord(statuses) };
        delete merchantStatuses[String(orderId)];
        return [merchantId, merchantStatuses];
      })
    );
    saveMerchantStatusOverrides(updatedMerchantOverrides);

    const localOrders = asArray(getStorageItem(ORDERS_STORAGE_KEY, []));
    const updatedLocal = localOrders.map((order) => {
      if (String(order.id) !== String(orderId)) return order;
      if (newStatus !== ORDER_STATUSES.CANCELLED) return { ...order, status: newStatus };

      const requests = asRecord(order.merchantCancellationRequestsById);
      const resolvedAt = new Date().toISOString();
      return {
        ...order,
        status: newStatus,
        merchantCancellationRequestsById: Object.fromEntries(
          Object.entries(requests).map(([merchantId, request]) => {
            if (
              !request ||
              typeof request !== 'object' ||
              Array.isArray(request) ||
              request.status !== MERCHANT_CANCELLATION_REQUEST_STATUSES.PENDING
            ) return [merchantId, request];
            return [
              merchantId,
              {
                ...request,
                status: MERCHANT_CANCELLATION_REQUEST_STATUSES.APPROVED,
                resolvedAt,
                resolution: 'Order cancelled by Admin.',
              },
            ];
          })
        ),
      };
    });
    saveOrders(updatedLocal);

    return { id: orderId, status: newStatus };
  },
};
