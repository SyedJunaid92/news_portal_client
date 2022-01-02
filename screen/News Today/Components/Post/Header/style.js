import {StyleSheet} from 'react-native';
import { COLORS } from "../../../COLORS";


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
  },
  right: {
    flexDirection: "row",
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 25,
    color: COLORS.font,
  },
  userID: {
    fontWeight: "bold",
    fontSize: 12,
    color: COLORS.font_secondary,
  },
  caption: {
    color: COLORS.font,
    justifyContent: 'space-around',
    fontSize: 20,
    padding: 10,
  },
  bottom: {
    flexDirection: "column",
    marginLeft: 10,
    marginBottom: 2,
    marginTop: 2,
  },
});

export default styles;