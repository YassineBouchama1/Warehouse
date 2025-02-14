import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProductById, updateProductDetails } from '~/api/productApi';
import { useAuthStore } from '~/store/useAuthStore';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import type { Product } from '~/types';
import { useState } from 'react';

export const useEditProduct = (productId: string) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const { logout } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product, Error>({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });

  const updateMutation = useMutation<Product, Error, Partial<Product>>({
    mutationFn: async (updatedProduct: Partial<Product>) => {
      if (!user) {
        throw new Error('User is not authenticated');
      }
      try {
        return await updateProductDetails(productId, {
          ...updatedProduct,
          image: selectedImage || updatedProduct.image,
          editedBy: [
            ...(product?.editedBy || []),
            {
              warehousemanId: user.id,
              at: new Date().toISOString(),
            },
          ],
        });
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'product', productId] });
      router.push('/(tabs)/products');
    },
    onError: async (error) => {
      if (isTokenInvalidOrUnauthorized(error.message)) {
        await logout();
        router.push('/(auth)/login');
      }
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return {
    product,
    isLoading,
    error,
    updateProduct: updateMutation.mutate,
    pickImage,
    selectedImage,
  };
};

function isTokenInvalidOrUnauthorized(errorMessage: string): boolean {
  return errorMessage.includes('token invalid') || errorMessage.includes('unauthorized');
}
