import { View, Image, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type ProductHeaderProps = {
  name: string;
  price: number;
  image: string;
  productId: number;
};

export function ProductHeader({ name, price, image, productId }: ProductHeaderProps) {
  const router = useRouter();

  return (
    <Animated.View style={styles.header}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.headerContent}>
        <Animated.Text entering={FadeInDown.delay(200)} style={styles.name}>
          {name}
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(300)} style={styles.price}>
          ${price}
        </Animated.Text>
      </View>
      <Animated.View style={styles.editButton}>
        <Ionicons
          name="pencil"
          size={24}
          color="#FFFFFF"
          onPress={() => router.push(`/edit-product/${productId}`)}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  },
  price: {
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 5,
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
});
