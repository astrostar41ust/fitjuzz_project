const CarbFood = require('../models/carbModel');
const ProteinFood = require('../models/proteinModel');
const FatFood = require('../models/fatModel');
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '../cache');
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const readFromCache = (cacheKey) => {
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.json`);
  
  try {
    if (fs.existsSync(cachePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      const now = new Date().getTime();
      
      if (now - cacheData.timestamp < CACHE_DURATION) {
        console.log(`[CACHE] use data from cache: ${cacheKey}`);
        return cacheData.data;
      } else {
        console.log(`[CACHE] cache expired: ${cacheKey}`);
      }
    }
  } catch (error) {
    console.error(`[CACHE] error reading cache ${cacheKey}:`, error);
  }
  
  return null;
};

const writeToCache = (cacheKey, data) => {
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.json`);
  
  try {
    const cacheData = {
      timestamp: new Date().getTime(),
      data: data
    };
    
    fs.writeFileSync(cachePath, JSON.stringify(cacheData));
    console.log(`[CACHE] save data to cache: ${cacheKey}`);
  } catch (error) {
    console.error(`[CACHE] error writing cache ${cacheKey}:`, error);
  }
};

const getFoodModelByType = (type) => {
  let model;
  switch (type.toLowerCase()) {
    case 'carb':
      model = CarbFood;
      console.log(`[DEBUG] use model CarbFood - collection: ${CarbFood.collection.name}`);
      break;
    case 'protein':
      model = ProteinFood;
      console.log(`[DEBUG] use model ProteinFood - collection: ${ProteinFood.collection.name}`);
      break;
    case 'fat':
      model = FatFood;
      console.log(`[DEBUG] use model FatFood - collection: ${FatFood.collection.name}`);
      break;
    default:
      model = CarbFood;
      console.log(`[DEBUG] use default model CarbFood - collection: ${CarbFood.collection.name}`);
  }
  return model;
};

/**
 * 
 * @param {string} type -  (carb, protein, fat)
 * @param {number} page - 
 * @param {number} limit - 
 * @returns {Promise} - 
 */
const getFoodsByType = async (type, page = 1, limit = 10) => {
  try {
    console.log('\n[FOOD SERVICE] fetching food by type:', type);
    
    const FoodModel = getFoodModelByType(type);
    console.log('[FOOD SERVICE] use model:', FoodModel.modelName);
    console.log('[FOOD SERVICE] collection name:', FoodModel.collection.name);
    
    const skip = (page - 1) * limit;
    console.log(`[FOOD SERVICE] skip: ${skip}, limit: ${limit}`);
    
    console.log('[FOOD SERVICE] fetching total data...');
    const total = await FoodModel.countDocuments();
    console.log(`[FOOD SERVICE] found ${total} data`);
    
    console.log('[FOOD SERVICE] fetching data...');
    
    const foods = await FoodModel.find()
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();  
    
    console.log(`[FOOD SERVICE] found ${foods.length} data`);
    
    if (foods.length > 0) {
      foods.forEach((food, index) => {
        console.log(`[FOOD SERVICE] ${index + 1}. ${food.name} (ID: ${food._id})`);
      });
    } else {
      console.log('[FOOD SERVICE] no data found');
    }
    
    const pagination = {
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };
    
    console.log(`[FOOD SERVICE] pagination: page ${page}/${pagination.totalPages}, total ${total} data`);
    return { foods, pagination };
  } catch (error) {
    console.error(`[FOOD SERVICE] error fetching food by type ${type}:`, error);
    throw error;
  }
};

/**
 * 
 * @param {string} type - 
 * @param {string} id - food ID
 * @returns {Promise} - food data
 */
const getFoodByTypeAndId = async (type, id) => {
  try {
    const FoodModel = getFoodModelByType(type);
    const food = await FoodModel.findById(id);
    
    if (!food) {
      console.warn(`Food with ID ${id} not found in ${type} model`);
      return null;
    }
    
    console.log(`Retrieved ${type} food by ID: ${id}`);
    return food;
  } catch (error) {
    console.error(`Error in getFoodByTypeAndId service for ID ${id}:`, error);
    throw error;
  }
};

