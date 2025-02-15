import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { WarehouseForm } from './WarehouseForm';
import { useAddWarehouse } from '~/hooks/useAddWarehouse';

interface AddStockModalProps {
  visible: boolean;
  onClose: () => void;
  productId: string;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({ visible, onClose, productId }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const { addWarehouse, isLoading, error: mutationError } = useAddWarehouse(productId);

  const handleAddStock = async () => {
    if (!name || !city || !quantity) {
      setError('Please fill in all fields');
      return;
    }

    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    try {
      setError('');
      await addWarehouse({
        name,
        quantity: quantityNum,
        city,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add warehouse');
    }
  };

  const handleClose = () => {
    setName('');
    setCity('');
    setQuantity('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Warehouse</Text>

          <WarehouseForm
            name={name}
            city={city}
            quantity={quantity}
            error={error || (mutationError?.message ?? '')}
            isLoading={isLoading}
            onNameChange={setName}
            onCityChange={setCity}
            onQuantityChange={setQuantity}
            onSubmit={handleAddStock}
            onCancel={handleClose}
          />
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
    width: '90%',
    maxWidth: 400,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: 'white',
  },
  error: {
    color: '#FF3B30',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
