import { inject, injectable } from "inversify";
import { UserModel } from "../generated/prisma/client.js";
import { User } from "./user.entity.js";
import { IUserRepo } from "./user.interface.repo.js";
import { TYPES } from "../types.js";
import { PrismaService } from "../database/prisma.service.js";

@injectable()
export class UserRepo implements IUserRepo {
    constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService ) {

    }
    async create({email, password, name}: User): Promise<UserModel> {
        return this.prismaService.client.userModel.create({
            data: {
                email,
                password,
                name,
            }
        })
    }

    async find(email:string): Promise<UserModel | null> {
        return this.prismaService.client.userModel.findFirst({
            where:{
                email,
            }
        })
    }
}