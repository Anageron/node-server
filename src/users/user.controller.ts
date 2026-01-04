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
import { UserRegisterDto } from './dto/user-register.dto.js';
import { IUserService } from './user.service.interface.js';
import { ValidateMiddleware } from '../common/validate.middleware.js';
import jwt from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface.js';
import { AuthGuard } from '../common/auth.guard.js';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HTTPError(401, 'Ошибка авторизации', 'login'));
		}
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user)
		this.ok(res, { email: userInfo?.email, id:userInfo?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((rs, rj) => {
			jwt.sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						rj(err);
					}
					rs(token as string);
				},
			);
		});
	}
}
