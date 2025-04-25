const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { OpenAI } = require('openai');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Import nodemailer for sending emails

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'student'], required: true },
}, { collection: 'users' });

const MarksSchema = new mongoose.Schema({
  section: String,
  usn: String,
  subject: String,
  marksDetails: Object,
}, { collection: 'marksData' });

const User = mongoose.model('User', UserSchema);
const Marks = mongoose.model('Marks', MarksSchema);

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store OTPs temporarily in memory
let otpStore = {}; // For storing OTPs in-memory (Consider using a more permanent storage in production)

// Helper Functions
function cleanJsonString(str) {
  str = str.replace(/```json\n?/g, '').replace(/```/g, '');
  const jsonStart = str.indexOf('{');
  const jsonEnd = str.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    str = str.substring(jsonStart, jsonEnd + 1);
  }
  return str.trim();
}

function transformData(extractedData) {
  return {
    section: extractedData.Section,
    usn: extractedData.USN || extractedData.usn,
    subject: extractedData.Subject || extractedData.subject,
    marksDetails: {
      questions: extractedData['Marks Details'].Questions.filter(
        (q) => q['Maximum Marks'] > 0 && q.Total > 0
      ).map((q) => ({
        questionNumber: q['Question Number'],
        maxMarks: q['Maximum Marks'],
        marksObtained: q['Marks Obtained'] || { a: 0, b: 0, c: 0, d: 0 },
        total: q.Total,
      })),
      summary: {
        totalMaxMarks: extractedData['Marks Details'].Summary['Total Maximum Marks'],
        totalObtainedMarks: extractedData['Marks Details'].Summary['Total Obtained Marks'],
      },
    },
  };
}

// Send OTP for Password Reset
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a 6-digit OTP
    const OTP = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { OTP, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP expires in 5 minutes

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    // Send OTP via email
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP for password reset is: <strong>${OTP}</strong></p><p>It is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, OTP, newPassword } = req.body;

    // Check if OTP is valid
    const otpData = otpStore[email];
    if (!otpData || otpData.OTP !== parseInt(OTP) || Date.now() > otpData.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = hashedPassword;
    await user.save();

    // Clear OTP from memory
    delete otpStore[email];

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Marks Routes (unchanged)
app.post('/api/process-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied. Teachers only.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Extract the following details from the uploaded marksheet image and provide them in a structured JSON format:
                1. Section: A string representing the section of the student.
                2. USN: A string representing the University Seat Number (USN) of the student.
                3. Subject: A string indicating the subject name.
                4. Marks Details:
                   Questions: A list of objects, where each object contains the following:
                   Question Number: A number representing the question number.
                   Maximum Marks: A number representing the maximum marks for the question.
                   Marks Obtained: A breakdown of marks obtained for each part (e.g., part a, part b, etc.) if any part is empty don't write NULL in that place just write 0 in that place.
                   Total: A number representing the total marks obtained for that question.
                   Summary: An object containing:
                   Total Maximum Marks: A number representing the total maximum marks for all questions.
                   Total Obtained Marks: A number representing the total marks obtained by the student.
                Ensure that the extracted data is accurate and formatted exactly as described above.`,
            },
            {
              type: 'image_url',
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const rawContent = response.choices[0].message.content;
    const cleanedContent = cleanJsonString(rawContent);
    const extractedData = JSON.parse(cleanedContent);
    const transformedData = transformData(extractedData);

    // Save to MongoDB
    const filter = {
      section: transformedData.section,
      usn: transformedData.usn,
      subject: transformedData.subject,
    };
    const options = { upsert: true, new: true };
    await Marks.findOneAndUpdate(filter, transformedData, options);

    res.json(transformedData);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image', details: error.message });
  }
});

app.get('/api/marks/:section/:usn/:subject', authenticateToken, async (req, res) => {
  try {
    const { section, usn, subject } = req.params;
    const marksData = await Marks.findOne({ section, usn, subject });

    if (!marksData) {
      return res.status(404).json({ error: 'Marks data not found' });
    }

    res.json(marksData);
  } catch (error) {
    console.error('Error retrieving marks:', error);
    res.status(500).json({ error: 'Failed to retrieve marks', details: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
