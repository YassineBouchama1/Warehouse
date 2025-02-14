import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '~/constants/theme';
import { moderateScale } from 'react-native-size-matters';

type GradientWrapperProps = {
  children: ReactNode;
};

const GradientWrapper = ({ children }: GradientWrapperProps) => {
  return (
    <LinearGradient colors={Gradients.background} style={styles.container}>
      {children}
    </LinearGradient>
  );
};

export default GradientWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
