import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchAllWarehouseman, fetchWarehouseman } from '~/api/warehousemanApi';
import { Warehouseman } from '~/types';

interface AddStockModalProps {
  visible: boolean;
  onClose: () => void;
 
  onAddStock: (warehouseId: number, quantity: number) => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({
  visible,
  onClose,
  
  onAddStock,
}) => {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>('');

  // Fetch warehouses
  const {
    data: warehouses,
    isLoading,
    error,
  } = useQuery<Warehouseman[], Error>({
    queryKey: ['warehouses'],
    queryFn: fetchAllWarehouseman,
  });

  const handleAddStock = () => {
    if (!selectedWarehouseId || !quantity) {
      alert('Please select a warehouse and enter a quantity');
      return;
    }
    onAddStock(selectedWarehouseId, parseInt(quantity, 10));
    onClose();
  };
console.log(warehouses);
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Stock to Warehouse</Text>

          {isLoading && <Text>Loading warehouses...</Text>}
          {error && <Text style={styles.error}>Error loading warehouses: {error.message}</Text>}

          {warehouses && (
            <FlatList
              data={warehouses || []}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Button
                  title={item.city}
                  onPress={() => setSelectedWarehouseId(item.warehouseId)}
                  color={selectedWarehouseId === item.warehouseId ? 'green' : 'gray'}
                />
              )}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Add Stock" onPress={handleAddStock} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
