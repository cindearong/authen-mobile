import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from './Input';
import Button from '../../components/ui/Button';
import { getFormattedDate } from '../../util/date';
import { Colors } from '../../constants/styles';
import * as DocumentPicker from 'expo-document-picker';


function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : '',
      isValid: true,
    },
    date: {
      value: defaultValues ? defaultValues.date : new Date(),
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : '',
      isValid: true,
    },
  });

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function dateChangeHandler(event, selectedDate) {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      inputChangedHandler('date', selectedDate);
    }
  }

  async function pickDocumentHandler() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "image/*", 
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
          "application/msword" // doc/doccx/word
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        
        const isImage = file.mimeType.startsWith('image/');
        const isPdf = file.mimeType === 'application/pdf';
        const isWord = 
          file.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.mimeType === 'application/msword';

        if (!isImage && !isPdf && !isWord) {
          Alert.alert(
            "Invalid File Type", 
            "Please select only images (JPG, PNG), PDF, or Word documents."
          );
          return;
        }

        setSelectedFile({
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
        });
      }
    } catch (err) {
      console.log("Error picking document:", err);
      Alert.alert("Error", "Could not pick the document. Please try again.");
    }
  }


  function submitHandler() {
    const expenseData = {
      amount: +inputs.amount.value,
      date: inputs.date.value,
      description: inputs.description.value,
      file: selectedFile,
    };
    
    const isNotFutureDate = expenseData.date <= new Date();

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== 'Invalid Date' && isNotFutureDate;
    const descriptionIsValid = expenseData.description.trim().length > 0;

    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
        setInputs((curInputs) => {
          return {
            amount: { value: curInputs.amount.value, isValid: amountIsValid },
            date: { value: curInputs.date.value, isValid: dateIsValid }, 
            description: { value: curInputs.description.value, isValid: descriptionIsValid },
          };
        });
        return;
      }

    onSubmit(expenseData);
  }

  const formIsInvalid =
    !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid;

  return (
  <View style={styles.form}>
   <Text style={styles.title}>Your Expense</Text>
   <View style={styles.inputsRow}>
    <Input
     style={styles.rowInput}
     label="Amount"
     invalid={!inputs.amount.isValid}
     textInputConfig={{
      keyboardType: 'decimal-pad',
      onChangeText: inputChangedHandler.bind(this, 'amount'),
      value: inputs.amount.value,
     }}
    />
    
    <Pressable 
     onPress={() => setShowDatePicker(true)} 
     style={styles.rowInput}
    >
     <View pointerEvents="none">
      <Input
       label="Date"
       invalid={!inputs.date.isValid}
       textInputConfig={{
        value: getFormattedDate(inputs.date.value),
        editable: false,
       }}
      />
     </View>
    </Pressable>
   </View>

   {showDatePicker && (
    <DateTimePicker
      value={inputs.date.value}
      mode="date"
      maximumDate={new Date()}
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      onChange={dateChangeHandler}
    />
    )}

   <Input
    label="Description"
    invalid={!inputs.description.isValid}
    textInputConfig={{
     multiline: true,
     onChangeText: inputChangedHandler.bind(this, 'description'),
     value: inputs.description.value,
    }}
   />

   {formIsInvalid && (
    <Text style={styles.errorText}>
     Invalid input values - please check your entered data!
    </Text>
   )}

   <View style={styles.filePickerContainer}>
    <Text style={styles.label}>Receipt (Optional)</Text>
    <Button mode="flat" onPress={pickDocumentHandler}>
     {selectedFile ? 'Change File' : 'Upload Receipt'}
    </Button>
    {selectedFile && (
     <Text style={styles.fileName}>Selected: {selectedFile.name}</Text>
    )}
   </View>

   <View style={styles.buttons}>
    <Button style={styles.button} mode="flat" onPress={onCancel}>
     Cancel
    </Button>
    <Button style={styles.button} onPress={submitHandler}>
     {submitButtonLabel}
    </Button>
   </View>
  </View>
 );
}

export default ExpenseForm;
;

const styles = StyleSheet.create({
  form: { 
    marginTop: 20,
    backgroundColor: Colors.primary950,
    padding: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary500,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: { 
    flex: 1 
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  errorText: {
    textAlign: 'center',
    color: Colors.error500,
    margin: 8,
  },
  filePickerContainer: {
    marginVertical: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.primary200,
    borderStyle: 'dashed',
    borderRadius: 6,
    alignItems: 'center'
  },
  fileName: {
    color: 'white',
    marginTop: 4,
    fontSize: 12
  }
});