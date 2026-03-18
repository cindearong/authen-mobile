import { Alert, View, StyleSheet } from "react-native";
import IconButton from "../components/ui/IconButton";
import { GlobalStyles } from "../constants/styles";
import { useContext, useLayoutEffect, useState} from "react";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "./ManageExpense/ExpenseForm";
import { storeExpense, updateExpense, deleteExpense} from "../util/http";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorOverlay from "../components/ui/ErrorOverlay";
import { Colors } from "../constants/styles";


function ManageExpense({route, navigation}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const expenseCtx = useContext(ExpensesContext);
  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;
  const selectedExpense = expenseCtx.expenses.find(
    (expense) => expense.id === editedExpenseId);


  useLayoutEffect(() => {
  navigation.setOptions({
   title: isEditing ? 'Edit Expense' : 'Add Expense',
 });
}, [navigation, isEditing]);

 async function deleteExpenseHandler() {
  setIsSubmitting(true);
  try {
   await deleteExpense(editedExpenseId);
   navigation.pop(2); 
   
   expenseCtx.deleteExpense(editedExpenseId);
  } catch {
   setError('Could not delete expense - please try again later!');
   setIsSubmitting(false);
  }
 }

 function cancelHandler() {
  navigation.goBack();
 }

      async function confirmHandler(expenseData) {
      setIsSubmitting(true);
      try {
        const apiData = {
          ...expenseData,
          attachment: expenseData.file ? expenseData.file : (selectedExpense?.attachment || null)
        };

        if (isEditing) {
          const responseData = await updateExpense(editedExpenseId, apiData);
          const serverUrl = responseData.attachment_url || responseData.data?.attachment_url;
          
          const contextUpdateData = {
            ...expenseData,
            id: editedExpenseId,
            date: new Date(expenseData.date), 
            attachment: serverUrl || (expenseData.file ? expenseData.file.uri : selectedExpense.attachment)
          };

          expenseCtx.updateExpense(editedExpenseId, contextUpdateData);
        } else {
          const responseData = await storeExpense(apiData);
          const serverAttachmentUrl = responseData.attachment_url || responseData.data?.attachment_url;
          const serverId = responseData.id || responseData.data?.id || Date.now().toString();

          expenseCtx.addExpense({
            ...expenseData,
            id: serverId,
            date: new Date(expenseData.date), //date an obj
            attachment: serverAttachmentUrl || (expenseData.file ? expenseData.file.uri : null),
          });
        }
        navigation.goBack();
      } catch (error) {
        setIsSubmitting(false);
  
        if (error.response && error.response.status === 422) {
          const serverErrors = error.response.data.errors;
          let errorMessage = "Validation Failed:\n";
          
          for (const key in serverErrors) {
            errorMessage += `- ${serverErrors[key].join(', ')}\n`;
          }
          
          console.log("Validation Details:", serverErrors);
          Alert.alert("Input Error", errorMessage);
        } else {
          console.error("Update Error:", error);
          setError('Could not save data - please check your connection.');
        }
      }
    }

  if (error && !isSubmitting) {
   return <ErrorOverlay message={error}/>
  }

  if (isSubmitting) {
   return <LoadingOverlay/>
  }

 return ( 
 <View style={styles.container}>
  <ExpenseForm 
  submitButtonLabel={isEditing ? 'Update' : 'Add'} 
  onSubmit={confirmHandler}
  onCancel={cancelHandler}
  defaultValues={selectedExpense}
  />
  {isEditing && (
   <View style={styles.deleteContainer}>
   <IconButton 
   icon="trash" 
   color={GlobalStyles.colors.error500} 
   size={36} 
   onPress={deleteExpenseHandler} />
   </View>
  )}
 </View>
 );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.primary50,
  },
  deleteContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1, 
    borderTopColor: Colors.primary200,
    alignItems: 'center',
  },
});