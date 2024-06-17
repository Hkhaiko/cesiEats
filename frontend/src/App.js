// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import axios from 'axios';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<AccountPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
