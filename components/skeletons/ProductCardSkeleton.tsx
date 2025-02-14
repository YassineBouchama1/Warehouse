import React from 'react';
import { View, StyleSheet } from 'react-native';
import { verticalScale, moderateScale } from 'react-native-size-matters';

const ProductCardSkeleton = () => {
  return (
    <View style={styles.card}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={[styles.skeletonPlaceholder, { width: '60%', height: moderateScale(20) }]} />
        <View style={[styles.skeletonPlaceholder, { width: '20%', height: moderateScale(20) }]} />
      </View>

      {/* Client Name Skeleton */}
      <View
        style={[
          styles.skeletonPlaceholder,
          { width: '40%', height: moderateScale(16), marginBottom: verticalScale(16) },
        ]}
      />

      {/* Date Container Skeleton */}
      <View style={styles.dateContainer}>
        <View style={styles.dateWrapper}>
          <View
            style={[
              styles.skeletonPlaceholder,
              { width: moderateScale(20), height: verticalScale(20) },
            ]}
          />
          <View
            style={[
              styles.skeletonPlaceholder,
              { width: '30%', height: moderateScale(14), marginLeft: moderateScale(4) },
            ]}
          />
        </View>

        <View
          style={[
            styles.skeletonPlaceholder,
            { width: moderateScale(20), height: verticalScale(20) },
          ]}
        />

        <View style={styles.dateWrapper}>
          <View
            style={[
              styles.skeletonPlaceholder,
              { width: moderateScale(20), height: verticalScale(20) },
            ]}
          />
          <View
            style={[
              styles.skeletonPlaceholder,
              { width: '30%', height: moderateScale(14), marginLeft: moderateScale(4) },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    shadowRadius: moderateScale(3.84),
    marginBottom: verticalScale(8),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonPlaceholder: {
    backgroundColor: '#e0e0e0',
    borderRadius: moderateScale(4), 
  },
});

export default ProductCardSkeleton;
