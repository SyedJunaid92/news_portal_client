import React from "react";
import { Image, View } from "react-native";
import { COLORS } from "../../COLORS";

import styles from "./style";

const ProfilePicture = ({ uri, size = 50, border = true, borderColor = COLORS.primary }) => (
  <View
    style={[
      styles.container,
      { width: size + 6, height: size + 6, borderWidth: border ? 3 : 3, borderColor: border ? borderColor : 'transparent', marginLeft: 10, marginTop: 20, },
    ]}
  >
    <Image
      source={require("../../../../assets/profile.jpeg")}
      style={[styles.image, { height: size, width: size }]}
    />
  </View>
);

export default ProfilePicture;
