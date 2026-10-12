/**
 * Formatters for currency, dates, percentages, and IDs
 */

export const formatCurrency = (amount, options = {}) => {
  const numeric = Number(amount || 0);
  const isWhole = Number.isInteger(numeric);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: options.minimumFractionDigits ?? (isWhole ? 0 : 2),
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    ...options,
  }).format(numeric);
};


export const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const formatOrderId = (id) => {
  return `ORD-${String(id).toUpperCase().slice(-6)}`;
};
