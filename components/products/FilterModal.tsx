import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, BackHandler, Pressable } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '~/constants/theme';
import { useFilterModalStore } from '~/store/useFilterModalStore';
import { moderateScale } from 'react-native-size-matters';
import Feather from '@expo/vector-icons/Feather';

const FilterModal: React.FC = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%'], []);

  const {
    isFilterModalOpen,
    closeFilterModal,
    orderBy,
    sortBy,
    city,
    inStockOnly,
    setFilters,
    resetFilters,
  } = useFilterModalStore();

  const cities = useMemo(() => ['Marrakesh', 'Oujda', 'Casablanca'], []);

  // Local state for filters
  const [filterState, setFilterState] = useState({
    city: city || '',
    sortBy: sortBy || 'name',
    orderBy: orderBy || 'asc',
    inStockOnly: inStockOnly || false,
  });

  // Handle hardware back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFilterModalOpen) {
        closeFilterModal();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [isFilterModalOpen, closeFilterModal]);

  // Open/close modal based on `isFilterModalOpen`
  useEffect(() => {
    if (isFilterModalOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isFilterModalOpen]);

  // Handler for filter changes
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Handlers for applying and resetting filters
  const handleApplyFilters = useCallback(() => {
    setFilters({
      city: filterState.city,
      sortBy: filterState.sortBy,
      orderBy: filterState.orderBy,
      inStockOnly: filterState.inStockOnly,
    });
    closeFilterModal();
  }, [filterState, setFilters, closeFilterModal]);

  const handleResetFilters = useCallback(() => {
    setFilterState({
      city: '',
      sortBy: 'name',
      orderBy: 'asc',
      inStockOnly: false,
    });
    resetFilters();
  }, [resetFilters]);

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) closeFilterModal();
      },
      [closeFilterModal]
    );
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose>
      <BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* City Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>City</Text>
            <Picker
              selectedValue={filterState.city}
              onValueChange={(value) => handleFilterChange('city', value)}
              style={styles.picker}>
              <Picker.Item label="All Cities" value="" />
              {cities.map((cityName) => (
                <Picker.Item key={cityName} label={cityName} value={cityName} />
              ))}
            </Picker>
          </View>

          {/* In Stock Only Toggle */}
          <View style={styles.filterSection}>
            <Pressable
              onPress={() => handleFilterChange('inStockOnly', !filterState.inStockOnly)}
              style={styles.toggleButton}>
              <Text style={styles.toggleButtonText}>
                {filterState.inStockOnly ? 'Show All Products' : 'Show In Stock Only'}
              </Text>
            </Pressable>
          </View>

          {/* Sorting Options */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Sort By</Text>
            <Picker
              selectedValue={filterState.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
              style={styles.picker}>
              <Picker.Item label="Name" value="name" />
              <Picker.Item label="Quantity" value="quantity" />
              <Picker.Item label="Stock" value="stock" />
            </Picker>
          </View>

          {/* Order By */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Order</Text>
            <Picker
              selectedValue={filterState.orderBy}
              onValueChange={(value) => handleFilterChange('orderBy', value)}
              style={styles.picker}>
              <Picker.Item label="Ascending" value="asc" />
              <Picker.Item label="Descending" value="desc" />
            </Picker>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable onPress={handleResetFilters} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
            <Pressable onPress={handleApplyFilters} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  container: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 20,
  },
  icon: {
    flexDirection: 'row',
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.text,
  },
  toggleButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default React.memo(FilterModal);
