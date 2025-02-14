import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Surface, Text, useTheme, List, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientWrapper from '~/components/GradientWrapper';
import { fetchStatistics } from '~/api/statisticsApi';
import { Statistics } from '~/types';



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





const StatisticsScreen = () => {
  const [data, setData] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statis = await fetchStatistics()
          setData(statis);
        
      } catch (error) {
        console.error('Error fetching statistics:', error);
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
console.log( data.mostAddedProducts)
  return (
    <GradientWrapper>
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
       
        
       
      </ScrollView>
    </GradientWrapper>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
