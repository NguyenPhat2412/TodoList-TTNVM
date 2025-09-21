import { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import Navbar from 'components/Navbar';
import ViewTask from 'components/ViewTask';
import InProgress from 'components/InProgress';
import Feather from '@react-native-vector-icons/feather';

interface CategoryCount {
  category: string;
  count: number;
}

const categories = [
  { name: 'Work', color: '#ff7eb9', icon: 'briefcase' },
  { name: 'Personal', color: '#7afcff', icon: 'user' },
  { name: 'Shopping', color: '#feff9c', icon: 'shopping-cart' },
  { name: 'Fitness', color: '#b9ffb7', icon: 'activity' },
  { name: 'Others', color: '#fbc1ff', icon: 'layers' },
];

const Home = () => {
  const [counts, setCounts] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Lấy userId từ AsyncStorage
  useFocusEffect(
    useCallback(() => {
      const loadUserId = async () => {
        try {
          const storedId = await AsyncStorage.getItem('userId');
          if (storedId) {
            setUserId(storedId);
          } else {
            console.log('No userId found, user not logged in');
          }
        } catch (error) {
          console.error('Error reading userId:', error);
        }
      };
      loadUserId();
    }, [])
  );

  // Fetch số lượng todos theo category
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/todos/category/count/${userId}`);
        const data = await res.json();
        if (res.ok && data && typeof data === 'object') {
          const formattedData = Object.entries(data).map(([category, count]) => ({
            category,
            count: Number(count),
          }));
          setCounts(formattedData);
        } else {
          setCounts([]);
        }
      } catch (err) {
        console.error('Error fetching todos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const getCountForCategory = (name: string) => {
    const found = counts.find((c) => c.category === name);
    return found ? found.count : 0;
  };

  const ListHeader = () => (
    <View>
      <Navbar />
      <ViewTask />

      {/* InProgress có thể lướt ngang */}
      <View style={styles.section}>
        <InProgress />
      </View>

      {/* Task Groups */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Task Groups</Text>
        <Text style={styles.logoTextLength}>{counts.reduce((sum, c) => sum + c.count, 0)}</Text>
      </View>
    </View>
  );

  return (
    <>
      <ListHeader />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#f9f9f9' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.card, { borderLeftColor: item.color }]}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                  <Feather name={item.icon as any} size={20} color="#fff" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardCount}>{getCountForCategory(item.name)} tasks</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={loading ? <Text style={styles.loading}>Loading...</Text> : null}
        />
      </KeyboardAvoidingView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoTextLength: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#e0f0ff',
    marginLeft: 8,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderLeftWidth: 6,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  cardCount: {
    fontSize: 13,
    color: '#555',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
