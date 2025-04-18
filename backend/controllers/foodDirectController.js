const mongoose = require('mongoose');
const CarbFood = require('../models/carbModel');
const ProteinFood = require('../models/proteinModel');
const FatFood = require('../models/fatModel');

/**
 * 
 */
const getAllCarbFoods = async (req, res) => {
  try {
    console.log('[DIRECT] fetching all carb foods');
    
    // call collection
    const foods = await CarbFood.find().lean();
    console.log(`[DIRECT] found ${foods.length} carb foods`);
    
    if (foods.length > 0) {
      foods.forEach((food, index) => {
        console.log(`[DIRECT] ${index + 1}. ${food.name} (ID: ${food._id})`);
      });
    }
    
    return res.status(200).json({
      success: true,
      foods: foods,
      count: foods.length
    });
  } catch (error) {
    console.error('[DIRECT] error fetching carb foods:', error);
    return res.status(500).json({
      success: false,
      message: 'error fetching carb foods',
      error: error.message
    });
  }
};

/**
 * 
 */
const getAllProteinFoods = async (req, res) => {
  try {
    console.log('[DIRECT] fetching all protein foods');
    
    // call collection
    const foods = await ProteinFood.find().lean();
    console.log(`[DIRECT] found ${foods.length} protein foods`);
    
    return res.status(200).json({
      success: true,
      foods: foods,
      count: foods.length
    });
  } catch (error) {
    console.error('[DIRECT] error fetching protein foods:', error);
    return res.status(500).json({
      success: false,
      message: 'error fetching protein foods',
      error: error.message
    });
  }
};

/**
 * 
 */
const getAllFatFoods = async (req, res) => {
  try {
    console.log('[DIRECT] fetching all fat foods');
    
    // call collection
    const foods = await FatFood.find().lean();
    console.log(`[DIRECT] found ${foods.length} fat foods`);
    
    return res.status(200).json({
      success: true,
      foods: foods,
      count: foods.length
    });
  } catch (error) {
    console.error('[DIRECT] error fetching fat foods:', error);
    return res.status(500).json({
      success: false,
      message: 'error fetching fat foods',
      error: error.message
    });
  }
};

/**
  * 
 */
const getFoodById = async (req, res) => {
  try {
    const { type, id } = req.params;
    console.log(`[DIRECT] fetching ${type} food with ID: ${id}`);
    
    let FoodModel;
    switch(type.toLowerCase()) {
      case 'carb':
        FoodModel = CarbFood;
        break;
      case 'protein':
        FoodModel = ProteinFood;
        break;
      case 'fat':
        FoodModel = FatFood;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'ประเภทอาหารไม่ถูกต้อง (รองรับเฉพาะ carb, protein, fat)'
        });
    }
    
    const food = await FoodModel.findById(id).lean();
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลอาหารตาม ID ที่ระบุ'
      });
    }
    
    console.log(`[DIRECT] found food: ${food.name}`);
    return res.status(200).json({
      success: true,
      food: food
    });
  } catch (error) {
    console.error('[DIRECT] error fetching food by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'error fetching food by ID',
      error: error.message
    });
  }
};

module.exports = {
  getAllCarbFoods,
  getAllProteinFoods,
  getAllFatFoods,
  getFoodById
}; 