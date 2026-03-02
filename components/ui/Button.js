import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlobalStyles } from '../../constants/styles';

function Button({ children, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: GlobalStyles.colors.accent500,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  flat: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: GlobalStyles.colors.primary800,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  flatText: {
    color: GlobalStyles.colors.primary100,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: GlobalStyles.colors.primary200,
    borderRadius: 12,
  },
});