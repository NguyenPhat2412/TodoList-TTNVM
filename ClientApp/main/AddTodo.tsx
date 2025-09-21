// eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';
import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  description: string;
  index: number;
  category: string;
  startDate: Date | null;
  dueDate: Date | null;
}
export default function CategorySelect() {
  const [selected, setSelected] = useState('Work');
  const [open, setOpen] = useState(false);
  const [showProjectName, setShowProjectName] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [index, setIndex] = useState(0);

  // Get userId from local storage
  const [userId, setUserId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const getUserId = async () => {
        try {
          const response = await fetch(`${API_URL}/api/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
            },
          });
          if (response.ok) {
            const user = await response.json();
            setUserId(user._id || 'User');
            return user._id || 'User';
          }
          return 'User';
        } catch (error) {
          console.error('Error retrieving user ID:', error);
          return 'User';
        }
      };
      getUserId();
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
      alert('Due date cannot be earlier than start date.');
      return;
    }
    setDueDate(selectedDate || dueDate);
  };

  console.log(selected);

  const addTodo = async () => {
    if (!projectName.trim()) return;

    if (!description.trim()) return;

    setIndex(todos.length > 0 ? (todos[todos.length - 1].index || 0) + 1 : 0);

    try {
      const res = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: projectName,
          completed: false,
          index,
          description,
          startDate,
          dueDate,
          category: selected,
        }),
      });
      const data: Todo = await res.json();
      setTodos((prev) => [...prev, data]);
      setProjectName('');
      setDescription('');
      setStartDate(null);
      setDueDate(null);
      setSelected('Work');
      setShowProjectName(false);
      Keyboard.dismiss();
      console.log('Todo added:', data);
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const categories = ['Work', 'Personal', 'Shopping', 'Others'];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View style={styles.wrapper}>
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

          {/* Change Logo */}
          <View style={styles.projectName}>
            <Text style={styles.projectNameLabel}>Project Logo</Text>
            <TouchableOpacity
              style={styles.projectNameInput}
              onPress={() => setShowProjectName(!showProjectName)}>
              <Text>{showProjectName ? 'Logo Selected' : 'Select Logo'}</Text>
              <Feather name="image" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Add Todo */}
          <View style={{ marginTop: 24 }}>
            <TouchableOpacity style={styles.button} onPress={addTodo}>
              <Text style={styles.buttonText}>Add Todo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 16,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
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
