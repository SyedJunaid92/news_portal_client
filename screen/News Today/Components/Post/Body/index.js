import React from 'react';
import {Image, View, Text} from 'react-native';
import styles from './style';
let index;

const Body = ({image}) => {
  const array = ['', 'BG.png', 'dollar.jpg', 'karachi.jpg', 'cricket.jpg'];

  let name;
  if (index == 3) {
    index = 0;
    name = array[index];
  } else {
    index = index + 1;
    name = array[index];
  }

  return (
    <View style={styles.view}>
      <Image
        source={require(`../../../../../assets/dollar.jpg`)}
        style={styles.image}
      />
      <Text style={{margin: 10, fontSize: 18, justifyContent: 'center'}}>
        {image}
      </Text>
    </View>
  );
};

export default Body;
