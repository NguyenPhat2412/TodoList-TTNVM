import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cart from 'main/Cart';
import Contact from 'main/Contact';
import Favorites from 'main/Favorites';
import Home from 'main/Home';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="Favorites" component={Favorites} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
