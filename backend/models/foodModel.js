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

/**
 * 
 */
const foodSchema = new mongoose.Schema({
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
        required: true,
        enum: [
            'ผัก', 'ผลไม้', 'เนื้อสัตว์', 'อาหารทะเล', 
            'ธัญพืช', 'ถั่ว', 'นม', 'ไข่', 'อาหารแปรรูป', 
            'เครื่องดื่ม', 'ของหวาน', 'อื่นๆ'
        ]
    },
    picture: {
        type: String,
        required: true,
        default: function() {
            const defaultImages = {
                'ผัก': '/images/foods/vegetables.jpg',
                'ผลไม้': '/images/foods/fruits.jpg',
                'เนื้อสัตว์': '/images/foods/meat.jpg',
                'อาหารทะเล': '/images/foods/seafood.jpg',
                'ธัญพืช': '/images/foods/grains.jpg',
                'ถั่ว': '/images/foods/beans.jpg',
                'นม': '/images/foods/dairy.jpg',
                'ไข่': '/images/foods/eggs.jpg',
                'อาหารแปรรูป': '/images/foods/processed.jpg',
                'เครื่องดื่ม': '/images/foods/beverages.jpg',
                'ของหวาน': '/images/foods/desserts.jpg',
                'อื่นๆ': '/images/foods/other.jpg'
            };
            return defaultImages[this.category] || '/images/foods/default.jpg';
        }
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

foodSchema.index({ name: 'text', description: 'text', tags: 'text' });

foodSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

foodSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food; 