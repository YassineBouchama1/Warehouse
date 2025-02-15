import axios from 'axios';
import { fetchWarehouses, fetchWarehouseStock } from '../warehouseApi';
import type { Warehouse, WarehouseStockItem } from '../../types';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Warehouse API', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      price: 99.99,
      stocks: [
        {
          id: 1,
          name: 'Warehouse 1',
          quantity: 100,
          localisation: {
            city: 'Test City',
            latitude: 0,
            longitude: 0,
          },
        },
        {
          id: 2,
          name: 'Warehouse 2',
          quantity: 50,
          localisation: {
            city: 'New City',
            latitude: 0,
            longitude: 0,
          },
        },
      ],
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Description 2',
      price: 149.99,
      stocks: [
        {
          id: 1,
          name: 'Warehouse 1',
          quantity: 200,
          localisation: {
            city: 'Test City',
            latitude: 0,
            longitude: 0,
          },
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchWarehouses', () => {
    it('should fetch all warehouses successfully', async () => {
      // Mock axios response
      mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });

      const result = await fetchWarehouses();

      // Expected warehouses
      const expectedWarehouses: Warehouse[] = [
        {
          id: 1,
          name: 'Warehouse 1',
          localisation: {
            city: 'Test City',
            latitude: 0,
            longitude: 0,
          },
        },
        {
          id: 2,
          name: 'Warehouse 2',
          localisation: {
            city: 'New City',
            latitude: 0,
            longitude: 0,
          },
        },
      ];

      expect(result).toEqual(expectedWarehouses);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API}:3000/products`);
    });

    it('should handle fetch warehouses error', async () => {
      // Mock axios error
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchWarehouses()).rejects.toThrow('Network error');
    });
  });

  describe('fetchWarehouseStock', () => {
    it('should fetch stock for a specific warehouse successfully', async () => {

      mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });

      const warehouseId = 1;
      const result = await fetchWarehouseStock(warehouseId);

      
      const expectedStock: WarehouseStockItem[] = [
        {
          productId: 1,
          name: 'Product 1',
          quantity: 100,
        },
        {
          productId: 2,
          name: 'Product 2',
          quantity: 200,
        },
      ];

      expect(result).toEqual(expectedStock);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API}:3000/products`);
    });

    it('should return an empty array if no stock is found for the warehouse', async () => {
      // Mock axios response
      mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });

      const warehouseId = 3; // Warehouse ID that doesnt exist
      const result = await fetchWarehouseStock(warehouseId);

      expect(result).toEqual([]);
    });

    it('should handle fetch warehouse stock error', async () => {
      // Mock axios error
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchWarehouseStock(1)).rejects.toThrow('Network error');
    });
  });
});
