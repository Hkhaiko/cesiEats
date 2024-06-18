import React, { useState, useContext } from "react";
import { login } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const { login: loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      loginUser(response.data); // Utiliser le contexte pour enregistrer l'utilisateur
      alert("Login successful");
      navigate("/"); // Rediriger vers la page d'accueil après connexion
    } catch (err) {
      console.error(err);
      alert("Error during login");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
