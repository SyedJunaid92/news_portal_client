import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text, View } from "react-native";
import ProfilePicture from "../ProfilePicture";


import styles from "./style";

const CommentHead = ({ comment }) => {
  // console.log(comment)
  const navigation = useNavigation();
  const onPress = () => {
    alert("comment pressed")
  };
  return (
    <View style={styles.container}>
        <ProfilePicture uri={comment.imageUri} size={25} border={false} />

      <View style={styles.content}>
        <Text style={styles.name}>{comment.name} </Text>
        <Text style={styles.commentText}>{comment.comment}</Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <Text style={styles.timestamp}>
          time
          {/* {moment(comment.timestamp, "YYYYMMDDhhmmss").fromNow()} */}
        </Text>
      </View>
    </View>
  );
};

export default CommentHead;
