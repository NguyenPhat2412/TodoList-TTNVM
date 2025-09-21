// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

interface Data {
  _id: string;
  id: number;
  title: string;
  completed: boolean;
}

const InProgress = () => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setUserId(userId);
        } else {
          console.log('No userId found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };
    fetchUser();
  }, []);

  // use useFocusEffect if needed to refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        setLoading(true);
        // Fetch data from API
        const fetchData = async () => {
          try {
            const response = await fetch(`${API_URL}/api/todos/user/${userId}`);
            const json = await response.json();
            if (response.ok) {
              setData(json.slice(0, 5));
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }
    }, [userId])
  );

  // useEffect(() => {
  //   // Fetch data from API
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`${API_URL}/api/todos/user/${userId}`);
  //       const json = await response.json();
  //       if (response.ok) {
  //         setData(json.slice(0, 5));
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>In Progress</Text>

      {/* Horizontal ScrollView for cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {data.map((item) => (
          <View key={item._id} style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.status}>{item.completed ? '✅ Completed' : '⌛ In Progress'}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default InProgress;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 10,
    color: '#2c3e50',
  },
  scrollContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  card: {
    width: 200,
    marginRight: 12,
    padding: 16,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
