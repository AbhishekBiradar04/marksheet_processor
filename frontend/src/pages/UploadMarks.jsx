import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, Button, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const UploadMarks = () => {
  const { user } = useAuth(); // Get the logged-in user's token
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please upload an image!');
      return;
    }

    if (!user || !user.token) {
      alert('You must be logged in to upload marks.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:3002/api/process-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`, // Pass the token in the header
        },
      });
      setResponse(res.data);
      alert('Marks uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload marks.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          color: 'white',
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Upload Marks
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2, backgroundColor: 'white', color: '#6a11cb', fontWeight: 'bold' }}
          >
            Choose File
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </Button>
          {image && <Typography sx={{ mt: 2, fontWeight: 'bold' }}>{image.name}</Typography>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.5, borderRadius: 2, background: 'black', color: 'white' }}
          >
            Upload
          </Button>
        </form>
        {response && (
          <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold">Response:</Typography>
            <Typography fontWeight="bold">Marks Uploaded Successfully</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UploadMarks;
