import { Request, Response, NextFunction } from 'express';
import { ErrorLog } from '../models/ErrorLog';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = async (
  err: AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let statusCode = 500;
  let message = 'Internal server error';
  let stack: string | undefined;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
  } else if (err.statusCode) {
    // Handle custom application errors
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
  } else {
    // Handle unexpected errors
    message = err.message || message;
    stack = err.stack;
  }

  // Log error to MongoDB
  try {
    const userId = (req as any).userId || undefined;
    
    await ErrorLog.create({
      message,
      stack,
      route: req.path,
      method: req.method,
      userId,
      statusCode,
      userAgent: req.get('user-agent'),
      ip: req.ip || req.socket.remoteAddress
    });
  } catch (logError) {
    console.error('Failed to log error to database:', logError);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack })
  });
};

