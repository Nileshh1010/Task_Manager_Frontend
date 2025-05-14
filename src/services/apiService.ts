import axios from 'axios';

interface Category {
  id: number;
  name: string;
  user_id: number;
}

interface CreateCategoryRequest {
  name: string;
}

interface CreateTaskRequest {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  category_id: number;
}

interface TaskResponse {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  category_id: number;
  status: 'Upcoming' | 'In Progress' | 'Completed';
}

// Update Task interfaces
interface Task {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  category_id: number;
  status: 'Upcoming' | 'In Progress' | 'Completed';
}

interface TrackingHistory {
  changed_at: string;
  from: string;
  to: string;
  task_id: number;
  title: string;
}

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
    timeout: 10000
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
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

// Add error interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error - Check if backend server is running');
        }
        return Promise.reject(error);
    }
);

// Authentication Services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        const userData = response.data.user || {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return { user: userData, token: response.data.token };
      }
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { 
        name: username, 
        email, 
        password 
      });
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
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Task Services
export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get('/tasks/');
      if (response.data?.tasks) {
        return response.data.tasks;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Please login to view tasks');
        }
        if (error.response?.status === 500) {
          throw new Error('Server error while fetching tasks');
        }
        throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
      }
      throw error;
    }
  },

  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate required fields before sending
      if (!taskData.title || !taskData.priority || !taskData.deadline || !taskData.category_id) {
        throw new Error('Missing required fields');
      }

      const response = await api.post('/tasks/', {
        title: taskData.title,
        priority: taskData.priority,
        deadline: taskData.deadline,
        category_id: taskData.category_id
      });

      if (!response.data || !response.data.task) {
        throw new Error('Invalid response format');
      }

      return response.data.task;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Please login to create tasks');
        }
        if (error.response?.status === 400) {
          throw new Error(error.response.data?.error || 'Invalid task data');
        }
        throw new Error(error.response?.data?.error || 'Failed to create task');
      }
      throw error;
    }
  },

  completeTask: async (taskId: number): Promise<{ message: string }> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.put(`/tasks/${taskId}/complete`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Task not found');
        }
        throw new Error(error.response?.data?.error || 'Failed to complete task');
      }
      throw error;
    }
  },

  deleteTask: async (taskId: number): Promise<{ message: string }> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Task not found');
        }
        throw new Error(error.response?.data?.error || 'Failed to delete task');
      }
      throw error;
    }
  }
};

// Category Services
export const categoryService = {
  createCategory: async (name: string): Promise<Category> => {
    try {
      const response = await api.post('/categories/', { name });
      if (response.data?.category) {
        return response.data.category;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  },

  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/categories/');
      if (response.data?.categories) {
        return response.data.categories;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }
};

// Tracking Services
export const trackingService = {
  getTrackingHistory: async (taskId: number): Promise<TrackingHistory[]> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/tracking/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data.history || [];
    } catch (error) {
      console.error('Get tracking history error:', error);
      throw error;
    }
  }
};

// Notification Services
export const notificationService = {
  getAllNotifications: async () => {
    try {
      const response = await api.get('/notifications/', { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  createNotification: async (notificationData: any) => {
    try {
      const response = await api.post('/notifications/', notificationData, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }
};

export default api;
