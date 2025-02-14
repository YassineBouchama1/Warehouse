import React, { useState, lazy, Suspense, useCallback } from 'react';
import {
  View,

  StyleSheet,

} from 'react-native';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import GradientWrapper from '~/components/GradientWrapper';
import LogoutButton from '~/components/profile/LogoutButton';
import { router } from 'expo-router';
import { useAuth } from '~/provider/AuthProvider';


const ProfileScreen = () => {
const { logout } = useAuth();

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
 
});

export default React.memo(ProfileScreen);
