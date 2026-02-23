import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import IconButton from './components/ui/IconButton';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import RecentExpenses from "./screens/RecentExpenses";
import AllExpenses from "./screens/AllExpenses";
import ManageExpense from "./screens/ManageExpense";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { setAuthToken } from './util/http';
import ExpensesContextProvider from './store/expenses-context';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();
SplashScreen.preventAutoHideAsync();

    GoogleSignin.configure({
      //iosClientId:
      //"1062013777281-p9rb00oovj1grd68c27pfluot4hi8eqs.apps.googleusercontent.com",
      webClientId:
      "584536588788-7l68nhr22plr14ltjltmdcnk0chqcn14.apps.googleusercontent.com",
      profileImageSize: 120,
      offlineAccess: true, 
      forceCodeForRefreshToken: true,
  });

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function ExpensesOverview() {
  const authCtx = useContext(AuthContext); // To access logout

  return (
    <BottomTabs.Navigator 
      screenOptions={({navigation}) => ({
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        tabBarStyle: { backgroundColor: Colors.primary500 },
        tabBarActiveTintColor: Colors.accent500,
        // Add Logout button on the left, Add button on the right
        headerLeft: ({tintColor}) => (
          <IconButton icon="exit" size={24} color={tintColor} onPress={authCtx.logout} />
        ),
        headerRight: ({tintColor}) => (
          <IconButton icon="add" size={24} color={tintColor} onPress={() => navigation.navigate('ManageExpense')} />
        ),
      })}
    >
      <BottomTabs.Screen name="RecentExpenses" component={RecentExpenses} options={{ title: 'Recent' }} />
      <BottomTabs.Screen name="AllExpenses" component={AllExpenses} options={{ title: 'All' }} />
    </BottomTabs.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="ExpensesOverview" component={ExpensesOverview} options={{ headerShown: false }} />
      <Stack.Screen name="ManageExpense" component={ManageExpense} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  // Use a double bang !! to force a boolean or check for null
  const isLoggedIn = !!authCtx.token; 

  return (
    <NavigationContainer>
      {!isLoggedIn ? <AuthStack /> : <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        authCtx.authenticate(storedToken);
        setAuthToken(storedToken);
      }
      setIsTryingLogin(false);
      await SplashScreen.hideAsync();
    }
    fetchToken();
  }, [authCtx.token]);

  if (isTryingLogin) return null;

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <ExpensesContextProvider> 
          <Root />
        </ExpensesContextProvider>
      </AuthContextProvider>
    </>
  );
}