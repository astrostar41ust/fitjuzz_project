import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../styles/style";
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const ExerciseDetailsModal = ({ visible, exercise, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (visible && exercise) {
      // Data may come from RapidAPI or original database
      // No need to call API again as we already have data from openExerciseDetails
      setDetails(exercise);
    }
  }, [visible, exercise]);

  // Edit fetchExerciseDetails function to use only when additional data is needed
  const fetchExerciseDetails = async (exerciseId) => {
    if (!exerciseId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching additional exercise details...');
      console.log('Exercise ID:', exerciseId);
      console.log('API URL:', `${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/getExerciseDetails/${exerciseId}`);
      
      // Call original API only when necessary
      const response = await axios.get(`${process.env.EXPO_PUBLIC_ENDPOINT_API}/api/user/getExerciseDetails/${exerciseId}`);
      console.log('Received additional data:', response.data);
      
      // Merge data from API with existing data
      setDetails({...exercise, ...response.data});
      setLoading(false);
    } catch (err) {
      console.error('Error fetching additional exercise details:', err);
      // In case of error, use existing data
      setDetails(exercise);
      setLoading(false);
    }
  };

  const retry = () => {
    if (exercise && exercise._id) {
      fetchExerciseDetails(exercise._id);
    }
  };

  // Define default muscle data if no data from API
  const defaultMusclesWorked = {
    'chest': {
      primary: ['Chest muscles', 'Shoulders'],
      secondary: ['Triceps', 'Mid-arm']
    },
    'back': {
      primary: ['Upper back', 'Scapula'],
      secondary: ['Biceps', 'Lower back']
    },
    'shoulders': {
      primary: ['Shoulder muscles'],
      secondary: ['Scapula', 'Triceps']
    },
    'arms': {
      primary: ['Biceps', 'Triceps'],
      secondary: ['Forearms', 'Shoulders']
    },
    'legs': {
      primary: ['Quadriceps', 'Hamstrings', 'Glutes'],
      secondary: ['Calves', 'Lower back']
    },
    'core': {
      primary: ['Central abdominals', 'Obliques'],
      secondary: ['Deep abdominals', 'Lower back']
    },
    'abs': {
      primary: ['Central abdominals', 'Obliques'],
      secondary: ['Deep abdominals', 'Lower back']
    },
    'cardio': {
      primary: ['Cardiovascular system'],
      secondary: ['Legs', 'Core']
    },
    'full body': {
      primary: ['Full body', 'Multiple muscles'],
      secondary: ['Cardiovascular system']
    },
    'lower arms': {
      primary: ['Forearms', 'Wrists'],
      secondary: ['Biceps']
    },
    'lower legs': {
      primary: ['Calves', 'Ankles'],
      secondary: ['Thighs']
    },
    'neck': {
      primary: ['Neck muscles'],
      secondary: ['Shoulders', 'Upper back']
    },
    'upper arms': {
      primary: ['Biceps', 'Triceps'],
      secondary: ['Shoulders', 'Forearms']
    },
    'upper legs': {
      primary: ['Quadriceps', 'Hamstrings'],
      secondary: ['Glutes', 'Core']
    },
    'waist': {
      primary: ['Central abdominals', 'Obliques'],
      secondary: ['Lower back', 'Glutes']
    }
  };

  // If no muscle data from API, use default data based on category
  const getMusclesWorked = () => {
    // For data from RapidAPI
    if (exercise?.target || exercise?.secondaryMuscles) {
      const primary = exercise.target ? [exercise.target] : [];
      const secondary = Array.isArray(exercise.secondaryMuscles) 
        ? exercise.secondaryMuscles 
        : [];
      
      return {
        primary,
        secondary
      };
    }
    
    // For data from original API
    if (details && details.targetMuscles) {
      // If targetMuscles is an object with primary, secondary
      if (typeof details.targetMuscles === 'object' && details.targetMuscles.primary) {
        return details.targetMuscles;
      }
      
      // If targetMuscles is a string, convert to object
      if (typeof details.targetMuscles === 'string') {
        // Split text using , and put data in primary
        const muscleList = details.targetMuscles.split(',').map(m => m.trim());
        return {
          primary: muscleList.slice(0, Math.ceil(muscleList.length / 2)),
          secondary: muscleList.slice(Math.ceil(muscleList.length / 2))
        };
      }
    }
    
    // Check if there might be other property names
    if (details && details.muscles) {
      return details.muscles;
    }
    
    const category = exercise?.category?.toLowerCase() || 'chest';
    return defaultMusclesWorked[category] || defaultMusclesWorked['chest'];
  };
  
  // Function to get muscle image URL based on category
  const getMuscleImageUrl = () => {
    // Use muscleImageUrl or muscleImage from details first
    if (details && details.muscleImageUrl) {
      return details.muscleImageUrl;
    }
    
    if (details && details.muscleImage) {
      return details.muscleImage;
    }
    
    // If no data from details, use image by muscle type
    const muscleImages = {
      'chest': 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2',
      'back': 'https://images.unsplash.com/photo-1600677396660-e090697d7638',
      'shoulders': 'https://images.unsplash.com/photo-1598971639058-bb1962a42cd6',
      'arms': 'https://images.unsplash.com/photo-1590507621108-433608c97823',
      'legs': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798',
      'abs': 'https://images.unsplash.com/photo-1577221084712-45b0445d2b00',
      'core': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      'cardio': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c',
      'full body': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2',
      'lower arms': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e',
      'lower legs': 'https://images.unsplash.com/photo-1562771379-eafdca7a02f8',
      'neck': 'https://images.unsplash.com/photo-1607332292242-77fd37e70aee',
      'upper arms': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61',
      'upper legs': 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a',
      'waist': 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955'
    };
    
    const category = exercise?.category?.toLowerCase() || 'chest';
    return muscleImages[category] || muscleImages['chest'];
  };

  // Exercise instruction steps
  const getInstructions = () => {
    // Check data from RapidAPI first
    if (exercise?.instructions && Array.isArray(exercise.instructions)) {
      return exercise.instructions;
    }
    
    // Check data from original database
    if (details?.steps && Array.isArray(details.steps)) {
      return details.steps;
    } else if (details?.howTo && Array.isArray(details.howTo)) {
      return details.howTo;
    } else {
      return [
        "Start with a stable standing or sitting position",
        "Position yourself correctly according to the exercise you want to do",
        "Perform the exercise with proper form, being careful not to get injured",
        "Repeat for the desired number of reps in each set",
        "Rest between sets for about 30-60 seconds before proceeding to the next set"
      ];
    }
  };

  // Render slide items (exercise image and muscle image)
  const renderImageItem = ({ item, index }) => {
    let imageUrl;
    
    if (index === 0) {
      // For exercise image
      imageUrl = exercise?.gifUrl || exercise?.picture || details?.picture1 || getDefaultImageByCategory();
    } else {
      // For muscle image
      imageUrl = details?.picture2 || getMuscleImageUrl();
    }
    
    return (
      <View style={[styles.slideItemContainer]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.slideImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  // Default image for first page by category
  const getDefaultImageByCategory = () => {
    const defaultImages = {
      'chest': 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955',
      'back': 'https://images.unsplash.com/photo-1594381898411-846e7d193883',
      'shoulders': 'https://images.unsplash.com/photo-1581122584612-713f89daa8eb',
      'arms': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61',
      'legs': 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a',
      'core': 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955',
      'abs': 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955',
      'cardio': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c',
      'full body': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2',
      'lower arms': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61',
      'lower legs': 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a',
      'neck': 'https://images.unsplash.com/photo-1607332292242-77fd37e70aee',
      'upper arms': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61',
      'upper legs': 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a',
      'waist': 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955'
    };
    
    const category = exercise?.category?.toLowerCase() || 'chest';
    return defaultImages[category] || defaultImages['chest'];
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const slideWidth = width * 0.85 + 10; // width + marginHorizontal
    const index = Math.round(offsetX / slideWidth);
    setCurrentIndex(index);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" />
      
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackground}>
            <BlurView 
              intensity={Platform.OS === 'ios' ? 100 : 140} 
              tint="dark"
              style={{...StyleSheet.absoluteFillObject}}
            />
          </View>
        </TouchableWithoutFeedback>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.clr_brightblue} />
              <Text style={styles.loadingText}>Loading data...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={retry}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Exercise Name */}
              <View style={styles.titleContainer}>
                <Text style={styles.exerciseName}>{exercise?.name || 'Exercise'}</Text>
              </View>
              
              {/* Image Carousel */}
              <View style={styles.imageCard}>
                <FlatList
                  ref={flatListRef}
                  data={[1, 2]} // 2 images: exercise image and muscle image
                  renderItem={renderImageItem}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  snapToInterval={width * 0.85 + 10}
                  decelerationRate="fast"
                  onMomentumScrollEnd={handleScroll}
                  style={styles.carousel}
                  contentContainerStyle={{ paddingRight: 10 }}
                  bounces={false}
                  ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                />
              </View>
              
              {/* Pagination dots */}
              <View style={styles.paginationContainer}>
                <View style={[styles.dot, { backgroundColor: currentIndex === 0 ? '#3366FF' : '#D3D3D3' }]} />
                <View style={[styles.dot, { backgroundColor: currentIndex === 1 ? '#3366FF' : '#D3D3D3' }]} />
              </View>

              {/* Muscles Worked Card */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Muscles worked</Text>
                <View style={styles.musclesContainer}>
                  <View style={styles.muscleColumn}>
                    <Text style={styles.muscleColumnTitle}>Primary</Text>
                    {Array.isArray(getMusclesWorked().primary) ? (
                      getMusclesWorked().primary.map((muscle, index) => (
                        <Text key={index} style={styles.muscleText}>{muscle}</Text>
                      ))
                    ) : (
                      <Text style={styles.muscleText}>{getMusclesWorked().primary}</Text>
                    )}
                  </View>
                  
                  <View style={styles.muscleColumn}>
                    <Text style={styles.muscleColumnTitle}>Secondary</Text>
                    {Array.isArray(getMusclesWorked().secondary) ? (
                      getMusclesWorked().secondary.map((muscle, index) => (
                        <Text key={index} style={styles.muscleText}>{muscle}</Text>
                      ))
                    ) : (
                      <Text style={styles.muscleText}>{getMusclesWorked().secondary}</Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Instructions Card */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Instructions</Text>
                <View style={styles.instructionsContainer}>
                  {getInstructions().map((step, index) => (
                    <View key={index} style={styles.instructionStep}>
                      <Text style={styles.instructionText}>{index + 1}. {step}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 30, 60, 0.2)',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowEffect1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: '15%',
    left: '10%',
    backgroundColor: 'rgba(100, 100, 255, 0.12)',
    opacity: 0.85,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
  },
  glowEffect2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    bottom: '20%',
    right: '15%',
    backgroundColor: 'rgba(80, 80, 200, 0.1)',
    opacity: 0.85,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
  },
  glowEffect3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: '50%',
    left: '40%',
    backgroundColor: 'rgba(120, 120, 255, 0.08)',
    opacity: 0.7,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: '7.5%',
  },
  titleContainer: {
    marginBottom: 10,
    padding: 15,
    width: '100%',
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  imageCard: {
    backgroundColor: 'transparent',
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 25,
  },
  carousel: {
    width: '100%',
  },
  slideItemContainer: {
    height: width * 0.9,
    overflow: 'hidden',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    width: width * 0.85,
    marginHorizontal: 0,
  },
  slideImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 15,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: -20,
    marginBottom: 10,
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  musclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  muscleColumn: {
    flex: 1,
  },
  muscleColumnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  muscleText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 5,
  },
  instructionsContainer: {
  },
  instructionStep: {
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  loadingContainer: {
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.clr_brightblue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
  },
  topEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  glowingLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  bottomGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default ExerciseDetailsModal; 