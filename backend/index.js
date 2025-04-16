const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const userUpdateRoute = require("./routes/userUpdateRoute");
const otpRoute = require("./routes/otpRoute");
const exerciseRoute = require("./routes/exerciseRoute");
const workoutRoute = require("./routes/workoutRoute");
const guideRoute = require("./routes/guideRoute");
const exerciseApiRoute = require("./routes/exerciseApiRoute");
const app = express();
app.use(express.json());
app.use(cors());

const exerciseModel = require("./models/exerciseModel");
const steroidDetailModel = require("./models/steroidDetail");
const supplementDetailModel = require("./models/supplementDetail");
const encyclopediaDetailModel = require("./models/encyclopediaDetail");
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Array of 10 exercises
    const exercises = [
      {
        name: "Push-up",
        description: "A bodyweight exercise for chest and arms.",
        category: "chest",
        picture: "https://www.burnthefatinnercircle.com/members/images/1683.jpg",
        target: "Pectoralis Major",
        secondaryMuscles: ["Deltoid", "Triceps"],
        instructions: [
          "ท่าเริ่มต้น นอนคว่ำกับพื้น มือวางข้างลำตัวระดับไหล่",
          "ยกตัวขึ้น ดันพื้นโดยใช้แขนและหน้าอก พยายามให้ลำตัวตรง",
          "หย่อนตัวลงจนหน้าอกเกือบแตะพื้น",
          "ดันตัวกลับขึ้นไปยังท่าเริ่มต้น",
          "ทำซ้ำตามจำนวนครั้งที่ต้องการ"
        ],
        equipment: "Bodyweight"
      },
      {
        name: "Pull-up",
        description: "A bodyweight exercise for the back.",
        category: "back",
        picture: "https://www.burnthefatinnercircle.com/members/images/1684.jpg",
        target: "Latissimus Dorsi",
        secondaryMuscles: ["Biceps", "Rhomboids"],
        instructions: [
          "จับราวด้วยมือสองข้าง มือห่างกันกว้างกว่าไหล่",
          "ห้อยตัวลงให้แขนเหยียดตรง",
          "ดึงตัวขึ้นจนคางอยู่เหนือราว",
          "ลดตัวลงช้าๆ กลับสู่ท่าเริ่มต้น",
          "ทำซ้ำตามจำนวนครั้งที่ต้องการ"
        ],
        equipment: "Pull-up Bar"
      },
      {
        name: "Bicep Curl",
        description: "An exercise for strengthening the arms.",
        category: "arms",
        picture: "https://www.burnthefatinnercircle.com/members/images/1685.jpg",
        target: "Biceps Brachii",
        secondaryMuscles: ["Forearm", "Brachialis"],
        instructions: [
          "ยืนตรง ถือดัมเบลด้วยมือสองข้าง แขนเหยียดตรง",
          "งอข้อศอกยกดัมเบลขึ้นมาที่หัวไหล่",
          "ลดดัมเบลลงช้าๆ กลับสู่ท่าเริ่มต้น",
          "ทำซ้ำตามจำนวนครั้งที่ต้องการ"
        ],
        equipment: "Dumbbells"
      },
      {
        name: "Sit-up",
        description: "A core exercise for the abs.",
        category: "abs",
        picture: "https://www.burnthefatinnercircle.com/members/images/1689.jpg",
        target: "Rectus Abdominis",
        secondaryMuscles: ["Hip Flexors", "Obliques"],
        instructions: [
          "นอนหงาย งอเข่า เท้าวางราบกับพื้น",
          "มือวางไขว้ที่หน้าอกหรือแตะที่ข้างหู",
          "ยกลำตัวส่วนบนขึ้นจนข้อศอกแตะหรือเลยหัวเข่า",
          "ลดตัวลงช้าๆ กลับสู่ท่าเริ่มต้น",
          "ทำซ้ำตามจำนวนครั้งที่ต้องการ"
        ],
        equipment: "Bodyweight"
      },
      {
        name: "Squat",
        description: "A lower body exercise for legs and glutes.",
        category: "leg",
        picture: "https://www.burnthefatinnercircle.com/members/images/1687.jpg",
        target: "Quadriceps",
        secondaryMuscles: ["Hamstrings", "Glutes", "Calves"],
        instructions: [
          "ยืนตรง เท้าห่างกันประมาณความกว้างของไหล่",
          "ย่อตัวลงโดยให้สะโพกถอยไปด้านหลัง เหมือนนั่งเก้าอี้",
          "ย่อตัวลงจนต้นขาขนานกับพื้น หรือต่ำกว่าหากทำได้",
          "ดันตัวกลับขึ้นสู่ท่าเริ่มต้น",
          "ทำซ้ำตามจำนวนครั้งที่ต้องการ"
        ],
        equipment: "Bodyweight"
      },
      {
        name: "Bench Press",
        description: "A strength exercise for the chest and triceps.",
        category: "chest",
        picture: "https://www.burnthefatinnercircle.com/members/images/1683.jpg",
        target: "Pectoralis Major",
        secondaryMuscles: ["Deltoid", "Triceps"],
        instructions: [
          "นอนหงายบนม้านั่ง ตาอยู่ใต้บาร์",
          "จับบาร์กว้างกว่าไหล่เล็กน้อย",
          "ยกบาร์ออกจากที่วาง",
          "ลดบาร์ลงช้าๆ จนแตะหน้าอก",
          "ดันบาร์ขึ้นจนแขนเหยียดตรง",
          "ทำซ้ำตามจำนวนครั้งที่ต้องการ"
        ],
        equipment: "Barbell, Bench"
      },
      {
        name: "Deadlift",
        description: "A compound exercise for the back and legs.",
        category: "back",
        picture: "https://www.burnthefatinnercircle.com/members/images/1684.jpg",
        target: "Erector Spinae",
        secondaryMuscles: ["Gluteus Maximus", "Hamstrings", "Quadriceps"],
        instructions: [
          "ยืนหน้าบาร์เบล เท้าห่างกันประมาณความกว้างของสะโพก",
          "ย่อตัวลง จับบาร์ด้วยมือทั้งสองข้าง",
          "ยืดอกขึ้น หลังตรง",
          "ยกบาร์ขึ้นโดยใช้พลังจากขาและสะโพก",
          "ยืนตรง บีบก้น",
          "ลดบาร์ลงช้าๆ กลับสู่พื้น",
          "ทำซ้ำตามจำนวนครั้งที่ต้องการ"
        ],
        equipment: "Barbell"
      },
      {
        name: "Tricep Dip",
        description: "An exercise for triceps.",
        category: "arms",
        picture: "https://www.burnthefatinnercircle.com/members/images/1685.jpg",
        target: "Triceps Brachii",
        secondaryMuscles: ["Chest", "Shoulders"],
        instructions: [
          "นั่งบนเก้าอี้หรือม้านั่ง มือจับขอบ",
          "เลื่อนสะโพกออกจากขอบ",
          "ลดตัวลงโดยงอข้อศอก",
          "ลงจนแขนท่อนบนขนานกับพื้น",
          "ดันตัวขึ้นกลับสู่ท่าเริ่มต้น",
          "ทำซ้ำตามจำนวนครั้งที่ต้องการ"
        ],
        equipment: "Bench or Chair"
      },
      {
        name: "Leg Press",
        description: "A machine-based leg exercise for quads and glutes.",
        category: "leg",
        picture: "https://www.burnthefatinnercircle.com/members/images/1687.jpg",
        target: "Quadriceps",
        secondaryMuscles: ["Hamstrings", "Glutes"],
        instructions: [
          "นั่งบนเครื่อง leg press วางเท้าบนแผ่นกดห่างกันเท่าความกว้างของไหล่",
          "ปลดตัวล็อคและงอเข่าช้าๆ ให้แผ่นกดเคลื่อนลงมา",
          "งอเข่าจนมุมประมาณ 90 องศา",
          "ดันขากลับไปจนขาเกือบเหยียดตรง ระวังอย่าล็อคเข่า",
          "ทำซ้ำตามจำนวนครั้งที่ต้องการ"
        ],
        equipment: "Leg Press Machine"
      },
      {
        name: "Plank",
        description: "A core strengthening exercise for abs and lower back.",
        category: "abs",
        picture: "https://www.burnthefatinnercircle.com/members/images/1689.jpg",
        target: "Core",
        secondaryMuscles: ["Shoulders", "Glutes"],
        instructions: [
          "เริ่มในท่าคล้ายท่าดันพื้น แต่ให้น้ำหนักอยู่บนปลายแขนท่อนล่าง",
          "ข้อศอกอยู่ใต้ไหล่พอดี",
          "ยกสะโพกขึ้นให้ร่างกายเป็นเส้นตรงจากศีรษะถึงส้นเท้า",
          "เกร็งกล้ามเนื้อท้อง",
          "คงท่านี้ไว้ตามเวลาที่กำหนด"
        ],
        equipment: "Bodyweight"
      },
      {
        name: "Fly",
        description: "A chest exercise for middle and inner chest",
        category: "chest",
        picture: "https://www.burnthefatinnercircle.com/members/images/1683.jpg",
        target: "Pectoralis Major",
        secondaryMuscles: ["Deltoid", "Biceps"],
        instructions: [
          "นอนหงายบนม้านั่ง หรือบนลูกบอลออกกำลังกาย",
          "ถือดัมเบลด้วยมือทั้งสองข้าง ยื่นแขนขึ้นเหนืออก",
          "ลดแขนออกด้านข้างเป็นรูปครึ่งวงกลม จนรู้สึกถึงการยืดที่หน้าอก",
          "ยกดัมเบลกลับขึ้นมาในท่าเริ่มต้น บีบหน้าอก",
          "ทำซ้ำตามจำนวนครั้งที่ต้องการ"
        ],
        equipment: "Dumbbells, Bench"
      },
    ];

    // process to delete all data and insert new data
    exerciseModel
      .deleteMany({})
      .then((result) => {
        console.log(`delete all data ${result.deletedCount} data`);
        return exerciseModel.insertMany(exercises);
      })
      .then((result) => {
        console.log(`insert new data ${result.length} data`);
      })
      .catch((err) => {
        console.error("error in data management:", err);
      });

    const steroidDetails = [
      {
        name: "Testosterone Enanthate",
        description:
          "Testosterone Enanthate is a long-acting anabolic steroid primarily used in hormone therapy for men with low testosterone levels. It promotes significant muscle mass gain, strength, and endurance when combined with resistance training. Often favored by bodybuilders during bulking cycles, it also enhances recovery and overall physical performance.",
        category: "anabolic",
        picture: "https://example.com/testosterone.jpg",
      },
      {
        name: "Dianabol",
        description:
          "Dianabol, also known as Methandrostenolone, is a fast-acting oral steroid that significantly boosts muscle growth and strength in a short period. It is commonly used in bulking phases due to its powerful anabolic effects, making it a favorite among athletes looking for rapid physical transformation.",
        category: "oral",
        picture: "https://example.com/dianabol.jpg",
      },
      {
        name: "Deca Durabolin",
        description:
          "Deca Durabolin (Nandrolone Decanoate) is a well-known anabolic steroid valued for its ability to enhance muscle recovery, joint health, and lean muscle mass. It has mild androgenic properties, making it suitable for longer cycles with minimal estrogenic side effects compared to other steroids.",
        category: "anabolic",
        picture: "https://example.com/deca.jpg",
      },
      {
        name: "Winstrol",
        description:
          "Winstrol (Stanozolol) is a popular oral steroid used during cutting phases to preserve lean muscle mass while promoting fat loss and muscle definition. Athletes and bodybuilders often use Winstrol to improve vascularity, hardness, and athletic performance without significant water retention.",
        category: "oral",
        picture: "https://example.com/winstrol.jpg",
      },
      {
        name: "Trenbolone",
        description:
          "Trenbolone is one of the most powerful injectable anabolic steroids known for its rapid muscle gain, fat-burning capabilities, and increased strength. It is not recommended for beginners due to its intensity and potential side effects, but it remains a top choice for advanced users during both bulking and cutting cycles.",
        category: "injectable",
        picture: "https://example.com/trenbolone.jpg",
      },
    ];

    // Process to delete all data and insert new data for steroids
    steroidDetailModel
      .deleteMany({})
      .then((result) => {
        console.log(
          `Deleted all existing steroid data. ${result.deletedCount} records removed.`
        );
        return steroidDetailModel.insertMany(steroidDetails);
      })
      .then((result) => {
        console.log(
          `Inserted new steroid data. ${result.length} records added.`
        );
      })
      .catch((err) => {
        console.error("Error in managing steroid data:", err);
      });

    const supplements = [
      {
        name: "Whey Protein",
        description:
          "A fast-digesting protein ideal for post-workout recovery.",
        category: "protein",
      },
      {
        name: "Creatine Monohydrate",
        description:
          "Helps increase strength and muscle mass by replenishing ATP stores.",
        category: "creatine",
      },

      {
        name: "BCAA",
        description:
          "Supports muscle recovery, reduces soreness, and prevents muscle breakdown.",
        category: "bcaa",
      },
      {
        name: "Casein Protein",
        description:
          "A slow-digesting protein great for overnight muscle repair.",
        category: "protein",
      },
    ];

    // Delete all and insert new supplements
    supplementDetailModel
      .deleteMany({})
      .then((result) => {
        console.log(`Deleted ${result.deletedCount} existing supplements`);
        return supplementDetailModel.insertMany(supplements);
      })
      .then((result) => {
        console.log(`Inserted ${result.length} new supplements`);
      })
      .catch((err) => {
        console.error("Error managing supplement data:", err);
      });

    const fitnessEntries = [
      {
        name: "Hypertrophy",
        description:
          "The enlargement of an organ or tissue from the increase in size of its cells, especially muscle fibers due to resistance training.",
      },
      {
        name: "VO2 Max",
        description:
          "The maximum rate of oxygen consumption measured during incremental exercise; a common indicator of cardiovascular fitness.",
      },
      {
        name: "Progressive Overload",
        description:
          "The gradual increase of stress placed upon the body during exercise training, which is essential for muscle growth.",
      },
      {
        name: "Resting Heart Rate",
        description:
          "The number of heartbeats per minute while at complete rest; a lower value typically indicates better cardiovascular fitness.",
      },
      {
        name: "DOMS (Delayed Onset Muscle Soreness)",
        description:
          "Muscle pain and stiffness that occurs hours to days after unaccustomed or strenuous exercise.",
      },
    ];

    // Delete all and insert new entries
    encyclopediaDetailModel
      .deleteMany({})
      .then((result) => {
        console.log(
          `Deleted ${result.deletedCount} existing encyclopedia entries`
        );
        return encyclopediaDetailModel.insertMany(fitnessEntries);
      })
      .then((result) => {
        console.log(`Inserted ${result.length} new encyclopedia entries`);
      })
      .catch((err) => {
        console.error("Error managing fitness encyclopedia data:", err);
      });
  })
  .catch((err) => {
    console.error("error in connection to MongoDB:", err);
  });

app.use("/api/user", userRoute, userUpdateRoute);
app.use("/api/user", otpRoute);
app.use("/api/user", exerciseRoute);
app.use("/api/user", workoutRoute);
app.use("/api/user", guideRoute);
app.use("/api/user", exerciseApiRoute);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
