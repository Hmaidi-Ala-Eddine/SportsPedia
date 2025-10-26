import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const athleteAPI = {
  getAll: (params) => api.get('/persons/athletes', { params }),
  getById: (id) => api.get(`/persons/athletes/${id}`),
};

export const teamAPI = {
  getAll: (params) => api.get('/teams', { params }),
  getById: (id) => api.get(`/teams/${id}`),
  getRoster: (id) => api.get(`/teams/${id}/roster`),
};

export const competitionAPI = {
  getAll: (params) => api.get('/competitions', { params }),
  getLeagues: (params) => api.get('/competitions/leagues', { params }),
  getMatches: (params) => api.get('/competitions/matches', { params }),
};

export const venueAPI = {
  getAll: (params) => api.get('/venues', { params }),
  getById: (id) => api.get(`/venues/${id}`),
};

export const sportAPI = {
  getAll: (params) => api.get('/sports', { params }),
  getTeamSports: (params) => api.get('/sports/team-sports', { params }),
};

export const organizationAPI = {
  getAll: (params) => api.get('/organizations', { params }),
};

export const equipmentAPI = {
  getAll: (params) => api.get('/equipment', { params }),
};

export const mediaAPI = {
  getAll: (params) => api.get('/media', { params }),
};

export const performanceAPI = {
  getAll: (params) => api.get('/performance/records', { params }),
  getByAthlete: (id, params) => api.get(`/performance/athletes/${id}/records`, { params }),
};

export const sponsorshipAPI = {
  getAll: (params) => api.get('/sponsorships', { params }),
};

export const searchAPI = {
  search: (query, params) => api.get('/search', { params: { q: query, ...params } }),
  suggest: (query, params) => api.get('/search/suggest', { params: { q: query, ...params } }),
};

export default api;