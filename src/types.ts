import { ConfigService } from "./config/config.service.js";

export const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	IUserController: Symbol.for('IUserController'),
	IUserService: Symbol.for('IUserService'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),
};
