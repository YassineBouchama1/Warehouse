import axios from 'axios';
import type { Product } from '../types';
import { fetchWarehouses } from './warehouseApi';

const API_URL = `${process.env.EXPO_PUBLIC_API}:3000`;

// export const fetchProducts = async (): Promise<Product[]> => {
//   const response = await axios.get<Product[]>(`${API_URL}/products`);
//   return response.data;
// };


export const fetchProducts = async (
  searchQuery?: string,
  sortBy?: string,
  orderBy?: string,
  city?: string,
  inStockOnly?: boolean
): Promise<Product[]> => {

  // fecth all products from the server
  const response = await axios.get<Product[]>(`${API_URL}/products`);
  let products = response.data;

  // here if search provid  search filter
  if (searchQuery) {
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.supplier?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // apply city filter
  if (city) {
    products = products.filter((product) =>
      product.stocks.some((stock) => stock.localisation.city === city)
    );
  }

  // apply in-stock filter
  if (inStockOnly) {
    products = products.filter((product) => product.stocks.some((stock) => stock.quantity > 0));
  }

  // apply sorting
  if (sortBy) {
    products.sort((a, b) => {
      if (sortBy === 'name') {
        return orderBy === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortBy === 'quantity') {
        const totalQuantityA = a.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
        const totalQuantityB = b.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
        return orderBy === 'asc'
          ? totalQuantityA - totalQuantityB
          : totalQuantityB - totalQuantityA;
      } else if (sortBy === 'stock') {
        const inStockA = a.stocks.some((stock) => stock.quantity > 0) ? 1 : 0;
        const inStockB = b.stocks.some((stock) => stock.quantity > 0) ? 1 : 0;
        return orderBy === 'asc' ? inStockA - inStockB : inStockB - inStockA;
      }
      return 0;
    });
  }

  return products;
};

export const fetchProductById = async (id: number | string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/products/${id}`);
  return response.data;
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axios.post<Product>(`${API_URL}/products`, product);
  return response.data;
};

export const updateProductStock = async (
  productId: number | string,
  warehouseId: number,
  quantity: number
): Promise<Product> => {
  const product = await fetchProductById(productId);
  const updatedStocks = product.stocks.map((stock) => {
    if (stock.id === warehouseId) {
      return { ...stock, quantity };
    }
    return stock;
  });

  const updatedProduct = { ...product, stocks: updatedStocks };
  const response = await axios.put<Product>(`${API_URL}/products/${productId}`, updatedProduct);
  return response.data;
};


export const removeProductQuantity = async (
  productId: number | string,
  warehouseId: number | string,
  quantityToRemove: number
): Promise<Product> => {
  const product = await fetchProductById(productId);

  if (quantityToRemove === 0 ){
    
  }
    const updatedStocks = product.stocks.map((stock) => {
      if (stock.id === warehouseId) {
        const newQuantity = Math.max(0, stock.quantity - quantityToRemove);
        return { ...stock, quantity: newQuantity };
      }
      return stock;
    });

  const updatedProduct = { ...product, stocks: updatedStocks };
  const response = await axios.put<Product>(`${API_URL}/products/${productId}`, updatedProduct);
  return response.data;
};

export const deleteProduct = async (id: number | string): Promise<void> => {
  await axios.delete(`${API_URL}/products/${id}`);
};

export const updateProductDetails = async (
  productId: number | string,
  updatedDetails: Partial<Product>
): Promise<Product> => {
  const product = await fetchProductById(productId);
  const updatedProduct = { ...product, ...updatedDetails };
  const response = await axios.put<Product>(`${API_URL}/products/${productId}`, updatedProduct);
  return response.data;
};

export const addStockToProduct = async (
  productId: number | string,
  warehouseId: number,
  quantity: number,
  city: string
): Promise<Product> => {
  const product = await fetchProductById(productId);
  const existingStockIndex = product.stocks.findIndex((stock) => stock.id === warehouseId);

  if (existingStockIndex !== -1) {
    product.stocks[existingStockIndex].quantity += quantity;
  } else {
    product.stocks.push({
      id: warehouseId,
      name: `Warehouse ${warehouseId}`,
      quantity: quantity,
      localisation: {
        city: city,
        latitude: 0,
        longitude: 0,
      },
    });
  }

  const response = await axios.put<Product>(`${API_URL}/products/${productId}`, product);
  return response.data;
};



export const addWareHouseToProduct = async (
  newWarehouseId:string | number,
  productId: number | string,
  name: string,
  city: string,
  quantity: number
): Promise<Product> => {
  const product = await fetchProductById(productId);

    product.stocks.push({
      id: newWarehouseId,
      name: name || 'no city',
      quantity: quantity,
      localisation: {
        city: city,
        latitude: 0,
        longitude: 0,
      },
    });
  

  const response = await axios.put<Product>(`${API_URL}/products/${productId}`, product);
  return response.data;
};



export const removeStockFromProduct = async (
  productId: number | string,
  warehouseId: number | string
): Promise<void> => {
  try {
    const product = await fetchProductById(productId);

    const updatedStocks = product.stocks.filter((stock) => stock.id !== warehouseId);

    // Update the product with the new stocks array
    const updatedProduct = { ...product, stocks: updatedStocks };

    // Send the updated product to the server
    const response = await axios.put<Product>(`${API_URL}/products/${productId}`, updatedProduct);

    // Check if the update was successful
    if (response.status !== 200) {
      throw new Error('Failed to remove stock from product');
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

