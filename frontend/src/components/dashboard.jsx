import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './dashboard.css'; // Add some basic styles (you can create this file for styling)

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard-default'); // To track the active sidebar section
  const [projects, setProjects] = useState([]); // To store the list of ongoing projects
  const [selectedProject, setSelectedProject] = useState(null); // To track the selected project for task details
  const [newProjectName, setNewProjectName] = useState(""); // To add new project

  const navigate = useNavigate();

  // Simulated fetch to get projects (replace with real API call)
  useEffect(() => {
    // Mock projects data, fetch from your API in real implementation
    const fetchProjects = async () => {
      const mockProjects = [
        { id: 1, name: "Project Alpha", tasks: [{ task: "Task 1", assignee: "John", status: "In Progress" }, { task: "Task 2", assignee: "Jane", status: "Completed" }] },
        { id: 2, name: "Project Beta", tasks: [{ task: "Task 1", assignee: "John", status: "Not Started" }] },
      ];
      setProjects(mockProjects);
    };
    
    fetchProjects();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
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

  // Handle adding new project
  const handleAddProject = () => {
    if (newProjectName) {
      const newProject = { id: projects.length + 1, name: newProjectName, tasks: [] };
      setProjects([...projects, newProject]);
      setNewProjectName("");
    }
  };

  // Render the sidebar with buttons
  const renderSidebar = () => (
    <div className="sidebar">
      <button onClick={() => setActiveSection('dashboard-default')}>Dashboard</button>
      <button onClick={() => setActiveSection('inbox')}>Inbox</button>
      <button onClick={() => setActiveSection('deadlines')}>Deadlines</button>
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}
    </div>
  );

  // Render the main workspace
  const renderWorkspace = () => {
    if (activeSection === 'dashboard-default') {
      return (
        <div className="workspace">
          <h2>Projects</h2>
          <div className="project-list">
            {projects.length > 0 ? (
              projects.map(project => (
                <div key={project.id} className="project-card" onClick={() => setSelectedProject(project)}>
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

  // Render selected project details
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
          <button onClick={() => setSelectedProject(null)}>Back to Projects</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      {renderSidebar()}
      {selectedProject ? renderProjectDetails() : renderWorkspace()}
    </div>
  );
};

export default Dashboard;
