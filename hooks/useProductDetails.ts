import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '~/api/productApi';
import { fetchWarehouseman } from '~/api/warehousemanApi';
import type { Product, Warehouseman } from '~/types';

interface ProductDetailsError {
  message: string;
  code?: string;
}

interface UseProductDetailsResult {
  product: Product | null;
  lastEditor: Warehouseman | null;
  isLoading: boolean;
  isError: boolean;
  error: ProductDetailsError | null;
  refetch: () => Promise<void>;
}

export const useProductDetails = (productId: string | null): UseProductDetailsResult => {
  const {
    data: product,
    isLoading: isLoadingProduct,
    isError: isProductError,
    error: productError,
    refetch: refetchProduct,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) {
        throw new Error('No product ID provided');
      }

      const product = await fetchProductById(productId);

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    },
    retry: 2,
    staleTime: 1000 * 60 * 5,
    enabled: !!productId,
  });

  const {
    data: lastEditor,
    isLoading: isLoadingEditor,
    isError: isEditorError,
    error: editorError,
  } = useQuery({
    queryKey: ['warehouseman', product?.editedBy?.[product.editedBy.length - 1]?.warehousemanId],
    queryFn: async () => {
      if (!product?.editedBy?.length) {
        return null;
      }

      const lastEdit = product.editedBy[product.editedBy.length - 1];
      return await fetchWarehouseman(lastEdit.warehousemanId.toString());
    },
    retry: 1,
    staleTime: 1000 * 60 * 30,
    enabled: !!product?.editedBy?.length,
  });

  const isLoading = isLoadingProduct || isLoadingEditor;

  const isError = isProductError || isEditorError;
  const error = (() => {
    if (isProductError) {
      return {
        message: productError instanceof Error ? productError.message : 'Error loading product',
        code: 'PRODUCT_ERROR',
      };
    }
    if (isEditorError) {
      return {
        message:
          editorError instanceof Error ? editorError.message : 'Error loading editor details',
        code: 'EDITOR_ERROR',
      };
    }
    return null;
  })();

  const refetch = async () => {
    await Promise.all([
      refetchProduct(),
      product?.editedBy?.length ? lastEditor : Promise.resolve(),
    ]);
  };

  return {
    product: product ?? null,
    lastEditor: lastEditor ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
};
