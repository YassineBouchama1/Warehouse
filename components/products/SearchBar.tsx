import React, { useCallback, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useDebounce from '~/hooks/useDebounce';
import { useProductModalStore } from '~/store/useProductModalStore';
import { useFilterModalStore } from '~/store/useFilterModalStore';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const openFilterModal = useFilterModalStore((state) => state.openFilterModal);

  useDebounce(
    () => {
      setSearchQuery(inputValue);
    },
    500,
    [inputValue]
  );

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearch = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue('');
  }, []);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor="#666"
          value={inputValue}
          onChangeText={handleSearch}
        />
        {inputValue !== '' && (
          <Pressable hitSlop={20} onPress={handleClear} style={{ marginRight: 8 }}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </Pressable>
        )}
        <Pressable onPress={() => openFilterModal()} hitSlop={10}>
          <Ionicons name="filter" size={26} color="#666" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingBottom: 16,
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});

export default React.memo(SearchBar);
