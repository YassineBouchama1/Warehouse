
import { useState, useEffect } from 'react';
import { addProduct, addStockToProduct } from '../api/productApi';
import * as ImagePicker from 'expo-image-picker';
import type { Product, AddProductFormData, NewProduct } from '../types';
import { useAuthStore } from '~/store/useAuthStore';

interface UseProductFormProps {
  initialBarcode: string;
  existingProduct: Product | null;
  onSuccess: (productId: number) => void;
}

export const useProductForm = ({
  initialBarcode,
  existingProduct,
  onSuccess,
}: UseProductFormProps) => {
  const [formData, setFormData] = useState<AddProductFormData>({
    name: '',
    type: '',
    price: '',
    supplier: '',
    quantity: '',
    image: null,
  });

  const user = useAuthStore((state) => state.user);

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

  const handleInputChange = (field: keyof AddProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async () => {
    if (!user) {
      throw new Error('User not logged in');
    }

    try {
      if (existingProduct) {
        const updatedProduct = await addStockToProduct(
          existingProduct.id,
          user.warehouseId,
          Number.parseInt(formData.quantity),
          user.city
        );
        onSuccess(updatedProduct.id);
      } else {
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
        const addedProduct = await addProduct(newProduct);
        onSuccess(addedProduct.id);
      }
    } catch (error) {
      throw new Error(`Error adding product: ${error}`);
    }
  };

  return {
    formData,
    handleInputChange,
    pickImage,
    handleSubmit,
    isExistingProduct: !!existingProduct,
  };
};
