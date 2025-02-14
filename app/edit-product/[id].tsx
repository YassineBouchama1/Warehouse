import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { EditProductForm } from '~/components/EditProductForm';
import { useEditProduct } from '~/hooks/useEditProduct';
import GradientWrapper from '~/components/GradientWrapper';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();
  const { product, isLoading, error, updateProduct, pickImage, selectedImage } = useEditProduct(
    id as string
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!product) {
    return <Text>Product not found</Text>;
  }

  return (
    <GradientWrapper>

    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Edit Product</Text>
        <EditProductForm
          product={product}
          onUpdate={updateProduct}
          onImagePick={pickImage}
          selectedImage={selectedImage}
        />
      </View>
    </ScrollView>
    </GradientWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
