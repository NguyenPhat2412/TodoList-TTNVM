// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@react-native-vector-icons/feather';
import { Todo } from 'types/types';

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dataTasks, setDataTasks] = useState<Todo[]>([]);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || '');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUserTasks = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      const response = await fetch(`${API_URL}/api/todos/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setDataTasks(data);
      }
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
      fetchUserTasks();
    }, [])
  );

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone }),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        console.log('Profile updated successfully');
        fetchUser();
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    navigation.navigate('Login' as never);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fd' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header gradient */}
          <LinearGradient
            colors={['#61058bff', '#6c3d8bff', '#bd6cecff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}>
            <Text style={styles.headerText}>Profile</Text>
          </LinearGradient>

          {/* Avatar Card */}
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
              }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Feather name="list" size={22} color="#ef4444" />
              <Text style={styles.statLabel}>Tasks</Text>
              <Text style={styles.statValue}>{dataTasks.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="check-square" size={22} color="#10b981" />
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>
                {dataTasks.filter((task) => task.completed).length}
              </Text>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handleUpdate}>
              <Feather name="settings" size={18} color="#6d28d9" />
              <Text style={styles.menuText}>Profile Settings</Text>
              <Feather name="chevron-right" size={18} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="lock" size={18} color="#6d28d9" />
              <Text style={styles.menuText}>Change Password</Text>
              <Feather name="chevron-right" size={18} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="bell" size={18} color="#6d28d9" />
              <Text style={styles.menuText}>Notification</Text>
              <Feather name="chevron-right" size={18} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="credit-card" size={18} color="#6d28d9" />
              <Text style={styles.menuText}>Transaction History</Text>
              <Feather name="chevron-right" size={18} color="#ccc" />
            </TouchableOpacity>
          </View>
          <View style={styles.menuButtonLogout}>
            <TouchableOpacity
              style={[styles.menuItemButton, { borderBottomWidth: 0 }]}
              onPress={handleLogout}>
              <Feather name="log-out" size={18} color="#000000ff" />
              <Text style={[styles.menuTextButton, { color: '#000000ff' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  avatar: {
    width: 125,
    height: 125,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    color: '#222',
  },
  userEmail: {
    fontSize: 15,
    color: '#666',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 25,
    marginTop: 25,
    paddingVertical: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    fontSize: 14,
    marginTop: 6,
  },
  statValue: {
    color: '#111',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  menuCard: {
    backgroundColor: '#fff',
    marginHorizontal: 25,
    marginTop: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  menuButtonLogout: {
    backgroundColor: '#fff',
    marginHorizontal: 25,
    marginTop: 15,
    marginBottom: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  menuItemButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  menuText: {
    flex: 1,
    marginLeft: 12,
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },

  menuTextButton: {
    color: '#333',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 12,
  },
});
