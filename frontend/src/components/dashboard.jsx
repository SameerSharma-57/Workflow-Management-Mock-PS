import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './dashboard.css'; // Add some basic styles (you can create this file for styling)
import ExitIcon from '../exit.svg';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard-default'); // To track the active sidebar section
  const [projects, setProjects] = useState([]); // To store the list of ongoing projects
  const [selectedProject, setSelectedProject] = useState(null); // To track the selected project for task details
  const [newProjectName, setNewProjectName] = useState(""); // To add new project
  const [showAddTask, setShowAddTask] = useState(false); // Toggle for adding tasks
  const [newTask, setNewTask] = useState({ task: "", assignee: "", status: "Not Started" }); // New task details
  const [showAddMember, setShowAddMember] = useState(false); // Toggle for adding members
  const [newMember, setNewMember] = useState(""); // New member name

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000/api";
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Error fetching projects");
        }
  
        const data = await response.json(); // Parse the response data
        setProjects(data); // Set the fetched projects
        console.log(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchProjects();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        alert("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Logout Error: ", error);
      alert("An error occurred during logout.");
    }
  };

  // Handle adding a new project
  const handleAddProject = async () => {
    if (newProjectName) {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newProjectName }), // Sending new project name to backend
        });

        if (!response.ok) {
          throw new Error("Failed to create project");
        }

        const data = await response.json();
        setProjects([...projects, { id: data.projectID, name: newProjectName, tasks: [] }]); // Add the new project locally
        setNewProjectName(""); // Reset the input field
        
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  const getProjectByProjectID = async (project) =>{
    console.log("Selected project:", project); // Debugging line
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${project.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project details");
    }

    const data = await response.json();

    const response2 = await fetch(`${API_BASE_URL}/tasks/getAllTasks/${project.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch project details");
    }
    const task_data = await response2.json();
    
    data.tasks = task_data.tasks;
    setSelectedProject(data);
    console.log(data);
  } catch (err) {
    console.error("Error:", err);
  }
  };
  // Handle adding a new task to the selected project
  const handleAddTask = async () => {
    // Ensure that new task details and the selected project are available
    if (newTask.task && newTask.assignee && selectedProject) {
      try {
        // Use the correct API endpoint for adding a task
        console.log(newTask);
        console.log(selectedProject.id);
        const response = await fetch(`${API_BASE_URL}/tasks/createTask/${selectedProject.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Only send the new task data as JSON in the body
          body: JSON.stringify(newTask),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add task");
        }
  
        // Get the response data (the created task)
        const data = await response.json();
  
        // Update the local projects state with the new task added
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === selectedProject.id
              ? { ...project, tasks: [...project.tasks, data] } // Add the newly created task
              : project
          )
        );
  
        // Reset task form fields after successful submission
        setNewTask({ task: "", assignee: "", status: "Not Started" });
        setShowAddTask(false); // Close the task form
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      console.warn("Please fill in all fields to add a task.");
    }
  };
  

  const handleUpdateTask = async (projectId, taskId, updatedTask) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/updateTask/${projectId}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask), // Send updated task details
      });
  
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
  
      const data = await response.json();
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === taskId ? data : task // Update the task in the project
                ),
              }
            : project
        )
      );
    } catch (err) {
      console.error("Error:", err);
    }
  };
  

  // Handle adding a new member to the selected project
  const handleAddMember = async () => {
    if (newMember && selectedProject) {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${selectedProject.id}/add-member`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({projectID: selectedProject.id, newMemberUID: newMember}), // Sending new member name to backend
        });

        if (!response.ok) {
          throw new Error("Failed to add member");
        }

        alert(`${newMember} added to the project`);
        setNewMember(""); // Reset the input field
        setShowAddMember(false); // Hide the add member form
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  // Render the sidebar with buttons
  const renderSidebar = () => (
    <div className="sidebar">
      <button onClick={() => setActiveSection('dashboard-default')}>Dashboard</button>
      <button onClick={() => setActiveSection('inbox')}>Inbox</button>
      <button onClick={() => setActiveSection('deadlines')}>Deadlines</button>
      <button id="logoutbtn" onClick={handleLogout}>
        Logout
        <img src={ExitIcon} style={{ width: "15px", marginLeft: "150px" }} alt="Exit Icon" />
      </button>
    </div>
  );

  // Render the main workspace
  const renderWorkspace = () => {
    if (activeSection === 'dashboard-default' && !selectedProject) {
      return (
        <div className="workspace">
          <h2>Projects</h2>
          <div className="project-list">
            {projects.length > 0 ? (
                projects
                .filter(project => project.name && project.name.trim()) // Only render projects with a valid name
                .map(project => (
                  <div key={project.id} className="project-card" onClick={() => getProjectByProjectID(project)}>
                    <h3>{project.name}</h3>
                  </div>
                ))
            ) : (
            <p>No ongoing projects</p>
          )}
          </div>
          <div className="add-project">
            <input
              type="text"
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <button onClick={handleAddProject}>Add Project</button>
          </div>
        </div>
      );
    } else if (activeSection === 'inbox') {
      return <h2>Inbox Section</h2>; // Can replace this with actual inbox content
    } else if (activeSection === 'deadlines') {
      return <h2>Deadlines Section</h2>; // Can replace this with actual deadlines content
    }
  };

  // Render selected project details with task addition and member addition functionality
  const renderProjectDetails = () => {
    if (selectedProject) {
      return (
        <div className="project-details">
          <h2>{selectedProject.name}</h2>
          <h3>Tasks</h3>
          <ul>
            {selectedProject.tasks.length > 0 ? (
              selectedProject.tasks.map((task, index) => (
                <li key={index}>
                  <strong>{task.task}</strong> - {task.assignee} - <em>{task.status}</em>
                </li>
              ))
            ) : (
              <p>No tasks available for this project.</p>
            )}
          </ul>
          
          <button onClick={() => setShowAddMember(true)}>Add Member</button>
          <button onClick={() => setShowAddTask(true)}>Add Task</button>
          <button onClick={() => setSelectedProject(null)}>Back to Projects</button>

          {showAddTask && (
            <div className="add-task">
              <h3>Add Task</h3>
              <input
                type="text"
                placeholder="Task name"
                value={newTask.task}
                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
              />
              <input
                type="text"
                placeholder="Assignee name"
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              />
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button onClick={handleAddTask}>Add Task</button>
              <button onClick={() => setShowAddTask(false)}>Cancel</button>
            </div>
          )}

          {showAddMember && (
            <div className="add-member">
              <h3>Add Member</h3>
              <input
                type="text"
                placeholder="Member name"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
              />
              <button onClick={handleAddMember}>Add Member</button>
              <button onClick={() => setShowAddMember(false)}>Cancel</button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="dashboard-container">
      {renderSidebar()}
      <div className="main-content">
        {renderWorkspace()}
        {renderProjectDetails()}
      </div>
    </div>
  );
};

export default Dashboard;
