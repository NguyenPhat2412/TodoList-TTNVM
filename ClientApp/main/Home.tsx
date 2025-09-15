import { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import Navbar from 'components/Navbar';
import ViewTask from 'components/ViewTask';

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

        if (res.ok) {
          console.log('Fetched todos:', data);
        }
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Navbar />
      <ViewTask />
      <View style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <DraggableFlatList
            data={todos}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            onDragEnd={({ data }) => {
              // Update index based on new order
              const updatedData = data.map((item, idx) => ({ ...item, index: idx }));
              console.log('Reordered todos:', updatedData);
              setTodos(updatedData);

              // Save new order to server
              fetch(`${API_URL}/api/todos/reorder`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderedIds: updatedData.map((item) => item._id) }),
              }).catch((err) => console.error('Error reordering todos:', err));
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Add new todo..."
          value={newTodo}
          onChangeText={setNewTodo}
        />

        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Add My Todo</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
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
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
});
