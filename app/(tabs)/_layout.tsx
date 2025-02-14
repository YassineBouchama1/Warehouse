import { Tabs, usePathname } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Colors } from '~/constants/theme';
import Feather from '@expo/vector-icons/Feather';
import { scale } from 'react-native-size-matters';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

import Header from '~/components/Header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View } from 'react-native';

const AnimatedFeather = Animated.createAnimatedComponent(Feather);
const AnimatedMaterialIcons = Animated.createAnimatedComponent(MaterialIcons);
const AnimatedView = Animated.createAnimatedComponent(View);

type TabIconProps = {
  color: string;
};

const TabsLayout: React.FC = () => {
  const pathname = usePathname();
  const activeTab = useSharedValue(0);

  useEffect(() => {
    const route = pathname.split('/')[1] || 'index';
    activeTab.value = route === 'products' ? 1 : route === 'profile' ? 2 : 0;
  }, [pathname]);

  // Create animation styles for icons
  const animatedIconStyles = [
    useAnimatedStyle(() => ({
      transform: [{ scale: activeTab.value === 0 ? withSpring(1.2) : withSpring(1) }],
      opacity: activeTab.value === 0 ? withTiming(1) : withTiming(0.6),
    })),
    useAnimatedStyle(() => ({
      transform: [{ scale: activeTab.value === 1 ? withSpring(1.2) : withSpring(1) }],
      opacity: activeTab.value === 1 ? withTiming(1) : withTiming(0.6),
    })),
    useAnimatedStyle(() => ({
      transform: [{ scale: activeTab.value === 2 ? withSpring(1.2) : withSpring(1) }],
      opacity: activeTab.value === 2 ? withTiming(1) : withTiming(0.6),
    })),
  ];

  // Animation for the middle button container
  const animateTasksContainer = useAnimatedStyle(() => ({
    opacity: activeTab.value === 1 ? withTiming(1) : withTiming(0.6),
  }));

  // Screen listeners for updating active tab
  const screenListeners = useCallback(
    () => ({
      tabPress: (e: any) => {
        const routeName = e.target.split('-')[0];
        if (routeName === 'index') activeTab.value = 0;
        if (routeName === 'products') activeTab.value = 1;
        if (routeName === 'profile') activeTab.value = 2;
      },
      focus: (e: any) => {
        const routeName = e.target.split('-')[0];
        if (routeName === 'index') activeTab.value = 0;
        if (routeName === 'products') activeTab.value = 1;
        if (routeName === 'profile') activeTab.value = 2;
      },
    }),
    []
  );

  // Function to get the header title based on route
  const getHeaderTitle = (route: string) => {
    switch (route) {
      case 'index':
        return 'Home';
      case 'profile':
        return 'profile';
      case 'products':
        return 'Barcode Scanner';
      default:
        return '';
    }
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        header: () => <Header title={getHeaderTitle(route.name)} />,
        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarItemStyle: { margin: 5, justifyContent: 'center', alignItems: 'center' },
        tabBarLabelStyle: { fontSize: 14, marginTop: 5, marginBottom: 5, fontWeight: '500' },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
      screenListeners={screenListeners}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: TabIconProps) => (
            <AnimatedFeather
              name="home"
              size={scale(20)}
              color={color}
              style={animatedIconStyles[0]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: '',
          tabBarIcon: ({ color }: TabIconProps) => (
            <AnimatedView
              style={[
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 70,
                  width: 70,
                  borderRadius: 50,
                  backgroundColor: Colors.primary,
                },
                animateTasksContainer,
              ]}>
              <AnimatedFeather
                name="box"
                size={scale(30)}
                color={'#fff'}
                style={animatedIconStyles[1]}
              />
            </AnimatedView>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color }: TabIconProps) => (
            <AnimatedFeather
              name="user"
              size={scale(20)}
              color={color}
              style={animatedIconStyles[2]}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default React.memo(TabsLayout);
