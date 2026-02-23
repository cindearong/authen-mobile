import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/styles";

function ExpensesSummary({ expenses, periodName }) {
  // 💡 Add "?? []" here. This ensures .reduce never runs on 'undefined'.
  const safeExpenses = expenses ?? [];

  const expenseSum = safeExpenses.reduce((sum, expense) => {
    const amount = +expense.amount || 0; 
    return sum + amount;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.period}>{periodName}</Text>
      {/* RM for Malaysia as per your context! */}
      <Text style={styles.sum}>RM{expenseSum.toFixed(2)}</Text>
    </View>
  );
}

export default ExpensesSummary;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: GlobalStyles.colors.primary50,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  period: {
    fontSize: 12,
    color: GlobalStyles.colors.primary400,
  },

  sum: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GlobalStyles.colors.primary500,
  }

});

