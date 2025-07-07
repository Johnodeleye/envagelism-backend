const { registerUser, loginUser } = require('../services/auth.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {   
    // Register user
    const { user, token } = await registerUser(req.body);
    
    res.status(201).json({
      success: true,
      message: user.email
      ? 'User registered successfully' 
      : 'User registered - complete onboarding',
      data: { user, token }
    });
  } catch (error) {
    
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user, token }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid credentials'
    });
  }
};


const logout = (req, res) => {

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        profileImage: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Format the response
    const formattedUser = {
      id: user.id,
      email: user.email,
      profileImage: user.profileImage,
    };

    res.status(200).json({
      success: true,
      data: formattedUser
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user data'
    });
  }
};


// Add to exports at the bottom
module.exports = { 
  register, 
  getCurrentUser, 
  login, 
  logout,
};