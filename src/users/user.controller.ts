/* eslint-disable @typescript-eslint/no-empty-object-type */
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller.js';
import { HTTPError } from '../errors/http-error.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { IUserController } from './user.controller.interface.js';
import { UserLoginDto } from './dto/user-login.dto.js';
import { User } from './user.entity.js';
import { UserRegisterDto } from './dto/user-register.dto.js';
import { IUserService } from './user.service.interface.js';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/register', method: 'post', func: this.register },
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		next(new HTTPError(401, 'Ошибка авторизации', 'login'));
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body)
		if(!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует' ))
		}
		this.ok(res, { email: result.email});
	}
}
