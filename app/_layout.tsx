import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { AppStateStatus, LogBox, Platform, SafeAreaView } from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { checkWarehouseman } from '~/utils/checkWarehouseman';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GradientWrapper from '~/components/GradientWrapper';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import useOnlineManager from '~/hooks/query/UseOnlineManager';
import useAppState from '~/hooks/query/useAppState';
// import NetInfo from '@react-native-community/netinfo';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '~/provider/AuthProvider';


export const unstable_settings = {
  initialRouteName: '(tabs)/products',
};

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const insets = useSafeAreaInsets();
  const { isLoading } = useAuth();


 if (isLoading) {
   return null; 
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



const onAppStateChange = useCallback((status: AppStateStatus) => {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}, []);

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
      <AuthProvider>

            <QueryClientProvider client={queryClient}>
      <RootSiblingParent>
          <PaperProvider>

                   <BottomSheetModalProvider>

        <RootLayoutNav />
        </BottomSheetModalProvider>
          </PaperProvider>
      </RootSiblingParent>
</QueryClientProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
