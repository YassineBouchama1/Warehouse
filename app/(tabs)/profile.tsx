import React, { useState, lazy, Suspense, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import GradientWrapper from '~/components/GradientWrapper';
import { Colors } from '~/constants/theme';
import LogoutButton from '~/components/profile/LogoutButton';
import { useAuthStore } from '~/store/useAuthStore';
import { router } from 'expo-router';


const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const translateX = useSharedValue(0);
const logout = useAuthStore((state) => state.logout);
  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    translateX.value = withSpring(tab === 'profile' ? 0 : moderateScale(300), {
      damping: 10,
      stiffness: moderateScale(100),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleLogout = useCallback(async () => {
logout()
router.push('/login')
  
  }, []);



  return (
    <GradientWrapper>

      <View style={styles.scrollContainer}>
        <LogoutButton onPress={handleLogout} isLoading={false} />
      </View>
    </GradientWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: verticalScale(10),
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    position: 'relative',
  },
  headerTab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  headerText: {
    color: Colors.primary,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '50%',
    backgroundColor: Colors.primary,
  },
});

export default React.memo(ProfileScreen);
