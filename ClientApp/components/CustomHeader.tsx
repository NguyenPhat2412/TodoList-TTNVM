import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomHeader = ({ title }: { title: string }) => {
  const navigate = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigate.goBack()}>
        <Text style={styles.backButton}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}></View>
    </View>
  );
};
export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,

    marginBottom: 10,
    justifyContent: 'space-between',
    color: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'black',
  },
  backButton: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    width: 70,
    height: 40,
    textAlign: 'left',
    textAlignVertical: 'center',
    backgroundColor: '#600868ff',
    borderRadius: 8,
    paddingLeft: 10,
  },
  right: {
    width: 70,
  },
});
