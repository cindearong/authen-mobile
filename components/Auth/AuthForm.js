import { useState } from 'react';
import { StyleSheet, View, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/styles';
import Button from '../ui/Button';
import Input from './Input';

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
  const [enteredName, setEnteredName] = useState('');
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] = useState(false);
 
  const {
    email: emailIsInvalid,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid || {};

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'name':
        setEnteredName(enteredValue);
        break;
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
      case 'confirmPassword':
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    const email = enteredEmail.trim();
    const password = enteredPassword.trim();
    const confirmPassword = enteredConfirmPassword.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length >= 8;
    const passwordsAreEqual = isLogin || password === confirmPassword;

    if (!emailIsValid) {
      Alert.alert('Invalid Input', 'Please enter a valid email address.');
      return;
    }
    if (!passwordIsValid) {
      Alert.alert('Invalid Input', 'Password must be at least 8 characters long.');
      return;
    }
    if (!isLogin && !passwordsAreEqual) {
      Alert.alert('Invalid Input', 'Passwords do not match.');
      return;
    }

    onSubmit({
      email,
      password,
      confirmPassword,
      name: isLogin ? '' : enteredName,
    });
  }

  return (
    <View style={styles.form}>
      {!isLogin && (
        <Input
          label="Full Name"
          onUpdateValue={(val) => setEnteredName(val)}
          value={enteredName}
          isInvalid={false}
        /> )}
      <View>
        <Input
          label="Email Address"
          onUpdateValue={updateInputValueHandler.bind(this, 'email')}
          value={enteredEmail}
          keyboardType="email-address"
          isInvalid={emailIsInvalid}
        />
        <View style={styles.passwordContainer}>
          <Input
            label="Password"
            onUpdateValue={updateInputValueHandler.bind(this, 'password')}
            secure={!passwordIsVisible}
            value={enteredPassword}
            isInvalid={passwordIsInvalid}
            style={styles.passwordInput}
          />
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setPasswordIsVisible((current) => !current)}
          >
            <Ionicons name={passwordIsVisible ? 'eye' : 'eye-off'} size={24} color={Colors.primary500} />
          </Pressable>
        </View>
        {!isLogin && (
          <View style={styles.passwordContainer}>
            <Input
              label="Confirm Password"
              onUpdateValue={updateInputValueHandler.bind(
                this,
                'confirmPassword'
              )}
              secure={!confirmPasswordIsVisible}
              value={enteredConfirmPassword}
              isInvalid={passwordsDontMatch}
              style={styles.passwordInput}
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setConfirmPasswordIsVisible((current) => !current)}
            >
              <Ionicons name={confirmPasswordIsVisible ? 'eye' : 'eye-off'} size={24} color={Colors.primary500} />
            </Pressable>
          </View>
        )}
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 42,
  },
  passwordInput: {
    paddingRight: 50,
  },
});