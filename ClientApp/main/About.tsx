import { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList, Todo } from 'types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import ListCategory from 'components/ListCategory';
import { useCategory } from 'Context/useCategory';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import CustomDay from 'components/CustomDay';

type AboutNavProp = StackNavigationProp<RootStackParamList, 'About'>;
const About = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const { selectedCategory } = useCategory();
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

        if (res?.ok) {
          const sortedData = data.sort((a: Todo, b: Todo) => (a.index || 0) - (b.index || 0));
          setAllTodos(sortedData);
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

  // Lọc theo danh mục đã chọn
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'All') {
      setTodos(allTodos.filter((todo) => todo.category === selectedCategory));
    } else {
      setTodos(allTodos);
    }
  }, [selectedCategory, allTodos]);

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
      setAllTodos((prev) => prev.filter((t) => t._id !== id));
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  // Render item cho DraggableFlatList
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Todo>) => (
      <ScaleDecorator>
        <Pressable
          onLongPress={drag}
          disabled={isActive}
          style={[styles.todoItem, { backgroundColor: isActive ? '#e2e3e5' : '#fff' }]}>
          <Text>{item.title}</Text>
        </Pressable>
      </ScaleDecorator>
    ),
    []
  );

  // Header UI (trước danh sách)
  const ListHeader = () => (
    <View
      style={{ marginBottom: 20, marginTop: 10, backgroundColor: '#f9f9f9', marginHorizontal: 8 }}>
      <CustomDay />
      <ListCategory />
      {loading && <Text>Loading...</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f9f9f9' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={['#dff3ff', '#fef6ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFillObject}>
        <View
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
      </BlurView>
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

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  todoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3436',
    flex: 1,
    marginRight: 12,
  },
  deleteText: {
    fontSize: 20,
    color: '#d63031',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3436',
    marginVertical: 12,
    marginLeft: 16,
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
  progress: {
    fontSize: 12,
    color: '#0984e3',
    marginTop: 4,
    textAlign: 'right',
    fontWeight: '600',
  },
});
