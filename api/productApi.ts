import axios from "axios"
import type { Product } from "../types"

const API_URL = `${process.env.EXPO_PUBLIC_API}:3000`


export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${API_URL}/products`)
  return response.data
}

export const fetchProductById = async (id: number|string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/products/${id}`)
  return response.data
}

export const addProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  const response = await axios.post<Product>(`${API_URL}/products`, product)
  return response.data
}

export const updateProductStock = async (
  productId:  number|string,
  warehouseId: number,
  quantity: number,
): Promise<Product> => {
  const product = await fetchProductById(productId)
  const updatedStocks = product.stocks.map((stock) => {
    if (stock.id === warehouseId) {
      return { ...stock, quantity }
    }
    return stock
  })

  const updatedProduct = { ...product, stocks: updatedStocks }
  const response = await axios.put<Product>(`${API_URL}/products/${productId}`, updatedProduct)
  return response.data
}

export const removeProductQuantity = async (
  productId: number | string,
  warehouseId: number | string,
  quantityToRemove: number
): Promise<Product> => {
  const product = await fetchProductById(productId);
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

