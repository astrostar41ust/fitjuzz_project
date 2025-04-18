const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    carbohydrates: {
        type: Number,
        required: true
    },
    sugar: {
        type: Number,
        default: 0
    },
    fiber: {
        type: Number,
        default: 0
    },
    fat: {
        type: Number,
        required: true
    },
    saturatedFat: {
        type: Number,
        default: 0
    },
    unsaturatedFat: {
        type: Number,
        default: 0
    },
    sodium: {
        type: Number,
        default: 0
    },
    cholesterol: {
        type: Number,
        default: 0
    }
}, { _id: false });

const foodBaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    nutritionPer100g: {
        type: nutritionSchema,
        required: true
    },
    servingSize: {
        value: {
            type: Number,
            default: 100
        },
        unit: {
            type: String,
            default: 'กรัม'
        }
    },
    healthBenefits: [String],
    tags: [String],
    isPopular: {
        type: Boolean,
        default: false
    },
    isVegetarian: {
        type: Boolean,
        default: false
    },
    isVegan: {
        type: Boolean,
        default: false
    },
    isGlutenFree: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

foodBaseSchema.index({ name: 'text', description: 'text', tags: 'text' });

foodBaseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

foodBaseSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = foodBaseSchema; 