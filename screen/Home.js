import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
  ToastAndroid,
  AlertIOS,
  useWindowDimensions,
} from 'react-native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import home_drawer from './News Today/HomeScreen/index.js';
import live_stream from './News Today/LiveStream/index.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

const home = ({navigation}) => {
  const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerType={'back'}
      screenOptions={{
        activeTintColor: '#009387',
        itemStyle: {marginVertical: 5},
        headerStyle: {
          backgroundColor: '#160d22',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#fff',
        },
        headerTintColor: '#fff',
      }}
      //drawerContent={props => <CustomSidebarMenu {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={home_drawer}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Drawer.Screen
        name="Live Stream"
        component={live_stream}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={color}
              size={26}
            />
          ),
        }}
      />

      {/* <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{
          headerShown: false,
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="logout" size={26} />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};
export default home;

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: '#009387',
  },
});
