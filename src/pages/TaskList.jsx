import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { Calendar, Flag, LogOut, Plus, Check, Trash2 } from 'lucide-react';
import "../assets/Tasks.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", priority: "High", deadline: "" });
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://127.0.0.1:5000/tasks/", {
          method: "GET",
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        } else {
          alert("Failed to fetch tasks");
        }
      } catch (error) {
        alert("Error fetching tasks");
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://127.0.0.1:5000/tasks/", {
        method: "POST",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();
      if (data.message === "Task added successfully") {
        const newAddedTask = { ...data.task, status: "Upcoming" };
        setTasks([...tasks, newAddedTask]);
        setNewTask({ title: "", priority: "High", deadline: "" });
      } else {
        alert("Failed to add task");
      }
    } catch (error) {
      alert("Error adding task");
    }
  };

  const handleCompleteTask = async (taskId) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}/complete`, {
        method: "PUT",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.message === "Task marked as complete") {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, status: "Completed" } : task
          )
        );
      } else {
        alert("Failed to complete task");
      }
    } catch (error) {
      alert("Error completing task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.message === "Task deleted successfully") {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        alert("Failed to delete task");
      }
    } catch (error) {
      alert("Error deleting task");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const upcomingTasks = tasks.filter((task) => task.status === "Upcoming");
  const completedTasks = tasks.filter((task) => task.status === "Completed");

  return (
    <div className="task-manager">
      <div className="header">
        <h2>Task Manager</h2>
        <button className="logout-button" onClick={handleLogout} style={{ marginBottom: '10px' }}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="task-form">
        <div className="form-grid">
          <input
            type="text"
            placeholder="Enter task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          />
          <button onClick={handleAddTask}>
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </div>

      <div className="task-section">
        <div className="upcoming-tasks">
          <h3>Upcoming Tasks</h3>
          {upcomingTasks.map((task) => (
            <div key={task.id} className="task-card">
              <h4>{task.title}</h4>
              <div className="task-details">
                <div className="priority" style={{ color: getPriorityColor(task.priority) }}>
                  <Flag size={16} />
                  <span>{task.priority} Priority</span>
                </div>
                <div className="deadline">
                  <Calendar size={16} />
                  <span>{task.deadline}</span>
                </div>
              </div>
              <div className="task-actions">
                <button onClick={() => handleCompleteTask(task.id)} className="complete-btn">
                  <Check size={16} />
                  Complete
                </button>
                <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {upcomingTasks.length === 0 && (
            <p className="empty-message">No upcoming tasks</p>
          )}
        </div>

        <div className="completed-tasks">
          <h3>Completed Tasks</h3>
          {completedTasks.map((task) => (
            <div key={task.id} className="task-card completed">
              <h4>{task.title}</h4>
              <div className="task-details">
                <div className="priority" style={{ color: getPriorityColor(task.priority) }}>
                  <Flag size={16} />
                  <span>{task.priority} Priority</span>
                </div>
                <div className="deadline">
                  <Calendar size={16} />
                  <span>{task.deadline}</span>
                </div>
              </div>
              <div className="task-actions">
                <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {completedTasks.length === 0 && (
            <p className="empty-message">No completed tasks</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;