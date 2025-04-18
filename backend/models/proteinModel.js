const mongoose = require('mongoose');
const foodBaseSchema = require('./foodBaseModel');

const ProteinFood = mongoose.model('ProteinFood', foodBaseSchema, 'proteinmodel');

module.exports = ProteinFood; 