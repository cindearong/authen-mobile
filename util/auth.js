import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { api, setAuthToken } from './http';

const BACKEND_URL = 'https://expenses-tracker-api-laravel.benova.com.my/api';

export async function startGoogleLogin() {
  try {
    await GoogleSignin.hasPlayServices();
    const { data } = await GoogleSignin.signIn();
    
    if (!data?.idToken) throw new Error("No ID Token received from Google");

    return await loginWithGoogle(data.idToken);
  } catch (error) {
    console.error("Google Sign-In Flow Error:", error);
    throw error; 
  }
}

export async function loginWithGoogle(idToken) {
  const response = await api.post(`/google-login`, {
    id_token: idToken,
  });
  
  const token = response.data.access_token;
  setAuthToken(token);
  return token;
}

export async function authenticate(mode, email, password, name, confirmPassword) {
  const endpoint = mode === 'signUp' ? '/register' : '/login';
  
  const payload = {
    name: name || email.split('@')[0],
    email: email,
    password: password,
    password_confirmation: confirmPassword, 
    device_name: 'mobile_app'
  };

  try {
    const response = await api.post(endpoint, payload);
    const token = response.data.access_token;
    setAuthToken(token);
    return token;
  } catch (error) {
    console.log("Laravel Auth Error:", error.response?.data || error.message);
    throw error;
  }
}

export function createUser(email, password, name, confirmPassword) {
  return authenticate('signUp', email, password, name, confirmPassword);
}

export function login(email, password) {
  return authenticate('login', email, password);
}