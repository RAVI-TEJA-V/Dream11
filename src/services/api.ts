import axios from 'axios';

const API_URL = 'http://localhost:5132/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const playerApi = {
  getAll: () => api.get('/players'),
  getStats: () => api.get('/players/stats'),
  getTopThree: () => api.get('/players/top-three'),
  create: (name: string) => api.post('/players', { name }),
};

export const matchApi = {
  getAll: () => api.get('/matches'),
  create: (winners: { playerId: string; earnings: number }[]) => 
    api.post('/matches', { winners }),
};

export default api; 