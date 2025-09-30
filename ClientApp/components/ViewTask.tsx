// // eslint-disable-next-line import/no-unresolved
import { API_URL } from '@env';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Todo } from 'types/types';
import * as Notifications from 'expo-notifications';

const ViewTask = () => {
  const [data, setData] = useState<Todo[]>([]);

  useFocusEffect(
    useCallback(() => {
      // Fetch data from API
      const fetchData = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (!userId) {
            console.log('No userId found, user not logged in');
            return;
          }
          const response = await fetch(`${API_URL}/api/todos/user/${userId}`);
          const json = await response.json();
          if (response.ok) {
            setData(json);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, [data])
  );
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const completedCount = data.filter((item) => item.progress === 'Completed').length;
  const progress = (completedCount / data.length) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleViewTasks = () => {
    // Logic to navigate to the task list or perform any action
    console.log('View Tasks button pressed');
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewTaskInfo}>
        <Text style={styles.taskInfoText}>Your today's tasks almost done!</Text>
        <TouchableOpacity style={styles.button} onPress={handleViewTasks}>
          <Text style={styles.buttonText}>View Tasks</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.circleContainer}>
        {/* UI circle progress */}
        <Svg width={radius * 2} height={radius * 2}>
          <Circle
            stroke="#e6e6e6"
            fill="none"
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <Circle
            stroke="#007bff"
            fill="none"
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(0 ${radius} ${radius})`}
          />
        </Svg>

        <View style={styles.label}>
          <Text style={styles.progressText}>{progress.toFixed(2)}%</Text>
          <Text style={styles.progressSubText}>Completed</Text>
        </View>
      </View>
    </View>
  );
};
export default ViewTask;

async function registerForPushNotificationsAsync() {}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 20,
    marginHorizontal: 20,
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
  },
  circleContainer: {
    position: 'absolute',
    right: 20,
    top: 25,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressSubText: {
    fontSize: 12,
    color: '#666',
  },
  viewTaskInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 120,
  },
  taskInfoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    fontWeight: '500',
  },
});
