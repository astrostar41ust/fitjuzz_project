import { StyleSheet } from "react-native";
import { colors, sizes } from "../style";

const NoteScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
 
  userWorkoutTrackInput: {
    backgroundColor: colors.clr_lightgray,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  continueButton: {
    width: "50%",
    backgroundColor: colors.clr_brightblue,
    borderRadius: 100,
    paddingVertical: 12,
    marginVertical: 14,
    alignItems: "center",
  },
  nextButton: {
    width: "50%",
    backgroundColor: colors.clr_brightblue,
    borderRadius: 100,
    paddingVertical: 12,
    marginVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: colors.clr_white,
    fontSize: sizes.size_base,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.clr_brightblue,
    borderRadius: 12,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    fontSize: sizes.size_sm,
    color: colors.clr_white,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: colors.clr_lightgray,
    borderRadius: 12,
    marginBottom: 6,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: sizes.size_sm,
    paddingVertical: 8,
    color: colors.clr_black,
  },
  title: {
    fontSize: sizes.size_3xl,
    textAlign: 'center',
    color: colors.clr_brightblue,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: sizes.size_base,
    textAlign: 'center',
    color: colors.clr_gray,
  },
  input__section: {
    fontSize: sizes.size_base,
    paddingLeft: 20,
    paddingRight: 15,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dateText: {
    color: colors.clr_gray,
    fontSize: sizes.size_base,
    textAlign: "center",
    marginBottom: 30,
  },
  addButtonText: {
    fontSize: sizes.size_base,
    color: "#424242",
    fontWeight: "500",
  },
  icon: {
    marginLeft: 10,
  },
  addExerciseBoxText: {
    color: colors.clr_orange,
    fontSize: sizes.size_base,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  removeExerciseBoxText: {
    color: colors.clr_orange,
    fontSize: sizes.size_base,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  box_modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  inside_box_modal: {
    backgroundColor: colors.clr_background_modal,
    borderRadius: 10,
    padding: 25,
    width: "90%",
    height: "85%",
  },
  modal_header_text_: {
    fontSize: sizes.size_2xl,
    fontWeight: "bold",
    color: colors.clr_brightblue,
  },
  modal_category_box: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  modal_category_inside: {
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  modal_category_inside_text: {
    fontSize: sizes.size_xs,
    fontWeight: "bold",
  },
  modal_body: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingTop: 20,
    flexWrap: "wrap",
  },
  exercisecard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    height: 70,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dumbbell_top: {
    position: "absolute",
    top: 5,
    right: 30,
    opacity: 0.1,
    zIndex: 0,
    transform: [{ rotate: "-55deg" }],
  },
  dumbbell_middle: {
    position: "absolute",
    top: 40,
    right: 100,
    opacity: 0.2,
    zIndex: 0,
    transform: [{ rotate: "45deg" }],
  },
  dumbbell_bottom: {
    position: "absolute",
    top: 80,
    right: 45,
    opacity: 0.3,
    zIndex: 0,
    transform: [{ rotate: "-50deg" }],
  },
  searchbar: {
    flexDirection: 'row',
    height: 40,
    borderColor: colors.clr_black,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchbarInput: {
    flex: 1,
    fontSize: sizes.size_sm,
    paddingLeft: 10,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  clearIcon: {
    paddingRight: 10,
  },
  exerciseHeader: {
    fontSize: sizes.size_3xl,      
    fontWeight: "800",             
    color: colors.clr_brightblue,  
    textAlign: "center",
    marginVertical: 20,
    letterSpacing: 1,
    textTransform: "capitalize",   
  },
  
});

export default NoteScreenStyle;
