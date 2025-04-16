const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: false,
        default: function() {
            // set different images for each category
            const categoryImages = {
                'chest': 'https://www.burnthefatinnercircle.com/members/images/1683.jpg',
                'back': 'https://www.burnthefatinnercircle.com/members/images/1684.jpg',
                'arms': 'https://www.burnthefatinnercircle.com/members/images/1685.jpg',
                'shoulders': 'https://www.burnthefatinnercircle.com/members/images/1686.jpg',
                'leg': 'https://www.burnthefatinnercircle.com/members/images/1687.jpg',
                'abs': 'https://www.burnthefatinnercircle.com/members/images/1689.jpg',
                'glutes': 'https://www.burnthefatinnercircle.com/members/images/1688.jpg'
            };
            return categoryImages[this.category.toLowerCase()] || 'https://www.burnthefatinnercircle.com/members/images/1683.jpg';
        }
    },
    target: {
        type: String,
        required: false,
    },
    secondaryMuscles: {
        type: [String],
        required: false,
    },
    instructions: {
        type: [String],
        required: false,
    },
    equipment: {
        type: String,
        required: false,
    }
});

const exerciseModel = mongoose.model('Exercise', exerciseSchema);

module.exports = exerciseModel;