'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import EmptyState from '@/components/common/EmptyState';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { useRouter } from '@/router/RouterContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { User, Package, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, isHydrated, updateProfile } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '' });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace('/login?redirect=/profile');
    } else if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
      orderService.getOrdersByUser(user.id).then((res) => {
        setOrders(res || []);
        setLoadingOrders(false);
      });
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-widest font-mono text-[#78716C] animate-pulse">
          Authenticating client ledger...
        </p>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      <Breadcrumbs items={[{ label: 'Client Dossier' }]} />

      <div className="pb-6 border-b border-[#E7E5E4]">
        <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
          Identity & Records
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
          Client Account & Manifests
        </h1>
        <p className="text-xs text-[#78716C] mt-1 font-mono">
          Manage personal contact credentials and review verified transaction history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Personal Details Form */}
        <div className="lg:col-span-5 bg-white rounded-sm border border-[#E7E5E4] p-6 sm:p-7 h-fit">
          <div className="flex items-center gap-3 pb-4 border-b border-[#F5F5F4] mb-6">
            <div className="w-10 h-10 rounded-sm bg-[#F5F5F4] text-[#1C1917] border border-[#E7E5E4] flex items-center justify-center font-bold">
              <User className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="font-sans text-lg font-normal text-[#1C1917]">Personal Identity</h2>
              <p className="text-[11px] text-[#78716C]">Contact credentials on file</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="First Name"
              value={profileData.firstName}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={profileData.lastName}
              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              required
            />
            <Button type="submit" variant="primary" size="md" className="w-full">
              Update Client Ledger
            </Button>
          </form>
        </div>

        {/* Order History */}
        <div className="lg:col-span-7 bg-white rounded-sm border border-[#E7E5E4] p-6 sm:p-7">
          <div className="flex items-center gap-3 pb-4 border-b border-[#F5F5F4] mb-6">
            <div className="w-10 h-10 rounded-sm bg-[#F5F5F4] text-[#1C1917] border border-[#E7E5E4] flex items-center justify-center font-bold">
              <Package className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="font-sans text-lg font-normal text-[#1C1917]">Transaction Manifests</h2>
              <p className="text-[11px] text-[#78716C]">Verified consignments linked to this account</p>
            </div>
          </div>

          {loadingOrders ? (
            <div className="py-16 text-center text-xs font-mono uppercase tracking-wider text-[#78716C]">
              Compiling order history...
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No previous orders recorded"
              description="You have not initiated any consignment requests yet. Visit the catalog to make your initial acquisition."
              actionText="Explore Collection"
              actionHref="/products"
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-sm border border-[#E7E5E4] bg-[#FAFAF9] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E7E5E4]">
                    <div>
                      <span className="font-mono text-xs font-semibold text-[#1C1917]">
                        {order.orderNumber || `ORD-${order.id}`}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#78716C] mt-0.5">
                        <Calendar className="w-3 h-3 text-[#A8A29E] stroke-[1.5]" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-sans text-lg font-normal text-[#1C1917] tabular-nums">
                        {formatCurrency(order.total)}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-[#57534E]">
                        <span className="truncate max-w-xs">{item.title} × {item.quantity}</span>
                        <span className="font-mono font-medium text-[#1C1917] tabular-nums">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
