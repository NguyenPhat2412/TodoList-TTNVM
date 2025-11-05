import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Modal,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import Navbar from 'components/Navbar';
import ViewTask from 'components/ViewTask';
import InProgress from 'components/InProgress';
import Feather from '@react-native-vector-icons/feather';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Todo, CategoryCount } from 'types/types';
import { io } from 'socket.io-client';

const categories = [
  { name: 'Work', color: '#ff0000ff', icon: 'briefcase' },
  { name: 'Personal', color: '#007274ff', icon: 'user' },
  { name: 'Shopping', color: '#636400ff', icon: 'shopping-cart' },
  { name: 'Fitness', color: '#1d571bff', icon: 'activity' },
  { name: 'Others', color: '#7c0085ff', icon: 'layers' },
];

const Home = () => {
  const [counts, setCounts] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const navigator = useNavigation();

  const socketRef = useRef<any>(null);

  // load custom fonts
  const [fontsLoaded] = useFonts({
    'PatrickHand-Regular': require('../assets/fonts/PatrickHand-Regular.ttf'),
  });

  // get userId from AsyncStorage
  useFocusEffect(
    useCallback(() => {
      const loadUserId = async () => {
        try {
          const storedId = await AsyncStorage.getItem('userId');

          if (storedId) {
            setUserId(storedId);
          } else {
            navigator.navigate('Login' as never);
          }
        } catch (error) {
          throw new Error('Error reading userId:', error as any);
        }
      };
      loadUserId();
    }, [])
  );
  // Fetch tasks by category (for modal)
  const fetchTasksByCategory = async (category: string) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/api/todos/${userId}/${category}`);
      const data = await res.json();
      if (res.ok) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      throw new Error('Error fetching tasks by category:', err as any);
    }
  };

  // if (userId === null) {
  //   navigator.navigate('Login' as never);
  // }
  // // Fetch số lượng todos theo category
  // useEffect(() => {
  //   if (!userId) return;
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await fetch(`${API_URL}/api/todos/category/count/${userId}`);
  //       const data = await res.json();
  //       if (res.ok && data && typeof data === 'object') {
  //         const formattedData = Object.entries(data).map(([category, count]) => ({
  //           category,
  //           count: Number(count),
  //         }));
  //         setCounts(formattedData);
  //       } else {
  //         setCounts([]);
  //       }
  //     } catch (err) {
  //       console.error('Error fetching todos:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [userId]);

  // Use useFocusEffect to refresh counts when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      const fetchCounts = async () => {
        try {
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
          throw new Error('Error fetching todos:', err as any);
        } finally {
          setLoading(false);
        }
      };
      fetchCounts();
    }, [userId])
  );

  // set up socket connection
  useEffect(() => {
    if (!userId) return;

    const socketSetup = io(`${API_URL}`, {
      transports: ['websocket'],
    });

    socketRef.current = socketSetup;

    socketSetup.on('connect', () => {
      console.log('Socket connected:', socketSetup.id);
      if (userId) {
        console.log('Registering userId with socket:', userId);
        socketSetup.emit('register', userId);
      }
    });

    socketSetup.on('users_status', ({ status, userId }) => {
      console.log(`User ${userId} is now ${status}`);
    });
    return () => {
      socketSetup.disconnect();
    };
  }, [userId]);

  const getCountForCategory = (name: string) => {
    const found = counts.find((c) => c.category === name);
    return found ? found.count : 0;
  };

  const getCategoryColor = (name: string) => {
    const category = categories.find((cat) => cat.name === name);
    return category ? category.color : '#ccc';
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
        <Text style={styles.logoText}>Tasks Group</Text>
        <Text style={styles.logoTextLength}>{counts.reduce((sum, c) => sum + c.count, 0)}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <LinearGradient
          colors={['#dff3ff', '#fef6ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <BlurView
          style={{
            position: 'absolute',
            top: 50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: '#9b5de5',
            opacity: 0.15,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
            elevation: 10,
          }}
        />

        <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFillObject}>
          <View
            style={{
              position: 'absolute',
              bottom: 100,
              right: -30,
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: '#00bbf9',
              opacity: 0.15,
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
              elevation: 10,
            }}
          />
        </BlurView>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={<ListHeader />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { borderLeftColor: item.color }]}
              onPress={() => {
                setSelectedCategory(item.name);
                setModalVisible(true);
                fetchTasksByCategory(item.name);
              }}>
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

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedCategory} Tasks</Text>

              <FlatList
                data={tasks}
                keyExtractor={(task, index) => index.toString()}
                renderItem={({ item }) => (
                  <>
                    <View style={styles.taskItem}>
                      <Text style={styles.taskTitle}>{item.title}</Text>
                      <Text style={styles.taskDesc}>{item.description}</Text>
                    </View>
                  </>
                )}
                ListEmptyComponent={<Text style={styles.noTasks}>No tasks available</Text>}
              />
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  { backgroundColor: getCategoryColor(selectedCategory) },
                ]}
                onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
  },
  cardCount: {
    fontSize: 16,
    color: '#555',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  taskItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  taskDesc: {
    fontSize: 14,
    color: '#666',
  },
  noTasks: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#999',
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
});
