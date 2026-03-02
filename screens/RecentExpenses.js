import { useContext, useEffect, useState } from 'react';
import ExpensesOutput from '../components/ExpensesOutput';
import ErrorOverlay from '../components/ui/ErrorOverlay';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { ExpensesContext } from '../store/expenses-context';
import { getDateMinusdays } from '../util/date';
import { fetchExpenses } from '../util/http';


function RecentExpenses() { 
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const expensesCtx = useContext(ExpensesContext);

  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);
      try {
        const expenses = await fetchExpenses();
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError('Could not fetch expenses!');
      }
      setIsFetching(false);
    }
    getExpenses();
  }, []);

  if (error && !isFetching) {
    return <ErrorOverlay message={error}/>;
  }

  if (isFetching) {
    return <LoadingOverlay/>;
    }

const allExpenses = expensesCtx.expenses ?? [];

const recentExpenses = allExpenses.filter((expense) => {
  const today = new Date();
  const date7DaysAgo = getDateMinusdays(today, 7);

  return expense.date && (expense.date >= date7DaysAgo) && (expense.date <= today);
});

  return (
  <ExpensesOutput 
  expenses={recentExpenses} 
  expensesPeriod="Last 7 Days" 
  fallbackText="No expenses registered for the last 7 days." />
    );
}

export default RecentExpenses;

