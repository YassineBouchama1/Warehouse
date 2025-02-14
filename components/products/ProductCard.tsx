import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const totalQuantity = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);

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
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productType}>{product.type}</Text>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            <Text style={styles.productQuantity}>Quantity: {totalQuantity}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onViewDetails}>
            <Ionicons name="document-text-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
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
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
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
  productQuantity: {
    fontSize: 14,
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
