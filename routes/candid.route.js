const express = require('express');
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const auth = require('../middlewares/auth');

// Function to generate random avatar URL
const generateRandomAvatar = () => {
  const seed = Math.random().toString(36).substring(2, 15); // random string to cbreate a unique avatar
  return `https://api.multiavatar.com/${seed}.svg`;
};

// POST /api/candidates - Create a new candidate (no auth required)
router.post('/', async (req, res) => {
  try {
    const { FullName, email, Dept, Level } = req.body;
    
    // Basic validation
    if (!FullName || !email) {
      return res.status(400).json({
        success: false,
        message: 'FullName and email are required'
      });
    }

    // Check if email already exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email }
    });

    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Generate random profile image
    const profileImage = generateRandomAvatar();

    const candidate = await prisma.candidate.create({
      data: {
        FullName,
        email,
        Dept,
        Level,
        profileImage 
      }
    });

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: candidate
    });

  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create candidate'
    });
  }
});

// GET /api/candidates - Get all candidates (auth required)
router.get('/', auth, async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
     orderBy: {
        id: 'asc' // order by numeric ID e.g 1,2,3,4,5,6,7,8 etc...
      }
    });

    res.status(200).json({
      success: true,
      data: candidates
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidates'
    });
  }
});

// DELETE /api/candidates/:id - Delete a candidate (auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id); // Convert to number
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    await prisma.candidate.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete candidate'
    });
  }
});

module.exports = router;