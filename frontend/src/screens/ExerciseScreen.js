import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Header from '../components/Header';
import ExerciseScreenStyle from '../styles/components/ExerciseScreenStyle';
import ExerciseDetailsModal from '../components/ExerciseDetailsModal';

export default function ExerciseScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const categories = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Leg', 'ABS', 'Cardio',];

  const openExerciseDetails = (exercise) => {
    fetchExerciseDetails(exercise);
  };

  const fetchExerciseDetails = async (exercise) => {
    const exerciseId = exercise.id || exercise._id;
    
    if (!exerciseId) {
      setSelectedExercise(exercise);
      setModalVisible(true);
      return;
    }
    
    try {
      setLoading(true);
      console.log(`Fetching exercise details ID: ${exerciseId}`);
      
      const apiUrl = `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/exercises/getExerciseByIdFromAPI/${exerciseId}`;
      console.log('API URL:', apiUrl);
      
      const response = await axios.get(apiUrl).catch(error => {
        console.log('Error occurred, using existing data instead:', error.message);
        return { data: exercise };
      });
      
      console.log('Exercise details data received');
      
      const detailedExercise = response.data || exercise;
      
      setSelectedExercise(detailedExercise);
      setModalVisible(true);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching exercise details:', err);
      setSelectedExercise(exercise);
      setModalVisible(true);
      setLoading(false);
    }
  };

  const closeExerciseDetails = () => {
    setModalVisible(false);
    setSelectedExercise(null); // Clear the selected exercise data when closing 
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [selectedCategory, searchQuery, exercises]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      console.log('Fetching popular fitness exercises from API...');
      
      const apiUrl = `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/exercises/getPopularFitnessExercises`;
      console.log('API URL:', apiUrl);
      
      const response = await axios.get(apiUrl);
      
      console.log(`Data fetched successfully! Found ${response.data.length} exercises`);
      if (response.data.length > 0) {
        console.log('Sample data:', response.data[0]);
      }
      
      setExercises(response.data);
      setLoading(false);
    } catch (err) {
      handleError(err, 'exercises');
    }
  };

  // if fetch error
  const handleError = (err, type) => {
    console.error(`Error fetching ${type}:`, err);
    if (err.response) {
      console.error('Error response data:', err.response.data);
      console.error('Error response status:', err.response.status);
      setError(`Unable to fetch ${type} (${err.response.status}): ${JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      console.error('No response received:', err.request);
      setError('Network error: No response from server. Check your connection.');
    } else {
      console.error('Error config:', err.config);
      setError(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  const filterExercises = () => {
    let filtered = [...exercises];
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        exercise => {
          // Check if category exists
          const exerciseCategory = exercise.category || '';
          return exerciseCategory.toLowerCase() === selectedCategory.toLowerCase();
        }
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        exercise => exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredExercises(filtered);
  };

  // Group exercises by first letter
  const groupExercisesByFirstLetter = () => {
    const groups = {};
    
    filteredExercises.forEach(exercise => {
      const firstLetter = exercise.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(exercise);
    });
    
    return Object.keys(groups).sort().map(letter => ({
      letter,
      exercises: groups[letter]
    }));
  };

  const exerciseGroups = groupExercisesByFirstLetter();

  const categoriesContainerStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 2,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center'
  };

  const exercisesContainerStyle = {
    paddingBottom: 20
  };

  return (
    <View style={ExerciseScreenStyle.container}>
      <View style={ExerciseScreenStyle.content}>
        <View style={ExerciseScreenStyle.searchSection}>
          <View style={ExerciseScreenStyle.searchBar}>
            <TextInput
              style={ExerciseScreenStyle.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search" size={20} color="gray" style={ExerciseScreenStyle.searchIcon} />
          </View>
        </View>

        {/* Display all categories */}
        <View style={ExerciseScreenStyle.categoriesWrapper}>
          <ScrollView 
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={categoriesContainerStyle}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  ExerciseScreenStyle.categoryButton,
                  selectedCategory === category && ExerciseScreenStyle.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text 
                  style={[
                    ExerciseScreenStyle.categoryText,
                    selectedCategory === category && ExerciseScreenStyle.categoryTextActive
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={ExerciseScreenStyle.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={ExerciseScreenStyle.loadingText}>Loading exercises...</Text>
          </View>
        ) : error ? (
          <Text style={ExerciseScreenStyle.errorText}>{error}</Text>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={exercisesContainerStyle}
          >
            {exerciseGroups.map(group => (
              <View key={group.letter}>
                <Text style={ExerciseScreenStyle.sectionHeader}>
                  {group.letter}
                </Text>
                {group.exercises.map(exercise => (
                  <TouchableOpacity 
                    key={exercise._id} 
                    style={ExerciseScreenStyle.exerciseItem}
                    onPress={() => openExerciseDetails(exercise)}
                  >
                    <Image 
                      source={{uri: exercise.picture || exercise.gifUrl || 'https://images.squarespace-cdn.com/content/v1/64c8035f53e9a56246c7c294/1723420893761-XYJVWOXL91SW5442P6RM/maxresdefault-29-1024x576.jpg'}} 
                      style={ExerciseScreenStyle.exerciseImage}
                    />
                    <View style={ExerciseScreenStyle.exerciseInfo}>
                      <Text style={ExerciseScreenStyle.exerciseName}>
                        {exercise.name}
                      </Text>
                      <Text style={ExerciseScreenStyle.exerciseCategory}>
                        {exercise.category || 'Other'}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={ExerciseScreenStyle.infoButton}
                      onPress={() => openExerciseDetails(exercise)}
                    >
                      <Ionicons name="information-circle-outline" size={24} color="white" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
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

