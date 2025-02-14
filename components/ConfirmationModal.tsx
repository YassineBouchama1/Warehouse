import React from 'react';
import {  View, Text, Pressable, StyleSheet } from 'react-native';
import { Portal, Modal } from 'react-native-paper'; 

interface ConfirmationModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
 
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onCancel,
  onConfirm,
  title = 'End Task',
  message = 'Are you sure you finished this task?',
}) => {
  return (
    
    <Portal>
      <Modal
        // transparent={true}
        visible={isVisible}
        // statusBarTranslucent={true}
        // presentationStyle="overFullScreen"
        // animationType="fade"
        contentContainerStyle={styles.modalOverlay}
        overlayAccessibilityLabel="Overlay"
        onDismiss={onCancel}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtons}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    height: '100%',
    
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4DA4CE',
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default React.memo(ConfirmationModal);
