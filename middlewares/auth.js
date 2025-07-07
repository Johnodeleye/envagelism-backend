const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Please authenticate');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if decoded has an ID
    if (!decoded.id) {
      throw new Error('Invalid token payload');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
  
};

module.exports = auth;