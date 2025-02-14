import React from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Triggers a refetch when the screen is focused.
 * @param refetch - The refetch function from React Query.
 * @param enabled .
 */

export function useRefreshOnFocus<T>(refetch: () => Promise<T>, enabled = true) {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (!enabled) return; // Skip refetch if not enabled

      // Skip the first focus event to avoid double fetching
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch, enabled])
  );
}