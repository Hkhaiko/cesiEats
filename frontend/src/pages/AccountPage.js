// src/pages/ProfilePage.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AccountPage() {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <Button onClick={() => navigate('/')}>Go to Home</Button>
    </div>
  );
}

export default AccountPage;