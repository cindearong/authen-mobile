import { Alert, View, StyleSheet, TextInput } from "react-native";
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
      //setIsSubmitting(false);
      expenseCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    }catch {
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
      if (isEditing) {
        await updateExpense(editedExpenseId, expenseData);
        expenseCtx.updateExpense(editedExpenseId, expenseData);
      } else {
        const newExpenseFromServer = await storeExpense(expenseData);
        const id = newExpenseFromServer?.id || Math.random().toString();
        expenseCtx.addExpense({ ...expenseData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError('Could not save data - please try again later!');
      setIsSubmitting(false);
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