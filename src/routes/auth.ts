import { Router} from 'express';
import { login, signup, verifyEmail, getAuthenticatedUser  } from '../controllers/auth';
import { authMiddleware } from '../middlewares/authMiddleware';
import { errorHandler } from '../error-handler';
import { rateLimiter } from '../middlewares/rateLimiter';

const authRoutes:Router = Router();

authRoutes.post('/login', rateLimiter, errorHandler(login));
authRoutes.post("/signup", rateLimiter, errorHandler(signup));
authRoutes.post('/verify-email', verifyEmail);
authRoutes.get('/me', authMiddleware, errorHandler(getAuthenticatedUser));

export default authRoutes;