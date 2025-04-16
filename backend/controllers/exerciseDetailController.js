const exerciseModel = require('../models/exerciseModel');
const { exerciseDetailModel } = require('../models/exerciseDetail');
const fs = require('fs');
const path = require('path');

// cache directory
const CACHE_DIR = path.join(__dirname, '../cache');
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// create cache directory if it doesn't exist
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// function to read data from cache
const readFromCache = (cacheKey) => {
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.json`);
  
  try {
    if (fs.existsSync(cachePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      const now = new Date().getTime();
      
      // check if cache is expired
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

// function to write data to cache
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

const exerciseDetailController = {
  getExerciseDetails: async (req, res) => {
    try {
      const exerciseId = req.params.id;
      console.log(`[DEBUG] Received request for exercise details with ID: ${exerciseId}`);
      
      // check cache before
      const cacheKey = `exercise_detail_${exerciseId}`;
      const cachedData = readFromCache(cacheKey);
      if (cachedData) {
        console.log(`[DEBUG] Returning cached exercise details for ID: ${exerciseId}`);
        return res.json(cachedData);
      }
      
      // if no data in cache, find exercise by id
      const exercise = await exerciseModel.findById(exerciseId);
      console.log(`[DEBUG] Exercise found:`, exercise ? 'Yes' : 'No');
      
      if (!exercise) {
        console.log(`[DEBUG] Exercise with ID ${exerciseId} not found`);
        return res.status(404).json({ message: 'not found exercise with id' });
      }
      
      // create or find additional exercise details
      let exerciseDetail = await exerciseDetailModel.findOne({ name: exercise.name });
      
      // if no additional exercise details, create new one
      if (!exerciseDetail) {
        console.log(`[DEBUG] Creating new exercise detail for: ${exercise.name}`);
        exerciseDetail = new exerciseDetailModel({
          name: exercise.name,
          description: exercise.description,
          picture1: "",
          picture2: "",
          category: exercise.category,
        });
        await exerciseDetail.save();
      }
      
      const exerciseDetails = {
        ...exercise._doc,
        picture1: exerciseDetail.picture1 || "",
        picture2: exerciseDetail.picture2 || "",
        steps: exerciseDetail.steps,
        targetMuscles: exerciseDetail.targetMuscles || getDefaultTargetMuscles(exercise.category),
        tips: exerciseDetail.tips
      };
      
      // save data to cache
      writeToCache(cacheKey, exerciseDetails);
      
      console.log(`[DEBUG] Sending exercise details back to client`);
      res.json(exerciseDetails);
    } catch (error) {
      console.error('[ERROR] Error fetching exercise details:', error);
      res.status(500).json({ message: 'Error fetching exercise details', error: error.message });
    }
  }
};

function getDefaultTargetMuscles(category) {
  switch (category.toLowerCase()) {
    case 'chest':
      return 'กล้ามเนื้อหน้าอก, ไหล่, แขนส่วนหลัง';
    case 'back':
      return 'กล้ามเนื้อหลัง, บริเวณไหล่ด้านหลัง';
    case 'arms':
      return 'กล้ามเนื้อต้นแขน, ปลายแขน';
    case 'abs':
      return 'กล้ามเนื้อหน้าท้อง, แกนกลางลำตัว';
    case 'leg':
      return 'กล้ามเนื้อขา, น่อง, สะโพก';
    default:
      return 'กล้ามเนื้อทั่วไป';
  }
}

module.exports = exerciseDetailController; 