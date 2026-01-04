import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto.js';
import { UserRegisterDto } from './dto/user-register.dto.js';
import { User } from './user.entity.js';
import { IUserService } from './user.service.interface.js';
import { TYPES } from '../types.js';
import { IConfigService } from '../config/config.service.interface.js';
import { IUserRepo } from './user.interface.repo.js';
import { UserModel } from '../generated/prisma/client.js';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepo) private userRepo: IUserRepo,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
        const existedUser = await this.userRepo.find(email)
        if(existedUser){
            return null
        }
		return this.userRepo.create(newUser)
	}
	async validateUser({email, password}: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepo.find(email)
		if(!existedUser){
			return false
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		return newUser.comparePassword(password)
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.userRepo.find(email)
	}
}
