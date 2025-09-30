import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }: any) {
  const handleFinish = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <View style={styles.container}>
      {/* Hình minh họa */}
      <Image
        source={require('../assets/onboarding.png')} // thêm ảnh 3D illustration vào assets
        style={styles.image}
        resizeMode="contain"
      />

      {/* Tiêu đề */}
      <Text style={styles.title}>Task Management &{'\n'}To-Do List</Text>

      {/* Mô tả */}
      <Text style={styles.subtitle}>
        This productive tool is designed to help{'\n'}
        you better manage your task project-wise conveniently!
      </Text>

      {/* Nút Start */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleFinish} style={styles.buttonWrapper}>
        <LinearGradient colors={['#7e57c2', '#673ab7']} style={styles.button}>
          <Text style={styles.buttonText}>Let’s Start</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 20,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
