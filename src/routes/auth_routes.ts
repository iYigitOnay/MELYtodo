import { Router } from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword } from '../controllers/auth_controller.js';

const router = Router();

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   POST /api/auth/forgotpassword
router.post('/forgotpassword', forgotPassword);

// @route   PUT /api/auth/resetpassword/:resetToken
router.put('/resetpassword/:resetToken', resetPassword);

export default router;