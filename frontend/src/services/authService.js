// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:5003/api/delivery";

export const register = (user) => {
  return axios.post(`${API_URL}/register`, user, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const login = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
