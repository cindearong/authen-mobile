import axios from 'axios';
import { getFormattedDate } from './date';

const BACKEND_URL = 'https://expenses-tracker-api-laravel.benova.com.my/api';

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    Accept: 'application/json',
  },
});

export function setAuthToken(token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function fetchExpenses() {
  const response = await api.get('/expenses');
  return response.data.data || response.data;
}

function createExpenseFormData(expenseData) {
  const formData = new FormData();
  
  formData.append('title', expenseData.description || 'Expense');
  formData.append('amount', expenseData.amount.toString());
  formData.append('date', getFormattedDate(expenseData.date));
  formData.append('description', expenseData.description || '');

  //string only
  if (expenseData.file && expenseData.file.uri) {
     formData.append('attachment', expenseData.file.uri); 
  } else if (typeof expenseData.attachment === 'string') {
     formData.append('attachment', expenseData.attachment);
  }

  return formData;
}

export async function storeExpense(expenseData) {
  const formData = createExpenseFormData(expenseData);
  const response = await api.post('/expenses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data || response.data;
}

export async function updateExpense(id, expenseData) {
  if (!id) throw new Error("Missing expense ID");

  const formData = new FormData();
  
  formData.append('title', expenseData.description || 'Expense');
  formData.append('amount', expenseData.amount.toString());
  formData.append('description', expenseData.description || '');
  
  if (expenseData.date) {
    const dateObj = new Date(expenseData.date);
    const formattedDate = dateObj.toISOString().slice(0, 10);
    formData.append('date', formattedDate);
  }

  if (expenseData.file && expenseData.file.uri) {
    formData.append('attachment', expenseData.file.uri);
  } else if (typeof expenseData.attachment === 'string') {
    formData.append('attachment', expenseData.attachment);
  }

  formData.append('_method', 'PUT');

  const response = await api.post(`/expenses/${id}`, formData, {
    headers: { 
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    },
  });
  
  return response.data;
}

export function deleteExpense(id) {
  return api.delete(`/expenses/${id}`);
}