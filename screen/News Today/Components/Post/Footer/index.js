import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  TextInput,
  ToastAndroid,
} from "react-native";
import { COLORS } from "../../../COLORS";
import CommentList from "../../CommentList/index";
import commentData from '../../../Data/CommentData/commentData'
import styles from "./style";

const Footer = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.like);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [comment, setComment] = useState("");
  const [commentArray, setCommentArray] = useState("");

  useEffect(() => {
    setCommentArray(commentData)
  }, []);
  const onLikePressed = () => {
    const amount = isLiked ? -1 : 1;
    setLikesCount(Number(likesCount) +1);
    setIsLiked(!isLiked);
  };
  const ondisLikePressed = () => {
    const amount = isLiked ? -1 : 1;
    setLikesCount(Number(likesCount) -1);
    setIsLiked(!isLiked);
  };

  const onCommentPressed = () => {
    // if(database.getComments(post.postID)){
    //   dispatch(setCommentsArray(database.getComments(post.postID)))
    //   console.log(commentsArray)
    // }
    setModalVisible(true);
  };

  const onPostCommentPress = () => {
    alert("Comment posted")
  };

  const onChangeCommentInput = (value) => {
    if (value !== "") {
      setIsEmpty(false);
      setComment(value);
    } else {
      setIsEmpty(true);
      setComment(value);
    }
  };

  const onClose = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View keyboardShouldPersistTaps="always" style={styles.container}>
      <View keyboardShouldPersistTaps="handled">
        <View style={styles.left}>
          <TouchableWithoutFeedback onPress={onLikePressed}>
            {isLiked ? (
              <View style={styles.buttonView}>
                <Text style={styles.footer_button_pressed}>Like</Text>
              </View>
            ) : (
              <View style={styles.buttonView}>
                <Text style={styles.footer_button}>Like</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
          <TouchableOpacity onPress={onCommentPressed}>
            <View style={styles.buttonView}>
              <Text style={styles.footer_button}>Comment</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>ondisLikePressed()}>
            <View style={styles.buttonView}>
              <Text style={styles.footer_button}>disLike</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.left}>
        <Text style={styles.likes}>{likesCount} Likes</Text>
      </View>

      <Modal
        keyboardShouldPersistTaps={"handled"}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setComment("");
          setIsEmpty(true);
        }}
      >
        <View style={styles.centeredView}>
          <TouchableOpacity
            onPressIn={onClose}
            style={styles.modalClose}
          ></TouchableOpacity>
          <View style={styles.modalView}>
            <View style={{ alignSelf: "center", marginBottom: 10 }}>
              <Text style={styles.modalText}>Comments</Text>
            </View>
            {/* <Text style={{color: "#eee"}}>ghsg</Text> */}
            {commentData ? (
              <CommentList commentsArray={commentData} />

            ) : (
              <View style={styles.centeredView,[{flex: 1, justifyContent: "center", alignItems: "center"}]}>
              <Text style={{fontSize: 18, color: COLORS.font}}>Be the first to comment</Text>
              </View>
            )}

            <View
              keyboardShouldPersistTaps="always"
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextInput
                keyboardShouldPersistTaps={"always"}
                placeholder="Comment"
                multiline
                placeholderTextColor={COLORS.font_secondary}
                selectionColor={COLORS.primary}
                style={styles.textInput}
                onChangeText={(value) => onChangeCommentInput(value)}
              ></TextInput>
              <TouchableOpacity onPress={onPostCommentPress}>
                {isEmpty ? (
                  <Text style={styles.footer_button}>Post</Text>
                ) : (
                  <Text style={styles.footer_button_pressed}>Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      
      <View style={{borderBottomColor: 'red', borderBottomWidth: 1, marginTop: 20, marginBottom: 20,}}></View>
    </View>
  );
};
export default Footer;
