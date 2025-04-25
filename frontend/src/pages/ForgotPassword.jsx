import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [OTP, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleSendOTP = async () => {
    try {
      await axios.post('http://localhost:3002/api/auth/forgot-password', { email });
      alert('OTP sent to your email.');
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send OTP.');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('http://localhost:3002/api/auth/reset-password', { email, OTP, newPassword });
      alert('Password reset successfully.');
      setStep(1);
      setEmail('');
      setOTP('');
      setNewPassword('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reset password.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            maxWidth: 400,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: '#333',
              fontWeight: 'bold',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </Typography>
          {step === 1 && (
            <Box component="form" onSubmit={(e) => e.preventDefault()}>
              <TextField
                label="Enter your email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleSendOTP}
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)',
                  },
                }}
              >
                Send OTP
              </Button>
            </Box>
          )}
          {step === 2 && (
            <Box component="form" onSubmit={(e) => e.preventDefault()}>
              <TextField
                label="Enter OTP"
                variant="outlined"
                fullWidth
                margin="normal"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                  },
                }}
              />
              <TextField
                label="Enter new password"
                variant="outlined"
                fullWidth
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleResetPassword}
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)',
                  },
                }}
              >
                Reset Password
              </Button>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ForgotPassword;
