const express = require('express');
const router = express.Router();
const foodDirectController = require('../controllers/foodDirectController');


router.get('/carb', foodDirectController.getAllCarbFoods);
router.get('/protein', foodDirectController.getAllProteinFoods);
router.get('/fat', foodDirectController.getAllFatFoods);
router.get('/:type/id/:id', foodDirectController.getFoodById);

module.exports = router; 