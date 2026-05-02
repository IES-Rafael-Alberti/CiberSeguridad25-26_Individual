const API_BASE_URL = 'http://localhost:3000';

export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('accessToken');
};

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle unauthorized
    clearAuthToken();
    window.location.href = '/login';
  }

  return response;
};

export const api = {
  getProducts: () => fetchWithAuth('/products').then(res => res.json()),
  getServices: () => fetchWithAuth('/services').then(res => res.json()),
  bookService: (serviceId: string) => fetchWithAuth('/services/book', {
    method: 'POST',
    body: JSON.stringify({ serviceId }),
  }).then(res => res.json()),
  getExclusiveOffers: () => fetchWithAuth('/offers/exclusive').then(res => res.json()),
  requestAdoption: (petId: string) => fetchWithAuth('/adoptions', {
    method: 'POST',
    body: JSON.stringify({ petId }),
  }).then(res => res.json()),
  login: (credentials: any) => fetch(`${API_BASE_URL}/auth/dev-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then(res => res.json()),
};
