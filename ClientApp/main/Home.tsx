import { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import Navbar from 'components/Navbar';
import ViewTask from 'components/ViewTask';
import InProgress from 'components/InProgress';

interface Todo {
  _id: string;
  title?: string;
  completed?: boolean;
  description?: string;
  index?: number;
}

const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState('');
  const [index, setIndex] = useState<number | undefined>(undefined);

  // Fetch todos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/todos`);
        const data = await res.json();

        const sortedData = data.sort((a: Todo, b: Todo) => (a.index || 0) - (b.index || 0));
        setTodos(sortedData);
      } catch (err) {
        console.error('Error fetching todos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Add new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    setIndex(todos.length > 0 ? (todos[todos.length - 1].index || 0) + 1 : 0);

    try {
      const res = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo, completed: false, index }),
      });
      const data = await res.json();
      setTodos((prev) => [...prev, data]);
      setNewTodo('');
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  // Render item for DraggableFlatList
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Todo>) => (
      <TouchableOpacity
        style={[styles.todoItem, { backgroundColor: isActive ? '#e0f7fa' : '#fff' }]}
        onLongPress={drag}>
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
    <View style={styles.container}>
      <Navbar />
      <ViewTask />
      <InProgress />

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Task Groups </Text>
        <Text style={styles.logoTextLength}>{todos.length}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={addTodo}>
        <Text style={styles.buttonText}>Add My Todo</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Add new todo..."
        value={newTodo}
        onChangeText={setNewTodo}
      />

      {loading && <Text>Loading...</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
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

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
  deleteText: {
    fontSize: 18,
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoTextLength: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#e0f0ff',
  },
});
