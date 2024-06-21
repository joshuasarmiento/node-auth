import { Router} from 'express';
import { login, signup, getAuthenticatedUser  } from '../controllers/auth';
import { authMiddleware } from '../middlewares/authMiddleware';
import { errorHandler } from '../error-handler';

const authRoutes:Router = Router();

authRoutes.post('/login', errorHandler(login));
authRoutes.post("/signup", errorHandler(signup));
authRoutes.get('/me', authMiddleware, errorHandler(getAuthenticatedUser));

export default authRoutes;