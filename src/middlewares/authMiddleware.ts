import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";

interface JwtPayload {
  userId: number;
  id?: number;
}

declare global {
    namespace Express {
      interface Request {
        user?: {
          userId: number;
        };
      }
    }
  }

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
        
    // Handle both cases: userId from signup and id from login
    const userId = decoded.userId || decoded.id;
    
    if (typeof userId !== 'number') {
      throw new Error('Invalid token payload');
    }

    req.user = { userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
