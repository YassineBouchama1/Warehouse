

import { useState } from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { fetchProducts } from '../api/productApi';
import { AddProductForm } from '../components/products/AddProductForm';
import type { Product } from '../types';
import { useAuthStore } from '~/store/useAuthStore';

interface ScanResult {
  data: string;
}

const  BarcodeScannerScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);

  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need camera permission to scan barcodes</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }: ScanResult) => {
    setScannedBarcode(data);
    try {
      const products = await fetchProducts();
      const product = products.find((p: Product) => p.barcode === data);

      if (product) {
        const userWarehouse = product.stocks.find((stock) => stock.id === user?.warehouseId);

        if (userWarehouse) {
          router.push(`/product/${product.id}`);
        } else {
          setExistingProduct(product);
          setShowAddProduct(true);
        }
      } else {
        setShowAddProduct(true);
      }
    } catch (error) {
      console.error('Error processing scanned barcode:', error);
    }
  };

  const handleCancelAddProduct = () => {
    setScannedBarcode(null);
    setShowAddProduct(false);
    setExistingProduct(null);
  };

  if (showAddProduct && scannedBarcode) {
    return (
      <AddProductForm
        initialBarcode={scannedBarcode}
        existingProduct={existingProduct}
        onCancel={handleCancelAddProduct}
        onSuccess={(productId) => router.replace(`/product/${productId}`)}
      />
    );
  }

  return (
    <CameraView
      style={styles.camera}
      barcodeScannerSettings={{
        barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a'],
      }}
      onBarcodeScanned={scannedBarcode ? undefined : handleBarcodeScanned}>
      <View style={styles.overlay}>
        <Text style={styles.scanText}>Scan Barcode</Text>
      </View>
    </CameraView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});


export default BarcodeScannerScreen
