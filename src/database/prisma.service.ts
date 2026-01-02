import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import { PrismaClient, UserModel } from '../generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { join } from 'path';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {

		const dbPath = join(process.cwd(), 'dev.db')
		const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`
		const adapter = new PrismaBetterSqlite3({
			url: dbUrl,
		});

		this.client = new PrismaClient({
			adapter: adapter,
		});

		this.logger.log(`[PrismaService] Инициализирован с базой данных: ${dbPath}`);
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect;
			this.logger.log('[PrismaService] Успешно подключились к базе данных');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(`[PrismaService] Ошибка подключение к БД: ${error.message}`);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect;
	}
}
