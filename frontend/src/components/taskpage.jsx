import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LogOut, Plus, X, ChevronDown, ChevronUp, Edit, MessageSquare, Sun, Moon, ArrowLeft, Trash2, ListTodo } from 'lucide-react';
import './dashboard.css';

const API_BASE_URL = "http://localhost:5001/api";

export default function Taskpage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState("Tasks");
  const [projects, setProjects] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    task: "",
    assignee: "",
    status: "Not Started",
    dueDate: null,
  });
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState("");
  const [newComment, setNewComment] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [editedTask, setEditedTask] = useState({
    dueDate: null,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  
  const navigate = useNavigate();
  const { projectId } = useParams();

  const fetchProjectAndTasks = useCallback( async () => {
    try {
      const projectResponse = await fetch(`${API_BASE_URL}/projects/${projectId}`);
      const taskResponse = await fetch(`${API_BASE_URL}/tasks/getAllTasks/${projectId}`);
      
      if (!projectResponse.ok || !taskResponse.ok) {
        throw new Error("Failed to fetch project details or tasks");
      }

      const projectData = await projectResponse.json();
      const taskData = await taskResponse.json();
      
      setSelectedProject({ ...projectData, tasks: taskData.tasks || [] });
      setActiveSection("Tasks");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to load project data");
    }
  }, [projectId]);

  useEffect(() => {
    

    const fetchAllProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/`);
        if (!response.ok) {
          throw new Error("Error fetching projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Error:", err);
        toast.error("Failed to load projects");
      }
    };

    fetchProjectAndTasks();
    fetchAllProjects();
  }, [projectId, fetchProjectAndTasks]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

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
        toast.success("Logged out successfully");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout Error: ", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleAddTask = async () => {
    if (newTask.task && newTask.assignee && newTask.dueDate) {
      if (newTask.task.length > 20) {
        toast.warn("Task name should not exceed 20 characters.");
        return;
      }
      if (newTask.assignee.length > 15) {
        toast.warn("Assignee name should not exceed 15 characters.");
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/createTask/${selectedProject.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newTask),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add task");
        }
  
        // Fetch tasks again after adding
        await fetchProjectAndTasks(); // Call the fetch function to update the tasks
        
        setNewTask({ task: "", assignee: "", status: "Not Started", dueDate: null });
        setShowAddTask(false);
        toast.success('Task added successfully!');
      } catch (err) {
        console.error("Error:", err);
        toast.error('Task could not be added');
      }
    } else {
      toast.warn("Please fill in all fields to add a task.");
    }
  };
  
  
  const handleUpdateTask = async () => {
    if (editedTask.task.length > 20) {
      toast.warn("Task name should not exceed 20 characters.");
      return;
    }
    if (editedTask.assignee.length > 15) {
      toast.warn("Assignee name should not exceed 15 characters.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/updateTask/${selectedProject.id}/${editedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(editedTask),
      });
  
      if (!response.ok) throw new Error("Failed to update task");
  
      await fetchProjectAndTasks();

      setSelectedProject((prevProject) => ({
        ...prevProject,
        tasks: prevProject.tasks.map((task) =>
          task.id === editedTask.id ? { ...task, ...editedTask } : task // Update the specific task
        ),
      }));
  
      setShowEditModal(false);
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task.");
      console.error("Error:", err);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/deleteTask/${selectedProject.id}/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
  
      // Update the local state by filtering out the deleted task
      setSelectedProject((prevProject) => ({
        ...prevProject,
        tasks: prevProject.tasks.filter((task) => task.id !== taskId),
      }));
  
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task.");
      console.error("Error:", err);
    }
  };  
  const handleAddComment = async (taskId) => {
    if (newComment[taskId]) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/addComment/${selectedProject.id}/${taskId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ "comment": newComment[taskId] }),
        });

        if (!response.ok) {
          throw new Error("Failed to add comment");
        }

        setSelectedProject(prevProject => ({
          ...prevProject,
          tasks: prevProject.tasks.map(task =>
            task.id === taskId
              ? { ...task, comments: [...(task.comments || []), { comment: newComment[taskId] }] }
              : task
          ),
        }));

        setNewComment(prev => ({ ...prev, [taskId]: "" }));
        setShowCommentInput(prev => ({ ...prev, [taskId]: false }));
        toast.success("Comment added successfully!");
      } catch (err) {
        console.error("Error:", err);
        toast.error("Failed to add comment");
      }
    }
  };

  const handleAddMember = async () => {
    if (newMember && selectedProject) {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${selectedProject.id}/add-member`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({projectID: selectedProject.id, newMemberUID: newMember}),
        });

        if (!response.ok) {
          throw new Error("Failed to add member");
        }

        toast.success('Member added successfully!');
        setNewMember("");
        setShowAddMember(false);
      } catch (err) {
        console.error("Error:", err);
        toast.error('Member could not be added');
      }
    }
  };

  const handleOpenEditModal = (task) => {
    setEditedTask(task);
    setShowEditModal(true);
  };

  const toggleProjectExpand = (projectId) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  const renderSidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-top">
        <button className={`sidebar-button ${activeSection === 'Tasks' ? 'active' : ''}`} onClick={() => setActiveSection('Tasks')}>
          <ListTodo size={20} />
          <span>Tasks</span>
        </button>
      </div>
      <div className="sidebar-bottom">
        <button className="sidebar-button" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="sidebar-button logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
  

  const renderProjectDetails = () => {
    if (selectedProject && activeSection === "Tasks") {
      return (
        <div className="project-details">
          <div className="project-header">
            <button className="back-button" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
            <h2>{selectedProject.name}</h2>
          </div>
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => setShowAddTask(!showAddTask)}>
              <Plus size={16} />
              Add Task
            </button>
            <button className="btn btn-secondary" onClick={() => setShowAddMember(!showAddMember)}>
              <Plus size={16} />
              Add Member
            </button>
          </div>

          <h3>Tasks</h3>
          <ul className="task-list">
            {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
              selectedProject.tasks.map((task) => (
                <li key={task.id} className="task-item">
                  <div className="task-header">
                    <strong>{task.task}</strong>
                    <span className="task-meta">
                      {task.assignee} - <em>{task.status}</em>
                      {task.dueDate && (
                        <span className="due-date">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button className="btn btn-small" onClick={() => setShowCommentInput((prev) => ({ ...prev, [task.id]: true }))}>
                      <MessageSquare size={16} />
                      Add Comment
                    </button>
                    <button className="btn btn-small btn-outline" onClick={() => handleOpenEditModal(task)}>
                      <Edit size={16} />
                      Update
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                  {showCommentInput[task.id] && (
                    <div className="comment-input">
                      <input
                        type="text"
                        placeholder="Type your comment..."
                        value={newComment[task.id] || ""}
                        onChange={(e) => setNewComment({ ...newComment, [task.id]: e.target.value })}
                      />
                      <button className="btn btn-small" onClick={() => handleAddComment(task.id)}>Submit</button>
                      <button className="btn btn-small btn-outline" onClick={() => setShowCommentInput((prev) => ({ ...prev, [task.id]: false }))}>Cancel</button>
                    </div>
                  )}
                  {task.comments && task.comments.length > 0 && (
                    <div className="comments-section">
                      <h4>Comments</h4>
                      <ul>
                        {task.comments.map((comment, index) => (
                          <li key={index}>{comment.comment}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p className="no-tasks">No tasks available for this project.</p>
            )}
          </ul>
        </div>
      );
    }
    return null;
  };

  const renderWorkspace = () => {
    if (activeSection === 'Tasks') {
      return renderProjectDetails();
    } else if (activeSection === 'inbox') {
      return <h2>Inbox Section</h2>;
    } else if (activeSection === 'deadlines') {
      return (
        <div className="deadlines-section">
          <h2>Deadlines</h2>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="project-deadlines">
                <div className="project-header" onClick={() => toggleProjectExpand(project.id)}>
                  <h3>{project.name}</h3>
                  {expandedProjectId === project.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {expandedProjectId === project.id && (
                  <ul className="task-list">
                    {project.tasks && project.tasks.length > 0 ? (
                      
                      project.tasks.map((task, index) => (
                        <li key={index} className="deadline-task">
                          <strong>{task.task}</strong>
                          <span className="due-date">
                            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date set'}
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
    }
    return null;
  };

  const renderEditTaskModal = () => {
    if (!showEditModal) return null;
    
    return (
      <Modal title="Edit Task" onClose={() => setShowEditModal(false)}>
        <input
          type="text"
          value={editedTask.task}
          onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
          placeholder="Task Name"
          maxLength={20}
        />
        <input
          type="text"
          value={editedTask.assignee}
          onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
          placeholder="Assignee"
          maxLength={15}
        />
        <DatePicker
          selected={editedTask.dueDate ? new Date(editedTask.dueDate) : null}
          onChange={(date) => setEditedTask({ ...editedTask, dueDate: date })}
          placeholderText="Due Date"
        />
        <select
          value={editedTask.status}
          onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleUpdateTask}>Save</button>
          <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
        </div>
      </Modal>
    );
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      {renderSidebar()}
      <main className="main-content">
        <header className="main-header">
          <h1 className="dashboard-title">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
        </header>
        <section className="content-area">
          {renderWorkspace()}
        </section>
      </main>
      {renderEditTaskModal()}
      {showAddTask && (
        <Modal title="Add New Task" onClose={() => setShowAddTask(false)}>
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.task}
            onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
            maxLength={20}
          />
          <input
            type="text"
            placeholder="Assignee"
            value={newTask.assignee}
            onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
          />
          <DatePicker
            selected={newTask.dueDate}
            onChange={(date) => setNewTask({ ...newTask, dueDate: date })}
            placeholderText="Due Date"
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleAddTask}>Add Task</button>
            <button className="btn btn-secondary" onClick={() => setShowAddTask(false)}>Cancel</button>
          </div>
        </Modal>
      )}
      {showAddMember && (
        <Modal title="Add New Member" onClose={() => setShowAddMember(false)}>
          <input
            type="text"
            placeholder="New Member UID"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
          />
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleAddMember}>Add Member</button>
            <button className="btn btn-secondary" onClick={() => setShowAddMember(false)}>Cancel</button>
          </div>
        </Modal>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

const Modal = ({ title, children, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>{title}</h2>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);