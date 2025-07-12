import express from 'express';
import { getRecords, saveForm } from '../controllers/saveFormController.js';
import {authenticate} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Save Credit Status Form
router.post('/submit-form', authenticate, saveForm);
router.get('/get-form', authenticate,getRecords); // Example route to get form data

// You can add more routes like fetching all forms, deleting, etc., later

export default router;
