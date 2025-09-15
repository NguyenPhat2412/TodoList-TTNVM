import Feather from '@react-native-vector-icons/feather';
import { Image, StyleSheet, Text, View } from 'react-native';

const Navbar = () => {
  return (
    <View style={styles.container}>
      {/* Image */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>Hello!</Text>
          <Text style={styles.userNameText}>Name user</Text>
        </View>
      </View>

      {/* Bell */}
      <View style={styles.bellContainer}>
        <Feather name="bell" size={24} color="black" />
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    flex: 1,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: -2,
    flexWrap: 'wrap',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  bellContainer: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
