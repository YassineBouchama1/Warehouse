import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppStateStatus, LogBox, Platform, SafeAreaView } from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { checkWarehouseman } from '~/utils/checkWarehouseman';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GradientWrapper from '~/components/GradientWrapper';
import { useAuthStore, User } from '~/store/useAuthStore';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import useOnlineManager from '~/hooks/query/UseOnlineManager';
import useAppState from '~/hooks/query/useAppState';
// import NetInfo from '@react-native-community/netinfo';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';


export const unstable_settings = {
  initialRouteName: '(tabs)/products',
};

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const insets = useSafeAreaInsets();
  const { loadUser, isLoading } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoading) {
    return null; // Show splash/loading screen if necessary
  }

  return (
    <SafeAreaProvider style={{ paddingTop: insets.top }}>
      <GradientWrapper>
        <Slot />
        <StatusBar style="auto" />
      </GradientWrapper>
    </SafeAreaProvider>
  );
}


export default function Layout() {
  const [fontsLoaded] = useFonts({
    // "Inter-Black": require("./assets/Inter-Black.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);



  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  }

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 2 } },
  });

  // useOnlineManager();
  // useAppState(onAppStateChange);


  // debugging
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
      <RootSiblingParent>
                   <BottomSheetModalProvider>

        <RootLayoutNav />
        </BottomSheetModalProvider>
      </RootSiblingParent>
</QueryClientProvider>
    </GestureHandlerRootView>
  );
}
