import { useFocusEffect } from '@react-navigation/native';
import { useState, useRef, useEffect, useCallback } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CustomDay() {
  const today = new Date();
  const isFirstRender = useRef(true);
  // Tạo danh sách ngày (15 ngày trước + 15 ngày sau)

  const generateDays = (range = 15) => {
    const days = [];
    for (let i = -range; i <= range; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const days = generateDays(15);
  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const listRef = useRef<FlatList>(null);

  // Đưa ngày hiện tại vào giữa khi load
  useEffect(() => {
    if (isFirstRender.current) {
      const todayIndex = days.findIndex((d) => d.toDateString() === today.toDateString());
      if (todayIndex !== -1) {
        setTimeout(() => {
          listRef.current?.scrollToIndex({
            index: todayIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 100);
      }
      isFirstRender.current = false;
    }
  }, [days]);

  // Format thứ + ngày
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        getItemLayout={(_, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
        renderItem={({ item }) => {
          const isSelected = item.toDateString() === selectedDay.toDateString();
          const isToday = item.toDateString() === today.toDateString();

          return (
            <TouchableOpacity
              onPress={() => setSelectedDay(item)}
              style={[
                styles.dayBox,
                isSelected && styles.selectedDayBox,
                isToday && !isSelected && styles.todayBox,
              ]}>
              <Text
                style={[
                  styles.weekText,
                  isSelected ? styles.selectedText : isToday && styles.todayText,
                ]}>
                {weekdays[item.getDay()]}
              </Text>
              <Text
                style={[
                  styles.dayText,
                  isSelected ? styles.selectedText : isToday && styles.todayText,
                ]}>
                {item.getDate()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  dayBox: {
    width: 70,
    height: 90,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: '#f2f2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayBox: {
    backgroundColor: '#7e57c2',
  },
  todayBox: {
    borderWidth: 2,
    borderColor: '#7e57c2',
    backgroundColor: '#fff',
  },
  weekText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  dayText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  todayText: {
    color: '#7e57c2',
    fontWeight: '700',
  },
});
