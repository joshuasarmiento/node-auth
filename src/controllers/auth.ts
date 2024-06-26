import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserSchema } from '../schema/users';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../secrets';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { NotFoundException } from '../exceptions/not-found';
import { lockAccount, incrementFailedAttempts } from '../middlewares/accountLock';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../utils/emailService'

const prisma = new PrismaClient();

const MAX_FAILED_ATTEMPTS = 3;

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = uuidv4();

    const user = await prisma.user.create({
      data: { 
          name,
          email, 
          password: hashedPassword,
          verificationToken
      },
    });

    const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
    await sendEmail(
        user.email,
        "Verify your email",
        `Please click this link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`
    );


    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN as string,
    });

    res.status(201).json({ 
      status: "User Created",
      token,
      user: { 
          id: user.id, 
          email: 
          user.email, 
          name: user.name 
      }
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
  
      const user = await prisma.user.findUnique({ where: { verificationToken: token } });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
      }
  
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          isVerified: true,
          verificationToken: null
        }
      });
  
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying email', error });
    }
  };

export const login = async (req: Request, res: Response) => {
    UserSchema.parse(req.body);
    const { email, password } = req.body

    let user = await prisma.user.findFirst({where: {email}})
    if(!user) {
        throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }

    // Check if account is locked out
    if (user.lockoutEndTime && user.lockoutEndTime > new Date()) {
        const now = new Date().getTime();
        const lockoutEndTime = user.lockoutEndTime.getTime();
        const lockoutTimeRemaining = Math.ceil((lockoutEndTime - now) / 1000); // Remaining time in seconds
  
        const minutes = Math.floor(lockoutTimeRemaining / 60);
        const seconds = lockoutTimeRemaining % 60;
        return res.status(423).json({
            status: 'fail',
            message: `Account locked. Try again after ${minutes} minutes and ${seconds} seconds.`
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
    
        const failedAttempts = await incrementFailedAttempts(email);

        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
            await lockAccount(email);
    
            return res.status(423).json({
              status: 'fail',
              message: 'Account locked due to too many failed login attempts. Try again later.'
            });
        }

        throw new BadRequestException("Password is incorrect", ErrorCode.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
        return res.status(400).json({ message: 'Email not verified' });
    }
  
    
    // Reset failed attempts and lockout time on successful login
    await prisma.user.update({
        where: { email },
        data: {
          failedAttempts: 0,
          lockoutEndTime: null
        }
    });

    const token = jwt.sign({id: user.id}, JWT_SECRET as string, {
        expiresIn: JWT_EXPIRES_IN
    });

    res.cookie("token", token, {
        httpOnly: true, 
        secure: true, 
        sameSite: "strict", 
    })

    res.json({
        status: "successfully login", 
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified
        }
    });
}

export const getAuthenticatedUser = async (req: Request, res: Response) => {
    if (!isAuthenticatedUser(req.user)) {
        throw new BadRequestException("User authentication information is missing", ErrorCode.INVALID_CREDENTIALS);
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
    }

    res.json({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified
        },
    });
};