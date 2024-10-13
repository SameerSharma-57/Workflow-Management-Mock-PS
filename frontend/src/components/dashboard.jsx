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

  // Simulated fetch to get projects (replace with real API call)
  useEffect(() => {
    const fetchProjects = async () => {
      const mockProjects = [
        { id: 1, name: "Project Alpha", tasks: [{ task: "Task 1", assignee: "Rishi", status: "In Progress" }, { task: "Task 2", assignee: "xyz", status: "Completed" }] },
        { id: 2, name: "Project Beta", tasks: [{ task: "Task 1", assignee: "xyz", status: "Not Started" }] },
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

  // Handle adding new task to the selected project
  const handleAddTask = () => {
    if (newTask.task && newTask.assignee) {
      const updatedProjects = projects.map((project) => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            tasks: [...project.tasks, newTask],
          };
        }
        return project;
      });
      setProjects(updatedProjects);
      setNewTask({ task: "", assignee: "", status: "Not Started" });
      setShowAddTask(false);
    }
  };

  // Handle adding new member to the selected project (in this example, a member is just added as a task assignee)
  const handleAddMember = () => {
    if (newMember) {
      // In a real scenario, you might want to manage a separate member list, but here it's a basic example
      alert(`${newMember} added as a project member.`);
      setNewMember("");
      setShowAddMember(false);
    }
  };

  // Render the sidebar with buttons
  const renderSidebar = () => (
    <div className="sidebar">
      <button onClick={() => setActiveSection('dashboard-default')}>Dashboard</button>
      <button onClick={() => setActiveSection('inbox')}>Inbox</button>
      <button onClick={() => setActiveSection('deadlines')}>Deadlines</button>
      <button id="logoutbtn" onClick={handleLogout}>Logout
        <img src={ExitIcon} style={{width:"15px", marginLeft:"150px"}} alt="Exit Icon" />
      </button> {/* Logout button */}
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
          
          <button onClick={() => setShowAddTask(true)}>Add Task</button>
          <button onClick={() => setShowAddMember(true)}>Add Member</button>
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
