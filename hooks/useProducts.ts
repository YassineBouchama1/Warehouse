import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/productApi';
import { Product, ProductSortConfig } from '~/types';

export const useProducts = () => {
  // State for filtering and sorting
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortConfig, setSortConfig] = useState<ProductSortConfig>({
    sortBy: 'name',
    sortOrder: 'asc',
  });

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
    staleTime: 1000 * 60 * 5, 
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

  // Handle sort functionality
  const handleSort = useCallback(
    ({ sortBy, sortOrder }: ProductSortConfig) => {
      setSortConfig({ sortBy, sortOrder });

      const sorted = [...filteredProducts].sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredProducts(sorted);
    },
    [filteredProducts]
  );

  return {
    products: filteredProducts,
    isLoading,
    isError,
    isSearching,
    searchQuery,
    sortConfig,
    handleSearch,
    handleSort,
    refreshProducts: refetch,
  };
};
