import express from 'express';
import { body } from 'express-validator';
import { login, getCurrentUser } from '../controllers/auth.controller.js';
import authenticate from '../middleware/authenticate.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  login
);

// GET /api/auth/me
router.get('/me', authenticate, getCurrentUser);

export default router;
