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
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface AddProductFormProps {
  initialBarcode: string;
  existingProduct: Product | null;
  onCancel: () => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({
  initialBarcode,
  existingProduct,
  onCancel,

}) => {
  const { formData, handleInputChange, pickImage, handleSubmit, isExistingProduct } =
    useProductForm({
      initialBarcode,
      existingProduct,
   
    });

  const handleSubmitPress = async () => {
    try {
      await handleSubmit();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Animated.ScrollView
      style={styles.container}
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(300)}>
      <Animated.Text
        style={styles.title}
        entering={SlideInDown.duration(600)}
        exiting={SlideOutDown.duration(300)}>
        {isExistingProduct ? 'Add Stock to Existing Product' : 'Add New Product'}
      </Animated.Text>

      <Animated.View style={styles.barcodeContainer} entering={FadeIn.delay(200).duration(500)}>
        <FontAwesome5 name="barcode" size={20} color="#6B7280" />
        <Text style={styles.barcodeText}> {initialBarcode}</Text>
      </Animated.View>

      {[
        { icon: 'label', placeholder: 'Product Name', key: 'name' },
        { icon: 'category', placeholder: 'Product Type', key: 'type' },
        { icon: 'dollar-sign', placeholder: 'Price', key: 'price' },
        { icon: 'store', placeholder: 'Supplier', key: 'supplier' },
        {
          icon: 'box',
          placeholder: isExistingProduct ? 'Quantity to Add' : 'Initial Quantity',
          key: 'quantity',
        },
      ].map((field, index) => (
        <Animated.View
          key={field.key}
          style={styles.inputContainer}
          entering={FadeIn.delay(300 + index * 100).duration(500)}>
          <MaterialIcons name={field.icon} size={20} color="#6B7280" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            value={formData[field.key]}
            onChangeText={(value) => handleInputChange(field.key, value)}
            editable={!isExistingProduct || field.key === 'quantity'}
            keyboardType={field.key === 'price' || field.key === 'quantity' ? 'numeric' : 'default'}
          />
        </Animated.View>
      ))}

      {!isExistingProduct && (
        <Animated.View entering={FadeIn.delay(800).duration(500)}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <MaterialIcons name="photo" size={20} color="white" />
            <Text style={styles.buttonText}>Pick an image</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {formData.image && (
        <Animated.View
          style={styles.imagePreviewContainer}
          entering={FadeIn.delay(900).duration(500)}>
          <Image source={{ uri: formData.image }} style={styles.imagePreview} />
        </Animated.View>
      )}

      <Animated.View style={styles.buttonContainer} entering={FadeIn.delay(1000).duration(500)}>
        <TouchableOpacity style={styles.addButton} onPress={handleSubmitPress}>
          <LinearGradient
            colors={['#007AFF', '#0040FF']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <MaterialIcons name="add-box" size={20} color="white" />
            <Text style={styles.buttonText}>{isExistingProduct ? 'Add Stock' : 'Add Product'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <LinearGradient
            colors={['#FF3B30', '#FF1A1A']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <MaterialIcons name="cancel" size={20} color="white" />
            <Text style={styles.buttonText}>Cancel</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1F2937',
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 2,
  },
  barcodeText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#6B7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1F2937',
  },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
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
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  addButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cancelButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});
