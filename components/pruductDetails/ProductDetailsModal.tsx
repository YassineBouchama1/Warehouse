import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  BackHandler,
  
} from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useProductModalStore } from '~/store/useProductModalStore';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '~/constants/theme';



const ProductDetailsModal: React.FC = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['90%'], []);

  const { productId, isModalOpen, closeModal } = useProductModalStore()



  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        closeModal();
      }
    },
    [closeModal]
  );

 

  useEffect(() => {
    if (isModalOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isModalOpen) {
        closeModal();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [isModalOpen, closeModal]);




  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose>
      <BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
        <React.Suspense fallback={<ActivityIndicator size="large" color={Colors.primary} />}>
          <Text>{productId}</Text>
        </React.Suspense>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(65),
    paddingTop: verticalScale(16),
  },
  
});

export default React.memo(ProductDetailsModal);
