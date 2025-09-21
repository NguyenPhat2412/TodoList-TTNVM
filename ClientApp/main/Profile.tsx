// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Profile = () => {
  // ⚡ State user (mock cho demo, sau này thay bằng API + token)
  const [user, setUser] = useState<null | { name: string; email: string }>(null);

  const navigation = useNavigation();
  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleRegister = () => {
    navigation.navigate('Register' as never);
  };

  const handleLogout = () => {
    setUser(null);

    // Delete token trong async storage
    AsyncStorage.removeItem('userToken');
    console.log('User logged out');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Retrieved token:', token);
        if (!token) {
          console.log('No token found, user not logged in');
          return null;
        }
        const response = await fetch(`${API_URL}/api/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const user = await response.json();

        setUser(user);
        await AsyncStorage.setItem('userId', user._id);
        return user;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Welcome, Guest!</Text>
          <Text style={styles.email}>Please login or register</Text>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonLogout}
            onPress={() => {
              navigation.navigate('Home' as never);
              handleLogout();
            }}>
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonSecondary: {
    backgroundColor: '#28a745',
  },
  buttonLogout: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
