const exerciseApiService = require('../services/exerciseApiService');

const transformExerciseData = (exercise) => {
  const categoryMap = {
    'back': 'Back',        
    'cardio': 'Cardio',    
    'chest': 'Chest',      
    'lower arms': 'Arms',  
    'upper arms': 'Arms',  
    'lower legs': 'Leg',   
    'upper legs': 'Leg',   
    'neck': 'Shoulders',   
    'shoulders': 'Shoulders', 
    'waist': 'ABS'
  };

  // for Glutes
  let category = categoryMap[exercise.bodyPart] || 'Other';
  
  
  const targetLower = exercise.target ? exercise.target.toLowerCase() : '';
  const nameLower = exercise.name ? exercise.name.toLowerCase() : '';
  
  if (targetLower.includes('glut') || 
      nameLower.includes('glut') || 
      nameLower.includes('hip') || 
      nameLower.includes('butt')) {
    category = 'Glutes';
  }

  return {
    _id: exercise.id,
    name: exercise.name,
    description: exercise.instructions ? exercise.instructions.join(' ') : 'No description available',
    category: category,
    picture: exercise.gifUrl,
    target: exercise.target,
    secondaryMuscles: exercise.secondaryMuscles || [],
    instructions: exercise.instructions || [],
    equipment: exercise.equipment
  };
};

const exerciseApiController = {
  // get all exercises
  getAllExercises: async (req, res) => {
    try {
      const exercises = await exerciseApiService.getAllExercises();
      const transformedExercises = exercises.map(transformExerciseData);
      res.json(transformedExercises);
    } catch (error) {
      console.error('Error in getAllExercises controller:', error);
      res.status(500).json({ message: 'Error fetching exercises' });
    }
  },

  // get exercise by id
  getExerciseById: async (req, res) => {
    try {
      const { id } = req.params;
      const exercise = await exerciseApiService.getExerciseById(id);
      const transformedExercise = transformExerciseData(exercise);
      res.json(transformedExercise);
    } catch (error) {
      console.error('Error in getExerciseById controller:', error);
      res.status(500).json({ message: 'Error fetching exercise details' });
    }
  },

  // get exercise by name
  getExerciseByName: async (req, res) => {
    try {
      const { name } = req.params;
      const exercises = await exerciseApiService.getExerciseByName(name);
      const transformedExercises = exercises.map(transformExerciseData);
      res.json(transformedExercises);
    } catch (error) {
      console.error('Error in getExerciseByName controller:', error);
      res.status(500).json({ message: 'Error fetching exercises by name' });
    }
  },

  // get body part list
  getBodyPartList: async (req, res) => {
    try {
      const bodyParts = await exerciseApiService.getBodyPartList();
      res.json(bodyParts);
    } catch (error) {
      console.error('Error in getBodyPartList controller:', error);
      res.status(500).json({ message: 'Error fetching body parts list' });
    }
  },

  // get exercise by body part
  getExercisesByBodyPart: async (req, res) => {
    try {
      const { bodyPart } = req.params;
      const exercises = await exerciseApiService.getExercisesByBodyPart(bodyPart);
      const transformedExercises = exercises.map(transformExerciseData);
      res.json(transformedExercises);
    } catch (error) {
      console.error('Error in getExercisesByBodyPart controller:', error);
      res.status(500).json({ message: 'Error fetching exercises by body part' });
    }
  },

  // get equipment list
  getEquipmentList: async (req, res) => {
    try {
      const equipmentList = await exerciseApiService.getEquipmentList();
      res.json(equipmentList);
    } catch (error) {
      console.error('Error in getEquipmentList controller:', error);
      res.status(500).json({ message: 'Error fetching equipment list' });
    }
  },

  // get exercise by equipment
  getExercisesByEquipment: async (req, res) => {
    try {
      const { equipment } = req.params;
      const exercises = await exerciseApiService.getExercisesByEquipment(equipment);
      const transformedExercises = exercises.map(transformExerciseData);
      res.json(transformedExercises);
    } catch (error) {
      console.error('Error in getExercisesByEquipment controller:', error);
      res.status(500).json({ message: 'Error fetching exercises by equipment' });
    }
  },

  // get target list
  getTargetList: async (req, res) => {
    try {
      const targetList = await exerciseApiService.getTargetList();
      res.json(targetList);
    } catch (error) {
      console.error('Error in getTargetList controller:', error);
      res.status(500).json({ message: 'Error fetching target list' });
    }
  },

  // get exercise by target
  getExercisesByTarget: async (req, res) => {
    try {
      const { target } = req.params;
      const exercises = await exerciseApiService.getExercisesByTarget(target);
      const transformedExercises = exercises.map(transformExerciseData);
      res.json(transformedExercises);
    } catch (error) {
      console.error('Error in getExercisesByTarget controller:', error);
      res.status(500).json({ message: 'Error fetching exercises by target' });
    }
  },
  
  // get all exercises for app
  getExercisesForApp: async (req, res) => {
    try {
      // get all exercises from API
      const exercises = await exerciseApiService.getAllExercises();
      
      // transform data to format used in our app
      const transformedExercises = exercises.map(transformExerciseData);
      
      console.log(`API returned ${transformedExercises.length} exercises successfully.`);
      res.json(transformedExercises);
    } catch (error) {
      console.error('Error in getExercisesForApp controller:', error);
      res.status(500).json({ message: 'Error fetching exercises from API' });
    }
  },

  // get popular fitness exercises
  getPopularFitnessExercises: async (req, res) => {
    try {
      // get all exercises from API (use getAllExercisesNoLimit to get more exercises)
      const exercises = await exerciseApiService.getAllExercisesNoLimit();
      console.log(`API returned ${exercises.length} exercises successfully.`);
      
      // 1. transform all data first to get correct categories
      const transformedExercises = exercises.map(transformExerciseData);
      
      // 2. group exercises by category
      const categorizedExercises = {};
      
      // prepare all categories we want
      const desiredCategories = ['Chest', 'Back', 'Leg', 'ABS', 'Arms', 'Shoulders', 'Glutes', 'Cardio'];
      
      // create object to store exercises by category
      desiredCategories.forEach(category => {
        categorizedExercises[category] = [];
      });
      
      // group exercises by category
      transformedExercises.forEach(exercise => {
        if (exercise.category && desiredCategories.includes(exercise.category)) {
          categorizedExercises[exercise.category].push(exercise);
        }
      });
      
      
      let resultExercises = [];
      
      desiredCategories.forEach(category => {
        const exercisesInCategory = categorizedExercises[category] || [];
        console.log(`Category ${category}: Found ${exercisesInCategory.length} exercises`);
        
        resultExercises = [...resultExercises, ...exercisesInCategory];
      });
      
      console.log(`Returned ${resultExercises.length} exercises in fitness categories`);
      res.json(resultExercises);
    } catch (error) {
      console.error('Error in getPopularFitnessExercises controller:', error);
      res.status(500).json({ message: 'Error fetching popular exercises from API' });
    }
  }
};

module.exports = exerciseApiController; 