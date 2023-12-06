import { Router } from "express";
import AuthController from "../contorllers/AuthController.js";
import { AuthMiddlewareRole } from "../middleware/AuthMiddleware.js";
const AuthRouter = Router();

AuthRouter.post('/login', AuthController.login)
AuthRouter.post('/signup', AuthController.signup)
AuthRouter.get('/users', AuthMiddlewareRole(["ADMIN"]), AuthController.users)

export default AuthRouter;
