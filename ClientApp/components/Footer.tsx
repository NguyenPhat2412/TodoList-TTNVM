import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const height = 70;
const notchWidth = 120;
const notchDepth = 40;

const Footer = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Home');

  const TabItem = ({ name, icon, screen }: { name: string; icon: string; screen: string }) => (
    <TouchableOpacity
      onPress={() => {
        setActiveTab(name);
        navigation.navigate(screen as never);
      }}>
      <Feather
        name={icon}
        size={24}
        color={activeTab === name ? '#fff' : '#e5d4f7'}
        style={{
          textShadowColor: activeTab === name ? '#fff' : 'transparent',
          textShadowRadius: activeTab === name ? 8 : 0,
        }}
      />
    </TouchableOpacity>
  );
  // Vẽ path với chỗ lõm ở giữa
  const d = `
      M0 0 
  H${width / 2 - notchWidth / 2} 
  C${width / 2 - notchWidth / 4} 0, ${width / 2 - notchWidth / 4} ${notchDepth}, ${width / 2} ${notchDepth}
  C${width / 2 + notchWidth / 4} ${notchDepth}, ${width / 2 + notchWidth / 4} 0, ${width / 2 + notchWidth / 2} 0
  H${width}  
  V${height} 
  H0 
  Z
  `;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#61058bff', '#6c3d8bff', '#bd6cecff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: width, height: height }}>
        <Svg width={width} height={height} style={styles.background}>
          <Path d={d} fill="#7e57c2" />
        </Svg>

        <View style={styles.iconRow}>
          <TabItem name="Home" icon="home" screen="Home" />
          <TabItem name="About" icon="calendar" screen="About" />
          <View style={{ width: 70 }} />
          <TabItem name="Privacy" icon="shield" screen="Privacy" />
          <TabItem name="Profile" icon="user" screen="Profile" />
        </View>

        <View style={styles.plusWrapper}>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => navigation.navigate('AddTodo' as never)}>
            <Feather name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    bottom: 0,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
    height: '100%',
    paddingBottom: 10,
    paddingTop: 10,
  },
  plusWrapper: {
    position: 'absolute',
    top: -30,
    alignSelf: 'center',
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7e57c2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  icon: {
    fontSize: 24,
  },
});
