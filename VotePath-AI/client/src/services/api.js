import axios from 'axios';

// In production: VITE_API_URL = Render backend URL
// In development: Vite proxy handles /api → localhost:5002
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// ── JWT Token Interceptor ─────────────────────────────────
// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('votepath_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (expired token)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('votepath_token');
      localStorage.removeItem('votepath_user');
      // Only redirect if not already on auth page
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * @typedef {import('axios').AxiosResponse} AxiosResponse
 */

/**
 * Register a new user with email and password.
 * @param {Object} data - User registration data (name, email, password).
 * @returns {Promise<AxiosResponse>}
 */
export const authRegister = async (data) => {
  console.log('api.js: authRegister started');
  try {
    const res = await API.post('/auth/register', data);
    console.log('api.js: authRegister succeeded');
    return res;
  } catch (e) {
    console.error('api.js: authRegister then', e);
    throw e;
  }
};

/**
 * Login an existing user with email and password.
 * @param {Object} data - Login credentials (email, password).
 * @returns {Promise<AxiosResponse>}
 */
export const authLogin = async (data) => {
  console.log('api.js: authLogin started');
  try {
    const res = await API.post('/auth/login', data);
    console.log('api.js: authLogin succeeded');
    return res;
  } catch (e) {
    console.error('api.js: authLogin then', e);
    throw e;
  }
};

/**
 * Authenticate or register a user using a Firebase Google ID Token.
 * @param {string} idToken - The Firebase ID token.
 * @returns {Promise<AxiosResponse>}
 */
export const authGoogle = async (idToken) => {
  console.log('api.js: authGoogle started');
  try {
    const res = await API.post('/auth/google', { idToken });
    console.log('api.js: authGoogle succeeded');
    return res;
  } catch (e) {
    console.error('api.js: authGoogle then', e);
    throw e;
  }
};

/**
 * Complete the user profile during initial setup.
 * @param {Object} data - Profile details (state, age, isFirstTimeVoter, etc.).
 * @returns {Promise<AxiosResponse>}
 */
export const authCompleteProfile = async (data) => {
  console.log('api.js: authCompleteProfile started');
  try {
    const res = await API.put('/auth/complete-profile', data);
    console.log('api.js: authCompleteProfile succeeded');
    return res;
  } catch (e) {
    console.error('api.js: authCompleteProfile then', e);
    throw e;
  }
};

/**
 * Update the existing user profile details.
 * @param {Object} data - Updated profile fields.
 * @returns {Promise<AxiosResponse>}
 */
export const authUpdateProfile = async (data) => {
  console.log('api.js: authUpdateProfile started');
  try {
    const res = await API.put('/auth/update-profile', data);
    console.log('api.js: authUpdateProfile succeeded');
    return res;
  } catch (e) {
    console.error('api.js: authUpdateProfile then', e);
    throw e;
  }
};

/**
 * Fetch the currently authenticated user's profile based on the JWT token.
 * @returns {Promise<AxiosResponse>}
 */
export const authGetMe = async () => {
  console.log('api.js: authGetMe started');
  try {
    const res = await API.get('/auth/me');
    console.log('api.js: authGetMe succeeded');
    return res;
  } catch (e) {
    console.error('api.js: authGetMe then', e);
    throw e;
  }
};

// ── User APIs ─────────────────────────────────────────────

/**
 * Initialize user-specific data on the backend.
 * @param {Object} data - Initialization data.
 * @returns {Promise<AxiosResponse>}
 */
export const initUser = async (data) => {
  console.log('api.js: initUser started');
  try {
    const res = await API.post('/user/init', data);
    console.log('api.js: initUser succeeded');
    return res;
  } catch (e) {
    console.error('api.js: initUser then', e);
    throw e;
  }
};

/**
 * Fetch a specific user's public profile data.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<AxiosResponse>}
 */
export const getUser = async (userId) => {
  console.log('api.js: getUser started');
  try {
    const res = await API.get(`/user/${userId}`);
    console.log('api.js: getUser succeeded');
    return res;
  } catch (e) {
    console.error('api.js: getUser then', e);
    throw e;
  }
};

/**
 * Fetch the voter journey steps for a specific user.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<AxiosResponse>}
 */
export const getJourney = async (userId) => {
  console.log('api.js: getJourney started');
  try {
    const res = await API.get(`/journey/${userId}`);
    console.log('api.js: getJourney succeeded');
    return res;
  } catch (e) {
    console.error('api.js: getJourney then', e);
    throw e;
  }
};

/**
 * Fetch the election timeline for a user's specific state/region.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<AxiosResponse>}
 */
export const getTimeline = async (userId) => {
  console.log('api.js: getTimeline started');
  try {
    const res = await API.get(`/timeline/${userId}`);
    console.log('api.js: getTimeline succeeded');
    return res;
  } catch (e) {
    console.error('api.js: getTimeline then', e);
    throw e;
  }
};

// ── Chat API ─────────────────────────────────────────────

/**
 * Send a message to the AI assistant.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} message - The user's prompt message.
 * @returns {Promise<AxiosResponse>}
 */
export const sendChatMessage = async (userId, message) => {
  console.log('api.js: sendChatMessage started');
  try {
    const res = await API.post('/chat', { userId, message });
    console.log('api.js: sendChatMessage succeeded');
    return res;
  } catch (e) {
    console.error('api.js: sendChatMessage then', e);
    throw e;
  }
};

