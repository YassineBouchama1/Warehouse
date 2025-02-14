import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ErrorViewProps = {
  error: string;
};

export function ErrorView({ error }: ErrorViewProps) {
  return (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle" size={64} color="#FF3B30" />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 10,
  },
});
