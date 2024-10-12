// Controller to fetch all tasks from Firestore
export const getAllTasks = async (db, projectID, res) => {
    try {
      const projectDoc = db.collection("projects").doc(projectID);
      const doc = await projectDoc.get();
  
      if (!doc.exists) {
        res.status(404).send(`No project found with projectID: ${projectID}`);
        return;
      }
  
      const projectData = { id: doc.id, ...doc.data() };
      const tasks = projectData.tasks || []; 
  
      res.status(200).json({ ...projectData, tasks });
    } catch (error) {
      console.error(`Error fetching tasks for projectID ${projectID}:`, error);
      res.status(500).send("Error fetching tasks");
    }
  };


export const getTaskByTaskID = async (db, projectID, taskID, res) => {
    try {
        const projectDoc = db.collection("projects").doc(projectID);
        const doc = await projectDoc.get();

        if (!doc.exists) {
            res.status(404).send(`No project found with projectID: ${projectID}`);
            return;
        }

        const projectData = doc.data();
        const tasks = projectData.tasks || []; 

        const task = tasks.find(t => t.id === taskID);

        if (!task) {
            res.status(404).send(`No task found with taskID: ${taskID}`);
            return;
        }

        res.status(200).json(task);
    } catch (error) {
        console.error(`Error fetching task with taskID ${taskID} for projectID ${projectID}:`, error);
        res.status(500).send("Error fetching task");
    }
};

  // Controller to update a specific task by taskID within a project
export const updateTaskByTaskID = async (db, projectID, taskID, updatedData, res) => {
    try {
        const projectDoc = db.collection("projects").doc(projectID);
        
        // Check if the document exists before updating
        const doc = await projectDoc.get();
        if (!doc.exists) {
            res.status(404).send(`No project found with projectID: ${projectID}`);
            return;
        }

        const projectData = doc.data();
        const tasks = projectData.tasks || []; // Default to empty array if no tasks

        // Find the index of the task to update
        const taskIndex = tasks.findIndex(t => t.id === taskID);
        if (taskIndex === -1) {
            res.status(404).send(`No task found with taskID: ${taskID}`);
            return;
        }

        // Update the task in the tasks array
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };

        // Update the project document with the modified tasks array
        await projectDoc.update({ tasks });

        res.status(200).send(`Task with taskID ${taskID} has been updated`);
    } catch (error) {
        console.error(`Error updating task with taskID ${taskID} for projectID ${projectID}:`, error);
        res.status(500).send("Error updating task");
    }
};

// Function to generate a random 6-character alphanumeric project ID
const generatetaskID = () => {
  const characters = '0123456789';
  let taskID = 'TSK';
  for (let i = 0; i < 6; i++) {
      taskID += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return taskID;
};

export const createTask = async (db, projectID, newTaskData, res) => {
  try {
    const taskID = generatetaskID();
    const taskWithID = { id: taskID, ...newTaskData };

    const projectDoc = db.collection('projects').doc(projectID);
    
    await projectDoc.update({
      tasks: admin.firestore.FieldValue.arrayUnion(taskWithID) // Append the new task
    });
    
    res.status(201).json({ message: "Task created successfully", projectID });
  } catch (error) {
    res.status(500).json({ error: `Failed to create task: ${error.message}` });
  }
};
  
