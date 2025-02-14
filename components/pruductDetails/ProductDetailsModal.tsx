import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  BackHandler,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useProductModalStore } from '~/store/useProductModalStore';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '~/constants/theme';
import Animated, {
  FadeInDown,
  FadeInLeft,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import StockUpdateModal from '~/components/StockUpdateModal';
import { updateProductStock, removeProductQuantity } from '~/api/productApi';
import { useProductDetails } from '~/hooks/useProductDetails';
import { Stock } from '~/types';


const ProductDetailsModal: React.FC = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['90%'], []);
  const headerScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const { productId, isModalOpen, closeModal } =
    useProductModalStore();
      const { product, isLoading, isError, error, refetch } = useProductDetails(productId!);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Stock | null>(null);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    if (isModalOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isModalOpen) {
        closeModal();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [isModalOpen, closeModal]);

  const headerAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: headerScale.value }],
    }),
    [headerScale]
  );

  const handleStockUpdate = async (quantity: number) => {
    if (!product || !selectedWarehouse) return;
    try {
      await updateProductStock(product.id, selectedWarehouse.id, quantity);
      headerScale.value = withSequence(withSpring(1.05), withSpring(1));
      refetch();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleStockRemove = async (quantity: number) => {
    if (!product || !selectedWarehouse) return;
    try {
      await removeProductQuantity(product.id, selectedWarehouse.id, quantity);
      refetch();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error removing stock:', error);
    }
  };

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (isError || !product) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FF3B30" />
          <Text style={styles.errorText}>{error?.message || 'An error occurred'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </Animated.View>

        <View style={styles.content}>
          <Animated.Text entering={FadeInDown.delay(200)} style={styles.name}>
            {product.name}
          </Animated.Text>

          <Animated.Text entering={FadeInDown.delay(400)} style={styles.price}>
            ${product.price}
          </Animated.Text>

          <Animated.View entering={FadeInLeft.delay(500)} style={styles.infoCard}>
            <Text style={styles.infoTitle}>Product Details</Text>
            <Text style={styles.info}>{product.solde}</Text>
          </Animated.View>

          <Animated.Text entering={FadeInLeft.delay(600)} style={styles.stockTitle}>
            Stock Information:
          </Animated.Text>

          {product.stocks?.map((stock, index) => (
            <MotiView
              key={stock.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 700 + index * 100 }}
              style={styles.stockItem}>
              <Text style={styles.stockName}>Warehouse: {stock.name}</Text>
              <Text style={styles.stockName}>City: {stock.localisation.city}</Text>
              <Text style={styles.stockQuantity}>Available: {stock.quantity}</Text>
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
        </View>
      </View>
    );
  }, [product, isLoading, isError, error, refetch, headerScale, buttonScale]);

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose>
        <BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
          <React.Suspense fallback={<ActivityIndicator size="large" color={Colors.primary} />}>
            {content}
          </React.Suspense>
        </BottomSheetScrollView>
      </BottomSheetModal>
      <StockUpdateModal
        visible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleStockUpdate}
        onRemove={handleStockRemove}
        currentQuantity={selectedWarehouse?.quantity || 0}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    position: 'relative',
    height: verticalScale(300),
    backgroundColor: '#F8F9FA',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  wishlistButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: moderateScale(20),
  },
  name: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: verticalScale(8),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  rating: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: moderateScale(4),
  },
  reviews: {
    fontSize: moderateScale(14),
    color: '#8E8E93',
    marginLeft: moderateScale(4),
  },
  price: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: verticalScale(20),
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(16),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: verticalScale(16),
  },
  infoTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
    color: '#1C1C1E',
  },
  info: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: '#3A3A3C',
  },
  stockItem: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(15),
    marginBottom: verticalScale(15),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stockName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: verticalScale(5),
  },
  stockQuantity: {
    fontSize: moderateScale(15),
    color: '#3A3A3C',
    marginBottom: verticalScale(10),
  },
  stockTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(15),
    color: '#1C1C1E',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: moderateScale(12),
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: moderateScale(15),
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    padding: moderateScale(16),
    borderRadius: 12,
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(30),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addToCartText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    marginBottom: verticalScale(10),
  },
  loadingText: {
    fontSize: moderateScale(16),
    color: '#8E8E93',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  errorText: {
    fontSize: moderateScale(16),
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
});

export default React.memo(ProductDetailsModal);
