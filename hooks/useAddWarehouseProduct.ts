import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProductById, addWareHouseToProduct } from '~/api/productApi';
import { useRouter } from 'expo-router';
import type { Product } from '~/types';
import { useAuth } from '~/provider/AuthProvider';

export const useAddWarehouseProduct = (productId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Fetch the product details
  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery<Product, Error>({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });

  const addStockMutation = useMutation<Product, Error, { warehouseId: number; quantity: number }>({
    mutationFn: async ({ warehouseId, quantity }) => {
      if (!user) {
        throw new Error('User is not authenticated');
      }
      if (!productId) {
        throw new Error('Product ID is required');
      }
      try {
        return await addWareHouseToProduct(productId, warehouseId, quantity);
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });

      router.push(`/product/${updatedProduct.id}`);
    },
    onError: async (error) => {
      if (isTokenInvalidOrUnauthorized(error.message)) {
        await logout();
        router.push('/(auth)/login');
      }
    },
  });

  const addStockToWarehouse = (warehouseId: number, quantity: number) => {
    if (!warehouseId || !quantity) {
      throw new Error('Warehouse ID and Quantity are required');
    }
    addStockMutation.mutate({ warehouseId, quantity });
  };

  return {
    product,
    isLoading: isProductLoading || addStockMutation.isPending,
    error: productError || addStockMutation.error,
    addStockToWarehouse,
  };
};

function isTokenInvalidOrUnauthorized(errorMessage: string): boolean {
  return errorMessage.includes('token invalid') || errorMessage.includes('unauthorized');
}
