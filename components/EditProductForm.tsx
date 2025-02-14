'use client';

import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import type { Product } from '~/types';
import CustomInput from './CustomInput';
import { Button } from './Button';
import Entypo from '@expo/vector-icons/Entypo';

interface EditProductFormProps {
  product: Product;
  onUpdate: (updatedProduct: Partial<Product>) => void;
  onImagePick: () => void;
  selectedImage: string | null;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onUpdate,
  onImagePick,
  selectedImage,
}) => {
  const [name, setName] = React.useState(product.name);
  const [type, setType] = React.useState(product.type);
  const [price, setPrice] = React.useState(product.price.toString());
  const [supplier, setSupplier] = React.useState(product.supplier);

  const handleSubmit = () => {
    onUpdate({
      name,
      type,
      price: Number.parseFloat(price),
      supplier,
      image: selectedImage || product.image,
    });
  };

  return (
    <View style={styles.form}>
      <CustomInput
        label="Product Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter product name"
        icon="pricetag-outline"
      />
      <CustomInput
        label="Product Type"
        value={type}
        onChangeText={setType}
        placeholder="Enter product type"
        icon="apps-outline"
      />
      <CustomInput
        label="Price"
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
        icon="cash-outline"
      />
      <CustomInput
        label="Supplier"
        value={supplier}
        onChangeText={setSupplier}
        placeholder="Enter supplier"
        icon="business-outline"
      />

      <TouchableOpacity style={styles.imagePickerButton} onPress={onImagePick}>
        <Entypo name="image" size={24} color="#007AFF" />
        <Text style={styles.imagePickerText}>Update Image</Text>
      </TouchableOpacity>

      {(selectedImage || product.image) && (
        <Image source={{ uri: selectedImage || product.image }} style={styles.productImage} />
      )}

      <Button onPress={handleSubmit} style={styles.updateButton}>
        Update Product
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginTop: 16,
  },
  imagePickerText: {
    marginLeft: 8,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginTop: 16,
  },
  updateButton: {
    marginTop: 24,
  },
});
