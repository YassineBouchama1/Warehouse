import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '~/provider/AuthProvider';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  // show nothing while checking authentication status
  if (isLoading) {
    return null;
  }



    return isAuthenticated ? (
      <Redirect href="/(tabs)/products" />
    ) : (
      <Redirect href="/(auth)/login" />
    );
  
}
