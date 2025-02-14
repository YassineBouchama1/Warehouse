import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import ConfirmationModal from '../ConfirmationModal';

interface LogoutButtonProps {
  onPress: () => Promise<void>; 
  isLoading: boolean; 
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress, isLoading }) => {
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  // Handle logout confirmation
  const handleConfirmLogout = async () => {
    setIsConfirmationModalVisible(false); 
  await  onPress(); 
  };

  // Handle cancellation
  const handleCancelLogout = () => {
    setIsConfirmationModalVisible(false); 
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsConfirmationModalVisible(true)} 
        disabled={isLoading}>
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Feather name="log-out" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.text}>Logout</Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF3B30', 
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, 
    marginTop: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LogoutButton;
