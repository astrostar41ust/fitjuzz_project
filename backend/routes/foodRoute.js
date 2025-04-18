const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');


router.get('/', foodController.getAllFoods);
router.get('/id/:id', foodController.getFoodById);
router.get('/category/:category', foodController.getFoodsByCategory);
router.get('/search', foodController.searchFoodByName);
router.get('/categories', foodController.getAllCategories);
router.get('/nutrition', foodController.searchByNutrition);

router.post('/create', foodController.createFood);
router.put('/update/:id', foodController.updateFood);
router.delete('/delete/:id', foodController.deleteFood);

module.exports = router; 