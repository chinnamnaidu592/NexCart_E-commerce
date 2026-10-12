/**
 * Standard order lifecycle statuses with visual color tags
 */
export const ORDER_STATUSES = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUSES.PENDING]: {
    label: 'Pending',
    bg: 'bg-[#FFFBEB] text-[#92400E] border-[#FEF3C7]',
    dot: 'bg-[#B45309]',
  },
  [ORDER_STATUSES.PROCESSING]: {
    label: 'Processing',
    bg: 'bg-[#F5F5F4] text-[#1C1917] border-[#E7E5E4]',
    dot: 'bg-[#78716C]',
  },
  [ORDER_STATUSES.SHIPPED]: {
    label: 'Shipped',
    bg: 'bg-[#F0F9FF] text-[#0369A1] border-[#E0F2FE]',
    dot: 'bg-[#0284C7]',
  },
  [ORDER_STATUSES.DELIVERED]: {
    label: 'Delivered',
    bg: 'bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]',
    dot: 'bg-[#16a34a]',
  },
  [ORDER_STATUSES.CANCELLED]: {
    label: 'Cancelled',
    bg: 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]',
    dot: 'bg-[#DC2626]',
  },
};
