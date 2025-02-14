import type React from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '~/constants/theme';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  secureTextEntry = false,
  isLoading = false,
  disabled = false,
  icon,
}) => {
  return (
    <View style={styles.inputRow}>
      <View style={[styles.inputContainer, disabled && styles.disabledInputContainer]}>
        {icon && (
          <Ionicons
            name={icon}
            size={moderateScale(20)}
            color={disabled ? Colors.secondary : Colors.primary}
            style={styles.icon}
          />
        )}
        <View style={styles.inputWrapper}>
          <Text style={[styles.label, disabled && styles.disabledLabel]}>{label}</Text>
          <TextInput
            style={[styles.input, disabled && styles.disabledInput]}
            placeholder={placeholder}
            placeholderTextColor={Colors.secondary}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            editable={!disabled}
          />
        </View>
        {isLoading && (
          <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    width: '100%',
    marginBottom: verticalScale(16),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    borderRadius: moderateScale(10),
    borderColor: '#cecdcd',
    borderWidth: moderateScale(0.5),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
  },
  icon: {
    marginRight: scale(8),
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: moderateScale(12),
    color: Colors.secondary,
    marginBottom: verticalScale(2),
  },
  input: {
    fontSize: moderateScale(14),
    color: Colors.text,
    padding: 0,
  },
  loader: {
    marginLeft: scale(10),
  },
  disabledInputContainer: {
    backgroundColor: '#e9e9e9',
  },
  disabledInput: {
    color: '#a9a9a9',
  },
  disabledLabel: {
    color: '#a9a9a9',
  },
});

export default CustomInput;
