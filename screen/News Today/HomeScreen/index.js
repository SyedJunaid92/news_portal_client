import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  RefreshControl,
  Text,
  View,
  ActivityIndicator,
  Platform,
  ImageBackground,
} from "react-native";

import { Header, Left, Body, Icon, Title, Button, Right } from "native-base";
import NewsFeed from "../Components/NewsFeed"
import styles from "../Components/Post/Body/style";


const HomeScreen = () => {
 
  return (
    <ImageBackground style={{flex:1,}} source={require('./../../../assets/BG.png')}>
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.8)",
      }}
    >
      <StatusBar backgroundColor="#" barStyle="light-content" />
      <NewsFeed />
    </SafeAreaView>
    </ImageBackground>
  );
};

export default HomeScreen;
