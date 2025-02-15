import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { MotiView } from 'moti';
import { Stock } from '~/types';
import { Colors } from '~/constants/theme';

type StockListProps = {
  stocks: Stock[];
  onUpdateStock: (stock: Stock) => void;
};

export function StockList({ stocks, onUpdateStock }: StockListProps) {
  return (
    <View>
      <Animated.Text entering={FadeInLeft.delay(600)} style={styles.stockTitle}>
        Stock Information:
      </Animated.Text>
      {stocks.map((stock, index) => (
        <MotiView
          key={stock.id}
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 700 + index * 100 }}
          style={styles.stockItem}>
          <Text style={styles.stockName}>Warehouse: {stock.name}</Text>
          <Text style={styles.stockInfo}>City: {stock.localisation.city}</Text>
          <Text style={styles.stockQuantity}>Quantity: {stock.quantity}</Text>
          <TouchableOpacity style={styles.updateButton} onPress={() => onUpdateStock(stock)}>
            <Text style={styles.updateButtonText}>Update Stock</Text>
          </TouchableOpacity>
        </MotiView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});
