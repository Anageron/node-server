import { UserModel } from "../generated/prisma/client.js";
import { User } from "./user.entity.js";

export interface IUserRepo {
    create: (user: User) => Promise<UserModel>
    find: (email: string) => Promise<UserModel | null>

}