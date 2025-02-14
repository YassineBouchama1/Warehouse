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
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
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
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isExistingProduct ? 'Add Stock to Existing Product' : 'Add New Product'}
      </Text>
      <View style={styles.barcodeContainer}>
        <FontAwesome5 name="barcode" size={18} color="gray" />
        <Text style={styles.barcodeText}> {initialBarcode}</Text>
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="label" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
          editable={!isExistingProduct}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="category" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Product Type"
          value={formData.type}
          onChangeText={(value) => handleInputChange('type', value)}
          editable={!isExistingProduct}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome5 name="dollar-sign" size={18} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={formData.price}
          onChangeText={(value) => handleInputChange('price', value)}
          keyboardType="numeric"
          editable={!isExistingProduct}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="store" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Supplier"
          value={formData.supplier}
          onChangeText={(value) => handleInputChange('supplier', value)}
          editable={!isExistingProduct}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome5 name="box" size={18} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={isExistingProduct ? 'Quantity to Add' : 'Initial Quantity'}
          value={formData.quantity}
          onChangeText={(value) => handleInputChange('quantity', value)}
          keyboardType="numeric"
        />
      </View>

      {!isExistingProduct && (
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <MaterialIcons name="photo" size={20} color="white" />
          <Text style={styles.buttonText}>Pick an image</Text>
        </TouchableOpacity>
      )}

      {formData.image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: formData.image }} style={styles.imagePreview} />
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleSubmitPress}>
        <MaterialIcons name="add-box" size={20} color="white" />
        <Text style={styles.buttonText}>{isExistingProduct ? 'Add Stock' : 'Add Product'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <MaterialIcons name="cancel" size={20} color="white" />
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  barcodeText: {
    fontSize: 16,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
  },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
