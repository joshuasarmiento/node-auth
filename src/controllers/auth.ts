import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserSchema } from '../schema/users';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../secrets';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { UnprocessableEntity } from '../exceptions/validations';
import { NotFoundException } from '../exceptions/not-found';

const prisma = new PrismaClient();

interface JwtPayload {
    userId: number;
}

function isAuthenticatedUser(user: any): user is JwtPayload {
    return user && typeof user.userId === 'number';
  }
  

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    UserSchema.parse(req.body);
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      new BadRequestException('User already exists', ErrorCode.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { 
          name,
          email, 
          password: hashedPassword 
      },
    });

    console.log("user", user);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN as string,
    });

    console.log("token", token);

    res.status(201).json({ 
      status: "success",
      token,
      user: { 
          id: user.id, 
          email: 
          user.email, 
          name: user.name 
      }
  });
};

export const login = async (req: Request, res: Response) => {
    UserSchema.parse(req.body);
    const { email, password } = req.body

    let user = await prisma.user.findFirst({where: {email}})
    if(!user) {
        throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        throw new BadRequestException("Invalid credentials", ErrorCode.INVALID_CREDENTIALS);
    }

    const token = jwt.sign({id: user.id}, JWT_SECRET as string, {
        expiresIn: JWT_EXPIRES_IN
    });

    res.json({
        status: "successfully login", 
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    });
}

export const getAuthenticatedUser = async (req: Request, res: Response) => {
    if (!isAuthenticatedUser(req.user)) {            
        throw new BadRequestException("User authentication information is missing", ErrorCode.INVALID_CREDENTIALS);
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
       throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
    }

    res.json({ 
        user: { 
            id: user.id, 
            email: user.email, 
            name: user.name 
        } 
    });
};