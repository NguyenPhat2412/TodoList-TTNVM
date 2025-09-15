import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
const ViewTask = () => {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = 75;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleViewTasks = () => {
    // Logic to navigate to the task list or perform any action
    console.log('View Tasks button pressed');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>Your today's tasks almost done!</Text>
        <TouchableOpacity style={styles.button}>
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
            transform={`rotate(0 ${radius} ${radius})`} // bắt đầu từ trên
          />
        </Svg>

        <View style={styles.label}>
          <Text style={styles.progressText}>{progress}%</Text>
          <Text style={styles.progressSubText}>Completed</Text>
        </View>
      </View>
    </View>
  );
};
export default ViewTask;

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
    marginBottom: 20,
    marginTop: 20,
    marginHorizontal: 20,
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
  },
  circleContainer: {
    position: 'absolute',
    right: 20,
    top: 10,
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
});
