import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Tasks.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", priority: "High", deadline: "" });
  const navigate = useNavigate();

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

  const upcomingTasks = tasks.filter((task) => task.status === "Upcoming");
  const completedTasks = tasks.filter((task) => task.status === "Completed");

  return (
    <div className="task-manager">
      <div className="task-form">
        <h2>TASK MANAGER</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <div className="task-section">
        <div className="upcoming-tasks">
          <h3>Upcoming Tasks</h3>
          {upcomingTasks.map((task) => (
            <div key={task.id} className="task-card">
              <h4>{task.title}</h4>
              <p>Priority: {task.priority}</p>
              <p>Deadline: {task.deadline}</p>
              <button onClick={() => handleCompleteTask(task.id)}>Complete</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </div>

        <div className="completed-tasks">
          <h3>Completed Tasks</h3>
          {completedTasks.map((task) => (
            <div key={task.id} className="task-card">
              <h4>{task.title}</h4>
              <p>Priority: {task.priority}</p>
              <p>Deadline: {task.deadline}</p>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
