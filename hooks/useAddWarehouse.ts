import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addWareHouseToProduct } from '~/api/productApi';
import { fetchWarehouses } from '~/api/warehouseApi';
import { useRouter } from 'expo-router';
import { useAuth } from '~/provider/AuthProvider';
import { isTokenInvalidOrUnauthorized } from '~/utils';

interface AddWarehouseInput {
  name: string;
  quantity: number;
  city: string;
}

export const useAddWarehouse = (productId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, logout } = useAuth();

  const addStockMutation = useMutation({
    mutationFn: async ({ name, quantity, city }: AddWarehouseInput) => {
      if (!user) throw new Error('User is not authenticated');
      if (!productId) throw new Error('Product ID is required');

      try {
        const warehouses = await fetchWarehouses();
        const maxId = Math.max(...warehouses.map((w) => w.id), 0);
        const newWarehouseId = maxId + 1;

        return await addWareHouseToProduct(newWarehouseId, productId, name, city, quantity);
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      router.push(`/product/${updatedProduct.id}`);
    },
    onError: async (error) => {
      if (isTokenInvalidOrUnauthorized(error.message)) {
        await logout();
        router.push('/(auth)/login');
      }
      throw error;
    },
  });

  return {
    addWarehouse: addStockMutation.mutate,
    isLoading: addStockMutation.isPending,
    error: addStockMutation.error,
  };
};
