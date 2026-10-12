import { useState, useMemo } from 'react';
import { filterProducts, sortProducts, paginateProducts } from '@/utils/productFilters';
import { APP_CONFIG } from '@/constants/config';

/**
 * useFilters hook encapsulates all filtering, sorting, and pagination logic.
 * Keeps components lean and focused solely on presentation.
 */
export const useFilters = (allProducts = [], initialFilters = {}) => {
  const [category, setCategory] = useState(initialFilters.category || 'all');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || Infinity);
  const [minRating, setMinRating] = useState(initialFilters.minRating || 0);
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '');
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'featured');
  const [currentPage, setCurrentPage] = useState(Number(initialFilters.page) || 1);
  const pageSize = APP_CONFIG.pagination.defaultPageSize;

  // Filtered & sorted array computed with pure utils
  const filteredList = useMemo(() => {
    return filterProducts(allProducts, {
      category,
      minPrice,
      maxPrice,
      minRating,
      searchQuery,
    });
  }, [allProducts, category, minPrice, maxPrice, minRating, searchQuery]);

  const sortedList = useMemo(() => {
    return sortProducts(filteredList, sortBy);
  }, [filteredList, sortBy]);

  const pagination = useMemo(() => {
    return paginateProducts(sortedList, currentPage, pageSize);
  }, [sortedList, currentPage, pageSize]);

  const resetFilters = () => {
    setCategory('all');
    setMinPrice(0);
    setMaxPrice(Infinity);
    setMinRating(0);
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    category !== 'all' ||
    minPrice > 0 ||
    maxPrice !== Infinity ||
    minRating > 0 ||
    Boolean(searchQuery.trim());

  return {
    category,
    setCategory: (val) => {
      setCategory(val);
      setCurrentPage(1);
    },
    minPrice,
    setMinPrice: (val) => {
      setMinPrice(val);
      setCurrentPage(1);
    },
    maxPrice,
    setMaxPrice: (val) => {
      setMaxPrice(val);
      setCurrentPage(1);
    },
    minRating,
    setMinRating: (val) => {
      setMinRating(val);
      setCurrentPage(1);
    },
    searchQuery,
    setSearchQuery: (val) => {
      setSearchQuery(val);
      setCurrentPage(1);
    },
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    paginatedProducts: pagination.items,
    totalItems: pagination.totalItems,
    totalPages: pagination.totalPages,
    resetFilters,
    hasActiveFilters,
  };
};
