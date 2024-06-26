import dotenv from 'dotenv';

dotenv.config({path: '.env'});

export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;