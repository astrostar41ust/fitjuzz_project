import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { SectionList } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Header from "../../components/Header";
import ExerciseScreenStyle from "../../styles/components/ExerciseScreenStyle";
import ExerciseDetailsModal from "../../components/ExerciseDetailsModal";
import Constants from "expo-constants";
import styles from "../../styles/style";
import { useFocusEffect } from "@react-navigation/native";
const EXPO_PUBLIC_ENDPOINT_API =
  Constants.expoConfig.extra.EXPO_PUBLIC_ENDPOINT_API;

export default function ExerciseScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const categories = [
    "All",
    "Chest",
    "Back",
    "Legs",
    "Abs",
    "Arms",
    "Shoulders",
    "Cardio",
  ];

  const openExerciseDetails = (exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const closeExerciseDetails = () => {
    setModalVisible(false);
    setSelectedExercise(null); // Clear the selected exercise data when closing
  };

  useEffect(() => {
    filterExercises();
  }, [selectedCategory, searchQuery, exercises]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${EXPO_PUBLIC_ENDPOINT_API}/api/user/getExercises`
      );

      setExercises(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching exercises:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        setError(
          `Unable to fetch exercises (${err.response.status}): ${JSON.stringify(
            err.response.data
          )}`
        );
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError(
          "Network error: No response from server. Check your connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error config:", err.config);
        setError(`Error: ${err.message}`);
      }
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = [...exercises];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (exercise) =>
          exercise.bodyPart.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  };

  // Group exercises by first letter
  const groupExercisesByFirstLetter = () => {
    const groups = {};

    filteredExercises.forEach((exercise) => {
      const firstLetter = exercise.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(exercise);
    });

    return Object.keys(groups)
      .sort()
      .map((letter) => ({
        title: letter, // <-- for SectionList header
        data: groups[letter], // <-- for SectionList data array
      }));
  };
  const exerciseGroups = groupExercisesByFirstLetter();

  return (
    <View style={[ExerciseScreenStyle.container]}>
      {/* <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity> */}
      <View style={[ExerciseScreenStyle.content]}>
        <View style={ExerciseScreenStyle.searchSection}>
          <View style={ExerciseScreenStyle.searchBar}>
            <TextInput
              style={ExerciseScreenStyle.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons
              name="search"
              size={20}
              color="gray"
              style={ExerciseScreenStyle.searchIcon}
            />
          </View>
        </View>

        <View style={ExerciseScreenStyle.categoriesWrapper}>
          <View style={ExerciseScreenStyle.categoriesRow}>
            {categories.slice(0, 5).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  ExerciseScreenStyle.categoryButton,
                  selectedCategory === category &&
                    ExerciseScreenStyle.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    ExerciseScreenStyle.categoryText,
                    selectedCategory === category &&
                      ExerciseScreenStyle.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={[
              ExerciseScreenStyle.categoriesRow,
              { justifyContent: "center" },
            ]}
          >
            {categories.slice(5).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  ExerciseScreenStyle.categoryButton,
                  selectedCategory === category &&
                    ExerciseScreenStyle.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    ExerciseScreenStyle.categoryText,
                    selectedCategory === category &&
                      ExerciseScreenStyle.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {loading ? (
          <Text style={ExerciseScreenStyle.loadingText}>Loading...</Text>
        ) : error ? (
          <Text style={ExerciseScreenStyle.errorText}>{error}</Text>
        ) : (
          <SectionList
            sections={exerciseGroups}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            style={ExerciseScreenStyle.exerciseList}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={ExerciseScreenStyle.sectionHeader}>{title}</Text>
            )}
            renderItem={({ item: exercise }) => (
              <TouchableOpacity
                style={ExerciseScreenStyle.exerciseItem}
                onPress={() => openExerciseDetails(exercise)}
              >
                <Image
                  source={{
                    uri:
                      exercise.gifUrl ||
                      "https://images.squarespace-cdn.com/content/v1/64c8035f53e9a56246c7c294/1723420893761-XYJVWOXL91SW5442P6RM/maxresdefault-29-1024x576.jpg",
                  }}
                  style={ExerciseScreenStyle.exerciseImage}
                />
                <View style={ExerciseScreenStyle.exerciseInfo}>
                  <Text style={ExerciseScreenStyle.exerciseName}>
                    {exercise.name}
                  </Text>
                  <Text style={ExerciseScreenStyle.exerciseCategory}>
                    {exercise.bodyPart.charAt(0).toUpperCase() +
                      exercise.bodyPart.slice(1)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={ExerciseScreenStyle.infoButton}
                  onPress={() => openExerciseDetails(exercise)}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ListFooterComponent={<View style={{ height: 20 }} />}
          />
        )}
      </View>

      {modalVisible && selectedExercise && (
        <ExerciseDetailsModal
          visible={modalVisible}
          exercise={selectedExercise}
          onClose={closeExerciseDetails}
        />
      )}
    </View>
  );
}
