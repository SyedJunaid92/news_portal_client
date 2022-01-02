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
  TouchableOpacity,
  Image,
} from "react-native";

import styles from "./style";
import ProfilePicture from "../../ProfilePicture";
import Entypo from 'react-native-vector-icons/Entypo'

const Header = ({ avatar, name, userID, caption }) => {
  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => alert("navigate to profile")}>
          <View style={styles.left}>
            <ProfilePicture uri={""} size={45} border={false} />
            <View style={{ marginTop: 10 }}>
              <Text style={styles.name}>{name}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.right}>
           <Entypo
              name="dots-three-vertical"
              size={20}
              color="#eee"
            />
          </View>
        </TouchableOpacity>
      </View>
      {caption === "" ? null : (
        <View style={styles.bottom}>
          <Text style={styles.caption}>{caption}</Text>
        </View>
      )}
    </View>
  );
};

export default Header;
