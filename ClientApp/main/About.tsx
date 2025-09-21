import { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import Navbar from 'components/Navbar';
import ViewTask from 'components/ViewTask';
import InProgress from 'components/InProgress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'types/types';
import { StackNavigationProp } from '@react-navigation/stack';
interface Todo {
  _id: string;
  title?: string;
  completed?: boolean;
  description?: string;
  index?: number;
}

type AboutNavProp = StackNavigationProp<RootStackParamList, 'About'>;
const About = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);

  const navigation = useNavigation<AboutNavProp>();
  // Lấy userId từ AsyncStorage
  useFocusEffect(
    useCallback(() => {
      const loadUserId = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (userId) {
            setUserId(userId);
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

  // Fetch todos
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/todos/user/${userId}`);
        const data = await res.json();
        console.log('Fetched todos:', data);
        if (res?.ok) {
          const sortedData = data.sort((a: Todo, b: Todo) => (a.index || 0) - (b.index || 0));
          setTodos(sortedData);
        } else {
          setTodos([]);
        }
      } catch (err) {
        console.error('Error fetching todos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  // Render item cho DraggableFlatList
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Todo>) => (
      <TouchableOpacity
        style={[styles.todoItem, { backgroundColor: isActive ? '#f0f9ff' : '#fff' }]}
        onLongPress={drag}
        onPress={() => {
          // navigate to Update screen with item details;
          console.log('Pressed todo:', item);
          navigation.navigate('UpdateTodo', { todo: item });
        }}>
        <Text style={styles.todoText}>{item.title}</Text>
        <TouchableOpacity onPress={() => deleteTodo(item._id)}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    []
  );

  // Header UI (trước danh sách)
  const ListHeader = () => (
    <View>
      <Navbar />
      <ViewTask />

      {/* InProgress có thể lướt ngang */}
      <View style={styles.section}>
        <InProgress />
        {/* <FlatList
          data={todos.filter((t) => !t.completed)} // lọc task chưa hoàn thành
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>{item.title}</Text>
              <Text style={styles.progressDesc}>{item.description || 'No description'}</Text>
            </View>
          )}
        /> */}
      </View>

      {/* Task Groups */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Task Groups</Text>
        <Text style={styles.logoTextLength}>{todos.length}</Text>
      </View>

      {loading && <Text>Loading...</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f9f9f9' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <DraggableFlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={<ListHeader />}
        onDragEnd={({ data }) => {
          const updatedData = data.map((item, idx) => ({ ...item, index: idx }));
          setTodos(updatedData);
          fetch(`${API_URL}/api/todos/reorder`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds: updatedData.map((item) => item._id) }),
          }).catch((err) => console.error('Error reordering todos:', err));
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default About;

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 6,
  },
  progressDesc: {
    fontSize: 13,
    color: '#555',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  deleteText: {
    fontSize: 18,
    color: 'red',
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
});
