import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller.js';
import { HTTPError } from '../errors/http-error.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { IUserController } from './user.controller.interface.js';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/register', method: 'post', func: this.register },
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		console.log("dsss")
		next(new HTTPError(401, 'Ошибка авторизации', 'login'));
	}

	register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'register');
	}
}
