import { Router } from 'express';
const router = Router();
import { login, logout } from '../controllers/auth.controller.js';


// router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

export default router;