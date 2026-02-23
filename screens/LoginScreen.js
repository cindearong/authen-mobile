import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { login, loginWithGoogle, startGoogleLogin } from '../util/auth';
import { 
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes 
} from '@react-native-google-signin/google-signin';
 import { useNavigation } from '@react-navigation/native';

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);

  // Standard Login Handler
  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert('Authentication failed!', 'Check your credentials.');
      setIsAuthenticating(false);
    }
  }

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      setIsAuthenticating(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        
        // Pass the Google token to your Firebase REST API utility
        const firebaseToken = await loginWithGoogle(idToken);
        
        authCtx.authenticate(firebaseToken);
        // We don't need to set isAuthenticating(false) here because 
        // the AuthContext will switch the screen automatically.
      } else {
        // Sign in was cancelled by user
        setIsAuthenticating(false);
      }
    } catch (error) {
      setIsAuthenticating(false); // Unstick the UI

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
            // This is where DEVELOPER_ERROR usually lands
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
      // Make sure this prop name matches what you use inside AuthContent.js
      onGoogleLogin={handleGoogleSignIn} 
    />
  );
}

export default LoginScreen;