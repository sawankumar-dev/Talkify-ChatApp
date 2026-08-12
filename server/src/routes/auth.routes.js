import { Router } from "express";
import validate from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { getCurrentUser, login, logout, register } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post(
    "/register", 
    validate(registerSchema), 
    register
)
authRouter.post(
    "/login",
    validate(loginSchema),
    login
)
authRouter.get("/me", authMiddleware, getCurrentUser)
authRouter.post("/logout", authMiddleware, logout)
export default authRouter;