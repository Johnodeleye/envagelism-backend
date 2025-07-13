const express = require('express');
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const auth = require('../middlewares/auth');

// Function to generate random avatar URL
const generateRandomAvatar = () => {
  const seed = Math.random().toString(36).substring(2, 15);
  return `https://api.multiavatar.com/${seed}.svg`;
};

// POST /api/candidates - Create a new candidate
router.post('/', async (req, res) => {
  try {
    const { FullName, email, Dept, Level, whatsapp } = req.body;
    
    // Enhanced validation
    if (!FullName || !email) {
      return res.status(400).json({
        success: false,
        message: 'FullName and email are required'
      });
    }

    // Validate WhatsApp number format
    if (whatsapp && !/^\+?[0-9]{10,15}$/.test(whatsapp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid WhatsApp number format'
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

    // Generate random profile image if not provided
    const profileImage = req.body.profileImage || generateRandomAvatar();

    const candidate = await prisma.candidate.create({
      data: {
        FullName,
        email,
        Dept,
        Level,
        whatsapp,
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

router.get('/avatar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://api.multiavatar.com/${id}.svg`);

    if (!response.ok) {
      throw new Error('Failed to fetch avatar');
    }
    
    // Set proper headers
    res.set('Content-Type', 'image/svg+xml');
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    
    // Stream the response
    response.body.pipe(res);
  } catch (error) {
    console.error('Avatar fetch error:', error);
    res.status(500).send('Error fetching avatar');
  }
});


// GET /api/candidates - Get all candidates (with search)
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    
    const candidates = await prisma.candidate.findMany({
      where: search ? {
        OR: [
          { FullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { Dept: { contains: search, mode: 'insensitive' } },
          { Level: { contains: search, mode: 'insensitive' } },
          { whatsapp: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      orderBy: {
        id: 'asc'
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

// DELETE /api/candidates/:id - Delete a candidate
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
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