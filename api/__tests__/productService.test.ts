import axios from 'axios';
import {
  fetchProducts,
  fetchProductById,
  addProduct,
  updateProductStock,
  removeProductQuantity,
  addWareHouseToProduct,
  
} from '../productApi';
import { fetchWarehouses } from '../warehouseApi';
import { Product } from '~/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock warehouse API
jest.mock('../warehouseApi');
const mockedFetchWarehouses = fetchWarehouses as jest.MockedFunction<typeof fetchWarehouses>;

describe('Product API', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
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
    ],
  };

  const mockWarehouse = {
    id: 2,
    name: 'Warehouse 2',
    localisation: {
      city: 'New City',
      latitude: 0,
      longitude: 0,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should fetch all products successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockProduct] });

      const result = await fetchProducts();

      expect(result).toEqual([mockProduct]);
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/products'));
    });

    it('should handle fetch products error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchProducts()).rejects.toThrow('Network error');
    });
  });

  describe('fetchProductById', () => {
    it('should fetch a single product by id', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

      const result = await fetchProductById(1);

      expect(result).toEqual(mockProduct);
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/products/1'));
    });
  });

  describe('addProduct', () => {
    it('should add a new product successfully', async () => {
      const newProduct = {
        name: 'New Product',
        description: 'New Description',
        price: 149.99,
        stocks: [],
      };

      mockedAxios.post.mockResolvedValueOnce({ data: { ...newProduct, id: 2 } });

      const result = await addProduct(newProduct as any);

      expect(result).toHaveProperty('id', 2);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/products'),
        newProduct
      );
    });
  });

  describe('updateProductStock', () => {
    it('should update product stock quantity', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });
      mockedAxios.put.mockResolvedValueOnce({
        data: {
          ...mockProduct,
          stocks: [{ ...mockProduct.stocks[0], quantity: 50 }],
        },
      });

      const result = await updateProductStock(1, 1, 50);

      expect(result.stocks[0].quantity).toBe(50);
      expect(mockedAxios.put).toHaveBeenCalled();
    });
  });

  describe('removeProductQuantity', () => {
    it('should remove quantity from product stock', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });
      mockedAxios.put.mockResolvedValueOnce({
        data: {
          ...mockProduct,
          stocks: [{ ...mockProduct.stocks[0], quantity: 80 }],
        },
      });

      const result = await removeProductQuantity(1, 1, 20);

      expect(result.stocks[0].quantity).toBe(80);
    });

    it('should not allow negative quantity', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });
      mockedAxios.put.mockResolvedValueOnce({
        data: {
          ...mockProduct,
          stocks: [{ ...mockProduct.stocks[0], quantity: 0 }],
        },
      });

      const result = await removeProductQuantity(1, 1, 150);

      expect(result.stocks[0].quantity).toBe(0);
    });
  });


describe('addWareHouseToProduct', () => {
  it('should add a new warehouse to product stocks', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });
    mockedAxios.put.mockResolvedValueOnce({
      data: {
        ...mockProduct,
        stocks: [
          ...mockProduct.stocks,
          {
            id: 2,
            name: 'New Warehouse',
            quantity: 50,
            localisation: {
              city: 'New City',
              latitude: 0,
              longitude: 0,
            },
          },
        ],
      },
    });

    const result = await addWareHouseToProduct(2, 1, 'New Warehouse', 'New City', 50);

    expect(result.stocks).toHaveLength(2);
    expect(result.stocks[1].id).toBe(2);
    expect(result.stocks[1].name).toBe('New Warehouse');
    expect(result.stocks[1].quantity).toBe(50);
    expect(result.stocks[1].localisation.city).toBe('New City');
  });

  it('should update quantity if warehouse already exists', async () => {
    const existingWarehouseProduct = {
      ...mockProduct,
      stocks: [
        {
          id: 2,
          name: 'Existing Warehouse',
          quantity: 100,
          localisation: {
            city: 'Existing City',
            latitude: 0,
            longitude: 0,
          },
        },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: existingWarehouseProduct });
    mockedAxios.put.mockResolvedValueOnce({
      data: {
        ...existingWarehouseProduct,
        stocks: [
          {
            id: 2,
            name: 'Existing Warehouse',
            quantity: 150,
            localisation: {
              city: 'Existing City',
              latitude: 0,
              longitude: 0,
            },
          },
        ],
      },
    });

    const result = await addWareHouseToProduct(2, 1, 'Existing Warehouse', 'Existing City', 50);

    expect(result.stocks).toHaveLength(1);
    expect(result.stocks[0].quantity).toBe(150); 
  });

  it('should handle add warehouse to product error', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });
    mockedAxios.put.mockRejectedValueOnce(new Error('Failed to add warehouse'));

    await expect(addWareHouseToProduct(2, 1, 'New Warehouse', 'New City', 50)).rejects.toThrow(
      'Failed to add warehouse'
    );
  });
});


});
