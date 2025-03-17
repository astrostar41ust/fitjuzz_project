const workoutModel = require("../models/workoutModel");


const workoutController = {
    updateWorkout: async (req, res) => {
        const { userId } = req.body
        const { exercises } = req.body
        console.log(userId)
        console.log(exercises)
        try {

            if (!userId || !exercises.length) {
                return res.status(400).json({ error: "Missing userId or exercises" });
            }

            const newWorkout = new workoutModel({ userId, exercises });
            console.log('before saving')
            await newWorkout.save();
            console.log('after saving')
            res.status(201).json({ message: "Workout saved successfully" });
        } catch (error) {
            res.status(500).json({ error: "Error saving workout" });
        }
    },
    getExercisesHistory: async (req, res) => {
        const { userId } = req.params
       
        try {
            const user = await workoutModel.findOne(userId)
            console.log(userId )
            console.log(user)
            if (user) {
                return res.json(user);
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
};



module.exports = workoutController