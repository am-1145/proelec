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
export const authRegister = (data) => API.post('/auth/register', data);

/**
 * Login an existing user with email and password.
 * @param {Object} data - Login credentials (email, password).
 * @returns {Promise<AxiosResponse>}
 */
export const authLogin = (data) => API.post('/auth/login', data);

/**
 * Authenticate or register a user using a Firebase Google ID Token.
 * @param {string} idToken - The Firebase ID token.
 * @returns {Promise<AxiosResponse>}
 */
export const authGoogle = (idToken) => API.post('/auth/google', { idToken });

/**
 * Complete the user profile during initial setup.
 * @param {Object} data - Profile details (state, age, isFirstTimeVoter, etc.).
 * @returns {Promise<AxiosResponse>}
 */
export const authCompleteProfile = (data) => API.put('/auth/complete-profile', data);

/**
 * Update the existing user profile details.
 * @param {Object} data - Updated profile fields.
 * @returns {Promise<AxiosResponse>}
 */
export const authUpdateProfile = (data) => API.put('/auth/update-profile', data);

/**
 * Fetch the currently authenticated user's profile based on the JWT token.
 * @returns {Promise<AxiosResponse>}
 */
export const authGetMe = () => API.get('/auth/me');

// ── User APIs ─────────────────────────────────────────────

/**
 * Initialize user-specific data on the backend.
 * @param {Object} data - Initialization data.
 * @returns {Promise<AxiosResponse>}
 */
export const initUser = (data) => API.post('/user/init', data);

/**
 * Fetch a specific user's public profile data.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<AxiosResponse>}
 */
export const getUser = (userId) => API.get(`/user/${userId}`);

/**
 * Fetch the voter journey steps for a specific user.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<AxiosResponse>}
 */
export const getJourney = (userId) => API.get(`/journey/${userId}`);

/**
 * Fetch the election timeline for a user's specific state/region.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<AxiosResponse>}
 */
export const getTimeline = (userId) => API.get(`/timeline/${userId}`);

// ── Chat API ─────────────────────────────────────────────

/**
 * Send a message to the AI assistant.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} message - The user's prompt message.
 * @returns {Promise<AxiosResponse>}
 */
export const sendChatMessage = (userId, message) => API.post('/chat', { userId, message });

/**
 * Retrieve the chat history between the user and AI assistant.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<AxiosResponse>}
 */
export const getChatHistory = (userId) => API.get(`/chat/${userId}/history`);

// ── Checklist APIs ─────────────────────────────────────────────

/**
 * Fetch the smart checklist for a specific user.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<AxiosResponse>}
 */
export const getChecklist = (userId) => API.get(`/checklist/${userId}`);

/**
 * Update the completion status of a checklist item.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} itemKey - The key identifier of the checklist item.
 * @param {boolean} completed - The new completion status.
 * @returns {Promise<AxiosResponse>}
 */
export const updateChecklistItem = (userId, itemKey, completed) =>
  API.post('/checklist/update', { userId, itemKey, completed });

// ── Scenario APIs ─────────────────────────────────────────────

/**
 * Fetch a list of available voter scenarios.
 * @returns {Promise<AxiosResponse>}
 */
export const getScenarios = () => API.get('/scenario/list');

/**
 * Run a specific voter simulation scenario.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} scenarioType - The type of scenario to run.
 * @returns {Promise<AxiosResponse>}
 */
export const runScenario = (userId, scenarioType) => API.post('/scenario', { userId, scenarioType });

// ── Booth API ─────────────────────────────────────────────

/**
 * Get booth guidance based on pincode and area.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} pincode - The area pincode.
 * @param {string} area - The specific area name.
 * @returns {Promise<AxiosResponse>}
 */
export const getBoothGuide = (userId, pincode, area) => API.post('/booth', { userId, pincode, area });

// ── Quiz APIs ─────────────────────────────────────────────

/**
 * Fetch a new election knowledge quiz.
 * @returns {Promise<AxiosResponse>}
 */
export const getQuiz = () => API.get('/quiz');

/**
 * Submit quiz answers and retrieve results/score.
 * @param {string} userId - The unique identifier of the user.
 * @param {Object} answers - User's selected answers.
 * @returns {Promise<AxiosResponse>}
 */
export const submitQuiz = (userId, answers) => API.post('/quiz/submit', { userId, answers });

// ── Health check ─────────────────────────────────────────────

/**
 * Check backend API health and connectivity status.
 * @returns {Promise<AxiosResponse>}
 */
export const getHealth = () => API.get('/health');

// ── Translate API ─────────────────────────────────────────────

/**
 * Translate text into one of the 22 Indian languages.
 * @param {string} text - The source text to translate.
 * @param {string} targetLanguage - Human-readable name of the target language.
 * @param {string} targetLanguageCode - ISO code of the target language.
 * @returns {Promise<AxiosResponse>}
 */
export const translateText = (text, targetLanguage, targetLanguageCode) =>
  API.post('/translate', { text, targetLanguage, targetLanguageCode });

export default API;
