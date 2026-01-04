import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middlewares.interface.js';
import jwt from 'jsonwebtoken';

interface TokenPayload {
	email: string;
	iat: number;
}

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return next();
		}

		const token = authHeader.split(' ')[1];

		try {
			const payload = jwt.verify(token, this.secret) as TokenPayload;
			req.user = payload.email;
			next();
		} catch (error) {
			next(); 
		}
	}
}
