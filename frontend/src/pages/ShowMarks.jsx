import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

// Custom Styled Table
const StyledTableContainer = styled(TableContainer)({
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
});

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  fontSize: '16px',
  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  color: '#fff',
  textAlign: 'center',
});

const ShowMarks = () => {
  const { user } = useAuth();
  const [section, setSection] = useState('');
  const [usn, setUsn] = useState('');
  const [subject, setSubject] = useState('');
  const [marksData, setMarksData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      alert('You must be logged in to view marks.');
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3002/api/marks/${section}/${usn}/${subject}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setMarksData(res.data.marksDetails);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch marks data. Please check your inputs.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
            p: 4,
            borderRadius: 4,
            boxShadow: 4,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#fff', mb: 3 }}>
            Show Marks
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Section"
              variant="outlined"
              fullWidth
              margin="normal"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2 }}
            />
            <TextField
              label="USN"
              variant="outlined"
              fullWidth
              margin="normal"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2 }}
            />
            <TextField
              label="Subject"
              variant="outlined"
              fullWidth
              margin="normal"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)',
                },
              }}
            >
              Fetch Marks
            </Button>
          </form>

          {marksData && (
            <StyledTableContainer component={Paper} sx={{ mt: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Question Number</StyledTableCell>
                    <StyledTableCell>Max Marks</StyledTableCell>
                    <StyledTableCell>Part A</StyledTableCell>
                    <StyledTableCell>Part B</StyledTableCell>
                    <StyledTableCell>Part C</StyledTableCell>
                    <StyledTableCell>Part D</StyledTableCell>
                    <StyledTableCell>Total</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {marksData.questions.map((question, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(106, 17, 203, 0.1)' },
                      }}
                    >
                      <TableCell align="center">{question.questionNumber}</TableCell>
                      <TableCell align="center">{question.maxMarks}</TableCell>
                      <TableCell align="center">{question.marksObtained.a || 0}</TableCell>
                      <TableCell align="center">{question.marksObtained.b || 0}</TableCell>
                      <TableCell align="center">{question.marksObtained.c || 0}</TableCell>
                      <TableCell align="center">{question.marksObtained.d || 0}</TableCell>
                      <TableCell align="center">{question.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          )}

          {marksData && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: '#000',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  display: 'inline-block',
                }}
              >
                Total Obtained Marks: {marksData.summary.totalObtainedMarks} /{' '}
                {marksData.summary.totalMaxMarks}
              </Typography>
            </Box>
          )}
        </Box>
      </motion.div>
    </Container>
  );
};

export default ShowMarks;
