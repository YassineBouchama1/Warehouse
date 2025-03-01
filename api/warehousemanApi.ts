import axios from 'axios';
import type { Warehouseman } from '../types';

const API_URL = `${process.env.EXPO_PUBLIC_API}:3000`;

export const fetchWarehouseman = async (
  secretKey: number | string
): Promise<Warehouseman | null> => {
  const response = await axios.get<Warehouseman[]>(
    `${API_URL}/warehousemans?secretKey=${secretKey}`
  );
  return response.data[0] || null;
};

export const fetchWarehousemanById = async (id: number | string): Promise<Warehouseman | null> => {
  const response = await axios.get<Warehouseman[]>(`${API_URL}/warehousemans?id=${id}`);
  return response.data[0] || null;
};




export const fetchAllWarehouseman = async (
 
): Promise<Warehouseman[]> => {
  const response = await axios.get<Warehouseman[]>(
    `${API_URL}/warehousemans`
  );
  return response.data ;
};