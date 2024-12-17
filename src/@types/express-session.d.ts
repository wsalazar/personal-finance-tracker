// src/@types/express-session.d.ts
import * as express from 'express';
import session from 'express-session';

declare global {
  namespace Express {
    interface Request {
      session: {
        userId?: string; // Add userId property
        email?: string; // Add email property
        // Add any other properties you want to include
      } & Partial<session.SessionData>; // Ensure it extends the existing session data
    }
  }
}
