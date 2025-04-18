const Food = require('../models/foodModel');
const foodService = require('../services/foodService');

/**
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getAllFoods = async (req, res) => {
  try {
    // Request query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    console.log(`Fetching all foods (page: ${page}, limit: ${limit})`);
    
    // call service
    const result = await foodService.getAllFoods(page, limit);
    
    res.status(200).json({
      success: true,
      foods: result.foods,
      pagination: result.pagination
    });
  } catch (error) {
    console.error(`Error in getAllFoods controller: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error fetching all foods',
      error: error.message
    });
  }
};

/**
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Fetching food by ID: ${id}`);
    
    // call service
    const food = await foodService.getFoodById(id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'error fetching food by ID'
      });
    }
    
    res.status(200).json({
      success: true,
      food
    });
  } catch (error) {
    console.error(`Error in getFoodById controller for ID ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error fetching food by ID',
      error: error.message
    });
  }
};

/**
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getFoodsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    console.log(`Fetching foods by category: ${category} (page: ${page}, limit: ${limit})`);
    
    // call service
    const result = await foodService.getFoodsByCategory(category, page, limit);
    
    res.status(200).json({
      success: true,
      foods: result.foods,
      pagination: result.pagination
    });
  } catch (error) {
    console.error(`Error in getFoodsByCategory controller for category ${req.params.category}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error fetching food by category',
      error: error.message
    });
  }
};

/**
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const searchFoodByName = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'error searching food by name'
      });
    }
    
    console.log(`Searching foods by name: ${query} (page: ${page}, limit: ${limit})`);
    
    // call service
    const result = await foodService.searchFoodsByName(query, page, limit);
    
    res.status(200).json({
      success: true,
      foods: result.foods,
      pagination: result.pagination
    });
  } catch (error) {
    console.error(`Error in searchFoodByName controller: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error searching food by name',
      error: error.message
    });
  }
};

/**
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getAllCategories = async (req, res) => {
  try {
    console.log('Fetching all food categories');
    
    // call service
    const categories = await foodService.getAllCategories();
    
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error(`Error in getAllCategories controller: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error fetching all categories',
      error: error.message
    });
  }
};

/**
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const searchByNutrition = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // get criteria from query parameters
    const criteria = {
      minCalories: req.query.minCalories,
      maxCalories: req.query.maxCalories,
      minProtein: req.query.minProtein,
      maxProtein: req.query.maxProtein,
      minCarbohydrates: req.query.minCarbohydrates,
      maxCarbohydrates: req.query.maxCarbohydrates,
      minFat: req.query.minFat,
      maxFat: req.query.maxFat,
      minFiber: req.query.minFiber,
      maxFiber: req.query.maxFiber,
      minSugar: req.query.minSugar,
      maxSugar: req.query.maxSugar
    };
    
    console.log(`Searching foods by nutrition criteria (page: ${page}, limit: ${limit})`);
    
    // call service
    const result = await foodService.searchFoodsByNutrition(criteria, page, limit);
    
    res.status(200).json({
      success: true,
      foods: result.foods,
      pagination: result.pagination
    });
  } catch (error) {
    console.error(`Error in searchByNutrition controller: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error searching food by nutrition',
      error: error.message
    });
  }
};

/**
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createFood = async (req, res) => {
  try {
    const foodData = req.body;
    
    // check required data
    if (!foodData.name) {
      return res.status(400).json({
        success: false,
        message: 'error creating food'
      });
    }
    
    console.log(`Creating new food entry: ${foodData.name}`);
    
    // call service
    const newFood = await foodService.createFood(foodData);
    
    res.status(201).json({
      success: true,
      message: 'success creating food',
      food: newFood
    });
  } catch (error) {
    console.error(`Error in createFood controller: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error creating food',
      error: error.message
    });
  }
};

/**
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`Updating food with ID: ${id}`);
    
    // call service
    const updatedFood = await foodService.updateFood(id, updateData);
    
    if (!updatedFood) {
      return res.status(404).json({
        success: false,
        message: 'error updating food'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'success updating food',
      food: updatedFood
    });
  } catch (error) {
    console.error(`Error in updateFood controller for ID ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error updating food',
      error: error.message
    });
  }
};

/**
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Deleting food with ID: ${id}`);
    
    // call service
    const deletedFood = await foodService.deleteFood(id);
    
    if (!deletedFood) {
      return res.status(404).json({
        success: false,
        message: 'error deleting food'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'success deleting food',
      food: deletedFood
    });
  } catch (error) {
    console.error(`Error in deleteFood controller for ID ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error deleting food',
      error: error.message
    });
  }
};

module.exports = {
  getAllFoods,
  getFoodById,
  getFoodsByCategory,
  searchFoodByName,
  getAllCategories,
  searchByNutrition,
  createFood,
  updateFood,
  deleteFood
}; 