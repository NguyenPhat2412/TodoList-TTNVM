// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';

import { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { Todo } from 'types/types';
import CustomHeader from 'components/CustomHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

type UpdateRouteProp = RouteProp<{ UpdateTodo: { todo: Todo } }, 'UpdateTodo'>;
export default function UpdateTodo({ route }: { route: UpdateRouteProp }) {
  // Đường dẫn
  const { todo } = route.params;

  // Các state của form.
  const [selected, setSelected] = useState(todo.category || 'Work');
  const [open, setOpen] = useState(false);

  const [showProjectName, setShowProjectName] = useState(false);
  const [projectName, setProjectName] = useState(todo.title || '');
  const [description, setDescription] = useState(todo.description || '');

  const [prioritize, setPrioritize] = useState(todo.prioritize || 'Medium');
  const [openPrioritize, setOpenPrioritize] = useState(false);
  const [openProgress, setOpenProgress] = useState(false);
  const [progress, setProgress] = useState(todo.progress || 'Not Start');
  const [startDate, setStartDate] = useState<Date | null>(
    todo.startDate ? new Date(todo.startDate) : null
  );
  const [dueDate, setDueDate] = useState<Date | null>(todo.dueDate ? new Date(todo.dueDate) : null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [index, setIndex] = useState(0);

  // Get userId from local storage
  const [userId, setUserId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadUserId = async () => {
        try {
          const storedId = await AsyncStorage.getItem('userId');
          console.log(storedId);

          if (storedId) {
            setUserId(storedId);
          } else {
            console.error('No userId found, user not logged in');
          }
        } catch (error) {
          console.error('Error reading userId:', error);
        }
      };
      loadUserId();
    }, [])
  );

  const handleStartDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const handleDueDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDueDatePicker(false);
    if (selectedDate && startDate && selectedDate < startDate) {
      alert('Due date cannot be earlier than start date!.');
      return;
    }
    setDueDate(selectedDate || dueDate);
  };

  const updateTodo = async (id: string) => {
    if (!projectName.trim()) return;

    if (!description.trim()) return;

    setIndex(todos.length > 0 ? (todos[todos.length - 1].index || 0) + 1 : 0);

    try {
      const res = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectName,
          completed: progress === 'Completed' ? true : false,
          index,
          description,
          startDate: startDate ? startDate.toISOString() : null,
          dueDate: dueDate ? dueDate.toISOString() : null,
          prioritize,
          progress,
          category: selected,
        }),
      });
      const data: Todo = await res.json();

      setTodos((prev) => prev.map((t) => (t._id === id ? data : t)));
      setProjectName('');
      setDescription('');
      setStartDate(null);
      setDueDate(null);
      setSelected('Work');
      setPrioritize('Medium');
      setProgress('Not Start');
      setShowProjectName(false);
      Keyboard.dismiss();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const categories = ['Work', 'Personal', 'Shopping', 'Others'];

  return (
    <ScrollView style={{ flex: 1 }}>
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
          }}></View>
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View style={styles.wrapper}>
            <CustomHeader title="Update Task" />
            {/* Select Box */}
            <TouchableOpacity style={styles.selectBox} onPress={() => setOpen(!open)}>
              {/* Left icon + label */}
              <View style={styles.left}>
                <View style={styles.iconBox}>
                  <Feather name="briefcase" size={20} color="#ff7eb9" />
                </View>
                <View>
                  <Text style={styles.label}>Task Group</Text>
                  <Text style={styles.value}>{selected}</Text>
                </View>
              </View>

              {/* Right arrow */}
              <Feather name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#333" />
            </TouchableOpacity>
            {/* Dropdown list */}
            {open && (
              <View style={styles.dropdown}>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelected(item);
                        setOpen(false);
                      }}>
                      <Text style={styles.dropdownText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setOpenPrioritize(!openPrioritize)}>
              {/* Left icon + label */}
              <View style={styles.left}>
                <View style={styles.iconBox}>
                  <Feather name="briefcase" size={20} color="#ff7eb9" />
                </View>
                <View>
                  <Text style={styles.label}>Prioritize</Text>
                  <Text style={styles.value}>{prioritize}</Text>
                </View>
              </View>

              {/* Right arrow */}
              <Feather name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#333" />
            </TouchableOpacity>
            {openPrioritize && (
              <View style={styles.dropdown}>
                <FlatList
                  data={['Low', 'Medium', 'High']}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setPrioritize(item);
                        setOpenPrioritize(false);
                      }}>
                      <Text style={styles.dropdownText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setOpenProgress(!openProgress)}>
              {/* Left icon + label */}
              <View style={styles.left}>
                <View style={styles.iconBox}>
                  <Feather name="briefcase" size={20} color="#ff7eb9" />
                </View>
                <View>
                  <Text style={styles.label}>In Progress</Text>
                  <Text style={styles.value}>{progress}</Text>
                </View>
              </View>

              {/* Right arrow */}
              <Feather name={openProgress ? 'chevron-up' : 'chevron-down'} size={20} color="#333" />
            </TouchableOpacity>
            {openProgress && (
              <View style={styles.dropdown}>
                <FlatList
                  data={['Not Start', 'In Progress', 'Completed', 'Interruption']}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setProgress(item);
                        setOpenProgress(false);
                      }}>
                      <Text style={styles.dropdownText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            {/* Project Name */}
            <View style={styles.projectName}>
              <Text style={styles.projectNameLabel}>Project Name</Text>
              <TextInput
                style={styles.projectNameInput}
                value={projectName}
                onChangeText={setProjectName}
                placeholder="Enter project name"
              />
            </View>
            {/* Description */}
            <View style={styles.description}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter task description"
                multiline
              />
            </View>
            {/* Set up start date and due date here */}
            <View style={styles.calendarContainer}>
              <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerContent}>
                    <Feather name="calendar" size={20} color="#333" />
                    <Text style={styles.datePickerLabel}>
                      Start Date: {startDate ? startDate.toDateString() : 'Not set'}
                    </Text>
                  </View>
                  <Feather
                    name={showStartDatePicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#333"
                  />
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={startDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={handleStartDateChange}
                    />
                  )}
                </View>
              </TouchableOpacity>

              <View style={{ marginTop: 16 }}></View>
              <TouchableOpacity onPress={() => setShowDueDatePicker(true)}>
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerContent}>
                    <Feather name="calendar" size={20} color="#333" />
                    <Text style={styles.datePickerLabel}>
                      Due Date: {dueDate ? dueDate.toDateString() : 'Not set'}
                    </Text>
                  </View>
                  <Feather
                    name={showDueDatePicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#333"
                  />
                  {showDueDatePicker && (
                    <DateTimePicker
                      value={dueDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDueDateChange}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Change Logo
          <View style={styles.projectName}>
            <Text style={styles.projectNameLabel}>Project Logo</Text>
            <TouchableOpacity
              style={styles.projectNameInput}
              onPress={() => setShowProjectName(!showProjectName)}>
              <Text>{showProjectName ? 'Logo Selected' : 'Select Logo'}</Text>
              <Feather name="image" size={20} color="#333" />
            </TouchableOpacity>
          </View> */}
            {/* Add Todo */}
            <View style={{ marginTop: 24 }}>
              <TouchableOpacity style={styles.button} onPress={() => updateTodo(todo._id)}>
                <Text style={styles.buttonText}>Update Todo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 50,
    flex: 1,
    paddingHorizontal: 16,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ffe6f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  label: {
    fontSize: 12,
    color: '#888',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  projectName: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  projectNameLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  projectNameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111',
  },
  description: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  descriptionLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111',
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerContainer: {
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerLabel: {
    fontSize: 16,
    color: '#111',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  calendarContainer: {
    marginTop: 16,
  },
  datePickerContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  button: {
    backgroundColor: '#b700ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
