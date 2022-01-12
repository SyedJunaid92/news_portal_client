import React, {useEffect} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = ({navigation}) => {
  useEffect(async () => {
    try {
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('name');
      navigation.navigate('SignInScreen');
    } catch (e) {
      console.log(e);
    }
  });
  return <View></View>;
};

export default Logout;
