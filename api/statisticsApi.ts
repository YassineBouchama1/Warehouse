import axios from 'axios';
import type { Statistics } from '../types';

const API_URL = `${process.env.EXPO_PUBLIC_API}:3000`;

// Fetch statistics from the JSON server
export const fetchStatistics = async (): Promise<Statistics> => {
  try {
    const response = await axios.get(`${API_URL}/statistics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

// Update statistics on the JSON server
export const updateStatistics = async (updatedStats: Partial<Statistics>): Promise<Statistics> => {
  try {
    const currentStats = await fetchStatistics();
    const newStats = { ...currentStats, ...updatedStats };
    const response = await axios.put(`${API_URL}/statistics`, newStats);
    return response.data;
  } catch (error) {
    console.error('Error updating statistics:', error);
    throw error;
  }
};
