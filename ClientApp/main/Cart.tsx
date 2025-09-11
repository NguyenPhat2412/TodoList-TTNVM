import { useNavigation } from '@react-navigation/native';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';

export default function Cart() {
  const cartItems = [
    {
      id: '1',
      name: 'Rau sạch hữu cơ',
      price: '30.000đ / kg',
      quantity: 2,
    },
    {
      id: '2',
      name: 'Cà chua chín đỏ',
      price: '40.000đ / kg',
      quantity: 1,
    },
    {
      id: '3',
      name: 'Khoai tây tươi',
      price: '25.000đ / kg',
      quantity: 3,
    },
    {
      id: '4',
      name: 'Táo hữu cơ',
      price: '80.000đ / kg',
      quantity: 1,
    },
  ];

  const totalAmount = cartItems.reduce((total, item) => {
    const price = parseInt(item.price.replace('đ / kg', '').replace('.', ''));
    return total + price * item.quantity;
  }, 0);

  const navigate = useNavigation();
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-4 text-xl font-bold">Giỏ hàng</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-4 rounded border border-gray-200 p-4">
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-gray-600">{item.price}</Text>
            <Text className="text-gray-600">Số lượng: {item.quantity}</Text>
          </View>
        )}
      />

      <View className="my-4 border-t border-gray-200 pt-4">
        <Text className="text-lg font-bold">Tổng cộng: {totalAmount}đ</Text>
      </View>

      <Pressable
        className="mt-auto rounded bg-green-500 p-4"
        onPress={() => {
          navigate.navigate('Home' as never);
        }}>
        <Text className="text-center text-black">Thanh toán</Text>
      </Pressable>
    </View>
  );
}
