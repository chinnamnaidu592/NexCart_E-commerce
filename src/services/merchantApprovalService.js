import { getStorageItem, setStorageItem } from '@/utils/storage';

const APPROVALS_KEY = 'nexcart_merchant_approval_statuses';
const APPROVAL_STATUSES = ['pending', 'approved', 'rejected'];

const getStoredStatuses = () => {
  const stored = getStorageItem(APPROVALS_KEY, {});
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};

  return Object.fromEntries(
    Object.entries(stored).filter(([, status]) => APPROVAL_STATUSES.includes(status))
  );
};

const getMerchantId = (merchant) => {
  if (
    !merchant ||
    merchant.role !== 'merchant' ||
    merchant.id === undefined ||
    merchant.id === null ||
    String(merchant.id).trim() === ''
  ) {
    throw new Error('A Merchant account with a stable user ID is required.');
  }

  return String(merchant.id);
};

export const merchantApprovalService = {
  getStatus(merchant) {
    const merchantId = getMerchantId(merchant);
    const storedStatus = getStoredStatuses()[merchantId];
    const accountStatus = APPROVAL_STATUSES.includes(merchant.approvalStatus)
      ? merchant.approvalStatus
      : null;

    return storedStatus || accountStatus || 'pending';
  },

  decide(merchant, status) {
    const merchantId = getMerchantId(merchant);
    if (!['approved', 'rejected'].includes(status)) {
      throw new Error('Choose an approved or rejected decision.');
    }

    const statuses = getStoredStatuses();
    const currentStatus = statuses[merchantId] ||
      (APPROVAL_STATUSES.includes(merchant.approvalStatus) ? merchant.approvalStatus : 'pending');
    if (currentStatus !== 'pending') {
      throw new Error('Only pending Merchant applications can be decided.');
    }

    statuses[merchantId] = status;
    if (!setStorageItem(APPROVALS_KEY, statuses)) {
      throw new Error('Could not save the Merchant approval decision in this browser.');
    }

    return status;
  },
};
