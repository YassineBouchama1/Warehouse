import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { removeStockFromProduct } from '~/api/productApi';
import { useAuth } from '~/provider/AuthProvider';

export const removeWarehouseProductStock = async (
  productId: string,
  warehouseId: number
): Promise<void> => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    throw new Error('User is not authenticated');
  }

  if (!productId || !warehouseId) {
    throw new Error('Product ID and Warehouse ID are required');
  }

  try {
    await removeStockFromProduct(productId, warehouseId);

    queryClient.invalidateQueries({ queryKey: ['product', productId] });
    queryClient.invalidateQueries({ queryKey: ['products'] });

    router.push(`/product/${productId}`);
  } catch (error) {
    if (isTokenInvalidOrUnauthorized((error as Error).message)) {
      await logout();
      router.push('/(auth)/login');
    } else {
      throw error; 
    }
  }
};

function isTokenInvalidOrUnauthorized(errorMessage: string): boolean {
  return errorMessage.includes('token invalid') || errorMessage.includes('unauthorized');
}
