const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token if expired/revoked
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth_unauthorized'));
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getMe: () => request('/auth/me'),
  },

  tasks: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '' && val !== 'all') {
          searchParams.append(key, val);
        }
      });
      const query = searchParams.toString();
      return request(`/tasks${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/tasks/${id}`),
    create: (taskData) =>
      request('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      }),
    update: (id, updates) =>
      request(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    delete: (id) =>
      request(`/tasks/${id}`, {
        method: 'DELETE',
      }),
    getStats: () => request('/tasks/stats'),
    getActivities: (limit = 15) => request(`/tasks/activities?limit=${limit}`),
  },
};
