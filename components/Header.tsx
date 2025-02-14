import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors, Fonts, Gradients } from '~/constants/theme';



type HeaderProps = {
  title?: string;
};

const Header: React.FC<HeaderProps> = ({ title = '' }) => {





  return (
    <View style={styles.container}>
      <Pressable
      
        style={styles.iconContainer}>
        <Image source={require('~/assets/logo.png')} style={styles.headerIcon} />
      </Pressable>

      <Text style={styles.title}>{title}</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(6),
    paddingHorizontal: moderateScale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E5EEF3',
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: Colors.secondary,
    fontFamily: Fonts.bold,
    flex: 1,
    textAlign: 'center',
  },
  iconContainer: {
    padding: moderateScale(4),
    borderRadius: moderateScale(8),
  },
  pressed: {
    opacity: 0.7,
  },
  headerIcon: {
    width: scale(45),
    height: verticalScale(45),
    resizeMode: 'contain',
  },
  notificationContainer: {
    padding: moderateScale(4),
    position: 'relative',
  },
  alertBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.error,
    borderRadius: moderateScale(10),
    minWidth: moderateScale(20),
    height: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: moderateScale(4),
  },
  alertText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
});

export default React.memo(Header);