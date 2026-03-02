import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/styles";

function ExpensesSummary({ expenses, periodName }) {
  const safeExpenses = expenses ?? [];

  const expenseSum = safeExpenses.reduce((sum, expense) => {
    const amount = +expense.amount || 0; 
    return sum + amount;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.period}>{periodName}</Text>
      <Text style={styles.sum}>RM{expenseSum.toFixed(2)}</Text>
    </View>
  );
}

export default ExpensesSummary;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: GlobalStyles.colors.primary500,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
  },
  period: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sum: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
});