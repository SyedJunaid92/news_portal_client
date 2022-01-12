import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  RefreshControl,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';

const Post = ({post}) => {
  return (
    <View
      style={{
        marginTop: 10,
        opacity: 100,
        marginHorizontal: 5,
        borderBottomColor: '#eee1',
        borderBottomWidth: 0.2,
      }}>
      <Header
        avatar={' '}
        name={post.author}
        userID={post.username}
        caption={post.title}
      />
      {post.body ? <Body image={post.body} /> : null}

      <Footer post={post} />
    </View>
  );
};

export default Post;
