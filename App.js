import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { GlobalStyles } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import ExpensesContextProvider from './store/expenses-context';

// util
import { setAuthToken } from './util/http';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

import RecentExpenses from "./screens/RecentExpenses";
import AllExpenses from "./screens/AllExpenses";
import ManageExpense from "./screens/ManageExpense";

import AllPlaces from './screens/PlaceScreens/AllPlace';
import AddPlace from './screens/PlaceScreens/AddPlace';
import Map from './screens/PlaceScreens/Map';
import PlaceDetails from './screens/PlaceScreens/PlaceDetails';

import IconButton from './components/ui/IconButton';
import ExpenseDetails from './screens/ManageExpense/ExpenseDetails';


const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();
const PlacesStack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

GoogleSignin.configure({
  webClientId: "584536588788-7l68nhr22plr14ltjltmdcnk0chqcn14.apps.googleusercontent.com",
  offlineAccess: true, 
  forceCodeForRefreshToken: true,
});

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary800 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: GlobalStyles.colors.primary700 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function PlacesNavigator() {
  return (
    <PlacesStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary800 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: GlobalStyles.colors.primary700 },
      }}
    >
      <PlacesStack.Screen
        name="AllPlaces"
        component={AllPlaces}
        options={({ navigation }) => ({
          title: 'Favorite Places',
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="add"
              size={24}
              color={tintColor}
              onPress={() => navigation.navigate('AddPlace')}
            />
          ),
        })}
      />
      <PlacesStack.Screen name="AddPlace" component={AddPlace} options={{ title: 'Add New Place' }} />
      <PlacesStack.Screen name="Map" component={Map} />
      <PlacesStack.Screen name="PlaceDetails" component={PlaceDetails} options={{ title: 'Loading Place...' }} />
    </PlacesStack.Navigator>
  );
}

function ExpensesOverview() {
  const authCtx = useContext(AuthContext);

  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary800 },
        headerTintColor: 'white',
        tabBarStyle: {
          backgroundColor: GlobalStyles.colors.primary800,
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
        headerLeft: ({ tintColor }) => (
          <IconButton icon="exit" size={24} color={tintColor} onPress={authCtx.logout} />
        ),
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="add"
            size={24}
            color={tintColor}
            onPress={() => navigation.navigate('ManageExpense')}
          />
        ),
      })}
    >
      <BottomTabs.Screen
        name="RecentExpenses"
        component={RecentExpenses}
        options={{
          title: 'Recent',
          tabBarLabel: 'Recent',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "time" : "time-outline"} size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="AllExpenses"
        component={AllExpenses}
        options={{
          title: 'All Expenses',
          tabBarLabel: 'All',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "journal" : "journal-outline"} size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="PlacesTab"
        component={PlacesNavigator}
        options={{
          headerShown: false,
          title: 'Places',
          tabBarLabel: 'Places',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "map" : "map-outline"} size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary800 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: GlobalStyles.colors.primary700 },
      }}
    >
      <Stack.Screen 
        name="ExpensesOverview" 
        component={ExpensesOverview} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ManageExpense" 
        component={ManageExpense} 
        options={{ presentation: 'modal' }} 
      />
      <Stack.Screen 
        name="ExpenseDetails" 
        component={ExpenseDetails} 
        options={{
          title: 'Expense Details',
        }} 
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authCtx.token ? <AuthStack /> : <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isAppReady, setIsAppReady] = useState(false);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function prepareApp() {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          authCtx.authenticate(storedToken);
          setAuthToken(storedToken);
        }
      } catch (e) {
        console.warn("Initialization Error:", e);
      } finally {
        setIsAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepareApp();
  }, [authCtx]);

  if (!isAppReady) return null;

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