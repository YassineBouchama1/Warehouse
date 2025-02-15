import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const totalQuantity = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'outOfStock';
    if (quantity < 10) return 'lowStock';
    return 'inStock';
  };

  const stockStatus = getStockStatus(totalQuantity);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.cardContent}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.productImage} />
          ) : (
            <View style={styles.noImageContainer}>
              <Ionicons name="image-outline" size={40} color="#ccc" />
              <Text style={styles.noImageText}>No Image</Text>
            </View>
          )}
          <View style={styles.productInfo}>
            <View style={styles.headerRow}>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={[styles.stockIndicator, styles[`${stockStatus}Indicator`]]} />
            </View>
            <Text style={styles.productType}>{product.type}</Text>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            <View style={styles.quantityContainer}>
              <Text style={[styles.productQuantity, styles[`${stockStatus}Text`]]}>
                {stockStatus === 'outOfStock'
                  ? 'Out of Stock'
                  : stockStatus === 'lowStock'
                    ? `Low Stock: ${totalQuantity}`
                    : `Quantity: ${totalQuantity}`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  noImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  productInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  stockIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  outOfStockIndicator: {
    backgroundColor: '#FF3B30',
  },
  lowStockIndicator: {
    backgroundColor: '#FFCC00',
  },
  inStockIndicator: {
    backgroundColor: '#4CAF50',
  },
  productType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 3,
  },
  quantityContainer: {
    marginTop: 2,
  },
  productQuantity: {
    fontSize: 14,
  },
  outOfStockText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  lowStockText: {
    color: '#CC9900',
    fontWeight: '500',
  },
  inStockText: {
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    marginLeft: 15,
  },
});
