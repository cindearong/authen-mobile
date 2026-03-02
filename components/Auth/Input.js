import { View, Text, TextInput, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import { Colors } from '../../constants/styles';

function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
  style,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid, style]}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
        autoCorrect={false}
        spellCheck={false}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
    inputContainer: {
        marginHorizontal: 4,
        marginVertical: 10,
    },
    label: {
        fontSize: 13,
        color: GlobalStyles.colors.gray700,
        marginBottom: 6,
        fontWeight: '600',
        textTransform: 'uppercase',
    },  
    input: {
        backgroundColor: GlobalStyles.colors.primary100,
        color: GlobalStyles.colors.gray700,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: GlobalStyles.colors.primary200,
    },
    inputMultiline: {
        minHeight: 120,
        textAlignVertical: 'top'
    },
    invalidInput: {
        backgroundColor: GlobalStyles.colors.error50,
        borderWidth: 1,
        borderColor: GlobalStyles.colors.error500,
    },
});