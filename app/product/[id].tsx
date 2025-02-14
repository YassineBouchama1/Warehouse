import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useProductDetails } from '~/hooks/useProductDetails';
import { useStockUpdate } from '~/hooks/useStockUpdate';
import { LoadingView } from '~/components/pruductDetails/LoadingView';
import { ErrorView } from '~/components/pruductDetails/ErrorView';
import { ProductHeader } from '~/components/pruductDetails/ProductHeader';
import { ProductInfo } from '~/components/pruductDetails/ProductInfo';
import { EditorInfo } from '~/components/pruductDetails/EditorInfo';
import { StockList } from '~/components/pruductDetails/StockList';
import StockUpdateModal from '~/components/StockUpdateModal';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { product, lastEditor, isLoading, isError, error, refetch } = useProductDetails(
    id as string
  );
  const {
    showUpdateModal,
    setShowUpdateModal,
    selectedWarehouse,
    setSelectedWarehouse,
    handleStockUpdate,
    handleStockRemove,
  } = useStockUpdate(id as string);

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError || !product) {
    return <ErrorView error={error?.message || 'An unknown error occurred'} />;
  }

  return (
    <>
      <Stack.Screen options={{ title: product.name, headerShown: true }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ProductHeader
          name={product.name}
          price={product.price}
          image={product.image}
          productId={product.id}
        />
        <View style={styles.content}>
          <ProductInfo type={product.type} supplier={product.supplier} barcode={product.barcode} />
          {lastEditor && (
            <EditorInfo
              editor={lastEditor}
              editDate={product.editedBy[product.editedBy.length - 1].at}
            />
          )}
          <StockList
            stocks={product.stocks}
            onUpdateStock={(stock) => {
              setSelectedWarehouse(stock);
              setShowUpdateModal(true);
            }}
          />
        </View>
      </ScrollView>
      <StockUpdateModal
        visible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleStockUpdate}
        onRemove={handleStockRemove}
        currentQuantity={selectedWarehouse?.quantity || 0}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
});
