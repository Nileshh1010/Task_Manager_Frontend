// Define the base URL
let BASE_URL = 'http://127.0.0.1:5000';

export const signupUser = async (name, email, password) => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {  // Corrected syntax
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
};

export const getTasks = async (token) => {
  const response = await fetch(`${BASE_URL}/tasks/`, {  // Corrected syntax
    method: 'GET',
    headers: {
      Authorization: token, // Use 'Bearer' prefix for JWT
    },
  });
  return response.json();
};

// Complete a task by ID
export const completeTask = async (taskId, token) => {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}/complete`, {  // Corrected syntax
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Delete a task by ID
export const deleteTask = async (taskId, token) => {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {  // Corrected syntax
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
