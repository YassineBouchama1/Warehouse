import { useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { focusManager } from '@tanstack/react-query';

/**
 * Handles app state changes and refocuses React Query when the app becomes active.
 * @param onAppStateChange - Optional callback function to handle app state changes.
 */
export default function useAppState(onAppStateChange?: (status: AppStateStatus) => void) {
  useEffect(() => {
    // Function to handle app state changes
    const handleAppStateChange = (status: AppStateStatus) => {
      // Update React Query's focus state based on app state
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }

      // Call the optional callback function if provided
      if (onAppStateChange) {
        onAppStateChange(status);
      }
    };

    // Add an event listener for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Clean up the event listener when the component unmounts
    return () => subscription.remove();
  }, [onAppStateChange]);
}
