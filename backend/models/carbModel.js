const mongoose = require('mongoose');
const foodBaseSchema = require('./foodBaseModel');

const CarbFood = mongoose.model('CarbFood', foodBaseSchema, 'carbmodels');

module.exports = CarbFood; 