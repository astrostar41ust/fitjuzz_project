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
    picture: {
        type: String,
        required: true,
        default: "https://images.squarespace-cdn.com/content/v1/64c8035f53e9a56246c7c294/1723420893761-XYJVWOXL91SW5442P6RM/maxresdefault-29-1024x576.jpg"
    },
    category: {
        type: String,
        enum: ['chest', 'back', 'arms', 'abs', 'leg', 'shoulder'],
        required: true
    },
   
});



const exerciseModel = mongoose.model('exerciseModel', exerciseSchema);

module.exports = exerciseModel;