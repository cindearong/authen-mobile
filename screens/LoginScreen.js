import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { login, loginWithGoogle } from '../util/auth';
import { setAuthToken } from '../util/http';
import { 
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes 
} from '@react-native-google-signin/google-signin';

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);

  // Standard Login Handler
  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      setAuthToken(token);
      authCtx.authenticate(token);
    } catch (error) {
      let message = 'Authentication failed! Could not log you in.';

      if (error.response?.data) {
        const data = error.response.data;
        if (data.errors) {
          const errorKey = Object.keys(data.errors)[0];
          if (errorKey) {
            message = data.errors[errorKey][0];
          }
        } else if (data.message) {
          message = data.message;
        }
      }

      Alert.alert('Authentication failed', message);
      setIsAuthenticating(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthenticating(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        const firebaseToken = await loginWithGoogle(idToken);
        setAuthToken(firebaseToken);
        
        authCtx.authenticate(firebaseToken);
      } else {
        setIsAuthenticating(false);
      }
    } catch (error) {
      setIsAuthenticating(false);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled');
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert('In Progress', 'Login is already running.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Error', 'Play services not available.');
            break;
          default:
            Alert.alert('Google Error', `Code: ${error.code}\nMessage: ${error.message}`);
        }
      } else {
        Alert.alert('Login Error', 'An unexpected error occurred.');
      }
    }
  };

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return (
    <AuthContent 
      isLogin 
      onAuthenticate={loginHandler} 
      onGoogleLogin={handleGoogleSignIn} 
    />
  );
}

export default LoginScreen;