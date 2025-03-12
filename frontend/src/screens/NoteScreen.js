import * as React from "react";
import { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Modal,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import styles, { colors, sizes } from "../styles/style";
import NoteScreenStyle from "../styles/components/NoteScreenStyle";
import Header from "../components/Header";
import AntDesign from "react-native-vector-icons/AntDesign";
import ExerciseCard from "../components/ExerciseCard";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import myImage from "../assets/images/Welcomimage.png";
import axios from "axios";
import CircularTimer from "../components/CircularTimer";

export default function NoteScreen({}) {
  const [currentDate, setCurrentDate] = useState("");
  const [exercisesBox, setExercisesBox] = useState([
    { id: 1, name: "Exercise", exercises: [] },
    { id: 2, name: "Exercise", exercises: [] },
    { id: 3, name: "Exercise", exercises: [] },
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentExerciseId, setCurrentExerciseId] = useState(null);
  const [isAddingNewBox, setIsAddingNewBox] = useState(false);
  const [databaseExercises, setDatabaseExercises] = useState([]);

  const [isNoteVisible, setIsNoteVisible] = useState(1);
  const [isStartVisible, setIsStartVisible] = useState(0);
  const [isTimerVisible, setIsTimerVisible] = useState(0);

  useEffect(() => {
    fetchExercise();
  }, []);

  const fetchExercise = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/getExercises`
      );

      setDatabaseExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const getAvailableExercises = () => {
    const selectedExercises = exercisesBox.map((ex) => ex.name);
    const filteredExercises = databaseExercises.filter(
      (ex) =>
        (!selectedExercises.includes(ex.name) || ex.name === "Exercise") &&
        (selectedCategory === "all" || ex.category === selectedCategory)
    );
    return filteredExercises;
  };

  useEffect(() => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    setCurrentDate(`Today ${day}/${month}/${year}`);
  }, []);

  const handleAddBox = () => {
    setIsAddingNewBox(true);
    setModalVisible(true);
  };

  const handleRemoveBox = () => {
    setExercisesBox([]);
  };

  const handleAddExercise = (exerciseId) => {
    const exercise = exercisesBox.find((ex) => ex.id === exerciseId);
    if (exercise.name === "Exercise") {
      setCurrentExerciseId(exerciseId);
      setModalVisible(true);
    } else {
      setExercisesBox(
        exercisesBox.map((ex) =>
          ex.id === exerciseId ? { ...ex, name: "Exercise" } : ex
        )
      );
    }
  };

  const handleSelectExercise = (exerciseName) => {
    if (isAddingNewBox) {
      setExercisesBox([
        ...exercisesBox,
        { id: Date.now(), name: exerciseName, exercises: [] },
      ]);
      setIsAddingNewBox(false);
    } else {
      setExercisesBox(
        exercisesBox.map((exercise) =>
          exercise.id === currentExerciseId
            ? { ...exercise, name: exerciseName }
            : exercise
        )
      );
    }
    setModalVisible(false);
  };

  // const handleCategoryPress = (category) => {
  //   setSelectedCategory(category);
  // };

  const handleRemoveExercise = (id) => {
    setExercisesBox(exercisesBox.filter((exercise) => exercise.id !== id));
  };

  const handleIsNoteVisible = () => {
    setIsNoteVisible(0);
    setIsStartVisible(1);
  };
  const handleIsTimerVisible = () => {
    setIsStartVisible(0);
    setIsTimerVisible(1);
  };

  const [data, setData] = useState([
    { id: "1", weight: "", reps: "", timer: "" },
    { id: "2", weight: "", reps: "", timer: "" },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState("weight"); // Start with weight

  const columnTitles = {
    weight: "Weight",
    reps: "Reps",
    timer: "Timer",
  };
  const columnPlaceholder = {
    weight: "Enter Weight",
    reps: "Enter Reps",
    timer: "Enter Timer",
  };


const handleNextInput = () => {
    if (inputValue === "") return; // Prevent empty input

    const updatedData = [...data];

    // Update the current column in the table
    updatedData[currentRow][currentColumn] = inputValue;
    setData(updatedData);
    setInputValue(""); // Clear input field

    // Move to the next column (Weight → Reps → Timer)
    if (currentColumn === "weight") {
      setCurrentColumn("reps");
    } else if (currentColumn === "reps") {
      setCurrentColumn("timer");
    } else {
      // If timer is filled, move to the next row
      if (currentRow < data.length - 1) {
        setCurrentRow(currentRow + 1);
        setCurrentColumn("weight"); // Reset to weight
      } else {
        // Add a new row if the last row is completed
        const newRow = { id: (data.length + 1).toString(), weight: "", reps: "", timer: "" };
        setData([...data, newRow]);
        setCurrentRow(data.length); // Move to the new row
        setCurrentColumn("weight"); // Reset column
      }
    }
  };

  return (
    <View style={[NoteScreenStyle.container]}>
      <Header />
      {isNoteVisible ? (
        <View style={[styles.container]}>
          <View style={{}}>
            <Text style={[NoteScreenStyle.dateText]}>{currentDate}</Text>
            <TouchableOpacity
              style={[styles.button, { marginBottom: 35 }]}
              onPress={handleIsNoteVisible}
            >
              <Text style={[styles.buttonText]}>Start</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 10 }}
          >
            {exercisesBox.map((exercise) => (
              <View
                key={exercise.id}
                style={{
                  marginBottom: 10,
                  position: "relative",
                  width: "100%",
                }}
              >
                <View
                  style={[
                    NoteScreenStyle.input__section,
                    exercise.name !== "Exercise" && {
                      backgroundColor: "#E8F5E9",
                      borderWidth: 1,
                      borderColor: "#4CAF50",
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        NoteScreenStyle.addButtonText,
                        exercise.name !== "Exercise" && {
                          color: "#2E7D32",
                        },
                      ]}
                    >
                      {exercise.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      right: 15,
                      height: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleAddExercise(exercise.id)}
                    >
                      <AntDesign
                        name={
                          exercise.name === "Exercise"
                            ? "pluscircle"
                            : "closecircle"
                        }
                        size={24}
                        color={
                          exercise.name === "Exercise" ? "#4CAF50" : "#E77339"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {exercise.name === "Exercise" && (
                  <View
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -4,
                      zIndex: 1,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleRemoveExercise(exercise.id)}
                    >
                      <View
                        style={{
                          borderRadius: 12,
                          width: 24,
                          height: 24,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <AntDesign
                          name="minuscircle"
                          size={15}
                          color="#E77339"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
            <Modal
              visible={isModalVisible}
              animationType="slide"
              transparent={true}
            >
              <View style={[NoteScreenStyle.box_modal]}>
                <View style={[NoteScreenStyle.inside_box_modal]}>
                  <IconFontAwesome5
                    name={"dumbbell"}
                    size={50}
                    color={colors.clr_slate}
                    style={[NoteScreenStyle.dumbbell_top]}
                  />
                  <IconFontAwesome5
                    name={"dumbbell"}
                    size={30}
                    color={colors.clr_slate}
                    style={[NoteScreenStyle.dumbbell_middle]}
                  />
                  <IconFontAwesome5
                    name={"dumbbell"}
                    size={55}
                    color={colors.clr_slate}
                    style={[NoteScreenStyle.dumbbell_bottom]}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 15,
                    }}
                  >
                    <Text style={[NoteScreenStyle.modal_header_text_]}>
                      Your{"\n"}Exercise
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        setIsAddingNewBox(false);
                      }}
                    >
                      <AntDesign
                        name={"closecircle"}
                        size={20}
                        color={colors.clr_gray}
                        style={{ paddingVertical: 10 }}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={[NoteScreenStyle.modal_category_box]}>
                    {["all", "leg", "abs", "back", "chest", "arms"].map(
                      (category) => (
                        <TouchableOpacity
                          key={category}
                          style={[
                            NoteScreenStyle.modal_category_inside,
                            {
                              backgroundColor:
                                selectedCategory === category
                                  ? colors.clr_slate
                                  : colors.clr_gray,
                            },
                          ]}
                          onPress={() => setSelectedCategory(category)}
                        >
                          <Text
                            style={[
                              NoteScreenStyle.modal_category_inside_text,
                              {
                                color:
                                  selectedCategory === category
                                    ? colors.clr_white
                                    : colors.clr_black,
                              },
                            ]}
                          >
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                  <ScrollView
                    style={{ marginTop: 20, flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        paddingHorizontal: 5,
                        paddingBottom: 20,
                      }}
                    >
                      {getAvailableExercises().map((exercise, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleSelectExercise(exercise.name)}
                          style={[NoteScreenStyle.exercisecard]}
                        >
                          <ExerciseCard
                            name={exercise.name}
                            description={exercise.description}
                            picture={exercise.picture}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>
            <TouchableOpacity onPress={handleAddBox}>
              <Text style={[NoteScreenStyle.addExerciseBoxText]}>
                + add exercise box
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRemoveBox}>
              <Text
                style={[
                  NoteScreenStyle.removeExerciseBoxText,
                  { marginBottom: 25 },
                ]}
              >
                - remove all exercise box
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : null}
      {isStartVisible ? (
        <View style={styles.container}>
          <View style={NoteScreenStyle.userExerciseDisplay}>
            <Image
              source={require("../assets/images/Welcomimage.png")}
              style={{ width: 100, height: 100 }}
            />
            <Text style={{ fontWeight: "bold", fontSize: sizes.size_xl }}>
              Placeholder
            </Text>
          </View>

          <View
            style={[NoteScreenStyle.userWorkoutTrackInput, { marginTop: 10 }]}
          >
            <Text style={{ fontWeight: "bold", fontSize: sizes.size_base}}>
              {columnTitles[currentColumn]}
            </Text>
            <View
              style={{ borderWidth: 1, borderColor: colors.clr_gray }}
            ></View>

            <View
              style={{
                
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity>
                  <AntDesign name="minuscircle" size={15} color="#E77339" />
                </TouchableOpacity> 
                <TextInput
                  placeholder={columnPlaceholder[currentColumn]}
                  value={inputValue}
                  onChangeText={setInputValue}
                  style={{
                    textAlign: "center",
                    fontSize: sizes.size_base,
                    color: colors.clr_black,
                    width: 100,
                    height: 20,

                    marginHorizontal: 20,
                  }}
                  maxLength={4}
                ></TextInput>
                <TouchableOpacity>
                  <AntDesign name="pluscircle" size={15} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.clr_gray,
                  width: "30%",
                }}
              ></View>
              <TouchableOpacity
                style={NoteScreenStyle.continueButton}
                onPress={handleNextInput}
              >
                <Text style={[NoteScreenStyle.buttonText]}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={NoteScreenStyle.tableHeader}>
            <Text style={NoteScreenStyle.headerCell}>Set</Text>
            <Text style={NoteScreenStyle.headerCell}>Weight</Text>
            <Text style={NoteScreenStyle.headerCell}>Reps</Text>
            <Text style={NoteScreenStyle.headerCell}>Timer</Text>
          </View>

          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={NoteScreenStyle.row}>
                <Text style={NoteScreenStyle.cell}>{item.id}</Text>
                <Text style={NoteScreenStyle.cell}>{item.weight || "-"}</Text>
                <Text style={NoteScreenStyle.cell}>{item.reps || "-"}</Text>
                <Text style={NoteScreenStyle.cell}>{item.timer || "-"}</Text>
              </View>
            )}
          />

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={NoteScreenStyle.nextButton}
              onPress={handleIsTimerVisible}
            >
              <Text style={NoteScreenStyle.buttonText}>Next ➝</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {isTimerVisible ? (
        <View style={styles.container}>
          <CircularTimer duration={180}></CircularTimer>
        </View>
      ) : null}
    </View>
  );
}
