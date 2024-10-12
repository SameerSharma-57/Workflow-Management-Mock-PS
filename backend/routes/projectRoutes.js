import express from "express";
import { getAllProjects,getProjectByProjectID,updateProjectByProjectID,createProject,addMemberToProject,addTaskToProject } from "../controllers/projectControllers.js";

const router = express.Router();

export default (db) => {
  // Route to get all products
  router.get("/", (req, res) => {
    getAllProjects(db, res);
  });

  // Route to get a specific product by projectID
  router.get("/:projectID", (req, res) => {
    const { projectID } = req.params; // Extract projectID from the request parameters
    getProjectByProjectID(db, projectID, res); // Pass projectID to the controller
  });

  // Route to update a project by projectID
  router.put("/update/:projectID", (req, res) => {
    const { projectID } = req.params;
    const updatedData = req.body; // The updated data is sent in the request body
    updateProjectByProjectID(db, projectID, updatedData, res); // Pass projectID and data to the controller
  });

  // Route to create a new project
  router.post("/create", (req, res) => {
    const newProjectData = req.body; // The new project data is sent in the request body
    createProject(db, newProjectData, res); // Pass data to the controller
  });

  // Route to add a member to a project
  router.post("/add-member", (req, res) => {
    const { projectID, newMemberUID } = req.body; // The project ID and new member are sent in the request body
    addMemberToProject(db, projectID, newMemberUID, res); // Pass projectID and member data to the controller
  });

  // Route to add a member to a project
  router.post("/add-task", (req, res) => {
    const { projectID, taskID } = req.body; // The project ID and new member are sent in the request body
    addTaskToProject(db, projectID, taskID, res); // Pass taskID and member data to the controller
  });

  return router;
};
