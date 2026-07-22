import express from 'express';
import { body } from 'express-validator';
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  addFollowUpNote
} from '../controllers/customer.controller.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const customerValidation = [
  body('name').trim().notEmpty().withMessage('Customer name is required'),
  body('mobile').trim().notEmpty().withMessage('Mobile number is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('customerType').isIn(['Retail', 'Wholesale', 'Distributor']).withMessage('Invalid customer type'),
  body('status').optional().isIn(['Lead', 'Active', 'Inactive']).withMessage('Invalid status'),
  body('gstNumber').optional().trim(),
  body('businessName').optional().trim(),
  body('address').optional().trim(),
  body('followUpDate').optional().isISO8601().withMessage('Invalid follow-up date')
];

// Routes
router.post(
  '/',
  authorize('admin', 'sales'),
  customerValidation,
  validateRequest,
  createCustomer
);

router.get('/', getCustomers);

router.get('/:id', getCustomer);

router.put(
  '/:id',
  authorize('admin', 'sales'),
  customerValidation,
  validateRequest,
  updateCustomer
);

router.post(
  '/:id/followups',
  authorize('admin', 'sales'),
  [body('text').trim().notEmpty().withMessage('Note text is required')],
  validateRequest,
  addFollowUpNote
);

export default router;
