// CategorySelector.tsx
import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { useCategory } from '../Context/useCategory';

const categories = ['All', 'Work', 'Personal', 'Shopping', 'Others'];

export default function ListCategory() {
  const { selectedCategory, setSelectedCategory } = useCategory();

  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((cat) => (
          <Animated.View key={cat} style={{ transform: [{ scale }] }}>
            <TouchableOpacity
              style={[styles.button, selectedCategory === cat && styles.activeButton]}
              onPress={() => setSelectedCategory(cat)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}>
              <Text style={[styles.text, selectedCategory === cat && styles.activeText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginTop: 10,
    marginRight: 11,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeButton: {
    backgroundColor: '#6c5ce7',
    shadowColor: '#6c5ce7',
    elevation: 4,
    shadowRadius: 6,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
  },
  text: { color: '#333', fontWeight: '500', fontSize: 14 },
  activeText: { color: '#fff', fontWeight: '600' },
});
