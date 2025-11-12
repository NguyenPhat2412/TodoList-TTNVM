import React, { useState, useRef, JSX } from 'react';
import { View, StyleSheet } from 'react-native';
import Home from 'main/Home';
import About from 'main/About';
import Privacy from 'main/Privacy';
import Profile from 'main/Profile';
import AddTodo from 'main/AddTodo';
import Footer from 'components/Footer';

const MainScreen = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const pages = useRef<Record<string, JSX.Element>>({
    Home: <Home />,
    About: <About />,
    AddTodo: <AddTodo />,
    Privacy: <Privacy />,
    Profile: <Profile />,
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {Object.entries(pages.current).map(([key, component]) => (
          <View key={key} style={{ display: activeTab === key ? 'flex' : 'none', flex: 1 }}>
            {component}
          </View>
        ))}
      </View>

      {/* Footer luôn ở cuối */}
      <View style={styles.footer}>
        <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 100,
  },
});

export default MainScreen;
