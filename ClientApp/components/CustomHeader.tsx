import { Image, StyleSheet, Text, View } from 'react-native';

const CustomHeader = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/Logo_vju.png')} style={styles.logo} />
      <View>
        <Text style={styles.title}>VJU Todo List</Text>
      </View>
    </View>
  );
};

export default CustomHeader;

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
