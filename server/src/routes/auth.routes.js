import { Router } from 'express';
const router = Router();
import { login, logout, fetchCurrentUser } from '../controllers/auth.controller.js';


// router.post('/register', register);
router.get('/me', fetchCurrentUser);
router.post('/login', login);
router.get('/logout', logout);

export default router;