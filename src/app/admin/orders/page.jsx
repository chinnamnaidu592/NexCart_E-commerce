'use client';

import React, { useState, useEffect } from 'react';
import OrdersTable from '@/components/admin/OrdersTable';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { orderService } from '@/services/orderService';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed loading orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (String(o.id) === String(orderId) ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order #${orderId} status changed to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || 'Could not update order status.');
    }
  };

  if (loading) return <Loader message="Fetching order fulfillment records..." />;
  if (error) return <ErrorState title="Orders Error" message={error} onRetry={loadOrders} />;

  return (
    <div className="space-y-6 text-left">
      <div className="pb-6 border-b border-[#E7E5E4]">
        <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
          Fulfillment Registry
        </span>
        <h2 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
          Consignment Manifests
        </h2>
        <p className="text-xs text-[#78716C] mt-1 font-mono">
          Review shipping progress, parcel status verification, and courier handovers
        </p>
      </div>

      <OrdersTable orders={orders} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
}
