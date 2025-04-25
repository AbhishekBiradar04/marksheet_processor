import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, TextField, Button, Box, Typography, Link, IconButton, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import backgroundImage from '../assets/imagee.avif';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3002/api/auth/login', {
        email,
        password,
      });
      login(res.data.token, res.data.role);
      navigate('/show-marks');
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: 4,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
            padding: 5,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <img
              src="https://media-hosting.imagekit.io//60dded609ffd4e2a/Screenshot 2025-01-22 121740.png?Expires=1832136471&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=xibQ2v0ogGsYliag~~l62W4of3dm~HkqRNoaz8qqL77QSZCr9AVBFpRbB~9an5uEiWU2rl-Ry-xGuehxYdEur~IvekQgEIkmeAEn7ozFpzbVo-qYxs-VS0u3t1HAx89Es3i0AAahtWCj68XFjYLiXEx3PXYslT3OcNQ4yz8FK2EHgq4T5UohI4TzZyej6XOFTuMXpDG1wz7GrrokbssLUjRSSig3AWZUpv~JdMr8FbWvQP5cWe1ThrQVUG-CTQogd8YSLkZ7H-qm8No7GhTmE35z1B8U45Bct~ZQYqOwNZjGa1yiePQxNZVhC0zldfQv5HGlZ1izOlsc0IrzDaFM1A__"
              alt="Logo"
              style={{ width: 100, borderRadius: '50%' }}
            />
          </Box>
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: '#333',
              fontWeight: 'bold',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Welcome Back!
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ff6f61 0%, #de4463 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #de4463 0%, #ff6f61 100%)',
                },
              }}
            >
              Login
            </Button>
          </form>
          <Link
            href="/forgot-password"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 3,
              color: '#de4463',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Forgot Password?
          </Link>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Login;
