const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// get API key and host from .env file
const rapidApiKey = process.env.RAPID_API_KEY;
const rapidApiHost = process.env.RAPID_API_HOST;
const baseUrl = process.env.RAPID_API_BASE_URL;

// Debug information
console.log('API Key:', rapidApiKey);
console.log('API Host:', rapidApiHost);
console.log('Base URL:', baseUrl);

// Cache directory
const CACHE_DIR = path.join(__dirname, '../cache');
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours (in milliseconds)

// Create cache directory if it doesn't exist
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Function to read data from cache
const readFromCache = (cacheKey) => {
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.json`);
  
  try {
    if (fs.existsSync(cachePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      const now = new Date().getTime();
      
      // Check if cache is expired
      if (now - cacheData.timestamp < CACHE_DURATION) {
        console.log(`Use data from cache: ${cacheKey}`);
        return cacheData.data;
      } else {
        console.log(`Cache expired: ${cacheKey}`);
      }
    }
  } catch (error) {
    console.error(`Error reading cache: ${cacheKey}:`, error);
  }
  
  return null;
};

// Function to write data to cache
const writeToCache = (cacheKey, data) => {
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.json`);
  
  try {
    const cacheData = {
      timestamp: new Date().getTime(),
      data: data
    };
    
    fs.writeFileSync(cachePath, JSON.stringify(cacheData));
    console.log(`Save data to cache: ${cacheKey}`);
  } catch (error) {
    console.error(`Error writing cache: ${cacheKey}:`, error);
  }
};

// create axios instance with headers for RapidAPI
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'x-rapidapi-key': rapidApiKey,
    'x-rapidapi-host': rapidApiHost
  }
});

