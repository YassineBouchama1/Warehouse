import { Redirect } from 'expo-router';
import { useAuthStore } from '~/store/useAuthStore';

export default function Index() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return null; 
  }

  console.log(user);

  return <Redirect href={user ? '/(tabs)/products' : '/(auth)/login'} />;
}
