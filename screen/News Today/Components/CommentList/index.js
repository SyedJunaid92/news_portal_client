import React from "react";
import {            
  FlatList,
  RefreshControl,
  ScrollView,
  ToastAndroid,
} from "react-native";
import CommentHead from "../CommentHead/index";
import { COLORS } from "../../../src/Constants/COLORS";

const CommentList = ({ commentsArray }) => {

  console.log(commentsArray)
  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={commentsArray}
      keyExtractor={({ id }) => id}
      renderItem={({ item }) => {
        return <CommentHead comment={item} />;
      }}
    />
  );
};

export default CommentList;
