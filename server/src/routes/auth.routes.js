import { Router } from "express";
import validate from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { getCurrentUser, login, logout, refreshToken, register } from "../controllers/auth.controller.js";
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
authRouter.post("/refresh", refreshToken)

export default authRouter;

// POST /api/v1/auth/register
// POST /api/v1/auth/login
// POST /api/v1/auth/refresh
// GET  /api/v1/auth/me
// POST /api/v1/auth/logout