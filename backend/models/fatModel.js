const mongoose = require('mongoose');
const foodBaseSchema = require('./foodBaseModel');

const FatFood = mongoose.model('FatFood', foodBaseSchema, 'fatmodel');

module.exports = FatFood; 