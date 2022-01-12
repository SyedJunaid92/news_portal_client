import React from 'react';
import {SafeAreaView, ImageBackground} from 'react-native';

import {Header, Left, Body, Icon, Title, Button, Right} from 'native-base';
import NewsFeed from '../Components/NewsFeed';
import styles from '../Components/Post/Body/style';

const HomeScreen = () => {
  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('./../../../assets/BG.png')}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.8)',
        }}>
        <NewsFeed />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HomeScreen;
