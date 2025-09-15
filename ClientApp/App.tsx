import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Screens
import Home from 'main/Home';

import './global.css';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import CustomHeader from 'components/CustomHeader';
import Footer from 'components/Footer';
import About from 'main/About';
import Privacy from 'main/Privacy';
import Profile from 'main/Profile';
import AddTodo from 'main/AddTodo';
import Login from 'components/Login';
import Register from 'components/Register';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
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
              <Stack.Screen name="Contact" component={AddTodo} />
              <Stack.Screen name="Privacy" component={Privacy} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
            </Stack.Navigator>
            <Footer />
          </View>
        </NavigationContainer>
      </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
}
