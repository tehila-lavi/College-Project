import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: Types.ObjectId;
        role: string;
    };
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string, role: string };
        req.user = {
            id: new Types.ObjectId(decoded.id),
            role: decoded.role
        };
        next();
    } catch (error: any) {
        console.error('JWT Verification Error:', error.message);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export const verifyAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};
