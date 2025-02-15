import React, { Suspense, useState } from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ProductCard } from '../../components/products/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import GradientWrapper from '~/components/GradientWrapper';
import { moderateScale } from 'react-native-size-matters';
import ProductCardSkeleton from '~/components/skeletons/ProductCardSkeleton';
import SearchBar from '~/components/products/SearchBar';
import { Colors } from '~/constants/theme';
import { useFilterModalStore } from '~/store/useFilterModalStore';

const FilterModal = React.lazy(() => import('~/components/products/FilterModal'));

const ProductsScreen: React.FC = () => {
  const router = useRouter();
  const { sortBy, orderBy, city, inStockOnly } = useFilterModalStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products with filters
  const { products, isLoading, isError, refreshProducts } = useProducts({
    searchQuery,
    sortBy,
    orderBy,
    city,
    inStockOnly,
  });

  // Handle product press navigation
  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId.toString()}`);
  };

  // Handle search input changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Render content based on loading, error, or data availability
  const renderContent = () => {
    if (isLoading) {
      // Display skeleton while loading
      return <ProductCardSkeleton />;
    }

    if (isError) {
      // Display error message if there's an error
      return (
        <View style={styles.loadingContainer}>
          <Text>Error loading products. Please try again.</Text>
        </View>
      );
    }

    if (products.length === 0 && !isLoading) {
      // Display no products message if the list is empty
      return (
        <View style={styles.loadingContainer}>
          <Text>No products found</Text>
        </View>
      );
    }

    // Render the list of products
    return (
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => handleProductPress(item.id)} />
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
          setSearchQuery={handleSearch} // Pass the handleSearch function
        />

        {/* Render content (skeleton, error, no products, or product list) */}
        {renderContent()}

        {/* Lazy-loaded FilterModal */}
        <Suspense fallback={<ActivityIndicator size="small" color={Colors.primary} />}>
          <FilterModal />
        </Suspense>
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
