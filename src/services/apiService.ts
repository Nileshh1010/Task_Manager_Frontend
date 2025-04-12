
import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update this with your actual backend URL
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include the auth token in all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (username: string, email: string, password: string) => {
    try {
      const response = await API.post('/auth/register', { username, email, password });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Task Services
export const taskService = {
  getAllTasks: async () => {
    try {
      const response = await API.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },
  
  createTask: async (taskData: any) => {
    try {
      const response = await API.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },
  
  updateTask: async (id: string, taskData: any) => {
    try {
      const response = await API.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },
  
  deleteTask: async (id: string) => {
    try {
      const response = await API.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  }
};

// Category Services
export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await API.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },
  
  createCategory: async (categoryData: any) => {
    try {
      const response = await API.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  }
};

// Tracking Services
export const trackingService = {
  getAllTrackings: async () => {
    try {
      const response = await API.get('/tracking');
      return response.data;
    } catch (error) {
      console.error('Get trackings error:', error);
      throw error;
    }
  },
  
  createTracking: async (trackingData: any) => {
    try {
      const response = await API.post('/tracking', trackingData);
      return response.data;
    } catch (error) {
      console.error('Create tracking error:', error);
      throw error;
    }
  }
};

// Notification Services
export const notificationService = {
  getAllNotifications: async () => {
    try {
      const response = await API.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },
  
  markAsRead: async (id: string) => {
    try {
      const response = await API.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }
};
