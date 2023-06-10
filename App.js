import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import AdminScreen from './screens/AdminScreen';
import UserScreen from './screens/UserScreen';


const Stack = createStackNavigator();

const App = () => {
  const doAdmin = (navigation) => {
    AsyncStorage.removeItem('authInfo');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Admin' }]
    });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
