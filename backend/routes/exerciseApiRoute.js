const express = require('express');
const router = express.Router();
const exerciseApiController = require('../controllers/exerciseApiController');

// get all exercises
router.get('/exercises', exerciseApiController.getAllExercises);

// get exercise by id
router.get('/exercises/exercise/:id', exerciseApiController.getExerciseById);

// get exercise by id for app
router.get('/exercises/getExerciseByIdFromAPI/:id', exerciseApiController.getExerciseById);

// get exercise by name
router.get('/exercises/name/:name', exerciseApiController.getExerciseByName);

// get body part list
router.get('/exercises/bodyPartList', exerciseApiController.getBodyPartList);

// get exercise by body part
router.get('/exercises/bodyPart/:bodyPart', exerciseApiController.getExercisesByBodyPart);

// get equipment list
router.get('/exercises/equipmentList', exerciseApiController.getEquipmentList);

// get exercise by equipment
router.get('/exercises/equipment/:equipment', exerciseApiController.getExercisesByEquipment);

// get target list
router.get('/exercises/targetList', exerciseApiController.getTargetList);

// get exercise by target
router.get('/exercises/target/:target', exerciseApiController.getExercisesByTarget);

// get all exercises for app
router.get('/exercises/getExercisesFromAPI', exerciseApiController.getExercisesForApp);

// get popular fitness exercises
router.get('/exercises/getPopularFitnessExercises', exerciseApiController.getPopularFitnessExercises);

module.exports = router; 