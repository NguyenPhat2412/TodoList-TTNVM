// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from '@react-native-vector-icons/feather';
import { LinearGradient } from 'expo-linear-gradient';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password!');
      return;
    }

    // Fetch API to login user
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        // Navigate to Home or Home screen
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userId', data.user.id.toString());
        navigation.navigate('Home' as never);
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('userToken');

      if (token) {
        navigation.navigate('Home' as never);
      }
    };
    checkLogin();
  }, []);

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
                <Text style={styles.footerText}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                  <Text style={styles.footerLink}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.mainTitle}>Welcome Back 👋</Text>
            <Text style={styles.subTitle}>Login to continue using the app</Text>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot password */}
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Login button */}
            <TouchableOpacity onPress={handleLogin}>
              <LinearGradient
                colors={['#61058bff', '#9c56caff', '#bd6cecff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* OR divider */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* Social login */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={[styles.socialButton, { borderColor: '#3b5998' }]}>
                <Feather name="facebook" size={22} color="#3b5998" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.socialButton, { borderColor: '#db4a39' }]}>
                <Feather name="mail" size={22} color="#db4a39" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

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
