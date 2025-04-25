const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
const Marks = require('../models/Marks');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Your existing marks-related routes with authentication
router.post('/process-image', authenticateToken, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Access denied' });
  }
  // Your existing image processing code
});

router.get('/:section/:usn/:subject', authenticateToken, async (req, res) => {
  // Your existing get marks code
});

module.exports = router;