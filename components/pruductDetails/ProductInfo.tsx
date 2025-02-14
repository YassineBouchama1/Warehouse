import { Text, StyleSheet } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

type ProductInfoProps = {
  type: string;
  supplier: string;
  barcode: string;
};

export function ProductInfo({ type, supplier, barcode }: ProductInfoProps) {
  return (
    <Animated.View entering={FadeInLeft.delay(400)} style={styles.infoCard}>
      <Text style={styles.infoTitle}>Product Details</Text>
      <Text style={styles.info}>Type: {type}</Text>
      <Text style={styles.info}>Supplier: {supplier}</Text>
      <Text style={styles.info}>Barcode: {barcode}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    // borderRadius: 15,
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
});
