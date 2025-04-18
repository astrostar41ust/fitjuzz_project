const express = require('express');
const router = express.Router();
const foodTypeController = require('../controllers/foodTypeController');

router.get('/:type', foodTypeController.getFoodsByType);
router.get('/:type/id/:id', foodTypeController.getFoodByTypeAndId);
router.get('/:type/search', foodTypeController.searchFoodsByTypeAndName);
router.get('/:type/nutrition', foodTypeController.searchFoodsByTypeAndNutrition);

module.exports = router; 