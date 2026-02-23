import ExpensesOutput from '../components/ExpensesOutput';
import { useContext } from 'react';
import { ExpensesContext } from '../store/expenses-context';


function AllExpenses() { 
  const expensesCtx = useContext(ExpensesContext);
  const loadedExpenses = expensesCtx.expenses ?? [];
  return ( <ExpensesOutput expenses={loadedExpenses} expensesPeriod="Total" fallbackText="No registered expenses found." />
);
}

export default AllExpenses;