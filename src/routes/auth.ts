import { Router} from 'express';
import { login, signup, getAuthenticatedUser  } from '../controllers/auth';
import { authMiddleware } from '../middlewares/authMiddleware';
import { errorHandler } from '../error-handler';
import { rateLimiter } from '../middlewares/rateLimiter';

const authRoutes:Router = Router();

authRoutes.post('/login', rateLimiter, errorHandler(login));
authRoutes.post("/signup", rateLimiter, errorHandler(signup));
authRoutes.get('/me', authMiddleware, errorHandler(getAuthenticatedUser));

export default authRoutes;