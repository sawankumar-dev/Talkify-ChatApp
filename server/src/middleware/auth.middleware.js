import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import config from '../config/config.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if(!token) {
        throw new ApiError(401, "Authentication required")
    }
    let decoded;
    try {
        decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired access token")
    }
    const user = await User.findById(decoded.userId).select("-password -refreshToken");
    if(!user) {
        throw new ApiError(401, "User no longer exists");
    }
    req.user = user;
    next()
})
export default authMiddleware;