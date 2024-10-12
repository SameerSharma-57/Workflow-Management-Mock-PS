import express from "express";
import { getAllTasks,getTaskByTaskID,updateTaskByTaskID,createTask } from "../controllers/taskControllers.js";

const router = express.Router();

export default (db) => {
    //all tasks of a project
  router.get("/getAllTasks/:projectId", (req, res) => {
    const proID = req.params;
    getAllTasks(db,proID, res);
  });

  //single task of a project
  router.get("/getTask/:projectID/:taskID", (req, res) => {
    const { projectID } = req.params;
    const {taskID} = req.params;
    getTaskByTaskID(db, projectID, taskID, res);
  });

  // update task
  router.put("/updateTask/:projectID/:taskID", (req, res) => {
    const { projectID } = req.params;
    const {taskID} = req.params;
    const updatedData = req.body;
    updateTaskByTaskID(db, projectID, taskID, updatedData, res);
  });

  // new task
  router.post("/createTask/:projectID", (req, res) => {
    const {projectID} = req.params; 
    const newTaskData = req.body;
    createTask(db, projectID, newTaskData, res); 
  });

  return router;
};
