import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import UploadMarks from './pages/UploadMarks';
import ShowMarks from './pages/ShowMarks';
import ForgotPassword from './pages/ForgotPassword'; // Import ForgotPassword page
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* fjghkg */}
          <Route
            path="/upload-marks"
            element={
              <PrivateRoute allowedRoles={['teacher']}>
                <UploadMarks />
              </PrivateRoute>
            }
          />
          <Route
            path="/show-marks"
            element={
              <PrivateRoute allowedRoles={['teacher', 'student']}>
                <ShowMarks />
              </PrivateRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
