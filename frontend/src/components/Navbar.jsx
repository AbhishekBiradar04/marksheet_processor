import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          borderRadius: 2,
          padding: '8px 0',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingX: 2,
          }}
        >
          {/* Logo and Title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src="https://media-hosting.imagekit.io//60dded609ffd4e2a/Screenshot 2025-01-22 121740.png?Expires=1832136471&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=xibQ2v0ogGsYliag~~l62W4of3dm~HkqRNoaz8qqL77QSZCr9AVBFpRbB~9an5uEiWU2rl-Ry-xGuehxYdEur~IvekQgEIkmeAEn7ozFpzbVo-qYxs-VS0u3t1HAx89Es3i0AAahtWCj68XFjYLiXEx3PXYslT3OcNQ4yz8FK2EHgq4T5UohI4TzZyej6XOFTuMXpDG1wz7GrrokbssLUjRSSig3AWZUpv~JdMr8FbWvQP5cWe1ThrQVUG-CTQogd8YSLkZ7H-qm8No7GhTmE35z1B8U45Bct~ZQYqOwNZjGa1yiePQxNZVhC0zldfQv5HGlZ1izOlsc0IrzDaFM1A__"
              alt="Logo"
              style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '50%' }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              Marksheet Processor
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Box>
            {user.role === 'teacher' && (
              <Button
                component={Link}
                to="/upload-marks"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  marginRight: 2,
                  borderRadius: 3,
                  padding: '6px 16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Upload Marks
              </Button>
            )}
            <Button
              component={Link}
              to="/show-marks"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                marginRight: 2,
                borderRadius: 3,
                padding: '6px 16px',
                background: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Show Marks
            </Button>
            <Button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: 3,
                padding: '6px 16px',
                background: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;
