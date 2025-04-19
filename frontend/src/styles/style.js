import { Platform, StyleSheet } from "react-native";

export const sizes = {
  size_3xs: 8,
  size_2xs: 10,
  size_xs: 12,
  size_sm: 14,
  size_base: 16,
  size_lg: 18,
  size_xl: 20,
  size_2xl: 24,
  size_3xl: 30,
  size_4xl: 36,
  size_5xl: 48,
  size_6xl: 60,
  size_7xl: 72,
  size_8xl: 96,
  size_9xl: 128,
};

export const colors = {
  clr_white: "#FFFFFF",
  clr_lightgray: "#D3D3D3",
  clr_gray: "#C0C0C0",
  clr_black: "#1C2431",
  clr_slate: "#334357",
  clr_orange: "#E77339",
  clr_blue: "#0046C2",
  clr_background: "#333333",
  clr_graybutton: "#575757",
  clr_brightblue: "#005eff",
  clr_background_modal: "#3A3A3A"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 0,
    paddingHorizontal: 40,
    paddingTop: Platform.OS == "android" ? sizes.size_xs : 0,
    backgroundColor: colors.clr_background



  },
  section: {
    marginTop: 28,
  },
  whiteText: {
    color: colors.clr_white,
  },
  orangeText: {
    color: colors.clr_orange,
  },
  buttonAuth: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.clr_blue,
    borderRadius: 26,

  },
  button: {
    width: "100%",
    backgroundColor: colors.clr_blue,
    borderRadius: 20,
    paddingVertical: 14,
 
  },

  buttonText: {
    fontSize: sizes.size_base,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.clr_white,
    color: colors.clr_lightgray,
  },
  input__subsection: {
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.7,
    height: 40,
    borderColor: colors.clr_gray,
    borderBottomWidth: 2,

  },
  input__box: {

    fontSize: sizes.size_sm,
    color: 'white',
    paddingRight: 50,
    opacity: 0.7,
    height: 40,
    borderColor: colors.clr_gray,
    borderBottomWidth: 2,

  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: sizes.size_sm,
    paddingRight: 10,
    opacity: 0.8,
  },
  title: {
    fontSize: sizes.size_xl,
    fontWeight: 'bold'
  },
  sub__title: {
    fontSize: sizes.size_base,
    fontWeight: 'bold',
    color: colors.clr_gray
  },
  message__box: {
    borderWidth: 2,
    borderColor: 'black',
    width: 20,
    height: 20
  },
  checkboxContainer: {
    marginLeft: 2,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  exerciseCardWrapper: {
    flex: 1,
    flexDirection: 'row',
  }
});

export default styles;
