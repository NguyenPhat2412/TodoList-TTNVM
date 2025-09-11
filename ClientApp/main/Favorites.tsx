import { ScrollView, Text, View } from 'react-native';

export default function Favorites() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-4 text-xl font-bold">Yêu thích</Text>
      <ScrollView></ScrollView>
    </View>
  );
}
