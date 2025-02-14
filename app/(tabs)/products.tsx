import React from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ProductCard } from '../../components/products/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import GradientWrapper from '~/components/GradientWrapper';
import { moderateScale } from 'react-native-size-matters';
import ProductCardSkeleton from '~/components/skeletons/ProductCardSkeleton';
import SearchBar from '~/components/products/SearchBar';

const ProductsScreen: React.FC = () => {
  const router = useRouter();
  const { products, isLoading, isSearching, searchQuery, handleSearch } = useProducts();

  // Handle product press navigation
  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  // Render content based on loading, searching, or data availability
  const renderContent = () => {
    if (isLoading || isSearching) {
      // Display skeleton while loading or searching
      return <ProductCardSkeleton />;
    }

    if (products.length === 0) {
      // Display no products message if the list is empty
      return (
        <View style={styles.loadingContainer}>
          <Text>No Products found</Text>
        </View>
      );
    }

    // Render the list of products
    return (
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item.id)}
            onEdit={() => router.push('/(tabs)/products')}
            onDelete={() => {}}
            onViewDetails={() => router.push('/(tabs)/products')}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
      />
    );
  };

  return (
    <GradientWrapper>
      <SafeAreaView style={styles.container}>
        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={handleSearch} // Pass the handleSearch function directly
        />
        {/* Render content (skeleton, no products, or product list) */}
        {renderContent()}
      </SafeAreaView>
    </GradientWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    paddingBottom: 20,
  },
});

export default ProductsScreen;
