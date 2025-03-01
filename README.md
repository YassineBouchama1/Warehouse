# Stock Management Application

An intuitive application for store stock management, allowing storekeepers to add, track, and modify stock in real time.

## 🚀 Features

### 1. Authentication

- Secure access via a personal secret code for each user.

### 2. Product Management

- **Product Identification**
  - Barcode scanning with `expo-Camera`.
- **Stock Management**
  - Add or remove quantities.
  - Display product details: name, type, price, quantity per warehouse.
- **Adding New Products**
  - Interactive form with: name, type, price, supplier, initial quantity, image (optional).

### 3. Product List

- **Detailed View**: name, type, price, available quantity, stock status.
- **Visual Indicators**
  - Red: out of stock.
  - Yellow: low stock (<10 units).
- **Quick Actions**
  - Restocking.
  - Unloading.

### 4. Advanced Features

- **Filtering and Search**: name, type, price, supplier.
- **Dynamic Sorting**: ascending/descending price, alphabetical name, quantity.

### 5. Stock Statistics & Summary

- Total number of products and locations.
- Out-of-stock products.
- Total stock value.
- Most added/removed products recently.

### 6. Backup & Export

- Export reports in PDF via `expo-print`.

## 🛠 Tech Stack

### Frontend (React Native + Expo)

- React Native with Expo
- StyleSheet for styling
- Expo Router for navigation
- Zustand for state management
- React Query for data fetching

### Backend (JSON Server)

- JSON Server for simulating a database
- `db.json` file for storing products

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/YassineBouchama1/Warehouse.git
```

2. Install dependencies:

```bash
cd warehouse
npm install
```

3. Start the backend JSON Server:

```bash
npx json-server db.json --watch
```

4. Launch the mobile application:

```bash
expo start
```

## 📁 Project Structure

```
WAREHOUSE/
├── .expo/
├── android/
├── api/
│   ├── productApi.ts
│   ├── statisticsApi.ts
│   ├── warehouseApi.ts
│   ├── warehousemanApi.ts
├── app/
│   ├── (auth)/
│   ├── (tabs)/
│   ├── edit-product/
│   ├── product/
│   │   ├── _layout.tsx
│   │   ├── +html.tsx
│   │   ├── +not-found.tsx
│   │   ├── barcode-scanner.tsx
│   │   ├── index.tsx
│   │   ├── modal.tsx
├── assets/
├── components/
├── constants/
├── hooks/
├── node_modules/
├── provider/
├── store/
├── types/
├── utils/
├── .env.example 
├── .gitignore
├── app.json
├── babel.config.js
└── README.md
```

## 📝 License

This project is under the MIT license.

## 👥 Author

- Yassine - [Contact LinkedIn](https://www.linkedin.com/in/yassinebouchama/)
