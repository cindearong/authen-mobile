import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/styles';

function FlatButton({ children, onPress, textStyle }) {
  return (
    <Pressable onPress={onPress}>
      <View>
        <Text style={[styles.buttonText, textStyle]}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default FlatButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.primary100,
  },
});