export interface Localisation {
  city: string;
  latitude: number;
  longitude: number;
}
export interface Warehouse {
  id: number;
  name: string;
  localisation: {
    city: string;
    latitude: number;
    longitude: number;
  };
}

export interface WarehouseStockItem {
  productId: number;
  name: string;
  quantity: number;
}

export interface Stock {
  id: number;
  name: string;
  quantity: number;
  localisation: Localisation;
}

export interface EditedBy {
  warehousemanId: number;
  at: string;
}

export interface Product {
  id: number;
  name: string;
  type: string;
  barcode: string;
  price: number;
  solde?: number;
  supplier: string;
  image: string;
  stocks: Stock[];
  editedBy: EditedBy[];
}

export interface Warehouseman {
  id: number;
  name: string;
  dob: string;
  city: string;
  secretKey: string;
  warehouseId: number;
}

export interface Statistics {
  totalProducts: number;
  outOfStock: number;
  totalStockValue: number;
  mostAddedProducts: { name: string; quantity: number }[];
  mostRemovedProducts: { name: string; quantity: number }[];
}

export type SortOrder = 'asc' | 'desc';

export interface ProductSortConfig {
  sortBy: keyof Product;
  sortOrder: SortOrder;
}

export interface NewProduct extends Omit<Product, 'id'> {}
export interface UpdateProductRequest {
  name?: string;
  type?: string;
  price?: string;
  supplier?: string;
  quantity?: string;
  image?: string | null;
}
export interface AddProductFormData {
  name: string;
  type: string;
  price: string;
  supplier: string;
  quantity: string;
  image: string | null;
}