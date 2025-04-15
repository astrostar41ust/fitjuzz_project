import { StyleSheet } from "react-native";
import { colors, sizes } from "../style";

const ProfileScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  text__topic: {
    color: colors.clr_white,
    fontSize: sizes.size_base,
  },
  text__seeall:{
color:colors.clr_brightblue
  },
  box: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 100,
    width: "49%",
  },
  longbox: {
    borderRadius: 10,
    paddingHorizontal: 20,
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  profile_box: {
    padding: 20,
    height: 200,
    alignItems: "center",
  },
  profile: {
    width: 90,
    height: 90,
    position: "absolute",
    top: 2,
    zIndex: 1,
  },
  profile__img: {
    width: 90,
    height: 90,
    position: "absolute",
    top: 2,
    zIndex: 1,
    overflow: "hidden",
    backgroundColor: colors.clr_white,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.clr_lightgray,
  },
  profile_button_edit: {
    width: 15,
    height: 15,
    backgroundColor: colors.clr_lightgray,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 65,
    top: 75,
    zIndex: 2,
  },

  profile_container: {
    backgroundColor: colors.clr_background_modal,
    width: 310,
    height: 150,
    marginTop: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    alignItems: "center",
  },
  username_text: {
    color: colors.clr_lightgray,
    fontSize: sizes.size_lg,
    textAlign: "center",
    paddingTop: 55,
    fontWeight: "bold",
  },
  data__text: {
    fontSize: sizes.size_xs,
    color: colors.clr_lightgray,
  },
  button: {
    width: 75,
    height: 25,
    backgroundColor: colors.clr_blue,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  button__text: {
    color: colors.clr_lightgray,
    fontSize: sizes.size_3xs,
  },
  inside_box: {
    gap: 5,
    justifyContent: "center",
  },
  button_edit: {
    width: 20,
    height: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },
  footer__box: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header_box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header_text: {
    color: colors.clr_lightgray,
    fontSize: sizes.size_xs,
    fontWeight: "bold",
  },
  header_box_bmi: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  body__box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  body__data__box: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
  },
  body_text_number: {
    fontSize: sizes.size_3xl,
    color: colors.clr_white,
  },
  body_text_unit: {
    fontSize: sizes.size_3xs,
    color: colors.clr_lightgray,
  },
  bmi_text: {
    color: colors.clr_white,
    fontSize: sizes.size_lg,
    marginTop: 5,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  pointer: {
    borderLeftWidth: 3,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.clr_lightgray,
    position: "absolute",
    transform: [{ translateX: -3 }],
    marginTop: 4,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeLabel: {
    fontSize: sizes.size_3xs,
    color: colors.clr_lightgray,
  },
  barColors: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  colorBlock: {
    width: "20%",
    height: 5,
  },
  box_modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
backgroundColor: 'rgba(0,0, 0, 0.9)'
  },
  inside_box_modal: {
    borderRadius: 10,
    padding: 30,
    width: 315,
    height: 550,
    backgroundColor: "#3A3A3A",
    alignItems: "center",
  },
  modal_header_text: {
    fontSize: sizes.size_xl,
    fontWeight: "bold",
    color: colors.clr_lightgray,
    textAlign: "center",
  },
  modal_subtitle: {
    color: colors.clr_lightgray,
  },
  modal_input_box: {
    borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 20,
  },
  modal_button: {
    alignItems: "center",
    width: 128,
    height: 39,
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.clr_brightblue,
  },
  modal__button__text: {
    fontSize: sizes.size_xs,
    color: colors.clr_white,
    fontWeight: "bold",
  },
  modal_sex_button: {
    width: 110,
    height: 110,
    borderRadius: 100,
    alignItems: "center",
    backgroundColor: colors.clr_graybutton,
  },
  table_header: {
    flexDirection: "row",
    borderWidth: 1,
    backgroundColor: colors.clr_brightblue,
    marginTop: 8,
    height:40,
  },
  table_header_cell: {
    borderWidth: 1,
    textAlign: "center",
    color: colors.clr_lightgray,
    fontWeight:'bold',
    height:40,
    paddingVertical:8
  },
  table_row: {
    flexDirection: "row",
    borderWidth: 1,
    backgroundColor: "lightgray",
  },
  table_row_cell: {
    borderWidth: 1,
    backgroundColor: "lightgray",
    textAlign:'center',
    height:50,
    alignItems:'center',
    paddingVertical:13
  },
  dumbbell_top: {
    position: "absolute",
    top: 0,
    right: 40,
    opacity: 0.1,
    zIndex: 0,
    transform: [{ rotate: "-55deg" }],
  },
  dumbbell_middle: {
    position: "absolute",
    top: 20,
    right: 80,
    opacity: 0.2,
    zIndex: 0,
    transform: [{ rotate: "45deg" }],
  },
  dumbbell_bottom: {
    position: "absolute",
    top: 60,
    right: 40,
    opacity: 0.3,
    zIndex: 0,
    transform: [{ rotate: "-50deg" }],
  },
});

export default ProfileScreenStyle;
