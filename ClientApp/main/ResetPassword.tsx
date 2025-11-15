// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from 'types/types';
type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;
const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const route = useRoute<ResetPasswordRouteProp>();
  const { email } = route.params;
  const navigation = useNavigation();

  const handleResetPassword = () => {
    fetch(`${API_URL}/api/admin/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword, confirmPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Password reset successfully') {
          alert('Password reset successfully');
          navigation.navigate('Login' as never);
        } else {
          alert(data.message || 'Failed to reset password');
        }
      })
      .catch((err) => {
        console.log(err);
        alert('An error occurred. Please try again.');
      });
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        {/* <LinearGradient colors={['#4c6ef5', '#228be6', '#15aabf']}> */}
        <LinearGradient
          colors={['#61058bff', '#6c3d8bff', '#bd6cecff']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View style={styles.headerLogin}>
            <View style={styles.headerLoginWrapper}>
              <Text style={styles.appTitle}>Todo App</Text>
              <Text style={styles.appSubtitle}>Organize your day with ease ✨</Text>

              <View style={styles.registerWrapper}>
                <Text style={styles.footerText}>Reset your password?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                  <Text style={styles.footerLink}>Let’s reset it</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.mainTitle}>Reset Password</Text>
            <Text style={styles.subTitle}>Let’s reset it</Text>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your new password"
                placeholderTextColor="#aaa"
                value={newPassword}
                onChangeText={setNewPassword}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your confirm password"
                placeholderTextColor="#aaa"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>

            {/* Login button */}
            <TouchableOpacity onPress={handleResetPassword} activeOpacity={0.8}>
              <LinearGradient
                colors={['#61058bff', '#9c56caff', '#bd6cecff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Reset Password</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafc',
    justifyContent: 'center',
  },
  headerLogin: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerLoginWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },

  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  appSubtitle: {
    fontSize: 16,
    color: '#f3e8ff',
    marginTop: 6,
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '500',
  },

  registerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  footerText: {
    fontSize: 15,
    color: '#fff',
  },

  footerLink: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
    marginLeft: 5,

    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  formContainer: {
    paddingHorizontal: 15,
    paddingTop: 30,
    flex: 0.65,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },

  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
    fontSize: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    color: '#007bff',
    fontSize: 14,
  },

  loginButton: {
    // backgroundColor: 'linear-gradient(90deg, #4b6cb7 0%, #182848 100%)',
    backgroundColor: '#4b6cb7',
    paddingVertical: 20,

    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontWeight: '500',
  },

  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 0.48,
    justifyContent: 'center',
  },
  socialText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
    color: '#333',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
