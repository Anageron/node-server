import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app.js';
import { ExceptionFilter } from './errors/exception.filter.js';
import { LoggerService } from './logger/logger.service.js';
import { UserController } from './users/user.controller.js';
import { ILogger } from './logger/logger.interface.js';
import { TYPES } from './types.js';
import { IExceptionFilter } from './errors/exception.filter.interface.js';
import { UserService } from './users/user.service.js';
import { IUserController } from './users/user.controller.interface.js';
import { IUserService } from './users/user.service.interface.js';

export interface IBootstrap {
	app: App
	appContainer: Container
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(TYPES.IUserController).to(UserController);
	bind<IUserService>(TYPES.IUserService).to(UserService);
	bind<App>(TYPES.Application).to(App);
});

function bootstrap() : IBootstrap {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
