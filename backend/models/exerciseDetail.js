const mongoose = require('mongoose');

const exerciseDetailJson = {
    "_id": "ObjectId", 
    "name": "String", 
    "description": "String", 
    "picture1": "String", 
    "picture2": "String", 
    "category": "String", 
    "steps": ["String"], 
    "targetMuscles": "String", 
    "tips": "String", 
    "__v": "Number" 
};

const exerciseDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture1: {
        type: String,
        default: "",
        description: "รูปหลักสำหรับแสดงในหน้ารายละเอียด (รูปแรกใน Slider)"
    },
    picture2: {
        type: String,
        default: "",
        description: "รูปที่สองสำหรับแสดงในหน้ารายละเอียด (รูปที่สองใน Slider)"
    },
    category: {
        type: String,
        enum: ['chest', 'back', 'arms', 'abs', 'leg', 'shoulder'],
        required: true
    },
    steps: {
        type: [String],
        default: [
            'เริ่มต้นด้วยท่ายืนหรือนั่งที่มั่นคง',
            'จัดท่าทางให้ถูกต้องตามลักษณะของท่าที่ต้องการออกกำลังกาย',
            'ทำการออกกำลังกายด้วยท่าที่ถูกต้อง โดยระวังไม่ให้เกิดการบาดเจ็บ',
            'ทำซ้ำตามจำนวนครั้งที่ต้องการ'
        ]
    },
    targetMuscles: {
        type: String,
        default: ''
    },
    tips: {
        type: String,
        default: 'ควรเริ่มต้นด้วยน้ำหนักเบาๆ ก่อน เพื่อให้ร่างกายได้ปรับตัว และค่อยๆ เพิ่มน้ำหนักเมื่อร่างกายแข็งแรงขึ้น ควรหายใจเข้าออกอย่างสม่ำเสมอระหว่างออกกำลังกาย และพักให้เพียงพอระหว่างเซ็ต'
    }
});

// function to convert Document to JSON that can be used by Modal
exerciseDetailSchema.methods.toModalJSON = function() {
    // แปลง targetMuscles เป็นรูปแบบที่เหมาะสม
    let parsedTargetMuscles = this.targetMuscles;
    
    // if it's a string and has a format of , then convert to object
    if (typeof this.targetMuscles === 'string' && this.targetMuscles.includes(',')) {
        const muscleList = this.targetMuscles.split(',').map(m => m.trim());
        parsedTargetMuscles = {
            primary: muscleList.slice(0, Math.ceil(muscleList.length / 2)),
            secondary: muscleList.slice(Math.ceil(muscleList.length / 2))
        };
    }
    
    return {
        _id: this._id,
        name: this.name,
        description: this.description,
        picture1: this.picture1 || "",
        picture2: this.picture2 || "",
        category: this.category,
        steps: this.steps,
        targetMuscles: parsedTargetMuscles,
        tips: this.tips,
        __v: this.__v
    };
};

const exerciseDetailModel = mongoose.model('exerciseDetailModel', exerciseDetailSchema);

// export both model and JSON structure
module.exports = { 
    exerciseDetailModel,
    exerciseDetailJson
}; 