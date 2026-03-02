import { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
    expenses: [],
    addExpense: ({description, amount, date}) => {},
    setExpenses: (expenses) => {},
    deleteExpense: (id) => {},
    updateExpense: (id, {description, amount, date}) => {},
});

function expensesReducer(state, action) {
    switch (action.type) {
        case 'ADD':
            const newExpense = action.payload;
            return [{ 
                ...newExpense, 
                amount: +newExpense.amount, 
                date: new Date(newExpense.date) 
            }, ...state];
        case 'SET':
            const dataToProcess = Array.isArray(action.payload) ? action.payload : [];
            
            const cleanedData = dataToProcess.map(exp => ({
                ...exp,
                amount: +exp.amount,
                date: new Date(exp.date)
            }));
            return cleanedData.reverse();
        case 'UPDATE':
            const updatableExpenseIndex = state.findIndex(
                (expense) => expense.id === action.payload.id);
                const updatableExpense = state[updatableExpenseIndex];
                const updatedItem = {
                    ...updatableExpense,
                    ...action.payload.expenseData,
                    amount: +action.payload.expenseData.amount,
                    date: new Date(action.payload.expenseData.date)
                };
                const updatedExpenses = [...state];
                updatedExpenses[updatableExpenseIndex] = updatedItem;
                return updatedExpenses;
            
        case 'DELETE':
            return state.filter((expense) => expense.id !== action.payload);
        default:
            return state
    }
}

function ExpensesContextProvider({children}){
   const [expensesState, dispatch] = useReducer(expensesReducer, []);
   function addExpenses(expenseData) {
    dispatch({type: 'ADD', payload: expenseData});
   }

   function setExpenses(expenses) {
    dispatch({type: 'SET', payload: expenses});
   }

   function deleteExpense(id) {
    dispatch({type: 'DELETE', payload: id});
   }

   function updateExpense(id, expenseData) {
    dispatch({type: 'UPDATE', payload: {id:id, expenseData:expenseData}});
   }

   const value = {
    expenses: expensesState,
    addExpense: addExpenses,
    setExpenses: setExpenses,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
   };


    return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export default ExpensesContextProvider;
