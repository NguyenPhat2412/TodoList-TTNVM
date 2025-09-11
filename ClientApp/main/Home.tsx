// import React from 'react';
// import { Text, View, FlatList, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';

// // eslint-disable-next-line import/no-unresolved
// import { API_URL } from '@env';
// import TodoInput from 'components/TodoInput';

// interface Todo {
//   userId: number;
//   _id: number;
//   title: string;
//   completed: boolean;
// }

// const Home = () => {
//   const [todos, setTodos] = React.useState<Todo[]>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [newTodo, setNewTodo] = React.useState('');

//   React.useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`${API_URL}/api/todos`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const data = await response.json();
//         console.log('Fetched todos:', data);
//         setTodos(data);
//       } catch (error) {
//         console.error('Error fetching todos:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Post todo
//   const postData = async () => {
//     if (newTodo.trim() === '') return;
//     try {
//       const response = await fetch(`${API_URL}/api/todos`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ title: newTodo, completed: false }),
//       });
//       const data = await response.json();
//       setTodos((prevTodos) => [...prevTodos, data]);
//       setNewTodo('');
//     } catch (error) {
//       console.error('Error posting todo:', error);
//     }
//   };

//   // Delete todo
//   const deleteData = async (id: number) => {
//     try {
//       await fetch(`${API_URL}/api/todos/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
//     } catch (error) {
//       console.error('Error deleting todo:', error);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={{ flex: 1 }}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Todo List</Text>
//         <Text style={styles.welcomeText}>Welcome to your Todo List App!</Text>

//         {loading ? (
//           <Text>Loading...</Text>
//         ) : todos.length > 0 ? (
//           <FlatList
//             data={todos}
//             keyExtractor={(item) => item?._id.toString()}
//             renderItem={({ item }) => (
//               <View style={styles.todoItem}>
//                 <Text style={styles.todoText}>Todo ID: {item?._id}</Text>
//                 <Text style={styles.todoText}>Title: {item?.title}</Text>
//                 <Text style={styles.todoCompleted}>
//                   Completed: {item?.completed ? 'Yes' : 'No'}
//                 </Text>

//                 <Text style={styles.deleteText} onPress={() => deleteData(item?._id)}>
//                   🗑️
//                 </Text>
//               </View>
//             )}
//           />
//         ) : (
//           <Text>No todo data available.</Text>
//         )}
//         <TodoInput newTodo={newTodo} setNewTodo={setNewTodo} postData={postData} />
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     marginTop: 40,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   welcomeText: {
//     fontSize: 18,
//     marginBottom: 20,
//     color: '#666',
//   },
//   todoItem: {
//     backgroundColor: '#fff',

//     padding: 15,
//     marginVertical: 8,
//     borderRadius: 5,
//     shadowColor: '#000',

//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   todoText: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 5,
//   },
//   todoCompleted: {
//     fontSize: 14,
//     color: 'green',
//     fontWeight: 'bold',
//   },
//   deleteText: {
//     fontSize: 18,
//     color: 'red',
//     position: 'absolute',
//     top: 30,
//     right: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginTop: 20,
//     borderRadius: 5,
//     backgroundColor: '#fff',
//     fontSize: 16,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 12,
//     marginTop: 10,
//     borderRadius: 5,
//     alignItems: 'center',

//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

import { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState('');

  // Fetch todos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/todos`);
        const data = await res.json();
        setTodos(data);
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
    try {
      const res = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo, completed: false }),
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

  const DismissKeyBoard = ({ children }: { children: React.ReactNode }) => (
    <TouchableOpacity
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}>
      {children}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <Text style={styles.title}>Todo List (Draggable)</Text>

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <DraggableFlatList
            data={todos}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            onDragEnd={({ data }) => setTodos(data)}
          />
        )}
        <DismissKeyBoard>
          <TextInput
            style={styles.input}
            placeholder="Add new todo..."
            value={newTodo}
            onChangeText={setNewTodo}
          />
        </DismissKeyBoard>
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Add Todo</Text>
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
});
