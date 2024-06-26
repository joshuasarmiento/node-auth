// accountLockout.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

export async function lockAccount(email: string): Promise<void> {
  await prisma.user.update({
    where: { email },
    data: {
      lockoutEndTime: new Date(Date.now() + LOCKOUT_DURATION),
      failedAttempts: 0 // Reset failed attempts
    }
  });
}

export async function unlockAccount(email: string): Promise<void> {
  await prisma.user.update({
    where: { email },
    data: {
      lockoutEndTime: null,
      failedAttempts: 0 // Reset failed attempts
    }
  });
}

export async function incrementFailedAttempts(email: string): Promise<number> {
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      failedAttempts: {
        increment: 1
      }
    }
  });

  return updatedUser.failedAttempts || 0;
}

export async function getFailedAttempts(email: string): Promise<number> {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.failedAttempts || 0;
}
