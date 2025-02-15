import axios from "axios"
import type { Product, Warehouse, WarehouseStockItem } from "../types"

const API_URL = `${process.env.EXPO_PUBLIC_API}:3000`



export const fetchWarehouses = async (): Promise<Warehouse[]> => {
  const response = await axios.get<Product[]>(`${API_URL}/products`)
  const products = response.data

  const warehouses = new Map<number, Warehouse>()

  products.forEach((product) => {
    product.stocks.forEach((stock) => {
      if (!warehouses.has(stock.id)) {
        warehouses.set(stock.id, {
          id: stock.id,
          name: stock.name,
          localisation: stock.localisation,
        })
      }
    })
  })

  return Array.from(warehouses.values())
}

export const fetchWarehouseStock = async (warehouseId: number): Promise<WarehouseStockItem[]> => {
  const response = await axios.get<Product[]>(`${API_URL}/products`)
  const products = response.data

  const warehouseStock = products
    .map((product) => {
      const stock = product.stocks.find((s) => s.id === warehouseId)
      if (stock) {
        return {
          productId: product.id,
          name: product.name,
          quantity: stock.quantity,
        }
      }
      return null
    })
    .filter((item): item is WarehouseStockItem => item !== null)

  return warehouseStock
}