/**
 * 
 * @param {string} type - 
 * @param {string} name - 
 * @param {string} name - 
 * @param {number} page - 
 * @param {number} limit - 
 * @returns {Promise} - 
 */
const searchFoodsByTypeAndName = async (type, name, page = 1, limit = 10) => {
  try {
    const FoodModel = getFoodModelByType(type);
    const skip = (page - 1) * limit;
    const query = { name: { $regex: name, $options: 'i' } };
    
    
    const foods = await FoodModel.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    
    const total = await FoodModel.countDocuments(query);
    
      
    const pagination = {
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };
    
    console.log(`Found ${foods.length} ${type} foods matching '${name}' (page ${page}/${pagination.totalPages})`);
    return { foods, pagination };
  } catch (error) {
    console.error(`Error in searchFoodsByTypeAndName service for name ${name}:`, error);
    throw error;
  }
};

/**
 * 
 * @param {string} type - 
 * @param {Object} criteria - 
 * @param {number} page - 
 * @param {number} limit - 
 * @returns {Promise} -
 */
const searchFoodsByTypeAndNutrition = async (type, criteria, page = 1, limit = 10) => {
  try {
    const FoodModel = getFoodModelByType(type);
    const skip = (page - 1) * limit;
    const query = {};
    
    if (criteria.minCalories) query['nutritionPer100g.calories'] = { $gte: parseInt(criteria.minCalories) };
    if (criteria.maxCalories) query['nutritionPer100g.calories'] = { ...query['nutritionPer100g.calories'], $lte: parseInt(criteria.maxCalories) };
    
    if (criteria.minProtein) query['nutritionPer100g.protein'] = { $gte: parseInt(criteria.minProtein) };
    if (criteria.maxProtein) query['nutritionPer100g.protein'] = { ...query['nutritionPer100g.protein'], $lte: parseInt(criteria.maxProtein) };
    
    if (criteria.minCarbohydrates) query['nutritionPer100g.carbohydrates'] = { $gte: parseInt(criteria.minCarbohydrates) };
    if (criteria.maxCarbohydrates) query['nutritionPer100g.carbohydrates'] = { ...query['nutritionPer100g.carbohydrates'], $lte: parseInt(criteria.maxCarbohydrates) };
    
    if (criteria.minFat) query['nutritionPer100g.fat'] = { $gte: parseInt(criteria.minFat) };
    if (criteria.maxFat) query['nutritionPer100g.fat'] = { ...query['nutritionPer100g.fat'], $lte: parseInt(criteria.maxFat) };
    
    if (criteria.minFiber) query['nutritionPer100g.fiber'] = { $gte: parseInt(criteria.minFiber) };
    if (criteria.maxFiber) query['nutritionPer100g.fiber'] = { ...query['nutritionPer100g.fiber'], $lte: parseInt(criteria.maxFiber) };
    
    if (criteria.minSugar) query['nutritionPer100g.sugar'] = { $gte: parseInt(criteria.minSugar) };
    if (criteria.maxSugar) query['nutritionPer100g.sugar'] = { ...query['nutritionPer100g.sugar'], $lte: parseInt(criteria.maxSugar) };
    
    const foods = await FoodModel.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    
    const total = await FoodModel.countDocuments(query);
    
    
    const pagination = {
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };
    
    console.log(`Found ${foods.length} ${type} foods matching nutrition criteria (page ${page}/${pagination.totalPages})`);
    return { foods, pagination };
  } catch (error) {
    console.error(`Error in searchFoodsByTypeAndNutrition service for type ${type}:`, error);
    throw error;
  }
};

module.exports = {
  getFoodsByType,
  getFoodByTypeAndId,
  searchFoodsByTypeAndName,
  searchFoodsByTypeAndNutrition,
  readFromCache,
  writeToCache
}; 