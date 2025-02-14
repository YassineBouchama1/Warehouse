import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Surface, Text, useTheme, List, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Statistics {
  totalProducts: number;
  outOfStock: number;
  totalStockValue: number;
  mostAddedProducts: Array<{
    name: string;
    quantity: number;
    date: string;
  }>;
  mostRemovedProducts: string[];
  lastAdded?: { name: string; timestamp: string };
  lastUpdated?: { name: string; timestamp: string };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  gradientColors: string[];
}

const StatCard = ({ title, value, icon, gradientColors }: StatCardProps) => (
  <Surface style={styles.statCard}>
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}>
      <MaterialCommunityIcons name={icon} size={24} color="white" style={styles.icon} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </LinearGradient>
  </Surface>
);

const ProductList = ({
  title,
  products,
}: {
  title: string;
  products: Array<{ name: string; quantity: number; date: string }>;
}) => (
  <Surface style={styles.activityCard}>
    <Text style={styles.activityTitle}>{title}</Text>
    {products.length > 0 ? (
      products.map((product, index) => (
        <React.Fragment key={index}>
          <List.Item
            title={product.name}
            description={`Added on ${product.date}`}
            left={(props) => <List.Icon {...props} icon="package-variant" />}
            right={() => (
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>+{product.quantity}</Text>
              </View>
            )}
            style={styles.listItem}
          />
          {index < products.length - 1 && <Divider />}
        </React.Fragment>
      ))
    ) : (
      <Text style={styles.emptyText}>No products added yet</Text>
    )}
  </Surface>
);

const LastUpdateCard = ({
  title,
  data,
}: {
  title: string;
  data?: { name: string; timestamp: string };
}) => (
  <Surface style={styles.lastUpdateCard}>
    <Text style={styles.lastUpdateTitle}>{title}</Text>
    {data ? (
      <>
        <Text style={styles.lastUpdateProduct}>{data.name}</Text>
        <Text style={styles.lastUpdateTime}>{data.timestamp}</Text>
      </>
    ) : (
      <Text style={styles.emptyText}>No updates</Text>
    )}
  </Surface>
);

const StatisticsScreen = () => {
  const [data, setData] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Mock data with added products list
  const mockData: Statistics = {
    totalProducts: 3,
    outOfStock: 1,
    totalStockValue: 70,
    mostAddedProducts: [
      { name: 'Product XYZ', quantity: 5, date: '2025-02-14' },
      { name: 'Product ABC', quantity: 3, date: '2025-02-13' },
      { name: 'Product 123', quantity: 2, date: '2025-02-12' },
    ],
    mostRemovedProducts: [],
    lastAdded: { name: 'Product XYZ', timestamp: '2 hours ago' },
    lastUpdated: { name: 'Product ABC', timestamp: '30 minutes ago' },
  };

  useEffect(() => {
    // Simulating API call with mock data
    const fetchData = async () => {
      try {
        setData(mockData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>Failed to load statistics</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Statistics Overview</Text>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Products"
          value={data.totalProducts}
          icon="package-variant"
          gradientColors={['#4c669f', '#3b5998']}
        />
        <StatCard
          title="Out of Stock"
          value={data.outOfStock}
          icon="alert-circle"
          gradientColors={['#ff416c', '#ff4b2b']}
        />
        <StatCard
          title="Stock Value"
          value={`$${data.totalStockValue}`}
          icon="currency-usd"
          gradientColors={['#11998e', '#38ef7d']}
        />
      </View>

      <View style={styles.lastUpdateContainer}>
        <LastUpdateCard title="Last Added" data={data.lastAdded} />
        <LastUpdateCard title="Last Updated" data={data.lastUpdated} />
      </View>

      <ProductList title="Most Added Products" products={data.mostAddedProducts} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 8,
    fontSize: 16,
    color: '#ff4b2b',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  gradientContainer: {
    padding: 16,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statTitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  lastUpdateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  lastUpdateCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  lastUpdateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  lastUpdateProduct: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  lastUpdateTime: {
    fontSize: 12,
    color: '#999',
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listItem: {
    paddingVertical: 8,
  },
  quantityContainer: {
    backgroundColor: '#e8f5e9',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default StatisticsScreen;
