import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

export function LoadingView() {
  return (
    <View style={styles.loadingContainer}>
      <MotiView
        from={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ loop: true, duration: 1000 }}
        style={styles.loadingIndicator}
      />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
