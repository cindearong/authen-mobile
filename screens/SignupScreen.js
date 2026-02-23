import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { createUser } from '../util/auth';
import { setAuthToken } from '../util/http'; 

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await createUser(email, password);
      
      // 🚀 SET AXIOS HEADER BEFORE AUTHENTICATING
      setAuthToken(token); 
      
      authCtx.authenticate(token);
    } catch (error) {
      // 💡 Log the exact backend error for debugging
      console.log("Signup Error Data:", error.response?.data);
      
      Alert.alert(
        'Authentication failed',
        error.response?.data?.message || 'Could not create user, please check your input.'
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;