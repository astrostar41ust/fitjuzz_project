const foodService = require('../services/foodService');

/**
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getFoodsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    console.log(`Fetching ${type} foods (page: ${page}, limit: ${limit})`);
    
    // call service
    const result = await foodService.getFoodsByType(type, page, limit);
    
    res.status(200).json({
      success: true,
      foods: result.foods,
      pagination: result.pagination
    });
  } catch (error) {
    console.error(`Error in getFoodsByType controller for type ${req.params.type}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error fetching food by type',
      error: error.message
    });
  }
};

/**
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getFoodByTypeAndId = async (req, res) => {
  try {
    const { type, id } = req.params;
    
    console.log(`Fetching ${type} food by ID: ${id}`);
    
    // call service
    const food = await foodService.getFoodByTypeAndId(type, id);
    
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
    console.error(`Error in getFoodByTypeAndId controller for type ${req.params.type}, ID ${req.params.id}: ${error.message}`);
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
const searchFoodsByTypeAndName = async (req, res) => {
  try {
    const { type } = req.params;
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'error searching food by name'
      });
    }
    
    console.log(`Searching ${type} foods by name: ${query} (page: ${page}, limit: ${limit})`);
    
    // call service
    const result = await foodService.searchFoodsByTypeAndName(type, query, page, limit);
    
    res.status(200).json({
      success: true,
      foods: result.foods,
      pagination: result.pagination
    });
  } catch (error) {
    console.error(`Error in searchFoodsByTypeAndName controller for type ${req.params.type}: ${error.message}`);
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
const searchFoodsByTypeAndNutrition = async (req, res) => {
  try {
    const { type } = req.params;
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
    
    console.log(`Searching ${type} foods by nutrition criteria (page: ${page}, limit: ${limit})`);
    
    // call service
    const result = await foodService.searchFoodsByTypeAndNutrition(type, criteria, page, limit);
    
    res.status(200).json({
      success: true,
      foods: result.foods,
      pagination: result.pagination
    });
  } catch (error) {
    console.error(`Error in searchFoodsByTypeAndNutrition controller for type ${req.params.type}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error searching food by nutrition',
      error: error.message
    });
  }
};

module.exports = {
  getFoodsByType,
  getFoodByTypeAndId,
  searchFoodsByTypeAndName,
  searchFoodsByTypeAndNutrition
}; 