import { StyleSheet } from "react-native";
import { colors, sizes } from "../style";

const TimerScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  all: {
    flex: 1,
  },
  time: {
    fontSize: 60,
    fontWeight: "bold",
    marginBottom:20,
    textAlign: "center",
    // borderWidth: 2,
    // borderColor: "red",
    marginTop:60
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
    // borderWidth: 2,
    // borderColor: "red",
    gap:100
  },
  lapButton: {
    backgroundColor: 'lightgray',
    width:60,
    height:60,
    borderRadius: 100,
    justifyContent:'center',
  },
  line:{
    width: 300,
    height: 1,
    backgroundColor: colors.clr_slate,
    marginTop: 3,
    alignSelf: 'center',
  },
  startButton: {
    backgroundColor:colors.clr_orange,
    width:60,
    height:60,
    borderRadius: 100,
    justifyContent:'center',
  },
  buttonText: {
    fontSize: sizes.size_base,
    fontWeight: "bold",
    color: "white",
    textAlign:'center'
  },
  lapsContainer: {
    width: "100%",
    maxHeight: 300,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 50,
  },
  lapText: {
    fontSize: sizes.size_lg,
    marginBottom: 5,
    marginTop: 5,
    color: 'gray',
    paddingLeft: 20,
  },
});

export default TimerScreenStyle;
