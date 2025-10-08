import { Image, StyleSheet, Text, View } from 'react-native';

const CustomHeaderHome = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/Logo_vju.png')} style={styles.logo} />
      <View>
        <Text style={styles.title}>VJU Todo List - Group 6</Text>
      </View>
    </View>
  );
};

export default CustomHeaderHome;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    marginTop: 5,
  },
});
