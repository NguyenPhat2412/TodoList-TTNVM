import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

//Main Screens
import Home from 'main/Home';
import { ActivityIndicator, Keyboard, Pressable, View } from 'react-native';
import CustomHeaderHome from 'components/CustomHeaderHome';
import Footer from 'components/Footer';
import About from 'main/About';
import Privacy from 'main/Privacy';
import Profile from 'main/Profile';
import AddTodo from 'main/AddTodo';
import Login from 'components/Login';
import Register from 'components/Register';
import UpdateTodo from 'main/Update';
import { RootStackParamList } from 'types/types';
import { CategoryProvider } from 'Context/useCategory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from 'main/FirstScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoad] = useFonts({
    PatrickHand: require('./assets/fonts/PatrickHand-Regular.ttf'),
  });

  const [loading, setLoading] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('hasLaunched');
        if (value === null) {
          setFirstLaunch(true);
        } else {
          setFirstLaunch(false);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    checkFirstLaunch();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
  }
  if (!fontsLoad) {
    return null;
  }

  // Override default font for Text component
  if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
  (Text as any).defaultProps.style = { fontFamily: 'PatrickHand' };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CategoryProvider>
        <NavigationContainer>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <View style={{ flex: 1, backgroundColor: '' }}>
              <View style={{ flex: 12 }}>
                <Stack.Navigator
                  screenOptions={{
                    headerTitleStyle: { fontFamily: 'PatrickHand' },
                  }}>
                  <Stack.Screen
                    name="OnboardingScreen"
                    component={OnboardingScreen}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                      headerTitle: () => <CustomHeaderHome />,
                      headerBackVisible: false,
                    }}
                  />

                  <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
                  <Stack.Screen
                    name="AddTodo"
                    component={AddTodo}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Privacy"
                    component={Privacy}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Profile"
                    component={Profile}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                  <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="UpdateTodo"
                    component={UpdateTodo}
                    options={{ headerShown: false }}
                  />
                </Stack.Navigator>
              </View>

              {!firstLaunch && (
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <Footer />
                </View>
              )}
            </View>
          </Pressable>
        </NavigationContainer>
      </CategoryProvider>
    </GestureHandlerRootView>
  );
}
