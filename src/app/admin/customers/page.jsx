'use client';

import React, { useState, useEffect } from 'react';
import CustomersTable from '@/components/admin/CustomersTable';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { userService } from '@/services/userService';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message || 'Failed loading customer accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  if (loading) return <Loader message="Loading registered client database..." />;
  if (error) return <ErrorState title="Customers Error" message={error} onRetry={loadCustomers} />;

  return (
    <div className="space-y-6 text-left">
      <div className="pb-6 border-b border-[#E7E5E4]">
        <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
          Client Directory
        </span>
        <h2 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
          Client Accounts & Ledgers
        </h2>
        <p className="text-xs text-[#78716C] mt-1 font-mono">
          Review verified patron profiles, registration timestamps, and delivery addresses
        </p>
      </div>

      <CustomersTable customers={customers} />
    </div>
  );
}
