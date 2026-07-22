import express from 'express';
import { body } from 'express-validator';
import {
  createChallan,
  getChallans,
  getChallan,
  updateChallan,
  confirmChallan,
  cancelChallan
} from '../controllers/challan.controller.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const challanValidation = [
  body('customer').notEmpty().withMessage('Customer is required'),
  body('products').isArray({ min: 1 }).withMessage('At least one product is required'),
  body('products.*.product').notEmpty().withMessage('Product ID is required'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('confirmImmediately').optional().isBoolean()
];

// Routes
router.post(
  '/',
  authorize('admin', 'sales'),
  challanValidation,
  validateRequest,
  createChallan
);

router.get('/', getChallans);

router.get('/:id', getChallan);

router.put(
  '/:id',
  authorize('admin', 'sales'),
  [
    body('products').isArray({ min: 1 }).withMessage('At least one product is required'),
    body('products.*.product').notEmpty().withMessage('Product ID is required'),
    body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  validateRequest,
  updateChallan
);

router.post(
  '/:id/confirm',
  authorize('admin', 'sales'),
  confirmChallan
);

router.post(
  '/:id/cancel',
  authorize('admin', 'sales'),
  cancelChallan
);

export default router;
