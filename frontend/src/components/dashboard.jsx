import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './dashboard.css'; // Add some basic styles (you can create this file for styling)
import ExitIcon from '../exit.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard-default'); // To track the active sidebar section
  const [projects, setProjects] = useState([]); // To store the list of ongoing projects
  const [selectedProject, setSelectedProject] = useState(null); // To track the selected project for task details
  const [newProjectName, setNewProjectName] = useState(""); // To add new project

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5001/api"; 
  
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
        toast.success('Project added successfully!');
      } catch (err) {
        toast.error('project could not be added');
        console.error("Error:", err);
      }
    }
  };

  const getProjectByProjectID = async (project) =>{
    navigate(`/dashboard/${project.id}`);
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

  return (
    <div className="dashboard-container">
      {renderSidebar()}
      <div className="main-content">
        {renderWorkspace()}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Dashboard;