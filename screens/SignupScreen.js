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

  async function signupHandler(credentials) {
    const { email, password, name, confirmPassword } = credentials;

    console.log("Checking Screen variables:", { password, confirmPassword });

    setIsAuthenticating(true);
    try {
      const token = await createUser(email, password, name, confirmPassword);
      
      setAuthToken(token);
      authCtx.authenticate(token);
    } catch (error) {
      setIsAuthenticating(false);
      let errorMsg = 'Could not create user. Please try again later.';

      if (error.response?.data) {
        const data = error.response.data;
        if (data.errors) {
          const errorKey = Object.keys(data.errors)[0];
          if (errorKey) {
            errorMsg = data.errors[errorKey][0];
          }
        } else if (data.message) {
          errorMsg = data.message;
        }
      }

      console.log("Full Error Object:", error);
      Alert.alert('Authentication failed', errorMsg);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;