import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Screens
import Home from 'main/Home';
import Contact from 'main/Contact';

import './global.css';
import { View } from 'react-native';
import CustomHeader from 'components/CustomHeader';
import Footer from 'components/Footer';
import About from 'main/About';
import Privacy from 'main/Privacy';
import Profile from 'main/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerTitle: () => <CustomHeader />,
                headerBackVisible: false,
              }}
            />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="Contact" component={Contact} />
            <Stack.Screen name="Privacy" component={Privacy} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
          <Footer />
        </View>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
