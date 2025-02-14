import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  View,
} from 'react-native';
import { useProductForm } from '../../hooks/useProductForm';
import type { Product } from '../../types';

interface AddProductFormProps {
  initialBarcode: string;
  existingProduct: Product | null;
  onCancel: () => void;
  onSuccess: (productId: number) => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({
  initialBarcode,
  existingProduct,
  onCancel,
  onSuccess,
}) => {
  const { formData, handleInputChange, pickImage, handleSubmit, isExistingProduct } =
    useProductForm({
      initialBarcode,
      existingProduct,
      onSuccess,
    });

  const handleSubmitPress = async () => {
    try {
      await handleSubmit();
    } catch (error) {
      console.error(error);
      // Here you might want to show an error message to the user
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isExistingProduct ? 'Add Stock to Existing Product' : 'Add New Product'}
      </Text>
      <Text style={styles.barcodeText}>Product ID / Barcode: {initialBarcode}</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        editable={!isExistingProduct}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Type"
        value={formData.type}
        onChangeText={(value) => handleInputChange('type', value)}
        editable={!isExistingProduct}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={formData.price}
        onChangeText={(value) => handleInputChange('price', value)}
        keyboardType="numeric"
        editable={!isExistingProduct}
      />
      <TextInput
        style={styles.input}
        placeholder="Supplier"
        value={formData.supplier}
        onChangeText={(value) => handleInputChange('supplier', value)}
        editable={!isExistingProduct}
      />
      <TextInput
        style={styles.input}
        placeholder={isExistingProduct ? 'Quantity to Add' : 'Initial Quantity'}
        value={formData.quantity}
        onChangeText={(value) => handleInputChange('quantity', value)}
        keyboardType="numeric"
      />

      {!isExistingProduct && (
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an image</Text>
        </TouchableOpacity>
      )}

      {formData.image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: formData.image }} style={styles.imagePreview} />
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleSubmitPress}>
        <Text style={styles.buttonText}>{isExistingProduct ? 'Add Stock' : 'Add Product'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  barcodeText: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
