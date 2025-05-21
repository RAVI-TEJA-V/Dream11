import axios from 'axios';

// const API_URL = 'http://localhost:5132/api';
const API_URL = import.meta.env.VITE_BACKEND ? `${import.meta.env.VITE_BACKEND}/api` : 'http://localhost:5132/api';

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
  createBulk: (players: string[]) => api.post('/players/bulk', { players }),
};

export const matchApi = {
  getAll: () => api.get('/matches'),
  create: (winners: { playerId: string; earnings: number }[], matchName?: string) => 
    api.post('/matches', { winners, matchName }),
};

export default api; 