import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        name: string;
        [key: string]: any; // To accommodate additional user fields
      };
    }
  }
}
