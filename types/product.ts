
export interface Stock {
    id: number;
    name: string;
    quantity: number;
    localisation: {
      city: string;
      latitude: number;
      longitude: number;
    };
  }
  
  export interface EditHistory {
    warehousemanId: number;
    at: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    type: string;
    barcode: string;
    price: number;
    supplier: string;
    image: string;
    stocks: Stock[];
    editedBy: EditHistory[];
    solde: number;
  }
  