const exerciseApiService = {
  // test API connection
  testApiConnection: async () => {
    try {
      // test simple endpoint
      const response = await axios.request({
        method: 'GET',
        url: 'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      console.log('API test successful:', response.data);
      return true;
    } catch (error) {
      console.error('API test failed:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response:', error.response.data);
      }
      return false;
    }
  },
  
  // get all exercises
  getAllExercises: async () => {
    try {
      // Check cache first
      const cachedData = readFromCache('all_exercises');
      if (cachedData) {
        return cachedData;
      }
      
      console.log('No data found in cache or cache expired, calling API...');
      const response = await axios.request({
        method: 'GET',
        url: `${baseUrl}/exercises`,
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      
      // Save data to cache
      writeToCache('all_exercises', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching all exercises:', error);
      if (error.response) {
        console.error('API response error:', error.response.data);
        console.error('Status code:', error.response.status);
      }
      throw error;
    }
  },
  
  // get exercise by id
  getExerciseById: async (id) => {
    try {
    // Check cache first
      const cachedData = readFromCache(`exercise_id_${id}`);
      if (cachedData) {
        return cachedData;
      }
      
      console.log(`Calling API to get exercise ID: ${id}...`);
      const response = await axios.request({
        method: 'GET',
        url: `${baseUrl}/exercises/exercise/${id}`,
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      
      // Save data to cache
      writeToCache(`exercise_id_${id}`, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercise with id ${id}:`, error);
      throw error;
    }
  },
  
  // get exercise by name
  getExerciseByName: async (name) => {
    try {
      // ตรวจสอบแคชก่อน
      const cachedData = readFromCache(`exercise_name_${name}`);
      if (cachedData) {
        return cachedData;
      }
      
      console.log(`Calling API to get exercise name: ${name}...`);
      const response = await axios.request({
        method: 'GET',
        url: `${baseUrl}/exercises/name/${name}`,
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      
      // Save data to cache
      writeToCache(`exercise_name_${name}`, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercise with name ${name}:`, error);
      throw error;
    }
  },
  
  // get body part list
  getBodyPartList: async () => {
    try {
      // Check cache first
      const cachedData = readFromCache('body_part_list');
      if (cachedData) {
        return cachedData;
      }
      
      console.log('Calling API to get body part list...');
      const response = await axios.request({
        method: 'GET',
        url: `${baseUrl}/exercises/bodyPartList`,
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      
      // Save data to cache
      writeToCache('body_part_list', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching body part list:', error);
      throw error;
    }
  },
  
  // get exercise by body part
  getExercisesByBodyPart: async (bodyPart) => {
    try {
      // Check cache first
      const cachedData = readFromCache(`exercises_bodypart_${bodyPart}`);
      if (cachedData) {
        return cachedData;
      }
      
      console.log(`Calling API to get exercises by body part: ${bodyPart}...`);
      const response = await axios.request({
        method: 'GET',
        url: `${baseUrl}/exercises/bodyPart/${bodyPart}`,
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      
      // Save data to cache
      writeToCache(`exercises_bodypart_${bodyPart}`, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercises by body part ${bodyPart}:`, error);
      throw error;
    }
  },
  
  // get equipment list
  getEquipmentList: async () => {
    try {
      // Check cache first
      const cachedData = readFromCache('equipment_list');
      if (cachedData) {
        return cachedData;
      }
      
      console.log('Calling API to get equipment list...');
      const response = await axios.request({
        method: 'GET',
        url: `${baseUrl}/exercises/equipmentList`,
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      
      // Save data to cache
      writeToCache('equipment_list', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment list:', error);
      throw error;
    }
  },
  
  // get exercise by equipment
  getExercisesByEquipment: async (equipment) => {
    try {
      // Check cache first
      const cachedData = readFromCache(`exercises_equipment_${equipment}`);
      if (cachedData) {
        return cachedData;
      }
      
      console.log(`Calling API to get exercises by equipment: ${equipment}...`);
      const response = await axios.request({
        method: 'GET',
        url: `${baseUrl}/exercises/equipment/${equipment}`,
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      
      // Save data to cache
      writeToCache(`exercises_equipment_${equipment}`, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercises by equipment ${equipment}:`, error);
      throw error;
    }
  },
  
  // get target list
  getTargetList: async () => {
    try {
      // Check cache first
      const cachedData = readFromCache('target_list');
      if (cachedData) {
        return cachedData;
      }
      
      console.log('Calling API to get target list...');
      const response = await axios.request({
        method: 'GET',
        url: `${baseUrl}/exercises/targetList`,
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      
      // Save data to cache
      writeToCache('target_list', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching target list:', error);
      throw error;
    }
  },
  
  // get exercise by target
  getExercisesByTarget: async (target) => {
    try {
      // Check cache first
      const cachedData = readFromCache(`exercises_target_${target}`);
      if (cachedData) {
        return cachedData;
      }
      
      console.log(`Calling API to get exercises by target: ${target}...`);
      const response = await axios.request({
        method: 'GET',
        url: `${baseUrl}/exercises/target/${target}`,
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      
      // Save data to cache
      writeToCache(`exercises_target_${target}`, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercises by target ${target}:`, error);
      throw error;
    }
  },
  
  // get all exercises
  getAllExercisesNoLimit: async () => {
    try {
      // Check cache first
      const cachedData = readFromCache('all_exercises_no_limit');
      if (cachedData) {
        return cachedData;
      }
      
      console.log('Start fetching all exercises...');
      
      // 1. Get data from main endpoint
      const mainResponse = await axios.request({
        method: 'GET',
        url: `${baseUrl}/exercises`,
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      let allExercises = [...mainResponse.data];
      console.log(`Fetched ${allExercises.length} exercises from main endpoint`);
      
      // ดึงข้อมูลเพิ่มเติมจากหมวดหมู่สำคัญเพื่อให้ได้ท่าเพิ่มขึ้น
      const importantBodyParts = ['chest', 'back', 'upper legs', 'lower legs', 'upper arms', 'lower arms', 'shoulders', 'waist', 'cardio'];
      
      // ดึงข้อมูลเฉพาะหมวดหมู่ที่สำคัญเพื่อลด API calls
      for (const bodyPart of importantBodyParts) {
        try {
          console.log(`Fetching exercises from body part: ${bodyPart}`);
          
          const response = await axios.request({
            method: 'GET',
            url: `${baseUrl}/exercises/bodyPart/${bodyPart}`,
            headers: {
              'x-rapidapi-key': rapidApiKey,
              'x-rapidapi-host': rapidApiHost
            }
          });
          
          // Add only new exercises that don't already exist (check by id)
          const newExercises = response.data.filter(
            newEx => !allExercises.some(ex => ex.id === newEx.id)
          );
          
          allExercises = [...allExercises, ...newExercises];
          console.log(`Added ${newExercises.length} exercises from body part ${bodyPart} (total ${allExercises.length})`);
        } catch (error) {
          console.error(`Error fetching data from body part ${bodyPart}:`, error.message);
        }
      }
      
      console.log(`Fetched all exercises successfully, got ${allExercises.length} exercises`);
      // Save data to cache
      writeToCache('all_exercises_no_limit', allExercises);
      
      return allExercises;
      
      // Close fetching data from body part to save API calls
      /*
      // 2. Get body part list
      const bodyPartsResponse = await axios.request({
        method: 'GET',
        url: `${baseUrl}/exercises/bodyPartList`,
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost
        }
      });
      const bodyParts = bodyPartsResponse.data;
      console.log(`Found ${bodyParts.length} body parts`);
      
      // 3. Get exercises from each body part
      for (const bodyPart of bodyParts) {
        try {
          console.log(`Fetching exercises from body part: ${bodyPart}`);
          
          const response = await axios.request({
            method: 'GET',
            url: `${baseUrl}/exercises/bodyPart/${bodyPart}`,
            headers: {
              'x-rapidapi-key': rapidApiKey,
              'x-rapidapi-host': rapidApiHost
            }
          });
          
          // Add only new exercises that don't already exist (check by id)
          const newExercises = response.data.filter(
            newEx => !allExercises.some(ex => ex.id === newEx.id)
          );
          
          allExercises = [...allExercises, ...newExercises];
          console.log(`Added ${newExercises.length} exercises from body part ${bodyPart} (total ${allExercises.length})`);
        } catch (error) {
          console.error(`Error fetching data from body part ${bodyPart}:`, error.message);
        }
      }
      
      console.log(`Fetched all exercises successfully, got ${allExercises.length} exercises`);
      // Save data to cache
      writeToCache('all_exercises_no_limit', allExercises);
      
      return allExercises;
      */
    } catch (error) {
      console.error('Error fetching all exercises with no limit:', error);
      if (error.response) {
        console.error('API response error:', error.response.data);
        console.error('Status code:', error.response.status);
      }
      throw error;
    }
  }
};

module.exports = exerciseApiService; 