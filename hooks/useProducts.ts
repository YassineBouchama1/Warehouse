import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/productApi';
import { Product } from '~/types';
import { useFilterModalStore } from '~/store/useFilterModalStore';

export const useProducts = () => {
  // State for filtering and sorting
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch filters from the store
  const { sortBy, orderBy, city, inStockOnly } = useFilterModalStore();

  // Fetch products using React Query
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setFilteredProducts(fetchedProducts);
        return fetchedProducts;
      } catch (error) {
        console.error('Failed to fetch products:', error);
        throw new Error('Failed to fetch products');
      }
    },
    retry: 2,
  });

  // Handle search functionality
  const handleSearch = useCallback(
    (query: string) => {
      setIsSearching(true);
      setSearchQuery(query);
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.type?.toLowerCase().includes(query.toLowerCase()) ||
          product.supplier?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsSearching(false);
    },
    [products]
  );

  // Apply filters and sorting
  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...products];

    // City filter
    if (city) {
      filtered = filtered.filter((product) =>
        product.stocks.some((stock) => stock.localisation.city === city)
      );
    }

    // Stock availability filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.stocks.some((stock) => stock.quantity > 0));
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.supplier?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return orderBy === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortBy === 'quantity') {
        const totalQuantityA = a.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
        const totalQuantityB = b.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
        return orderBy === 'asc'
          ? totalQuantityA - totalQuantityB
          : totalQuantityB - totalQuantityA;
      } else if (sortBy === 'stock') {
        const inStockA = a.stocks.some((stock) => stock.quantity > 0) ? 1 : 0;
        const inStockB = b.stocks.some((stock) => stock.quantity > 0) ? 1 : 0;
        return orderBy === 'asc' ? inStockA - inStockB : inStockB - inStockA;
      }
      return 0;
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy, orderBy, city, inStockOnly]);

  // Trigger filtering and sorting whenever filters change
  React.useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  return {
    products: filteredProducts,
    isLoading,
    isError,
    isSearching,
    searchQuery,
    handleSearch,
    refreshProducts: refetch,
  };
};
