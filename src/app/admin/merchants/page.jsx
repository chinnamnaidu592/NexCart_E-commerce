'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Search, Store, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ErrorState from '@/components/common/ErrorState';
import Loader from '@/components/common/Loader';
import { productService } from '@/services/productService';
import { merchantApprovalService } from '@/services/merchantApprovalService';
import { userService } from '@/services/userService';

const FILTERS = ['all', 'pending', 'approved', 'rejected'];

const getMerchantRecord = (user) => {
  const merchant = {
    id: user.id,
    role: user.role,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    storeName: user.storeName || 'Store name not provided',
    storeCategory: user.storeCategory || 'Category not provided',
    gstin: user.gstin || '',
    phone: user.phone || '',
    pickupAddress: user.pickupAddress || null,
    createdAt: user.createdAt || '',
    approvalStatus: user.approvalStatus,
  };

  return {
    ...merchant,
    approvalStatus: merchantApprovalService.getStatus(merchant),
    currentProductCount: productService.getMerchantProducts(merchant).length,
  };
};

const formatDate = (date) => {
  if (!date) return 'Not provided';
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? 'Not provided'
    : parsedDate.toLocaleDateString();
};

const getApplicantName = (merchant) =>
  `${merchant.firstName} ${merchant.lastName}`.trim() || 'Applicant name not provided';

export default function AdminMerchantApprovalsPage() {
  const [merchants, setMerchants] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMerchants = async () => {
    try {
      const users = await userService.getCustomers();
      const merchantUsers = users.filter(
        (user) => user?.role === 'merchant' && user.id !== undefined && user.id !== null
      );
      const uniqueMerchants = Array.from(
        new Map(merchantUsers.map((user) => [String(user.id), user])).values()
      );
      setMerchants(uniqueMerchants.map(getMerchantRecord));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed loading Merchant accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMerchants();
  }, []);

  const filteredMerchants = useMemo(() => {
    const query = search.trim().toLowerCase();
    return merchants.filter((merchant) => {
      const matchesFilter = filter === 'all' || merchant.approvalStatus === filter;
      const matchesSearch = !query || [
        merchant.storeName,
        getApplicantName(merchant),
        merchant.email,
      ].some((value) => value.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [filter, merchants, search]);

  const handleDecision = (merchant, status) => {
    try {
      const approvalStatus = merchantApprovalService.decide(merchant, status);
      setMerchants((current) =>
        current.map((item) =>
          String(item.id) === String(merchant.id) ? { ...item, approvalStatus } : item
        )
      );
      toast.success(
        `${merchant.storeName} marked ${status}.`
      );
    } catch (err) {
      toast.error(err.message || 'Could not update the Merchant application.');
    }
  };

  if (loading) return <Loader message="Loading Merchant applications..." />;
  if (error) {
    return (
      <ErrorState
        title="Merchant Applications Error"
        message={error}
        onRetry={() => {
          setLoading(true);
          setError(null);
          loadMerchants();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="pb-6 border-b border-[#E7E5E4]">
        <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
          Marketplace Governance
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
          Merchant Approvals
        </h1>
        <p className="text-xs text-[#78716C] mt-1 font-mono">
          Review Merchant identity and onboarding details before product-level moderation.
        </p>
      </div>

      <div className="border border-[#E7E5E4] bg-[#F5F5F4] px-4 py-3 text-xs text-[#57534E]">
        Approval decisions are saved in this browser for the demo. They do not currently change
        Merchant sign-in or product visibility.
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F5F5F4] p-1 border border-[#E7E5E4] rounded-xs text-xs">
          {FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
              className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
                filter === status
                  ? 'bg-[#1C1917] text-white shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <label className="relative w-full sm:max-w-sm">
          <span className="sr-only">Search Merchant applications</span>
          <input
            type="search"
            placeholder="Search store, applicant, or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full text-xs bg-white border border-[#E7E5E4] rounded-xs pl-9 pr-3 py-2 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
          />
          <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </label>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-xs overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F5F4] text-[#78716C] uppercase tracking-[0.12em] font-semibold border-b border-[#E7E5E4]">
                <th scope="col" className="py-3 px-5">Merchant & Store</th>
                <th scope="col" className="py-3 px-5">Business Details</th>
                <th scope="col" className="py-3 px-5">Contact & Location</th>
                <th scope="col" className="py-3 px-5">Catalog</th>
                <th scope="col" className="py-3 px-5">Status</th>
                <th scope="col" className="py-3 px-5 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F4]">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-5 text-center text-[#78716C]">
                    {merchants.length === 0
                      ? 'No Merchant accounts are available for review.'
                      : 'No Merchant applications match this search and status.'}
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-[#FAFAF9] transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 font-medium text-[#1C1917]">
                        <Store className="w-3.5 h-3.5 text-[#78716C] shrink-0" />
                        <span>{merchant.storeName}</span>
                      </div>
                      <p className="mt-1 text-[#57534E]">{getApplicantName(merchant)}</p>
                      <p className="text-[10px] font-mono text-[#A8A29E]">
                        Merchant ID: {merchant.id}
                      </p>
                    </td>

                    <td className="py-4 px-5">
                      <p className="text-[#57534E]">{merchant.storeCategory}</p>
                      <p className="mt-1 text-[10px] font-mono text-[#78716C]">
                        GSTIN: {merchant.gstin || 'Not provided'}
                      </p>
                      <p className="text-[10px] text-[#A8A29E]">
                        Registered: {formatDate(merchant.createdAt)}
                      </p>
                    </td>

                    <td className="py-4 px-5">
                      <p className="text-[#57534E] break-all">{merchant.email || 'Email not provided'}</p>
                      <p className="mt-1 text-[#78716C]">
                        {merchant.phone || 'Phone not provided'}
                      </p>
                      <p className="text-[#78716C]">
                        {merchant.pickupAddress?.city || 'Fulfillment city not provided'}
                      </p>
                    </td>

                    <td className="py-4 px-5 text-[#57534E]">
                      {merchant.currentProductCount} current listings
                    </td>

                    <td className="py-4 px-5">
                      {merchant.approvalStatus === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : merchant.approvalStatus === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#FFFBEB] text-[#92400E] border border-[#FEF3C7]">
                          <Clock3 className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right">
                      {merchant.approvalStatus === 'pending' ? (
                        <div className="flex flex-wrap justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDecision(merchant, 'approved')}
                            className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-[#1C1917] text-white hover:bg-[#292524] rounded-xs transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDecision(merchant, 'rejected')}
                            className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#991B1B] border border-[#E7E5E4] hover:bg-[#FEF2F2] rounded-xs transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider text-[#A8A29E]">
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
