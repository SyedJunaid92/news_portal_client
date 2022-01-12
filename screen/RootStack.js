import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './SignInScreen.js';
import SignupScreen from './SignupScreen.js';
import SplashScreen from './SplashScreen.js';
import home from './Home.js';
import HomeLive from './HomeLive.js';
import Live from './Live.js';

const Rootstack = createStackNavigator();

const RootStackScreen = ({ navigation }) => (
  <Rootstack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#160d22',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#fff',
      },
      headerTintColor: '#fff',
    }}>
    <Rootstack.Screen
      name="Main"
      component={home}
      options={{ headerShown: false }}
    />
    <Rootstack.Screen
      name="SplashScreen"
      component={SplashScreen}
      options={{ headerShown: false }}
    />
    <Rootstack.Screen
      name="SignInScreen"
      component={SignInScreen}
      options={{ headerShown: false }}
    />
    <Rootstack.Screen
      name="SignupScreen"
      component={SignupScreen}
      options={{ headerShown: false }}
    />
    {/* <Rootstack.Screen
      name="Main"
      component={home}
      options={{headerShown: false}}
    /> */}
    <Rootstack.Screen name="Homelive" component={HomeLive} options={{ headerShown: false }} />
    <Rootstack.Screen name="Live" component={Live} options={{ headerShown: false }} />
  </Rootstack.Navigator>
);
export default RootStackScreen;
