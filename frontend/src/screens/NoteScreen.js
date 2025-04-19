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
  Alert,
  ActivityIndicator,
} from "react-native";
import styles, { colors, sizes } from "../styles/style";
import NoteScreenStyle from "../styles/components/NoteScreenStyle";
import Header from "../components/Header";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import ExerciseCard from "../components/ExerciseCard";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import myImage from "../assets/images/Welcomimage.png";
import axios from "axios";
import CircularTimer from "../components/CircularTimer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomCheckbox from "../components/CustomCheckbox";
import CategoryButtons from "../components/CategoryButtons";

export default function NoteScreen({}) {
  const [error, setError] = useState("");
  const [errorLoading, setErrorLoading] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [exercisesBox, setExercisesBox] = useState([
    {
      id: 1,
      name: "Exercise",
      sets: [{ setNumber: 1, weight: 0, reps: 0, timer: 0 }],
    },
  ]);
  const [isModalStartVisible, setIsModalStartVisible] = useState(false);
  const [isModalNoteVisible, setIsModalNoteVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentExerciseId, setCurrentExerciseId] = useState(null);
  const [isAddingNewBox, setIsAddingNewBox] = useState(false);
  const [databaseExercises, setDatabaseExercises] = useState([]);
  const [storeDatabaseExercises, setDatabaseStoreExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isStartCreateWorkoutVisible, setIsCreateWorkoutVisible] = useState(1);
  const [isNoteVisible, setIsNoteVisible] = useState(0);
  const [isStartVisible, setIsStartVisible] = useState(0);
  const [isTimerVisible, setIsTimerVisible] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSelected, setSelection] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState({});

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const newData = storeDatabaseExercises.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setDatabaseExercises(newData);
    } else {
      setDatabaseExercises(storeDatabaseExercises);
    }
  };
  
  useEffect(() => {
    fetchExercise();
  }, []);

  useEffect(() => {
    if (selectedCategory !== 'all') {
      console.log(`filtering: ${selectedCategory}`);
      
      const filteredData = storeDatabaseExercises.filter(
        (item) => {
          if (!item.category) return false;
          const lowerCaseCategory = item.category.toLowerCase();
          
          if (selectedCategory.toLowerCase() === 'shoulder') {
            const isMatch = lowerCaseCategory === 'shoulder' || lowerCaseCategory === 'shoulders';
            if (isMatch) {
              console.log(`found: ${item.name}, category: ${item.category}`);
            }
            return isMatch;
          }
          
          return lowerCaseCategory === selectedCategory.toLowerCase();
        }
      );
      
      console.log(`found ${filteredData.length} exercises`);
      setDatabaseExercises(filteredData);
    } else {
      setDatabaseExercises(storeDatabaseExercises);
    }
  }, [selectedCategory]);

  const fetchExercise = async () => {
    try {
      setLoading(true);
      setError("");
      
      const cachedExercises = await AsyncStorage.getItem('cachedExercises');
      
      if (cachedExercises) {
        try {
          const exercisesData = JSON.parse(cachedExercises);
          console.log('Using cached exercises data');
          
          const shoulderExercises = exercisesData.filter(ex => {
            return ex.category && 
                 (ex.category.toLowerCase() === 'shoulder' || 
                  ex.category.toLowerCase() === 'shoulders');
          });
          
          console.log(`number of exercises in shoulder category: ${shoulderExercises.length}`);
          if (shoulderExercises.length > 0) {
            console.log('example exercises in shoulder category:');
            shoulderExercises.slice(0, 3).forEach(ex => {
              console.log(`- ${ex.name} (${ex.category})`);
            });
          }
          
          setDatabaseExercises(exercisesData);
          setDatabaseStoreExercises(exercisesData);
          setLoading(false);
        } catch (e) {
          console.error('Error parsing cached exercises:', e);
          await AsyncStorage.removeItem('cachedExercises');
        }
      }
      
      console.log('Fetching popular fitness exercises from API...');
      const apiUrl = `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/exercises/getPopularFitnessExercises`;
      console.log('API URL:', apiUrl);
      
      const response = await axios.get(apiUrl);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log(`Data fetched successfully! Found ${response.data.length} exercises`);
        
        await AsyncStorage.setItem('cachedExercises', JSON.stringify(response.data));
        
        setDatabaseExercises(response.data);
        setDatabaseStoreExercises(response.data);
      } else {
        console.log('API response did not contain valid exercise data');
        setError("can't fetch exercises");
        setErrorLoading(1);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      
      if (databaseExercises.length === 0) {
        setError("can't fetch exercises");
        setErrorLoading(1);
      }
      setLoading(false);
    }
  };

  const getAvailableExercises = () => {
    const selectedExercises = exercisesBox.map((ex) => ex.name);
    const filteredExercises = databaseExercises.filter(
      (ex) =>
        (!selectedExercises.includes(ex.name) || ex.name === "Exercise")
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
    setIsModalNoteVisible(true);
  };

  const handleRemoveBox = () => {
    setExercisesBox([]);
  };

  const handleAddExercise = (exerciseId) => {
    const exercise = exercisesBox.find((ex) => ex.id === exerciseId);
    if (exercise.name === "Exercise") {
      setCurrentExerciseId(exerciseId);
      setIsModalNoteVisible(true);
    } else {
      setExercisesBox(
        exercisesBox.map((ex) =>
          ex.id === exerciseId ? { ...ex, name: "Exercise" } : ex
        )
      );
    }
  };

  const handleSelectOneExercise = (exerciseName) => {
    
    const exerciseData = storeDatabaseExercises.find(ex => ex.name === exerciseName) || { name: exerciseName };
    
    if (isAddingNewBox) {
      setExercisesBox([
        ...exercisesBox,
        {
          id: Date.now(),
          name: exerciseName,
          category: exerciseData.category || '',
          picture: exerciseData.picture || '',
          sets: [{ setNumber: 1, weight: 0, reps: 0, timer: 0 }],
        },
      ]);
      setIsAddingNewBox(false);
    } else {
      setExercisesBox(
        exercisesBox.map((exercise) =>
          exercise.id === currentExerciseId
            ? { 
                ...exercise, 
                name: exerciseName,
                category: exerciseData.category || exercise.category || '',
                picture: exerciseData.picture || exercise.picture || '',
              }
            : exercise
        )
      );
    }

    setSelection(!isSelected);
    setIsModalStartVisible(false);
    setIsModalNoteVisible(false);
  };

  const handleSelectMultiExercise = (exerciseNames) => {
    if (exerciseNames.length > 0) {
      const exerciseBoxes = exerciseNames.map(name => {
        const exerciseData = storeDatabaseExercises.find(ex => ex.name === name) || { name };
        return {
          id: Date.now() + Math.random(),
          name: name,
          category: exerciseData.category || '',
          picture: exerciseData.picture || '',
          sets: [{ setNumber: 1, weight: 0, reps: 0, timer: 0 }],
        };
      });
      
      setExercisesBox(exerciseBoxes);
    }

    setIsAddingNewBox(false);
    setSelection(!isSelected);
    setIsModalStartVisible(false);
    setIsModalNoteVisible(false);
  };

  const handleRemoveExercise = (id) => {
    setExercisesBox(exercisesBox.filter((exercise) => exercise.id !== id));
  };

  const [inputValue, setInputValue] = useState(""); // Input that user enter (weight, reps, timer)

  const [currentField, setCurrentField] = useState("weight"); // Track which value user is entering
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [timerDuration, setTimerDuration] = useState(0);

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
  const handleConfirm = () => {
    if (inputValue == "") {
      setErrorLoading(1);
      return setError("Please enter your workout progress");
    } else {
      setErrorLoading(0);
    }

    setExercisesBox((prevExercises) =>
      prevExercises.map((exercise, exIdx) =>
        exIdx === currentExerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, sIdx) =>
                sIdx === currentSetIndex
                  ? { ...set, [currentField]: inputValue } // Update only the current set
                  : set
              ),
            }
          : exercise
      )
    );

    // ✅ Reset input field
    setInputValue(0);

    if (currentField === "weight") {
      setCurrentField("reps");
    } else if (currentField === "reps") {
      setCurrentField("timer");
    } else if (currentField === "timer") {
      setTimerDuration(inputValue);
      setIsStartVisible(0);
      setIsTimerVisible(1);

      // ✅ Move to the next set if available
      if (
        currentSetIndex <
        exercisesBox[currentExerciseIndex].sets.length - 1
      ) {
        setCurrentSetIndex((prevIndex) => prevIndex + 1);
        setCurrentField("weight");
      } else {
        // ✅ If last set, create a new set
        setExercisesBox((prevExercises) =>
          prevExercises.map((exercise, exIdx) =>
            exIdx == currentExerciseIndex
              ? {
                  ...exercise,
                  sets: [
                    ...exercise.sets,
                    {
                      setNumber: exercise.sets.length + 1,
                      weight: 0,
                      reps: 0,
                      timer: 0,
                    },
                  ],
                }
              : exercise
          )
        );

        setTimeout(() => {
          setCurrentSetIndex((prevIndex) => prevIndex + 1);
          setCurrentField("weight");
        }, 100);
      }
    }
  };

  const moveToNextExercise = async () => {
    console.log("Before filtering:", exercisesBox);

    const filteredExercises = exercisesBox
      .filter((exercise) => exercise.name !== "Exercise") // Remove unselected exercises
      .map((exercise) => ({
        ...exercise,
        sets: exercise.sets.filter(
          (set) => set.weight !== 0 || set.reps !== 0 || set.timer !== 0
        ),
      }))
      .filter((exercise) => exercise.sets.length > 0); // Remove exercises with no valid sets

    console.log("After filtering:", filteredExercises); // Debug: Check if extra sets exist

    const saveWorkout = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const userGoogleToken = await AsyncStorage.getItem("userGoogleToken");
      const userXToken = await AsyncStorage.getItem("userXToken");

      if (userToken) {
        const decodedUserToken = jwtDecode(userToken);
        saveWorkoutToDatabase(decodedUserToken);
      } else if (userGoogleToken) {
        const decodedUserGoogleToken = jwtDecode(userGoogleToken);
        saveWorkoutToDatabase(decodedUserGoogleToken);
      } else if (userXToken) {
        const decodedUserXToken = jwtDecode(userXToken);
        saveWorkoutToDatabase(decodedUserXToken);
      }
    };

    const saveWorkoutToDatabase = async (allUserToken) => {
      const userId = allUserToken.userId;

      console.log("UserID:", userId);
      // console.log("🚀 Sending workout data:", workoutData);

      try {
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/${userId}/updateWorkout`,
          {
            userId: userId,
            exercises: filteredExercises,
          }
        );

        console.log("✅ Workout saved successfully:", response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentExerciseIndex < exercisesBox.length - 1) {
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
      setCurrentSetIndex(0); // Reset set index for new exercise
      setCurrentField("weight"); // Reset input field to 'weight' for new exercise
    } else {
      console.log("before saving");

      saveWorkout();
      console.log("after saving");
      // Reset everything when the last exercise is finished
      setExercisesBox([
        {
          id: 1,
          name: "Exercise",
          sets: [{ setNumber: 1, weight: 0, reps: 0, timer: 0 }],
        },
      ]); // Reset exercisesBox with empty sets

      setCurrentExerciseIndex(0);
      setCurrentSetIndex(0);
      setCurrentField("weight");
      setIsCreateWorkoutVisible(1);
      setIsNoteVisible(0);
      setIsStartVisible(0);
      setIsTimerVisible(0);
      setErrorLoading(0); // Reset error state if needed
      setError("");
    }
  };

  const moveToWorkout = () => {
    const selectedAllExercises = exercisesBox.filter(
      (exercise) => exercise.name !== "Exercise"
    );
    console.log(selectedAllExercises);
    if (selectedAllExercises.length > 0) {
      // Keep only selected exercises and reset everything else
      setExercisesBox(selectedAllExercises);
      setErrorLoading(0);
      setIsCreateWorkoutVisible(0);
      setIsNoteVisible(0);
      setIsStartVisible(1);
      setIsTimerVisible(0);
    } else {
      // Show error if no exercise is selected
      setErrorLoading(1);
      setError("Please select at least one exercise");
    }
  };

  // Toggle selection for a single exercise
  const toggleSelection = (exerciseName) => {
    setSelectedExercises(prev => ({
      ...prev,
      [exerciseName]: !prev[exerciseName]
    }));
  };

  const handleDone = () => {
    const selectedNames = Object.keys(selectedExercises).filter(name => selectedExercises[name]);
    
    if (selectedNames.length === 0) {
      Alert.alert("กรุณาเลือกการออกกำลังกาย", "โปรดเลือกการออกกำลังกายอย่างน้อย 1 รายการ");
      return;
    }
    
    if (selectedNames.length === 1) {
      handleSelectOneExercise(selectedNames[0]);
    } else {
      handleSelectMultiExercise(selectedNames);
    }
    
    // Reset selections after adding
    setSelectedExercises({});
    
    // เปลี่ยนหน้าไปยังหน้า Note
    setIsModalStartVisible(false);
    setIsCreateWorkoutVisible(false);
    setIsNoteVisible(true);
  };

  return (
    <View style={[NoteScreenStyle.container]}>
      <Header />
      {isStartCreateWorkoutVisible ? (
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Image
            source={require("../assets/images/fitness-dumbell.png")}
            style={{ width: 150, height: 150, bottom: 20 }}
          ></Image>
          <Text style={NoteScreenStyle.title}>Create your note workout</Text>
          <Text style={NoteScreenStyle.subtitle}>
            Set up your own unique routine
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              { width: "50%", borderRadius: 30, marginTop: 20 },
            ]}
            onPress={() => setIsModalStartVisible(true)}
          >
            <Text style={styles.buttonText}>Start +</Text>
          </TouchableOpacity>
          <Modal
            visible={isModalStartVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={[NoteScreenStyle.box_modal]}>
              <View style={[NoteScreenStyle.inside_box_modal]}>
                <IconFontAwesome5
                  name={"dumbbell"}
                  size={50}
                  color={colors.clr_lightgray}
                  style={[NoteScreenStyle.dumbbell_top]}
                />
                <IconFontAwesome5
                  name={"dumbbell"}
                  size={30}
                  color={colors.clr_lightgray}
                  style={[NoteScreenStyle.dumbbell_middle]}
                />
                <IconFontAwesome5
                  name={"dumbbell"}
                  size={55}
                  color={colors.clr_lightgray}
                  style={[NoteScreenStyle.dumbbell_bottom]}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={[NoteScreenStyle.modal_header_text_]}>
                    Add exercise
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      setIsModalStartVisible(false);
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
                <View style={NoteScreenStyle.searchbar}>
                  <Entypo
                    name="magnifying-glass"
                    size={20}
                    color={"gray"}
                    style={NoteScreenStyle.searchIcon}
                  ></Entypo>
                  <TextInput
                    placeholder="search"
                    style={NoteScreenStyle.searchbarInput}
                    value={searchQuery}
                    onChangeText={handleSearch}
                  ></TextInput>
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch("")}>
                      <Icon
                        name="times"
                        size={20}
                        color={"gray"}
                        style={NoteScreenStyle.clearIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                
                <CategoryButtons 
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />

                {loading ? (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <ActivityIndicator size="large" color={colors.clr_blue} />
                    <Text style={{ marginTop: 10, fontSize: 16, color: colors.clr_gray }}>กำลังโหลดรายการออกกำลังกาย...</Text>
                  </View>
                ) : getAvailableExercises().length === 0 ? (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <IconFontAwesome5 
                      name={"dumbbell"}
                      size={40}
                      color={colors.clr_gray}
                      style={{ marginBottom: 10 }}
                    />
                    <Text style={{ fontSize: 16, color: colors.clr_gray, textAlign: 'center' }}>
                      ไม่พบรายการออกกำลังกายที่คุณต้องการ
                    </Text>
                    <TouchableOpacity 
                      style={{ 
                        marginTop: 15,
                        padding: 10,
                        backgroundColor: colors.clr_blue,
                        borderRadius: 8 
                      }}
                      onPress={fetchExercise}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>ลองใหม่อีกครั้ง</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <FlatList
                    data={getAvailableExercises()}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.name || item.id || Math.random().toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => toggleSelection(item.name)}
                        style={[
                          NoteScreenStyle.exercisecard
                        ]}
                      >
                        <View style={styles.checkboxContainer}>
                          <CustomCheckbox
                            value={!!selectedExercises[item.name]}
                            setValue={() => toggleSelection(item.name)}
                          />
                        </View>

                        <View style={styles.exerciseCardWrapper}>
                          <ExerciseCard
                            name={item.name}
                            category={item.category}
                            picture={item.picture}
                          />
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}

                <TouchableOpacity
                  style={[
                    styles.buttonAuth,
                    {
                      paddingHorizontal: 1,
                      paddingVertical: 12,
                      marginTop: 10,
                      marginHorizontal: 60,
                    },
                  ]}
                  onPress={() => handleDone()}
                >
                  <Text style={styles.buttonText}>Done ➝</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
      {isNoteVisible ? (
        <View style={[styles.container]}>
          <View style={{}}>
            <Text style={[NoteScreenStyle.dateText]}>{currentDate}</Text>
            <TouchableOpacity
              style={[styles.button, { marginBottom: 16 }]}
              onPress={moveToWorkout}
            >
              <Text style={[styles.buttonText]}>Start</Text>
            </TouchableOpacity>
            {errorLoading ? (
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                  marginBottom: 12,
                  fontSize: sizes.size_base,
                }}
              >
                {" "}
                {error}
              </Text>
            ) : null}
          </View>

          <FlatList
            data={exercisesBox}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                key={item.id}
                style={{
                  marginTop: 10,
                  position: "relative",
                  width: "100%",
                }}
              >
                <View
                  style={[
                    NoteScreenStyle.input__section,
                    item.name !== "Exercise" && {
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
                        item.name !== "Exercise" && {
                          color: "#2E7D32",
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    position: "absolute",
                    right: 15,
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => handleAddExercise(item.id)}>
                    <AntDesign
                      name={
                        item.name === "Exercise" ? "pluscircle" : "closecircle"
                      }
                      size={24}
                      color={item.name === "Exercise" ? "#4CAF50" : "#E77339"}
                    />
                  </TouchableOpacity>
                </View>
                {item.name === "Exercise" && (
                  <View
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -4,
                      zIndex: 1,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleRemoveExercise(item.id)}
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
            )}
          />
          <Modal
            visible={isModalNoteVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={[NoteScreenStyle.box_modal]}>
              <View style={[NoteScreenStyle.inside_box_modal]}>
                <IconFontAwesome5
                  name={"dumbbell"}
                  size={50}
                  color={colors.clr_lightgray}
                  style={[NoteScreenStyle.dumbbell_top]}
                />
                <IconFontAwesome5
                  name={"dumbbell"}
                  size={30}
                  color={colors.clr_lightgray}
                  style={[NoteScreenStyle.dumbbell_middle]}
                />
                <IconFontAwesome5
                  name={"dumbbell"}
                  size={55}
                  color={colors.clr_lightgray}
                  style={[NoteScreenStyle.dumbbell_bottom]}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={[NoteScreenStyle.modal_header_text_]}>
                    Add exercise
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      setIsModalNoteVisible(false);
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
                <View style={NoteScreenStyle.searchbar}>
                  <Entypo
                    name="magnifying-glass"
                    size={20}
                    color={"gray"}
                    style={NoteScreenStyle.searchIcon}
                  ></Entypo>
                  <TextInput
                    placeholder="search"
                    style={NoteScreenStyle.searchbarInput}
                    value={searchQuery}
                    onChangeText={handleSearch}
                  ></TextInput>
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch("")}>
                      <Icon
                        name="times"
                        size={20}
                        color={"gray"}
                        style={NoteScreenStyle.clearIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                
                <CategoryButtons 
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />

                <FlatList
                  data={getAvailableExercises()}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectOneExercise(item.name)}
                      style={[
                        NoteScreenStyle.exercisecard
                      ]}
                    >
                      <View style={styles.checkboxContainer}>
                        <CustomCheckbox
                          value={!!selectedExercises[item.name]}
                          setValue={() => toggleSelection(item.name)}
                        />
                      </View>

                      <View style={styles.exerciseCardWrapper}>
                        <ExerciseCard
                          name={item.name}
                          category={item.category}
                          picture={item.picture}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                />
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
        </View>
      ) : null}
      {isStartVisible ? (
        <View style={styles.container}>
          <View style={NoteScreenStyle.userExerciseDisplay}>
            {/* <Image
                source={require("../assets/images/Welcomimage.png")}
                style={{ width: 100, height: 100 }}
              /> */}

            <Text style={NoteScreenStyle.exerciseHeader}>
              {exercisesBox[currentExerciseIndex].name}
            </Text>
          </View>

          <View
            style={[NoteScreenStyle.userWorkoutTrackInput, { marginTop: 10 }]}
          >
            <Text style={{ fontWeight: "bold", fontSize: sizes.size_base }}>
              {columnTitles[currentField]}
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
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    const current = parseInt(inputValue) || 0;
                    if (current > 0) setInputValue(String(current - 1));
                  }}
                >
                  <AntDesign name="minuscircle" size={20} color="#E77339" />
                </TouchableOpacity>

                <TextInput
                  placeholder={columnPlaceholder[currentField]}
                  keyboardType="numeric"
                  value={inputValue}
                  onChangeText={setInputValue}
                  style={{
                    textAlign: "center",
                    fontSize: sizes.size_base,
                    color: colors.clr_black,
                    width: 100,
                    height: 40,
                    marginHorizontal: 20,
                  }}
                  maxLength={4}
                />

                <TouchableOpacity
                  onPress={() => {
                    const current = parseInt(inputValue) || 0;
                    setInputValue(String(current + 1));
                  }}
                >
                  <AntDesign name="pluscircle" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.clr_gray,
                  width: "30%",
                }}
              ></View>
              {errorLoading ? (
                <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
              ) : null}
              <TouchableOpacity
                style={NoteScreenStyle.continueButton}
                onPress={handleConfirm}
              >
                <Text style={[NoteScreenStyle.buttonText]}>Confirm</Text>
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
            data={exercisesBox[currentExerciseIndex].sets}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.setNumber}
            renderItem={({ item }) => (
              <View style={NoteScreenStyle.row}>
                <Text style={NoteScreenStyle.cell}>
                  {item.setNumber || "-"}
                </Text>
                <Text style={NoteScreenStyle.cell}>{item.weight || "-"}</Text>
                <Text style={NoteScreenStyle.cell}>{item.reps || "-"}</Text>
                <Text style={NoteScreenStyle.cell}>{item.timer || "-"}</Text>
              </View>
            )}
          />

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={NoteScreenStyle.nextButton}
              onPress={moveToNextExercise}
            >
              <Text style={NoteScreenStyle.buttonText}>
                {currentExerciseIndex < exercisesBox.length - 1
                  ? "Next exercise ➝"
                  : "Finish"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {isTimerVisible ? (
        <View style={styles.container}>
          <CircularTimer
            duration={timerDuration}
            setNextExercise={moveToWorkout}
          />
        </View>
      ) : null}
    </View>
  );
}
