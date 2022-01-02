import React, { useState, useEffect } from "react";
import { FlatList, View } from "react-native";
import Post from "../Post";
import {fetchData} from "../../Data/PostData/posts"
import * as DataFetch from '../../Data/PostData/posts'
const NewsFeed = ({ posts }) => {
  const [postsArray, setPostsArray] = useState();
  useEffect(async() => {
    let data=await  DataFetch.fetchData()

    setPostsArray(data)
  }, []);


  return (
    <View style={{  }}>
      {postsArray!= undefined?
     
      <FlatList
        data={postsArray}
        showsVerticalScrollIndicator={false}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => {
          if(item.status=="true"){  return <Post post={item} />;}
        
        }}
      />:null}
    </View>
  );
};

export default NewsFeed;
