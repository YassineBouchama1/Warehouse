import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '~/constants/theme';

// Custom Toast Config
const toastConfig = {
  success: ({ text1, props }: any) => (
    <View style={styles.successToast}>
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
  error: ({ text1, props }: any) => (
    <View style={styles.errorToast}>
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
  info: ({ text1, props }: any) => (
    <View style={styles.infoToast}>
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  successToast: {
    backgroundColor: '#4CAF50', 
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  errorToast: {
    backgroundColor: '#F44336', 
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  infoToast: {
    backgroundColor: Colors.primary, 
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default toastConfig;
