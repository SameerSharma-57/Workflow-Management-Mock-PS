import express from "express";
import { getAllTasks,getTaskByTaskID,updateTaskByTaskID,createTask,addComment,getComments } from "../controllers/taskControllers.js";

const router = express.Router();

export default (db) => {
    //all tasks of a project
  router.get("/getAllTasks/:projectId", (req, res) => {
    const { projectId } = req.params; // Corrected to extract projectId directly
    getAllTasks(db, projectId, res); // Updated to use projectId
  });

  //single task of a project
  router.get("/getTask/:projectID/:taskID", (req, res) => {
    const { projectID, taskID } = req.params; // Destructured both parameters in one line
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

  //add comment to task
  router.post("/addComment/:projectId/:taskId", (req,res) => {
    const {projectId,taskId} = req.params;
    const comment=req.body;
    addComment(db, projectId, taskId,comment, res);
  })

  //get comments of tasks
  router.get("/getComments/:projectId/:taskId", (req,res) => {
    const {projectId,taskId} = req.params;
    const comment = req.body;
    getComments(db, projectId, taskId, comment, res);
  })

  return router;
};
