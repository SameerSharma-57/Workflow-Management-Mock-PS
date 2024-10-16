import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './dashboard.css'; // Add some basic styles
import ExitIcon from '../exit.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard-default');
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [showInput, setShowInput] = useState(false); // State to control input visibility
  const [expandedProjectId, setExpandedProjectId] = useState(null); // State to control which project is expanded

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

        const data = await response.json();
        setProjects(data);
        console.log(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchProjects();
  }, []);

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

  const handleAddProject = async () => {
    if (newProjectName) {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newProjectName }),
        });

        if (!response.ok) {
          throw new Error("Failed to create project");
        }

        const data = await response.json();
        setProjects([...projects, { id: data.projectID, name: newProjectName, tasks: [] }]);
        setNewProjectName("");
        setShowInput(false); // Hide input field after adding
        toast.success('Project added successfully!');
      } catch (err) {
        toast.error('Project could not be added');
        console.error("Error:", err);
      }
    }
  };

  const getProjectByProjectID = async (project) => {
    navigate(`/dashboard/${project.id}`);
  };

  const toggleProjectExpand = (projectId) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

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

  const renderWorkspace = () => {
    if (activeSection === 'dashboard-default') {
      return (
        <div className="workspace">
          <h2>Projects</h2>
          <div className="project-list">
            {projects.length > 0 ? (
                projects
                .filter(project => project.name && project.name.trim())
                .map(project => (
                  <div key={project.id} className="project-card" onClick={() => getProjectByProjectID(project)}>
                    <h3>{project.name}</h3>
                  </div>
                ))
            ) : (
            <p>No ongoing projects</p>
          )}
          </div>
          <button className="add-project-button" onClick={() => setShowInput(prev => !prev)}>
        + Add Project
      </button>
      {showInput && (
        <div className="modal-overlay" >
        <div className="project-input-container">
          <input
            type="text"
            className="project-input"
            placeholder="New project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button onClick={handleAddProject}>Add</button>
          <button style={{marginLeft: "10px"}} onClick={()=>{setShowInput(false)}}>Cancel</button>
        </div>
        </div>
      )}
        </div>
      );
    } else if (activeSection === 'inbox') {
      return <h2>Inbox Section</h2>; // Can replace this with actual inbox content
    } else if (activeSection === 'deadlines') {
      return (
        <div>
          <h2>Deadlines Section</h2>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="project-deadlines">
                <div className="project-header" onClick={() => toggleProjectExpand(project.id)}>
                  <h3>{project.name}</h3>
                  <span style={{ cursor: 'pointer', fontSize: '18px' }}>
                    {expandedProjectId === project.id ? '▲' : '▼'} {/* Arrow for expand/collapse */}
                  </span>
                </div>
                {expandedProjectId === project.id && (
                  <ul className="task-list">
                    {project.tasks && project.tasks.length > 0 ? (
                      project.tasks.map((task, index) => (
                        <li key={index}>
                          <strong>{task.task}</strong> - Due: 
                          {task.dueDate ? (
                            <span style={{ fontStyle: 'italic', color: '#d9534f' }}>
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          ) : (
                            <span style={{ fontStyle: 'italic', color: '#d9534f' }}>
                              No due date set.
                            </span>
                          )}
                        </li>
                      ))
                    ) : (
                      <li>No tasks available for this project.</li>
                    )}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p>No projects available.</p>
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
      </div>
      
      <ToastContainer/>
    </div>
  );
};

export default Dashboard;
