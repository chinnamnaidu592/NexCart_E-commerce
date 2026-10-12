/**
 * Pure functions for filtering, sorting, and paginating products list.
 * Isolated here to keep the Products page lean (<150 lines) and easily testable.
 */

export const filterProducts = (products = [], {
  category = 'all',
  minPrice = 0,
  maxPrice = Infinity,
  minRating = 0,
  searchQuery = '',
} = {}) => {
  return products.filter((item) => {
    // 1. Category match
    if (category && category !== 'all' && item.category !== category) {
      return false;
    }

    // 2. Price bounds
    const price = Number(item.price || 0);
    if (price < Number(minPrice || 0)) return false;
    if (maxPrice !== Infinity && price > Number(maxPrice)) return false;

    // 3. Minimum rating filter
    const rating = Number(item.rating || 0);
    if (rating < Number(minRating || 0)) return false;

    // 4. Search query text match (title, brand, category, description)
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const inTitle = item.title?.toLowerCase().includes(q);
      const inBrand = item.brand?.toLowerCase().includes(q);
      const inCat = item.category?.toLowerCase().includes(q);
      const inDesc = item.description?.toLowerCase().includes(q);
      if (!inTitle && !inBrand && !inCat && !inDesc) return false;
    }

    return true;
  });
};

export const sortProducts = (products = [], sortBy = 'featured') => {
  const list = [...products];

  switch (sortBy) {
    case 'price-low':
      return list.sort((a, b) => Number(a.price) - Number(b.price));
    case 'price-high':
      return list.sort((a, b) => Number(b.price) - Number(a.price));
    case 'rating-high':
      return list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    case 'name-asc':
      return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'name-desc':
      return list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    case 'discount-high':
      return list.sort((a, b) => Number(b.discountPercentage || 0) - Number(a.discountPercentage || 0));
    default:
      return list;
  }
};

export const paginateProducts = (products = [], page = 1, pageSize = 12) => {
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = products.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    totalItems: total,
    totalPages,
    currentPage,
    pageSize,
  };
};
