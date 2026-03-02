import axios from 'axios';

const BACKEND_URL = 'https://expenses-tracker-api-laravel.benova.com.my/api';

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    Accept: 'application/json',
  },
});

export function setAuthToken(token){
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function fetchExpenses() {
  const response = await api.get('/expenses');
  return response.data.data || response.data;
}

export async function storeExpense(expenseData) {
  const response = await api.post('/expenses', {
    title: expenseData.description, 
    amount: expenseData.amount,
    date: expenseData.date, 
    category: 'General',    
    description: expenseData.description
  });
  
  const data = response.data.data || response.data;

  if (Array.isArray(data)) {
    return data[0];
  }
  
  return data;
}

export function updateExpense(id, expenseData) {
  return api.put(`/expenses/${id}`, {
    title: expenseData.description,
    amount: expenseData.amount,
    date: expenseData.date,
    category: 'General',
    description: expenseData.description
  });
}

export function deleteExpense(id) {
  return api.delete(`/expenses/${id}`);
}