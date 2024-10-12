// Controller to fetch all projects from Firestore
export const getAllProjects = async (db, res) => {
    try {
      const projectsRef = db.collection("projects");
      const snapshot = await projectsRef.get();
  
      if (snapshot.empty) {
        res.status(404).send("No projects found");
        return;
      }
  
      const projects = [];
      snapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() });
      });
  
      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).send("Error fetching projects");
    }
  };

// Controller to fetch a specific project by projectID
export const getProjectByProjectID = async (db, projectID, res) => {
    try {
      // Reference to the specific document with the provided projectID
      const projectDoc = db.collection("projects").doc(projectID);
      const doc = await projectDoc.get();
  
      if (!doc.exists) {
        res.status(404).send(`No project found with projectID: ${projectID}`);
        return;
      }
  
      // Send the project data
      res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error(`Error fetching project with projectID ${projectID}:`, error);
      res.status(500).send("Error fetching project");
    }
  };

  // Controller to update a project by projectID
export const updateProjectByProjectID = async (db, projectID, updatedData, res) => {
  try {
    const projectDoc = db.collection("projects").doc(projectID);

    // Check if the document exists before updating
    const doc = await projectDoc.get();
    if (!doc.exists) {
      res.status(404).send(`No project found with projectID: ${projectID}`);
      return;
    }

    // Update the document with the new data
    await projectDoc.update(updatedData);

    res.status(200).send(`Project with projectID ${projectID} has been updated`);
  } catch (error) {
    console.error(`Error updating project with projectID ${projectID}:`, error);
    res.status(500).send("Error updating project");
  }
  
};

// Function to generate a random 6-character alphanumeric project ID
const generateProjectID = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let projectID = '';
  for (let i = 0; i < 6; i++) {
      projectID += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return projectID;
};

export const createProject = async (db, newProjectData, res) => {
  const projectID = generateProjectID(); // Generate a new project ID

  try {
      // Set the document with the generated projectID
      await db.collection('projects').doc(projectID).set({
          ...newProjectData, // Spread the existing project data
          projectID // Add the projectID to the project data
      });
      res.status(201).json({ message: "Project created successfully", projectID });
  } catch (error) {
      res.status(500).json({ error: `Failed to create project: ${error.message}` });
  }
};
  