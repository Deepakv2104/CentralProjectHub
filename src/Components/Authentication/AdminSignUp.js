// AdminSignupForm.js

import React, { useState } from 'react';
import { Button, Input, Typography, Container, Paper } from '@mui/material';

const AdminSignupForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // Add your signup logic here
    console.log('Full Name:', fullName);
    console.log('Email:', email);
    console.log('College ID:', collegeId);
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
       
        <Input
          disableUnderline  
          placeholder='Full Name'
          variant="outlined"
          margin="normal"
          fullWidth
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          disableUnderline  
          placeholder="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          disableUnderline  
          placeholder="College ID"
          variant="outlined"
          margin="normal"
          fullWidth
          value={collegeId}
          onChange={(e) => setCollegeId(e.target.value)}
        />
        <Input
          disableUnderline  
          placeholder="Username"
          variant="outlined"
          margin="normal"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          disableUnderline  
          placeholder="Password"
          variant="outlined"
          margin="normal"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
       
        <Button variant="contained" color="primary" onClick={handleSignup} style={{ marginTop: 20 }}>
          Signup
        </Button>
      </Paper>
    </Container>
  );
};

export default AdminSignupForm;
