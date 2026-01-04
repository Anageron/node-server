import { IMiddleware } from "./middlewares.interface.js";
import { NextFunction, Request, Response } from "express";

export class AuthGuard implements IMiddleware {
    constructor() {}

    execute (req: Request, res: Response, next: NextFunction): void {
     if(req.user) {
        return next()
     }
     res.status(401).send({error: 'Вы не авторизованы'})
    }
}