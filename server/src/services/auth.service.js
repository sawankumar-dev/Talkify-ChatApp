import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

const generateTokens = async (user) => {
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString())
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return {
        accessToken,
        refreshToken,
    };
};

class AuthService {
    async registerUser({ name, username, email, password }) {
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            if(existingUser.email === email) {
                throw new ApiError(409, "Email already registered")
            }
            throw new ApiError(409, "Username already taken")
        }
        const user = await User.create({
            name,
            username,
            email, 
            password
        });
        const { accessToken, refreshToken } = await generateTokens(user)
        return {
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt,
            },
            accessToken,
            refreshToken,
        }
    };
    async loginUser({ email, password }) {
        const user = await User.findOne({ email }).select("+password")
        if(!user) {
            throw new ApiError(401, "Invalid email or password");
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect) {
            throw new ApiError(401, "Invalid email or password");
        }
        const { accessToken, refreshToken } = await generateTokens(user)
        return {
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            },
            accessToken,
            refreshToken,
        }
    };
    async logoutUser(userId) {
        await User.findByIdAndUpdate(userId, {
            $unset: {
                    refreshToken: 1,
            },
        });
    };
};

export default new AuthService;