/**
 * Retrieve the chat history between the user and AI assistant.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<AxiosResponse>}
 */
export const getChatHistory = async (userId) => {
  console.log('api.js: getChatHistory started');
  try {
    const res = await API.get(`/chat/${userId}/history`);
    console.log('api.js: getChatHistory succeeded');
    return res;
  } catch (e) {
    console.error('api.js: getChatHistory then', e);
    throw e;
  }
};

// ── Checklist APIs ─────────────────────────────────────────────

/**
 * Fetch the smart checklist for a specific user.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<AxiosResponse>}
 */
export const getChecklist = async (userId) => {
  console.log('api.js: getChecklist started');
  try {
    const res = await API.get(`/checklist/${userId}`);
    console.log('api.js: getChecklist succeeded');
    return res;
  } catch (e) {
    console.error('api.js: getChecklist then', e);
    throw e;
  }
};

/**
 * Update the completion status of a checklist item.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} itemKey - The key identifier of the checklist item.
 * @param {boolean} completed - The new completion status.
 * @returns {Promise<AxiosResponse>}
 */
export const updateChecklistItem = async (userId, itemKey, completed) => {
  console.log('api.js: updateChecklistItem started');
  try {
    const res = await API.post('/checklist/update', { userId, itemKey, completed });
    console.log('api.js: updateChecklistItem succeeded');
    return res;
  } catch (e) {
    console.error('api.js: updateChecklistItem then', e);
    throw e;
  }
};

// ── Scenario APIs ─────────────────────────────────────────────

/**
 * Fetch a list of available voter scenarios.
 * @returns {Promise<AxiosResponse>}
 */
export const getScenarios = async () => {
  console.log('api.js: getScenarios started');
  try {
    const res = await API.get('/scenario/list');
    console.log('api.js: getScenarios succeeded');
    return res;
  } catch (e) {
    console.error('api.js: getScenarios then', e);
    throw e;
  }
};

/**
 * Run a specific voter simulation scenario.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} scenarioType - The type of scenario to run.
 * @returns {Promise<AxiosResponse>}
 */
export const runScenario = async (userId, scenarioType) => {
  console.log('api.js: runScenario started');
  try {
    const res = await API.post('/scenario', { userId, scenarioType });
    console.log('api.js: runScenario succeeded');
    return res;
  } catch (e) {
    console.error('api.js: runScenario then', e);
    throw e;
  }
};

// ── Booth API ─────────────────────────────────────────────

/**
 * Get booth guidance based on pincode and area.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} pincode - The area pincode.
 * @param {string} area - The specific area name.
 * @returns {Promise<AxiosResponse>}
 */
export const getBoothGuide = async (userId, pincode, area) => {
  console.log('api.js: getBoothGuide started');
  try {
    const res = await API.post('/booth', { userId, pincode, area });
    console.log('api.js: getBoothGuide succeeded');
    return res;
  } catch (e) {
    console.error('api.js: getBoothGuide then', e);
    throw e;
  }
};

// ── Quiz APIs ─────────────────────────────────────────────

/**
 * Fetch a new election knowledge quiz.
 * @returns {Promise<AxiosResponse>}
 */
export const getQuiz = async () => {
  console.log('api.js: getQuiz started');
  try {
    const res = await API.get('/quiz');
    console.log('api.js: getQuiz succeeded');
    return res;
  } catch (e) {
    console.error('api.js: getQuiz then', e);
    throw e;
  }
};

/**
 * Submit quiz answers and retrieve results/score.
 * @param {string} userId - The unique identifier of the user.
 * @param {Object} answers - User's selected answers.
 * @returns {Promise<AxiosResponse>}
 */
export const submitQuiz = async (userId, answers) => {
  console.log('api.js: submitQuiz started');
  try {
    const res = await API.post('/quiz/submit', { userId, answers });
    console.log('api.js: submitQuiz succeeded');
    return res;
  } catch (e) {
    console.error('api.js: submitQuiz then', e);
    throw e;
  }
};

// ── Health check ─────────────────────────────────────────────

/**
 * Check backend API health and connectivity status.
 * @returns {Promise<AxiosResponse>}
 */
export const getHealth = async () => {
  console.log('api.js: getHealth started');
  try {
    const res = await API.get('/health');
    console.log('api.js: getHealth succeeded');
    return res;
  } catch (e) {
    console.error('api.js: getHealth then', e);
    throw e;
  }
};

// ── Translate API ─────────────────────────────────────────────

/**
 * Translate text into one of the 22 Indian languages.
 * @param {string} text - The source text to translate.
 * @param {string} targetLanguage - Human-readable name of the target language.
 * @param {string} targetLanguageCode - ISO code of the target language.
 * @returns {Promise<AxiosResponse>}
 */
export const translateText = async (text, targetLanguage, targetLanguageCode) => {
  console.log('api.js: translateText started');
  try {
    const res = await API.post('/translate', { text, targetLanguage, targetLanguageCode });
    console.log('api.js: translateText succeeded');
    return res;
  } catch (e) {
    console.error('api.js: translateText then', e);
    throw e;
  }
};

export default API;
