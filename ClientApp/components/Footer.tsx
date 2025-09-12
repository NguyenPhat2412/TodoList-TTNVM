import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.navigate('Home' as never);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' as never }],
          });
        }}>
        <Feather name="home" size={24} color="#555" />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('About' as never)}>
        <Feather name="info" size={24} color="#555" />
        <Text style={styles.text}>About</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Contact' as never)}>
        <Feather name="phone" size={24} color="#555" />
        <Text style={styles.text}>Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Privacy' as never)}>
        <Feather name="shield" size={24} color="#555" />
        <Text style={styles.text}>Privacy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Profile' as never)}>
        <Feather name="user" size={24} color="#555" />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e7e7e7',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  item: {
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
});
