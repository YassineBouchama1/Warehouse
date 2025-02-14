import { useState, useEffect } from 'react';
import { addProduct, addStockToProduct } from '../api/productApi';
import * as ImagePicker from 'expo-image-picker';
import type { Product, AddProductFormData, NewProduct } from '../types';
import { useAuth } from '~/provider/AuthProvider';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseProductFormProps {
  initialBarcode: string;
  existingProduct: Product | null;
}

export const useProductForm = ({ initialBarcode, existingProduct }: UseProductFormProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [formData, setFormData] = useState<AddProductFormData>({
    name: '',
    type: '',
    price: '',
    supplier: '',
    quantity: '',
    image: null,
  });

  // set initial form data if editing an existing product
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        type: existingProduct.type,
        price: existingProduct.price.toString(),
        supplier: existingProduct.supplier,
        quantity: '',
        image: existingProduct.image,
      });
    }
  }, [existingProduct]);

  // Handle input changes
  const handleInputChange = (field: keyof AddProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleInputChange('image', result.assets[0].uri);
    }
  };

  // Mutation for adding a new product
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: NewProduct) => {
      return await addProduct(newProduct);
    },
    onSuccess: (addedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      router.replace(`/product/${addedProduct.id}`);
    },
    onError: (error) => {
      throw new Error(`Error adding product: ${error}`);
    },
  });

  // mutation for adding stock to an existing product
  const addStockMutation = useMutation({
    mutationFn: async ({
      productId,
      warehouseId,
      quantity,
      city,
    }: {
      productId: number;
      warehouseId: number;
      quantity: number;
      city: string;
    }) => {
      return await addStockToProduct(productId, warehouseId, quantity, city);
    },
    onSuccess: (updatedProduct) => {
      // invalid and refetch the product details
      
      queryClient.invalidateQueries({ queryKey: ['products', 'product', updatedProduct.id] });
      // navi to the updated product page
      router.replace(`/product/${updatedProduct.id}`);
    },
    onError: (error) => {
      throw new Error(`Error adding stock: ${error}`);
    },
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (!user) {
      throw new Error('User not logged in');
    }

    try {
      if (existingProduct) {
        // Check if product already has stock in the user warehouse
        const existingStock = existingProduct.stocks.find((stock) => stock.id === user.warehouseId);

        if (existingStock) {
          // Update existing stock in the warehouse
          await addStockMutation.mutateAsync({
            productId: existingProduct.id,
            warehouseId: user.warehouseId,
            quantity: Number.parseInt(formData.quantity),
            city: user.city,
          });
        } else {
          // create new stock entry in the user warehouse
          await addStockMutation.mutateAsync({
            productId: existingProduct.id,
            warehouseId: user.warehouseId,
            quantity: Number.parseInt(formData.quantity),
            city: user.city,
          });
        }
      } else {
        // Create a new product
        const newProduct: NewProduct = {
          name: formData.name,
          type: formData.type,
          barcode: initialBarcode,
          price: Number.parseFloat(formData.price),
          supplier: formData.supplier,
          image: formData.image || '',
          stocks: [
            {
              id: user.warehouseId,
              name: user.warehouseId.toString(),
              quantity: Number.parseInt(formData.quantity),
              localisation: {
                city: user.city,
                latitude: 0,
                longitude: 0,
              },
            },
          ],
          editedBy: [
            {
              warehousemanId: user.id,
              at: new Date().toISOString(),
            },
          ],
          solde: 0,
        };
        await addProductMutation.mutateAsync(newProduct);
      }
    } catch (error) {
      throw new Error(`Error submitting form: ${error}`);
    }
  };

  return {
    formData,
    handleInputChange,
    pickImage,
    handleSubmit,
    isExistingProduct: !!existingProduct,
    isSubmitting: addProductMutation.isPending || addStockMutation.isPending,
    error: addProductMutation.error || addStockMutation.error,
  };
};
