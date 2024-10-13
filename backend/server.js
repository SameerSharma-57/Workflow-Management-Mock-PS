import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import projectRoutes from "./routes/projectRoutes.js"; 
import taskRoutes from "./routes/taskRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { db } from "./config/firebase.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// import serviceAccount from "./config/serviceAccountKey.json" assert { type: "json" }; // Ensure correct path

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

//API Endpoints
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes(db)); //includes get getAllProjects, getProjectByProjectID, updateProjectByProjectID
app.use("/api/tasks", taskRoutes(db)); //includes get getAllTasks, getTaskByTaskID, updateTaskByTaskID

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
