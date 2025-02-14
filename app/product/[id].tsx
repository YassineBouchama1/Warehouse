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
import GradientWrapper from '~/components/GradientWrapper';
import { Button } from '~/components/Button';
import { AddStockModal } from '~/components/pruductDetails/AddStockModal';
import { useState } from 'react';
import { useAddWarehouseProduct } from '~/hooks/useAddWarehouseProduct';
import { Text } from 'react-native';

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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { addStockToWarehouse, isLoading: isLoadingAdd, error:errorWarhouse } = useAddWarehouseProduct(id);


  const handleAddStock = (warehouseId: number, quantity: number) => {
    addStockToWarehouse(warehouseId, quantity);
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError || !product) {
    return <ErrorView error={error?.message || 'An unknown error occurred'} />;
  }

  return (
    <>
      <Stack.Screen options={{ title: product.name, headerShown: true }} />
      <GradientWrapper>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <ProductHeader product={product} />
          <View style={styles.content}>
            <ProductInfo
              type={product.type}
              supplier={product.supplier}
              barcode={product.barcode}
            />
            {lastEditor && (
              <EditorInfo
                key={lastEditor.id}
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
            <AddStockModal
              visible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
              onAddStock={handleAddStock}
            />

            {isLoadingAdd && <Text>Adding stock...</Text>}
            {errorWarhouse && (
              <Text style={{ color: 'red' }}>error: {errorWarhouse.message}</Text>
            )}
            <Button title="Add Stock to Warehouse" onPress={() => setIsModalVisible(true)} />
          </View>
        </ScrollView>
        <StockUpdateModal
          visible={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleStockUpdate}
          onRemove={handleStockRemove}
          currentQuantity={selectedWarehouse?.quantity || 0}
        />
      </GradientWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    // padding: 20,
  },
});
