import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/productApi';
import { Product } from '~/types';

interface ProductFilters {
  searchQuery?: string;
  sortBy?: string;
  orderBy?: string;
  city?: string;
  inStockOnly?: boolean;
}

export const useProducts = (filters: ProductFilters = {}) => {
  const {
    searchQuery = '',
    sortBy = '',
    orderBy = 'asc',
    city = '',
    inStockOnly = false,
  } = filters;

  // Fetch products using React Query
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products', searchQuery, sortBy, orderBy, city, inStockOnly],
    queryFn: async () => {
      try {
        const fetchedProducts = await fetchProducts(
          searchQuery,
          sortBy,
          orderBy,
          city,
          inStockOnly
        );
        return fetchedProducts;
      } catch (error) {
        console.error('Failed to fetch products:', error);
        throw new Error('Failed to fetch products');
      }
    },
    retry: 2,
  });

  return {
    products,
    isLoading,
    isError,
    refreshProducts: refetch,
  };
};
