import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './dashboard.css'; 
import { useParams } from 'react-router-dom';
import ExitIcon from '../exit.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const Taskpage =()=> {
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeSection, setActiveSection] = useState("dashboard-default");
    const [projects, setProjects] = useState([]);
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTask, setNewTask] = useState({
      task: "",
      assignee: "",
      status: "Not Started",
      dueDate: null, // New dueDate field
    });
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMember, setNewMember] = useState("");
    const [newComment, setNewComment] = useState({});
    const [showCommentInput, setShowCommentInput] = useState({});
    const [editedTask, setEditedTask] = useState({
      dueDate: null, // Add dueDate field to editedTask
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [expandedProjectId, setExpandedProjectId] = useState(null); 
    
    const API_BASE_URL = "http://localhost:5001/api";
    const navigate = useNavigate();
    const { projectId } = useParams();

    useEffect(() => {
        const getProjectByProjectID = async () =>{
            try {
                console.log(projectId);
                const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                });
            
                if (!response.ok) {
                throw new Error("Failed to fetch project details");
                }
            
                const data = await response.json();
                const response2 = await fetch(`${API_BASE_URL}/tasks/getAllTasks/${projectId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch project details");
                }
                const task_data = await response2.json();
                data.tasks = task_data.tasks || [];
                setSelectedProject(data);
                console.log("data:",data);
            } catch (err) {
                console.error("Error:", err);
            }
        };
        getProjectByProjectID();

        const fetchProjects = async () => {
            console.log(projectId);
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
      }, [projectId]);
     
    const handleOpenEditModal = (task) => {
        setEditedTask(task);
        setShowEditModal(true);
      };
    

    const handleLogout = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/tasks/updateTask/${selectedProject.id}/${editedTask.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedTask),
          });
      
          if (!response.ok) throw new Error("Failed to update task");

        const data = await response.json();
        
        } catch (error) {
          console.error("Logout Error: ", error);
        }
    };

    const handleAddTask = async () => {
        // Ensure that new task details and the selected project are available
        if (newTask.task && newTask.assignee && newTask.dueDate && selectedProject) {
          try {
            // Use the correct API endpoint for adding a task
            console.log("new task:",newTask);
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
            
            setSelectedProject((prevProject) => {
                const tasks = Array.isArray(prevProject.tasks) ? prevProject.tasks : []; // Ensure it's an array
                return {
                  ...prevProject,
                  tasks: [...tasks, newTask], // Add the new task
                };
            });
            
            console.log("selected project after updation",selectedProject);
            console.log("data of response:",data);

            // Update the local projects state with the new task added
            setProjects((prevProjects) =>
                prevProjects.map((project) => 
                project.id === selectedProject.id
                ? { 
                    ...project, 
                    tasks: [...(Array.isArray(project.tasks) ? project.tasks : []), newTask] // Ensure tasks is always an array
                } 
                : project)
);

      
            // Reset task form fields after successful submission
            setNewTask({ task: "", assignee: "", status: "Not Started", dueDate: null });
            setShowAddTask(false); // Close the task form
            window.location.reload();
            toast.success('Task added successfully!');
          } catch (err) {
            toast.error('Task could not be added');
            console.error("Error:", err);
          }
        } else {
          toast.warn("Please fill in all fields to add a task.");
        }
    };

    const handleUpdateTask = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/updateTask/${selectedProject.id}/${editedTask.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedTask),
            });
            if (!response.ok) throw new Error("Failed to update task");

            // Update the state with the new task data
            setSelectedProject((prevProject) => ({
                ...prevProject,
                tasks: prevProject.tasks.map((task) =>
                    task.id === editedTask.id ? editedTask : task
                ),
            }));

            setShowEditModal(false);
            toast.success("Task updated successfully!");
        } catch (err) {
            toast.error("Failed to update task.");
            console.error("Error:", err);
        }
    };

      const handleAddComment = async (taskId) => {
        if (newComment[taskId] && selectedProject) {
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

                const data = await response.json();
                const temporary = selectedProject;

                // Updating the task with new comment
                temporary.tasks.forEach(eachtask => {
                    if (eachtask.id === taskId) {
                        if (!eachtask.comments) {
                            eachtask.comments = [];
                        }
                        eachtask.comments.push({ "comment": newComment[taskId] });
                    }
                });
                
                setSelectedProject(temporary);
                setNewComment((prevState) => ({ ...prevState, [taskId]: "" }));
                setShowCommentInput((prev) => ({ ...prev, [taskId]: false })); // Hide the input after adding comment
                toast.success("Comment added successfully!");
            } catch (err) {
                console.error("Error:", err);
                toast.error("Failed to add comment");
            }
        }
    };

    const handleCommentInputChange = (taskId, value) => {
        setNewComment((prevState) => ({
          ...prevState,
          [taskId]: value, // Update the comment text for the specific task
        }));
    };
    
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
    
            toast.success('member added successfully!');
            setNewMember(""); // Reset the input field
            setShowAddMember(false); // Hide the add member form
          } catch (err) {
            console.error("Error:", err);
            toast.success('Member could not be added');
          }
        }
    };

    const toggleProjectExpand = (projectId) => {
        setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
      };
    
    const renderEditTaskModal = () => {
        if (!showEditModal) return null; // If modal is not shown, return nothing
      
        return (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Task</h2>
      
              <input
                type="text"
                value={editedTask.task}
                onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
                placeholder="Task Name"
              />
      
              <input
                type="text"
                value={editedTask.assignee}
                onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                placeholder="Assignee"
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
      
              <button onClick={handleUpdateTask}>Save</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        );
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
        if(activeSection === 'inbox') {
          return (
          <h2>Inbox Section</h2>
          ); // Can replace this with actual inbox content
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

          ); // Can replace this with actual deadlines content
        }
    };

    const renderProjectDetails = () => {
        if (selectedProject && activeSection === "dashboard-default") {
            return (
                <div className="project-details">
                    <button onClick={()=>{navigate("/dashboard")}}>Back</button>
                    <h2>{selectedProject.name}</h2>
                    <div className="top-buttons">
                        <button className="add-task-btn" onClick={() => setShowAddTask(!showAddTask)}>
                            Add Task
                        </button>
                        <button className="add-member-btn" style={{marginLeft: "10px"}} onClick={() => setShowAddMember(!showAddMember)}>
                            Add Member
                        </button>
                    </div>

                    {showAddTask && (
                        <div className="modal-overlay">
                        <div className="task-input">
                            <input
                                type="text"
                                placeholder="Task Name"
                                value={newTask.task}
                                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
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
                            <br></br>
                            <select
                                value={newTask.status}
                                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                            </select>
                            <br></br>
                            <button onClick={handleAddTask}>Add Task</button>
                            <button style={{marginLeft: "10px"}} onClick={() => setShowAddTask(false)}>Cancel</button>
                        </div>
                        </div>
                    )}

                    {showAddMember && (
                        <div className="modal-overlay">
                        <div className="member-input">
                            <input
                                type="text"
                                placeholder="New Member UID"
                                value={newMember}
                                onChange={(e) => setNewMember(e.target.value)}
                            />
                            <button onClick={handleAddMember}>Add Member</button>
                            <button style={{marginLeft: "10px"}} onClick={()=> setShowAddMember(false)} >Cancel</button>
                         </div>
                        </div>
                    )}

                    <h3>Tasks</h3>
                    <ul>
                        {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                            selectedProject.tasks.map((task, index) => (
                                <li key={index} className="task-item">
                                    <strong>{task.task}</strong> - {task.assignee} - <em>{task.status}</em>
                                    {task.dueDate && (
                                        <span style={{ fontStyle: 'italic', color: '#d9534f' }}>
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                    <div className="comments-section">
                                        <h4>Comments</h4>
                                        <ul>
                                            {task.comments && task.comments.map((comment, index) => (
                                                <li key={index}>{comment.comment}</li>
                                            ))}
                                        </ul>
                                        <button className="add-comment-btn" onClick={() => setShowCommentInput((prev) => ({ ...prev, [task.id]: true }))}>
                                            Add Comment
                                        </button>
                                        {showCommentInput[task.id] && (
                                            <div className="comment-input">
                                                <input
                                                    type="text"
                                                    placeholder="Type your comment..."
                                                    value={newComment[task.id] || ""}
                                                    onChange={(e) => handleCommentInputChange(task.id, e.target.value)}
                                                />
                                                <button onClick={() => handleAddComment(task.id)}>Submit</button>
                                                <button onClick={() => setShowCommentInput((prev) => ({ ...prev, [task.id]: false }))}>Cancel</button>
                                            </div>
                                        )}
                                    </div>
                                    <button className="updatebtn" onClick={() => handleOpenEditModal(task)}>Update</button>
                                </li>
                            ))
                        ) : (
                            <p>No tasks available for this project.</p>
                        )}
                    </ul>
                </div>
            );
        }
    };
    


    return(
        <div className="dashboard-container">
            {renderSidebar()}
            <div className="main-content">
                {renderProjectDetails()}
                {renderWorkspace()}
                {renderEditTaskModal()}
            </div>
            <ToastContainer/>
        </div>
    );
};
export default Taskpage;