const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const seed = Math.random().toString(36).substring(2, 15); // random string
const avatarUrl = `https://api.multiavatar.com/${seed}.svg`;

const registerUser = async (userData) => {
  try {
    
    // Check if email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
        ]
      }
    });

    if (existingUser) {
      throw new Error(existingUser.email === userData.email 
        ? 'Email already exists' 
        : 'Username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);



    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        profileImage: avatarUrl,
      }
    });
    
    // const token = generateToken(user.id);
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };

  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};


// Add these to the exports at the bottom
module.exports = { 
  registerUser, 
  loginUser
};

