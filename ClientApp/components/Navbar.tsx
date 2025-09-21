// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from '@react-native-vector-icons/feather';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const Navbar = () => {
  const [userName, setUserName] = React.useState('User');

  useEffect(() => {
    const getUserName = async () => {
      try {
        const response = await fetch(`${API_URL}/api/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
          },
        });
        if (response.ok) {
          const user = await response.json();
          setUserName(user.name || 'User');

          return user.name || 'User';
        }
        return 'User';
      } catch (error) {
        console.error('Error retrieving user name:', error);
        return 'User';
      }
    };
    getUserName();
  }, []);
  return (
    <View style={styles.container}>
      {/* Image */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>Hello!</Text>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>
      </View>

      {/* Bell */}
      <View style={styles.bellContainer}>
        <Feather name="bell" size={24} color="black" />
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    flex: 1,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: -2,
    flexWrap: 'wrap',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  bellContainer: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
