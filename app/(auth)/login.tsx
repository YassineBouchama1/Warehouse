import { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { fetchWarehouseman } from '~/api/warehousemanApi';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors, Fonts } from '~/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '~/store/useAuthStore';

const logo = require('~/assets/logo.png');

export default function LoginScreen() {
  const [secretCode, setSecretCode] = useState('123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  const memoizedStyles = useMemo(() => styles, []);

  // useEffect(() => {
  //   if (user) {
  //   router.replace('/(tabs)/products');
  //   }
  // }, [user]); 
  console.log('iam in login')
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const warehouseman = await fetchWarehouseman(secretCode);
      if (warehouseman) {
       await login(warehouseman);
        router.push('/(tabs)/products');
      } else {
        setError('Invalid secret code');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={memoizedStyles.container}>
      <View style={memoizedStyles.card}>
        <Image source={logo} style={memoizedStyles.logo} />
        <Text style={memoizedStyles.title}>
          Sign in to your account to start using your account
        </Text>

        {/* Secret Code Input */}
        <View style={memoizedStyles.inputContainer}>
          <Ionicons
            name="code"
            size={moderateScale(25)}
            color={Colors.secondary}
            style={memoizedStyles.icon}
          />
          <TextInput
            style={memoizedStyles.input}
            placeholder="Secret Code"
            placeholderTextColor={Colors.secondary}
            value={secretCode}
            onChangeText={setSecretCode}
            keyboardType="visible-password"
            autoCapitalize="none"
          />
        </View>
        {error && <Text style={memoizedStyles.errorText}>{error}</Text>}

        {/* Login Button */}
        <TouchableOpacity style={memoizedStyles.button} onPress={handleLogin} disabled={isLoading}>
          <Text style={memoizedStyles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    alignItems: 'center',
  },
  logo: {
    height: verticalScale(150),
    width: scale(150),
    resizeMode: 'contain',
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(40),
    fontWeight: '300',
    color: '#5E6A7C',
    textAlign: 'center',
    fontFamily: Fonts.regular,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: verticalScale(50),
    backgroundColor: '#fcfcfc',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    borderColor: '#cecdcd',
    borderWidth: moderateScale(0.5),
    marginBottom: verticalScale(20),
  },
  icon: {
    marginRight: moderateScale(10),
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.text,
    fontFamily: Fonts.regular,
  },
  button: {
    width: '100%',
    height: verticalScale(40),
    backgroundColor: Colors.primary,
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  buttonText: {
    color: Colors.white,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    fontFamily: Fonts.bold,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: verticalScale(10),
    fontFamily: Fonts.regular,
  },
});
