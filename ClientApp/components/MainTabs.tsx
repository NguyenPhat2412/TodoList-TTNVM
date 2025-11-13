// import React, { useState, useRef, JSX } from 'react';
// import { View, StyleSheet } from 'react-native';
// import Home from 'main/Home';
// import About from 'main/About';
// import Privacy from 'main/Privacy';
// import Profile from 'main/Profile';
// import CategorySelect from 'main/AddTodo';
// import Footer from 'components/Footer';

// const MainScreen = () => {
//   const [activeTab, setActiveTab] = useState('Home');

//   const pages = useRef<Record<string, JSX.Element>>({
//     Home: <Home />,
//     About: <About />,
//     AddTodo: <CategorySelect setActiveTab={setActiveTab} />,
//     Privacy: <Privacy />,
//     Profile: <Profile />,
//   });

//   return (
//     <View style={{ flex: 1 }}>
//       <View style={{ flex: 0.9 }}>
//         {Object.entries(pages.current).map(([key, component]) => (
//           <View key={key} style={{ display: activeTab === key ? 'flex' : 'none', flex: 1 }}>
//             {component}
//           </View>
//         ))}
//       </View>

//       {/* Footer luôn ở cuối */}
//       <View style={styles.footer}>
//         <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   footer: {
//     position: 'relative',
//     bottom: 0,
//     width: '100%',
//     zIndex: 100,
//     flex: 0.1,
//   },
// });

// export default MainScreen;
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Footer from './Footer';
import Home from '../main/Home';
import About from '../main/About';
import Privacy from '../main/Privacy';
import Profile from '../main/Profile';
import CategorySelect from 'main/AddTodo';

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState('Home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <Home />;
      case 'About':
        return <About />;
      case 'AddTodo':
        return <CategorySelect setActiveTab={setActiveTab} />;
      case 'Privacy':
        return <Privacy />;
      case 'Profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screen}>{renderScreen()}</View>
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screen: { flex: 1 },
});
