import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import projectRoutes from "./routes/projectRoutes.js"; 

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.json());

import serviceAccount from "./config/serviceAcountKey.json" assert { type: "json" }; // Ensure correct path

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

//API Endpoints
app.use("/projects", projectRoutes(db)); //includes get getAllProjects, getProjectByProjectID, updateProjectByProjectID

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
