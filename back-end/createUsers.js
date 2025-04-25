const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User'); // Ensure the User model path is correct
require('dotenv').config(); // Load environment variables

async function createInitialUsers() {
  try {
    // Ensure MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the .env file.');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const users = [
      {
        email: 'teacher.ise@bmsce.ac.in',
        password: await bcrypt.hash('teacher123', 10),
        role: 'teacher',
      },
      {
        email: 'student.is21@bmsce.ac.in',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
      },
    ];

    // Check if each user already exists before inserting
    for (const user of users) {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create(user);
        console.log(`User created: ${user.email}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    }

    console.log('Initial users created successfully');
  } catch (error) {
    console.error('Error creating initial users:', error);
  } finally {
    mongoose.connection.close();
  }
}

createInitialUsers();
