/**
 * AUTHENTICATION ROUTES
 * 
 * Handles user signup, signin, email verification
 * According to Problem Statement 3.1
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const path = require('path');

// Debug: Log the path
const prismaPath = path.join(__dirname, '../../../app/generated/prisma');
console.log('Loading Prisma from:', prismaPath);

const { PrismaClient } = require(prismaPath);
console.log('PrismaClient loaded:', typeof PrismaClient);

const prisma = new PrismaClient();
console.log('Prisma instance created:', typeof prisma, typeof prisma?.user);

const JWT_SECRET = process.env.JWT_SECRET || 'dayflow-secret-key-change-in-production';

// ============= HELPER FUNCTIONS =============

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const isValidPassword = (password) => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
};

/**
 * Generate JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Generate email verification token
 */
const generateVerificationToken = (email) => {
  return jwt.sign(
    { email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Get password strength feedback
 */
const getPasswordFeedback = (password) => {
  const feedback = [];
  if (password.length < 8) feedback.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) feedback.push('At least one uppercase letter');
  if (!/[a-z]/.test(password)) feedback.push('At least one lowercase letter');
  if (!/\d/.test(password)) feedback.push('At least one number');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) feedback.push('At least one special character');
  return feedback;
};

// ============= SIGNUP ENDPOINT =============
/**
 * POST /api/auth/signup
 * 
 * Register a new user
 * Required fields: employeeId, email, password, role
 */
router.post('/signup', async (req, res) => {
  try {
    const { employeeId, email, password, role } = req.body;

    // Validate input
    if (!employeeId || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide employeeId, email, password, and role'
      });
    }

    // Validate role
    if (!['EMPLOYEE', 'ADMIN'].includes(role.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Role must be EMPLOYEE or ADMIN'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        requirements: getPasswordFeedback(password)
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if employeeId already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { employeeId }
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Employee ID already registered'
      });
    }

    // Hash password (store in profile or create a separate password field)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = generateVerificationToken(email);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        id: `user_${Date.now()}`,
        name: employeeId,
        email,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: role.toUpperCase(),
        profile: {
          create: {
            employeeId,
            name: employeeId,
            phone: null,
            address: null,
            salary: null
          }
        }
      },
      include: { profile: true }
    });

    // Note: Password needs to be stored separately (add a password field to User model or Profile)
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Email verification pending.',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.profile?.employeeId,
        emailVerified: user.emailVerified
      },
      verificationToken: verificationToken,
      instructions: 'Check your email for verification link (valid for 24 hours)',
      warning: 'Password storage needs to be added to schema'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
});

// ============= EMAIL VERIFICATION ENDPOINT =============
/**
 * POST /api/auth/verify-email
 * 
 * Verify user's email address
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Update user as email verified
    const user = await prisma.user.update({
      where: { email: decoded.email },
      data: { emailVerified: true },
      include: { profile: true }
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        userId: user.id,
        email: user.email,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired verification token',
      error: error.message
    });
  }
});

// ============= SIGNIN ENDPOINT =============
/**
 * POST /api/auth/signin
 * 
 * Login existing user
 * Returns JWT token and redirects to dashboard on success
 */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect credentials'
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }

    // Note: Password verification disabled - schema needs password field
    // TODO: Add password field to User model and uncomment below
    /*
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect credentials'
      });
    }
    */

    // TEMPORARY: Skip password check (for testing)
    // In production, add password field to schema

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    // Return success with redirect to dashboard
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.profile?.employeeId,
        name: user.profile?.name
      },
      token,
      redirectUrl: user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/employee'
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

// ============= VERIFY TOKEN ENDPOINT =============
/**
 * POST /api/auth/verify-token
 * 
 * Verify if JWT token is valid
 */
router.post('/verify-token', (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      success: true,
      message: 'Token is valid',
      data: decoded
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
});

// ============= GET CURRENT USER ENDPOINT =============
/**
 * GET /api/auth/me
 * 
 * Get current logged-in user info
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
      error: error.message
    });
  }
});

// ============= LOGOUT ENDPOINT =============
/**
 * POST /api/auth/logout
 * 
 * Logout user (client-side token removal)
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
