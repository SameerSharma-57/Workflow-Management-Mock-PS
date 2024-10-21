import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Moon,
  Sun,
  LogOut,
  Home,
  Inbox,
  Calendar,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "./dashboard.css";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [expandedProjectId, setExpandedProjectId] = useState(null);

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
        if (!response.ok) throw new Error("Error fetching projects");

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Error:", err);
        toast.error("Failed to fetch projects");
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    setActiveSection("dashboard"); // Reset to dashboard when component mounts
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
        toast.error("Failed to log out. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during logout.");
    }
  };

  const handleAddProject = async () => {
    if (newProjectName.trim()) {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newProjectName }),
        });
        if (!response.ok) throw new Error("Failed to create project");

        const data = await response.json();
        setProjects((prevProjects) => [
          ...prevProjects,
          { id: data.projectID, name: newProjectName, tasks: [] },
        ]);
        setNewProjectName("");
        setShowProjectModal(false);
        toast.success("Project added successfully!");
      } catch (err) {
        toast.error("Project could not be added");
      }
    }
  };

  const getProjectByProjectID = (project) => {
    navigate(`/dashboard/${project.id}`);
  };

  const toggleProjectExpand = (projectId) => {
    setExpandedProjectId((prev) => (prev === projectId ? null : projectId));
  };

  const renderWorkspace = () => {
    if (activeSection === "deadlines") {
      return (
        <div className="deadlines-section">
          <h2>Deadlines</h2>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="project-deadlines">
                <div
                  className="project-header"
                  onClick={() => toggleProjectExpand(project.id)}
                >
                  <h3>{project.name}</h3>
                  {expandedProjectId === project.id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
                {expandedProjectId === project.id && (
                  <ul className="task-list">
                    {project.tasks && project.tasks.length > 0 ? (
                      project.tasks.map((task, index) => (
                        <li key={index} className="deadline-task">
                          <strong>{task.task}</strong>
                          <span className="due-date">
                            Due:{" "}
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "No due date set"}
                          </span>
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
            <p className="no-projects">No projects available.</p>
          )}
        </div>
      );
    } else if (activeSection === "inbox") {
      return <h2>Inbox Section</h2>;
    }
    return null;
  };

  const renderProjectList = () => (
    <div className="project-grid">
      {projects.length > 0 ? (
        projects
          .filter(
            (project) => typeof project.name === "string" && project.name.trim()
          )
          .map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => getProjectByProjectID(project)}
            >
              <h3>{project.name}</h3>
              <p>Tasks: {project.tasks ? project.tasks.length : 0}</p>
            </div>
          ))
      ) : (
        <p className="no-projects">No ongoing projects</p>
      )}
    </div>
  );

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <button
            className={`sidebar-button ${
              activeSection === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </button>
          <button
            className={`sidebar-button ${
              activeSection === "inbox" ? "active" : ""
            }`}
            onClick={() => setActiveSection("inbox")}
          >
            <Inbox size={20} />
            <span>Inbox</span>
          </button>
          <button
            className={`sidebar-button ${
              activeSection === "deadlines" ? "active" : ""
            }`}
            onClick={() => setActiveSection("deadlines")}
          >
            <Calendar size={20} />
            <span>Deadlines</span>
          </button>
        </div>
        <div className="sidebar-bottom">
          <button
            className="sidebar-button"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button className="sidebar-button logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1 className="dashboard-title">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
          {activeSection === "dashboard" && (
            <button
              className="add-project-button"
              onClick={() => setShowProjectModal(true)}
            >
              <Plus size={16} />
              <span>Add Project</span>
            </button>
          )}
        </header>

        <section className="content-area">
          {activeSection === "dashboard" && (
            <div className="workspace">
              <h2>Your Projects</h2>
              {renderProjectList()}
            </div>
          )}
          {renderWorkspace()} {/* Call renderWorkspace for other sections */}
        </section>
      </main>

      {showProjectModal && (
        <Modal
          title="Add New Project"
          onClose={() => setShowProjectModal(false)}
          onSubmit={handleAddProject}
        >
          <input
            type="text"
            placeholder="Enter project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
        </Modal>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

const Modal = ({ title, children, onClose, onSubmit }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>{title}</h2>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
      <div className="modal-footer">
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button className="submit-button" onClick={onSubmit}>
          Save
        </button>
      </div>
    </div>
  </div>
);

export default Dashboard;
