import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchProductById, updateProductStock, removeProductQuantity } from '../../api/productApi';
import { fetchWarehouseman } from '../../api/warehousemanApi';

import type { Product, Stock, Warehouseman } from '../../types';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import StockUpdateModal from '~/components/StockUpdateModal';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [lastEditor, setLastEditor] = useState<Warehouseman | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Stock | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Animation values
  const headerScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    if (!id) {
      setError('No product ID provided');
      return;
    }

    try {
      const fetchedProduct = await fetchProductById(id);

      if (!fetchedProduct) {
        setError('Product not found');
        return;
      }

      setProduct(fetchedProduct);
      setError(null);

      if (fetchedProduct.editedBy?.length > 0) {
        const lastEdit = fetchedProduct.editedBy[fetchedProduct.editedBy.length - 1];
        const editor = await fetchWarehouseman(lastEdit.warehousemanId.toString());
        setLastEditor(editor);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Error loading product');
    }
  };

  const handleStockUpdate = async (quantity: number) => {
    if (!product || !selectedWarehouse) return;
    try {
      await updateProductStock(product.id, selectedWarehouse.id, quantity);
      // Animate header on successful update
      headerScale.value = withSequence(withSpring(1.05), withSpring(1));
      loadProduct();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleStockRemove = async (quantity: number) => {
    if (!product || !selectedWarehouse) return;
    try {
      await removeProductQuantity(product.id, selectedWarehouse.id, quantity);
      loadProduct();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error removing stock:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <MotiView
          from={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ loop: true, duration: 1000 }}
          style={styles.loadingIndicator}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.headerContent}>
          <Animated.Text entering={FadeInDown.delay(200)} style={styles.name}>
            {product.name}
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(300)} style={styles.price}>
            ${product.price}
          </Animated.Text>
        </View>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View entering={FadeInLeft.delay(400)} style={styles.infoCard}>
          <Text style={styles.infoTitle}>Product Details</Text>
          <Text style={styles.info}>Type: {product.type}</Text>
          <Text style={styles.info}>Supplier: {product.supplier}</Text>
          <Text style={styles.info}>Barcode: {product.barcode}</Text>
        </Animated.View>

        {lastEditor && (
          <Animated.View entering={FadeInLeft.delay(500)} style={styles.editorInfo}>
            <Text style={styles.editorTitle}>Last Edited by:</Text>
            <Text style={styles.editorName}>{lastEditor.name}</Text>
            <Text style={styles.editorDate}>
              {formatDate(product.editedBy[product.editedBy.length - 1].at)}
            </Text>
          </Animated.View>
        )}

        <Animated.Text entering={FadeInLeft.delay(600)} style={styles.stockTitle}>
          Stock Information:
        </Animated.Text>

        {product.stocks.map((stock, index) => (
          <MotiView
            key={stock.id}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 700 + index * 100 }}
            style={styles.stockItem}>
            <Text style={styles.stockName}>Warehouse: {stock.name}</Text>
            <Text style={styles.stockInfo}>City: {stock.localisation.city}</Text>
            <Text style={styles.stockQuantity}>Quantity: {stock.quantity}</Text>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => {
                buttonScale.value = withSequence(withSpring(0.95), withSpring(1));
                setSelectedWarehouse(stock);
                setShowUpdateModal(true);
              }}>
              <Text style={styles.updateButtonText}>Update Stock</Text>
            </TouchableOpacity>
          </MotiView>
        ))}

        <AnimatedTouchableOpacity
          style={[styles.editButton, buttonAnimatedStyle]}
          onPress={() => {
            buttonScale.value = withSequence(withSpring(0.95), withSpring(1));
            // router.push(`/edit-product/${product.id}`);
          }}>
          <Text style={styles.editButtonText}>Edit Product</Text>
        </AnimatedTouchableOpacity>
      </View>

      <StockUpdateModal
        visible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleStockUpdate}
        onRemove={handleStockRemove}
        currentQuantity={selectedWarehouse?.quantity || 0}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    position: 'relative',
    height: 300,
    marginBottom: 20,
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  price: {
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1C1C1E',
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    color: '#3A3A3C',
  },
  editorInfo: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  editorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  editorName: {
    fontSize: 15,
    marginTop: 5,
    color: '#3A3A3C',
  },
  editorDate: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  stockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: '#1C1C1E',
  },
  stockItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stockName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  stockInfo: {
    fontSize: 15,
    color: '#3A3A3C',
    marginBottom: 5,
  },
  stockQuantity: {
    fontSize: 15,
    color: '#3A3A3C',
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  editButton: {
    backgroundColor: '#FF9500',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
