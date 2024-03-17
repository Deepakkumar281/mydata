import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "react-native-paper";
import AppStyle from "../../config/styles";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFDFE",
  },
  centerFlex: {
    justifyContent: "center",
    alignItems: "center",
  },
  nameTxt: {
    fontSize: 18,
    fontFamily: AppStyle.fonts.FONT_SEMIBOLD,
    color: AppStyle.color.TITLE_COLOR,
  },
  degreeTxt: {
    fontSize: 14,
    fontFamily: AppStyle.fonts.ROBOTO_FONT_REGULAR,
    color: AppStyle.color.TITLE_COLOR,
  },
  drawerItemStyle: {
    flexDirection: "row",
    height: 45,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent:'center',
    borderBottomColor: Colors.grey400,
    borderBottomWidth: 0.6,
    paddingLeft: 30,
  },
  drawerSubItemStyle: {
    flexDirection: "row",
    height: 45,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomColor: "#536476",
    borderBottomWidth: 0.1,
    paddingLeft: 46,
  },
  drawerSubView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "86%",
  },
  drawerItemTxt: {
    fontSize: 14,
    fontFamily: AppStyle.fonts.ROBOTO_FONT_REGULAR,
    color: AppStyle.color.GREY_90,
    paddingLeft: 20,
  },
});

export default styles;
