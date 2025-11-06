import axios from 'axios';

const baseURL = process.env.VUE_APP_API_BASE_URL || 'http://192.168.15.9:8080';

let authToken = null;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  // usa token em memória ou, se faltar, do localStorage
  const token = authToken || (typeof localStorage !== 'undefined' && localStorage.getItem('jwt_token'));
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// log simples em desenvolvimento para validar o header
if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use((config) => {
    const hasAuth = config && config.headers && !!config.headers.Authorization;
    const method = (config && config.method && config.method.toUpperCase()) || 'GET';
    const url = (api.defaults.baseURL || '') + (config && config.url ? config.url : '');
    // eslint-disable-next-line no-console
    console.log('[API]', method, url, 'Authorization:', hasAuth ? 'ON' : 'OFF');
    return config;
  });
}

api.interceptors.response.use(
  function (response) { return response; },
  function (err) {
    if (err && err.response && err.response.status === 401) {
      // opcional: redirecionar
      // window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export function setAuthToken(token) {
  authToken = token || null;
  if (token) {
    api.defaults.headers.common.Authorization = 'Bearer ' + token;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
export function clearAuthToken() {
  authToken = null;
  delete api.defaults.headers.common.Authorization;
}
export function getAuthToken() {
  return authToken;
}

export default api;