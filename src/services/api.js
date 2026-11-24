// API Service layer connecting the frontend React app directly to Express & MongoDB
// Automatically detects host IP so friends on the same Wi-Fi connect to your backend seamlessly
const API_BASE = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:5001/api`
  : 'http://localhost:5001/api';

/**
 * Standard fetch wrapper that handles JSON headers and JWT Bearer authorization
 */
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('ledger_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const authApi = {
  async register(userData) {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async login(credentials) {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async getMe() {
    return fetchWithAuth('/auth/me');
  },

  async updateMe(profileData) {
    return fetchWithAuth('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

export const transactionsApi = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.type && params.type !== 'all') query.append('type', params.type);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchWithAuth(`/transactions${qs}`);
  },

  async create(txData) {
    return fetchWithAuth('/transactions', {
      method: 'POST',
      body: JSON.stringify(txData),
    });
  },

  async update(id, txData) {
    return fetchWithAuth(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(txData),
    });
  },

  async delete(id) {
    return fetchWithAuth(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  async getStats() {
    return fetchWithAuth('/transactions/stats');
  },
};

export const budgetsApi = {
  async getAll() {
    return fetchWithAuth('/budgets');
  },

  async set(category, limit, month) {
    return fetchWithAuth('/budgets', {
      method: 'POST',
      body: JSON.stringify({ category, limit, month }),
    });
  },

  async delete(id) {
    return fetchWithAuth(`/budgets/${id}`, {
      method: 'DELETE',
    });
  },
};

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      return { isConnected: true, data };
    }
  } catch (err) {
    // Server is either offline or proxying
  }
  return { isConnected: false };
}
