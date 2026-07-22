import express from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  adjustStock,
  getStockLog
} from '../controllers/product.controller.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
  body('minStockAlert').optional().isInt({ min: 0 }).withMessage('Min stock alert must be a non-negative integer'),
  body('location').optional().trim()
];

const stockAdjustValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('movementType').isIn(['IN', 'OUT']).withMessage('Movement type must be IN or OUT'),
  body('reason').trim().notEmpty().withMessage('Reason is required')
];

// Routes
router.post(
  '/',
  authorize('admin'),
  productValidation,
  validateRequest,
  createProduct
);

router.get('/', getProducts);

router.get('/:id', getProduct);

router.put(
  '/:id',
  authorize('admin'),
  productValidation,
  validateRequest,
  updateProduct
);

router.post(
  '/:id/stock',
  authorize('admin', 'warehouse'),
  stockAdjustValidation,
  validateRequest,
  adjustStock
);

router.get('/:id/stock-log', getStockLog);

export default router;
