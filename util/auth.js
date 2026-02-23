import axios from "axios";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const API_KEY = 'AIzaSyADZzX9jInA-DlTLUwqr05PjA452EtlVrw';

export async function startGoogleLogin() {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    
    const idToken = response.data.idToken;

    if (!idToken) {
      throw new Error("No ID Token received from Google");
    }

    return await loginWithGoogle(idToken);
  } catch (error) {
    console.error("Google Sign-In Flow Error:", error);
    throw error; 
  }
}

export async function loginWithGoogle(idToken) {
  
  console.log("Google Login Response:", idToken);
  const response = await axios.post('https://expenses-tracker-api-laravel.benova.com.my/api/google-login', {
    firebase_token: idToken,
    
  });

  const laravelToken = response.data.access_token; 

  return laravelToken;
}

export async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  const token = response.data.idToken;

  return token;
}

export function createUser(email, password) {
  return authenticate('signUp', email, password);
}

export function login(email, password) {
  return authenticate('signInWithPassword', email, password);
}