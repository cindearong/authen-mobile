import { useState } from 'react';
import { Alert, StyleSheet, View, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import FlatButton from '../ui/FlatButton';
import AuthForm from './AuthForm';
import { Colors } from '../../constants/styles';

function AuthContent({ isLogin, onAuthenticate, onGoogleLogin }) {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace('Signup');
    } else {
      navigation.replace('Login');
    }
  }

  function submitHandler(credentials) {
  const safeCredentials = credentials || {};
  
  let { 
      email = '', 
      password = '', 
      confirmPassword = '' 
  } = safeCredentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email && email.includes('@'); 
    const passwordIsValid = password && password.length >= 8;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && !passwordsAreEqual)
    ) {
      Alert.alert('Invalid input', 'Please check your entered credentials.');
      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
      onAuthenticate({ 
        email, 
        password, 
        confirmPassword, 
        name: safeCredentials.name
      });
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />

      {isLogin && onGoogleLogin && (
        <View style={styles.googleButtonContainer}>
          <Pressable
            style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}
            onPress={onGoogleLogin}
          >
            <Ionicons name="logo-google" size={20} color={Colors.primary500} style={styles.googleIcon} />
            <Text style={styles.buttonText}>Log In with Google</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.buttons}>
      <FlatButton 
        onPress={switchAuthModeHandler} 
        textStyle={styles.buttonText} 
      >
        {isLogin ? 'Create a new user' : 'Log in instead'}
      </FlatButton>
    </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor:'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary200,
  },
  buttons: {
    marginTop: 20,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  googleButtonContainer: {
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary200,
    paddingBottom: 12,
    marginBottom: 8,
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: Colors.primary500,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
