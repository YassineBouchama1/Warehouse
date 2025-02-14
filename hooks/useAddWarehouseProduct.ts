import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProductById, addStockToProduct } from '~/api/productApi';
import { useRouter } from 'expo-router';
import type { Product } from '~/types';
import { useAuth } from '~/provider/AuthProvider';

export const useAddWarehouseProduct = (
  productId: string,
  warehouseId: number,
  quantity: number
) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, logout } = useAuth();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product, Error>({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });

  const addStockMutation = useMutation<
    Product,
    Error,
    { productId: string; warehouseId: number; quantity: number }
  >({
    mutationFn: async ({ productId, warehouseId, quantity }) => {
      if (!user) {
        throw new Error('User is not authenticated');
      }
      try {
        return await addStockToProduct(productId, warehouseId, quantity, user.city);
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products', 'product', productId] });
      router.push(`/product/${updatedProduct.id}`);
    },
    onError: async (error) => {
      if (isTokenInvalidOrUnauthorized(error.message)) {
        await logout();
        router.push('/(auth)/login');
      }
    },
  });

  const addStockToWarehouse = () => {
    if (!productId || !warehouseId || !quantity) {
      throw new Error('Product ID, Warehouse ID, and Quantity are required');
    }
    addStockMutation.mutate({ productId, warehouseId, quantity });
  };

  return {
    product,
    isLoading,
    error,
    addStockToWarehouse,
  };
};

function isTokenInvalidOrUnauthorized(errorMessage: string): boolean {
  return errorMessage.includes('token invalid') || errorMessage.includes('unauthorized');
}
