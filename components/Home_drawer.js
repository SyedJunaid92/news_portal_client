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
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import classroom from './Classroom';
import schedule from './Schedule';
import result from './Result';
import join_class from './Join_class';
import ClassroomChat from './ClassroomChat';
import ClassHome from './ClassHome';
import DescriptiveQuestion from './DescriptiveQuestion';
import DescriptiveSolution from './DescriptiveSolution';
import McqsSol from './McqsSol';
import mcqs from './Mcqs';
import TeacherResult from './TeacherResult';
import StudentResult from './StudentResult';
const Tab = createBottomTabNavigator();

const home_drawer = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {position: 'absolute', backgroundColor: '#422629'},
        headerStyle: {
          backgroundColor: '#160d22',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#fff',
        },
        headerTintColor: '#fff',
      }}>
      <Tab.Screen
        name="Room"
        component={classroom}
        options={{
          tabBarLabel: 'Room',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="StudentResult"
        component={StudentResult}
        options={{
          tabBarLabel: 'StudentResult',
          tabBarItemStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={schedule}
        options={{
          tabBarLabel: 'Schedule',
          tabBarItemStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        name="TeacherResult"
        component={TeacherResult}
        options={{
          tabBarLabel: 'TeacherResult',
          tabBarItemStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        name="DesSolution"
        component={DescriptiveSolution}
        options={{
          tabBarLabel: 'DesSolution',
          tabBarItemStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        name="Des"
        component={DescriptiveQuestion}
        options={{
          tabBarLabel: 'Descriptive',
          tabBarItemStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        name="mcqs"
        component={mcqs}
        options={{
          tabBarLabel: 'mcqs',
          tabBarItemStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        name="McqsSol"
        component={McqsSol}
        options={{
          tabBarLabel: 'mcqsSolution',
          tabBarItemStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        name="Result"
        component={result}
        options={{
          tabBarLabel: 'Result',
          tabBarItemStyle: {display: 'none'},
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="text-box-check"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Join"
        component={join_class}
        options={{
          tabBarLabel: 'Join',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ClassroomChat}
        options={{
          tabBarItemStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        name="ClassHome"
        component={ClassHome}
        options={{
          tabBarItemStyle: {display: 'none'},
        }}
      />
    </Tab.Navigator>
  );
};
export default home_drawer;
