import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface WarehouseFormProps {
  name: string;
  city: string;
  quantity: string;
  error?: string;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const WarehouseForm: React.FC<WarehouseFormProps> = ({
  name,
  city,
  quantity,
  error,
  isLoading,
  onNameChange,
  onCityChange,
  onQuantityChange,
  onSubmit,
  onCancel,
}) => (
  <>
    {error ? <Text style={styles.error}>{error}</Text> : null}

    <TextInput
      style={styles.input}
      placeholder="Warehouse Name"
      value={name}
      onChangeText={onNameChange}
      placeholderTextColor="#666"
      autoCapitalize="words"
    />

    <TextInput
      style={styles.input}
      placeholder="City"
      value={city}
      onChangeText={onCityChange}
      placeholderTextColor="#666"
      autoCapitalize="words"
    />

    <TextInput
      style={styles.input}
      placeholder="Initial Stock Quantity"
      keyboardType="numeric"
      value={quantity}
      onChangeText={onQuantityChange}
      placeholderTextColor="#666"
    />

    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton, isLoading && styles.disabledButton]}
        onPress={onCancel}
        disabled={isLoading}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.addButton, isLoading && styles.disabledButton]}
        onPress={onSubmit}
        disabled={isLoading}>
        <Text style={[styles.buttonText, styles.addButtonText]}>
          {isLoading ? 'Adding...' : 'Add Warehouse'}
        </Text>
      </TouchableOpacity>
    </View>
  </>
);

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
