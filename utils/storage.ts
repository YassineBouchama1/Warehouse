import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stores data in AsyncStorage.
 * @param key - The key under which to store the data.
 * @param value - The value to store. Can be any JSON-serializable data.
 */
export const storeData = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
    throw new Error(`Failed to store data for key "${key}"`);
  }
};

/**
 * Retrieves data from AsyncStorage.
 * @param key - The key of the data to retrieve.
 * @returns The parsed data, or `null` if the key does not exist.
 */
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? (JSON.parse(jsonValue) as T) : null;
  } catch (error) {
    console.error(`Error reading data for key "${key}":`, error);
    throw new Error(`Failed to retrieve data for key "${key}"`);
  }
};

/**
 * Removes data from AsyncStorage.
 * @param key - The key of the data to remove.
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
    throw new Error(`Failed to remove data for key "${key}"`);
  }
};

/**
 * Clears all data from AsyncStorage.
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw new Error('Failed to clear all data');
  }
};